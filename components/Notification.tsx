import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useTimer } from '../store/useTimer';
import {
    cancelScheduledNotificationAsync,
    dismissNotificationAsync,
    scheduleNotificationAsync,
    setNotificationCategoryAsync,
    setNotificationHandler,
    addNotificationResponseReceivedListener,
    NotificationAction,
    AndroidNotificationPriority,
} from 'expo-notifications';

setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const NOTIFICATION_ID = 'timer';
const CATEGORY_ID = 'timer_category';
const runningActions = ['Stop', 'Reset', 'Lap'];
const stoppedActions = ['Start', 'Reset'];
const resetActions = ['Start'];
const actions = (actions: string[]): NotificationAction[] =>
    actions.map((item) => ({
        identifier: item.toLowerCase(),
        buttonTitle: item,
        options: {
            isAuthenticationRequired: false,
            opensAppToForeground: false,
        },
    }));

const Notification = () => {
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const running = useTimer((state) => state.running);
    const time = useTimer((state) => state.time);
    const onStop = useTimer((state) => state.onStop);
    const setTime = useTimer((state) => state.setTime);
    const onStart = useTimer((state) => state.onStart);
    const onReset = useTimer((state) => state.onReset);
    const onLap = useTimer((state) => state.onLap);

    useEffect(() => {
        const subscription1 = AppState.addEventListener('change', _handleAppStateChange);
        const subscription2 = addNotificationResponseReceivedListener((response) => {
            handleAction(response.actionIdentifier);
        });
        return () => {
            subscription1.remove();
            subscription2.remove();
        };
    }, []);

    // Add a BackgroundFetch event to <FlatList>

    const handleAction = (action: string) => {
        switch (action) {
            case 'start':
                setNotificationCategoryAsync(CATEGORY_ID, actions(stoppedActions));
                onStart();
                break;
            case 'stop':
                setNotificationCategoryAsync(CATEGORY_ID, actions(runningActions));
                onStop();
                break;
            case 'reset':
                setNotificationCategoryAsync(CATEGORY_ID, actions(resetActions));
                onReset();
                break;
            case 'lap':
                onLap();
                break;
        }
    };

    useEffect(() => {
        if (appStateVisible === 'background' && running) {
            scheduleNotificationAsync({
                content: {
                    categoryIdentifier: CATEGORY_ID,
                    title: time,
                    priority: AndroidNotificationPriority.MIN,
                    sticky: true,
                },
                identifier: NOTIFICATION_ID,
                trigger: { seconds: 1 },
            });
            setNotificationCategoryAsync(CATEGORY_ID, actions(runningActions));
        }

        if (appStateVisible === 'active' && running) {
            cancelScheduledNotificationAsync(NOTIFICATION_ID);
            dismissNotificationAsync(NOTIFICATION_ID);
        }
    }, [appStateVisible]);

    const _handleAppStateChange = (nextAppState) => {
        appState.current = nextAppState;
        setAppStateVisible(appState.current);
    };

    return null;
};

export default Notification;
