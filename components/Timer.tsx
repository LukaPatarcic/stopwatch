import React, { FC, useEffect } from 'react';
import { Text, View } from 'react-native';
import { useTimer } from '../store/useTimer';

const Timer: FC = () => {
    const time = useTimer((state) => state.time);
    const running = useTimer((state) => state.running);
    const setTime = useTimer((state) => state.setTime);

    useEffect(() => {
        let counter = null;
        if (running) {
            counter = setInterval(() => {
                setTime();
            }, 10);
        } else {
            clearInterval(counter);
        }
        return () => {
            clearInterval(counter);
        };
    }, [running]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View>
                <Text style={{ fontSize: 72 }}>{time ?? '00:00:00'}</Text>
            </View>
        </View>
    );
};

export default Timer;
