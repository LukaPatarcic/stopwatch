import React, { FC, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTimer } from '../store/useTimer';

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 72 },
});

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
        <View style={styles.container}>
            <Text adjustsFontSizeToFit numberOfLines={1} style={styles.text}>
                {time ?? '00:00:00'}
            </Text>
        </View>
    );
};

export default Timer;
