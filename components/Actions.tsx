import React, { FC, memo } from "react";
import { Button } from "react-native";

interface Props {
    running: boolean;
    onStop: () => void;
    onStart: () => void;
    onReset: () => void;
    onLap: () => void;
}

const Actions: FC<Props> = ({ running, onStop, onStart, onReset, onLap }) => {
    return (
        <>
            <Button
                onPress={() => (running ? onStop() : onStart())}
                title={running ? "Stop Timer" : "Start Timer"}
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />
            <Button
                onPress={onReset}
                title="Reset Timer"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />
            <Button
                onPress={onLap}
                title="Lap Time"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />
        </>
    );
};

export default memo(
    Actions,
    (prevProps, nextProps) => prevProps.running === nextProps.running
);
