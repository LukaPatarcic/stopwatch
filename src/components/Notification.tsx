import { useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { useTimer } from '../store/useTimer';
import PushNotification, { Importance } from 'react-native-push-notification';
import BackgroundTimer from 'react-native-background-timer';

const NOTIFICATION_ID = '1';
PushNotification.createChannel(
    {
        channelId: 'channel-id',
        channelName: 'Stopwatch',
        channelDescription: 'Show stopwatch in the background',
        importance: Importance.LOW,
        playSound: false,
        vibrate: false,
    },
    () => {}
);

const Notification = () => {
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const setTime = useTimer((state) => state.setTime);
    const time = useTimer((state) => state.time);
    const onStop = useTimer((state) => state.onStop);
    const onReset = useTimer((state) => state.onReset);
    const onStart = useTimer((state) => state.onStart);
    const running = useTimer((state) => state.running);
    const startTime = useTimer((state) => state.startTime);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            appState.current = nextAppState;
            setAppStateVisible(appState.current);
        });
        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        PushNotification.configure({
            popInitialNotification: true,
            requestPermissions: Platform.OS === 'ios',
            onAction: ({ action }) => {
                switch (action) {
                    case 'Stop': {
                        onStop();
                        BackgroundTimer.stopBackgroundTimer();
                        break;
                    }
                    case 'Start': {
                        BackgroundTimer.runBackgroundTimer(runBackground, 1000);
                        onStart();
                        break;
                    }
                    case 'Restart': {
                        onReset();
                        BackgroundTimer.stopBackgroundTimer();
                        PushNotification.cancelLocalNotification(NOTIFICATION_ID);
                    }
                }
            },
        });
    }, [startTime]);

    useEffect(() => {
        if (appStateVisible === 'background') {
            setNotification(time, [running ? 'Stop' : 'Start', 'Restart']);
        }
    }, [time, running]);

    const setNotification = (message: string | null, actions: string[]) => {
        PushNotification.localNotification({
            id: NOTIFICATION_ID,
            message: message ?? '00:00.00',
            autoCancel: false,
            channelId: 'channel-id',
            ignoreInForeground: false,
            allowWhileIdle: true,
            visibility: 'public',
            priority: 'low',
            importance: 'low',
            actions,
            invokeApp: false,
        });
    };

    const runBackground = async () => {
        if (!running) {
            BackgroundTimer.stopBackgroundTimer();
            return;
        }

        setTime();
    };

    useEffect(() => {
        if (appStateVisible === 'background' && running) {
            BackgroundTimer.runBackgroundTimer(runBackground, 1000);
        }

        if (appStateVisible === 'active') {
            BackgroundTimer.stopBackgroundTimer();
            PushNotification.cancelLocalNotification(NOTIFICATION_ID);
        }
    }, [appStateVisible]);

    return null;
};

export default Notification;
