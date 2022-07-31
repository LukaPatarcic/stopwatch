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
} from 'expo-notifications';

setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const NOTIFICATION_ID = 'timer';

const Notification = () => {
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const running = useTimer((state) => state.running);
    const time = useTimer((state) => state.time);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', _handleAppStateChange);
        setNotificationCategoryAsync('category', [
            {
                identifier: 'button1',
                buttonTitle: 'title',
                options: {
                    isAuthenticationRequired: false,
                    opensAppToForeground: false,
                },
            },
        ]);
        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        const subscription = addNotificationResponseReceivedListener(response => {
            console.log(response);
        });
        return () => subscription.remove();
    }, []);

    useEffect(() => {
        if (appStateVisible === 'background' && running) {
            scheduleNotificationAsync({
                content: {
                    categoryIdentifier: 'category',
                    title: '',
                    body: time,
                },
                identifier: NOTIFICATION_ID,
                trigger: { seconds: 1, repeats: true },
            });
        }

        if (appStateVisible === 'active' && running) {
            cancelScheduledNotificationAsync(NOTIFICATION_ID);
            dismissNotificationAsync(NOTIFICATION_ID);

        }

    }, [appStateVisible]);


    const _handleAppStateChange = nextAppState => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!');
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
    };

    return null;
};

export default Notification;
