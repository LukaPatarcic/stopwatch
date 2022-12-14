import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTimer } from '../store/useTimer';
import { IconButton } from 'react-native-paper';

const ICON_SIZE = 42;

const styles = StyleSheet.create({
    container: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});

const Actions: FC = () => {
    const elapsed = useTimer((state) => state.elapsed);
    const running = useTimer((state) => state.running);
    const onStop = useTimer((state) => state.onStop);
    const onStart = useTimer((state) => state.onStart);
    const onReset = useTimer((state) => state.onReset);
    const onLap = useTimer((state) => state.onLap);

    return (
        <View style={styles.container}>
            {elapsed && (
                <IconButton color="black" size={ICON_SIZE} onPress={onReset} icon="restart" />
            )}
            <IconButton
                size={ICON_SIZE}
                color="black"
                icon={running ? 'stop' : 'play'}
                animated
                onPress={() => (running ? onStop() : onStart())}
            />
            {elapsed && running && (
                <IconButton color="black" size={ICON_SIZE} onPress={onLap} icon="timer" />
            )}
        </View>
    );
};

export default Actions;
