import React, { FC } from "react";
import { View } from 'react-native';
import {useTimer} from "../store/useTimer";
import { IconButton } from 'react-native-paper';

const ICON_SIZE = 42;

const Actions: FC = () => {
    const elapsed = useTimer((state) => state.elapsed)
    const running = useTimer((state) => state.running)
    const onStop = useTimer((state) => state.onStop)
    const onStart = useTimer((state) => state.onStart)
    const onReset = useTimer((state) => state.onReset)
    const onLap = useTimer((state) => state.onLap)

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}>
            {elapsed && <IconButton
                size={ICON_SIZE}
                onPress={onReset}
                icon="restart"
            />}
            <IconButton
                size={ICON_SIZE}
                icon={running ? "stop" : "play"}
                animated
                onPress={() => (running ? onStop() : onStart())}
            />
            {elapsed && running && <IconButton
                size={ICON_SIZE}
                onPress={onLap}
                icon="timer"
            />}
        </View>
    );
};

export default Actions;
