import create from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ITimer {
    time: string | null;
    timeDate: Date | null;
    startTime: Date | null;
    running: boolean;
    elapsed: boolean;
    laps: string[];
    setTime: () => void;
    onStart: () => void;
    onStop: () => void;
    onReset: () => void;
    onLap: () => void;
}

export const formatTimer = (timeElapsed: number | null) => {
    if (!timeElapsed) return '00:00:00';
    const milliseconds = String(parseInt(String((timeElapsed % 1000) / 10))).padStart(2, '0');
    const seconds = String(parseInt(String((timeElapsed / 1000) % 60))).padStart(2, '0');
    const minutes = String(parseInt(String((timeElapsed / (1000 * 60)) % 60))).padStart(2, '0');
    const hours = String(parseInt(String(timeElapsed / 3600000))).padStart(2, '0');
    return `${hours !== '00' ? `${hours}:` : ''}${minutes}:${seconds}.${milliseconds}`;
};

export const useTimer = create<ITimer>()(
    persist(
        (set, get) => ({
            time: null,
            timeDate: null,
            startTime: null,
            running: false,
            elapsed: false,
            laps: [],
            setTime: () =>
                set(({ startTime }) => {
                    if (!startTime) return {};
                    const newTime = formatTimer(new Date().valueOf() - startTime.valueOf());
                    return { time: newTime, timeDate: new Date() };
                }),
            onStart: () =>
                set(({ elapsed, startTime, timeDate }) => {
                    const now = new Date();
                    return {
                        running: true,
                        elapsed: true,
                        startTime: elapsed
                            ? new Date(now.valueOf() + (startTime!.valueOf() - timeDate!.valueOf()))
                            : now,
                    };
                }),
            onStop: () =>
                set(({ startTime }) => ({
                    running: false,
                    elapsed: true,
                    time: formatTimer(new Date().valueOf() - startTime!.valueOf()),
                })),
            onReset: () => {
                set({
                    running: false,
                    elapsed: false,
                    startTime: null,
                    time: null,
                    laps: [],
                });
            },
            onLap: () =>
                set(({ laps, time }) => {
                    if (!time) return { laps };
                    return { laps: [time, ...laps] };
                }),
        }),
        { name: 'timer-storage', getStorage: () => AsyncStorage }
    )
);
