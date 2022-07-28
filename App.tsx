import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

let interval = null;
export default function App() {
    const [timer, setTimer] = useState(null);
    const [running, setRunning] = useState(false);
    const [startTime, setStartTime] = useState<number>(null);
    const [laps, setLaps] = useState([]);

    useEffect(() => {
        let counter;
        const now = new Date().getTime();
        if (running) {
            counter = setInterval(() => {
                const now = new Date().valueOf();
                const timeElapsed = new Date(now - startTime);
                const hours = timeElapsed.getUTCHours();
                const minutes = timeElapsed.getUTCMinutes();
                const seconds = timeElapsed.getUTCSeconds();
                const miliseconds = (
                    timeElapsed.getUTCMilliseconds() / 10
                ).toFixed(0);
                setTimer(`${hours}: ${minutes} : ${seconds}: ${miliseconds}`);
            }, 10);
        }
        return () => {
            clearInterval(counter);
        };
    }, [running]);

    const onStart = () => {
        setRunning(true);
        setStartTime(new Date().getTime());
    };

    const onStop = () => {
        setRunning(false);
        clearInterval(interval);
    };

    const onReset = () => {
        setTimer(null);
        setStartTime(null);
        setLaps([]);
        setRunning(false);
    };

    const onLap = () => {
        setLaps((laps) => [...laps, timer]);
    };

    return (
        <View style={styles.container}>
            <Text>{timer}</Text>
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
            {laps.map((lap, index) => (
                <View key={index}>
                    <Text>
                        {index + 1}. lap - {lap}
                    </Text>
                </View>
            ))}
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
