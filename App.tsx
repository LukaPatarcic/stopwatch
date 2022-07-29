import { useCallback, useEffect, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Actions from "./components/Actions";
import Laps from "./components/Laps";

let interval = null;

const formatTimer = (timeElapsed: Date | null) => {
    if (!timeElapsed) return "";
    const hours = String(timeElapsed.getUTCHours()).padStart(2, "0");
    const minutes = String(timeElapsed.getUTCMinutes()).padStart(2, "0");
    const seconds = String(timeElapsed.getUTCSeconds()).padStart(2, "0");
    const miliseconds = (timeElapsed.getUTCMilliseconds() / 10)
        .toFixed(0)
        .padStart(2, "0");
    return `${
        hours != "00" ? `${hours}:` : ""
    } ${minutes}:${seconds}:${miliseconds}`;
};
export default function App() {
    const [timer, setTimer] = useState<Date | null>(null);
    const [running, setRunning] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [laps, setLaps] = useState<string[]>([]);

    useEffect(() => {
        let counter;
        if (running) {
            counter = setInterval(() => {
                const now = new Date().valueOf();
                const timeElapsed = new Date(now - startTime);
                setTimer(timeElapsed);
            }, 10);
        }
        return () => {
            clearInterval(counter);
        };
    }, [running]);

    const onStart = useCallback(() => {
        setRunning(true);
        setStartTime((startTime) => startTime ?? new Date().getTime());
    }, [running, startTime]);

    const onStop = useCallback(() => {
        console.log(timer);
        setRunning(false);
        setStartTime(timer.getTime());
    }, [running, startTime, timer]);

    const onReset = () => {
        setTimer(null);
        setStartTime(null);
        setLaps([]);
        setRunning(false);
    };

    const onLap = () => {
        if (timer === null) return;
        setLaps((laps) => [...laps, formatTimer(timer)]);
    };

    return (
        <View style={styles.container}>
            <Text>{formatTimer(timer)}</Text>
            <Actions
                running={running}
                onLap={onLap}
                onReset={onReset}
                onStart={onStart}
                onStop={onStop}
            />
            <Laps laps={laps} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
