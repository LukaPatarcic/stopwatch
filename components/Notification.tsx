import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { formatTimer, useTimer } from '../store/useTimer';
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
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

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

    const BACKGROUND_FETCH_TASK = 'background-fetch';

    // 1. Define the task by providing a name and the function that should be executed
    // Note: This needs to be called in the global scope (e.g outside of your React components)
    TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
        const now = Date.now();
        console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);
        setTime();
        // Be sure to return the successful result type!
        return BackgroundFetch.BackgroundFetchResult.NewData;
    });

    async function registerBackgroundFetchAsync() {
        return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
            minimumInterval: 1,
            stopOnTerminate: false, // android only,
            startOnBoot: true, // android only
        });
    }
    async function unregisterBackgroundFetchAsync() {
        return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    }

    useEffect(() => {
        const subscription = AppState.addEventListener('change', _handleAppStateChange);
        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        const subscription = addNotificationResponseReceivedListener((response) => {
            handleAction(response.actionIdentifier);
        });
        return () => subscription.remove();
    }, []);

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
            registerBackgroundFetchAsync();
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
            unregisterBackgroundFetchAsync();
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
