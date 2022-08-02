import { useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { formatTimer, useTimer } from '../store/useTimer';
import PushNotification, { Importance } from 'react-native-push-notification';
import BackgroundTimer from 'react-native-background-timer';

PushNotification.configure({
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
});

PushNotification.createChannel(
    {
        channelId: 'channel-id',
        channelName: 'stopwatch',
        channelDescription: 'Show stopwatch in the background',
        playSound: false,
        importance: Importance.DEFAULT,
        vibrate: false,
    },
    (created) => console.log(`createChannel returned '${created}'`)
);

const Notification = () => {
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
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
        if (appStateVisible === 'background' && running) {
            BackgroundTimer.runBackgroundTimer(async () => {
                const time = formatTimer(new Date().valueOf() - startTime.valueOf());
                PushNotification.localNotification({
                    id: '123',
                    message: time,
                    autoCancel: false,
                    channelId: 'channel-id',
                    ignoreInForeground: false,
                    allowWhileIdle: true,
                    actions: ['STOP'],
                });
            }, 1000);
        }

        if (appStateVisible === 'active' && running) {
            BackgroundTimer.stopBackgroundTimer();
            PushNotification.cancelLocalNotification('123');
        }
    }, [appStateVisible]);

    return null;
};

export default Notification;
