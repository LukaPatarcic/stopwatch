import create from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ITimer {
    time: string;
    timeDate: Date | null,
    startTime: Date | null,
    stopTime: Date | null,
    running: boolean;
    elapsed: boolean;
    laps: string[];
    setTime: () => void;
    onStart: () => void;
    onStop: () => void;
    onReset: () => void;
    onLap: () => void;
}

const formatTimer = (timeElapsed: number | null) => {
    if (!timeElapsed) return "00:00:00";
    const milliseconds = String(parseInt(String((timeElapsed % 1000) / 10))).padStart(2, "0");
    const seconds = String(parseInt(String((timeElapsed/1000)%60))).padStart(2, "0");
    const minutes = String(parseInt(String((timeElapsed/(1000*60))%60))).padStart(2, "0");
    return `${minutes == '00' ? `${minutes}:` : ''}${seconds}.${milliseconds}`;
};


export const useTimer = create<ITimer>()(persist((set) => ({
    time: "00:00:00",
    timeDate: null,
    startTime: null,
    stopTime: null,
    running: false,
    elapsed: false,
    laps: [],
    setTime: () => set(({ time, startTime }) => {
        const newTime = formatTimer(time ? new Date().valueOf() - startTime.valueOf() : new Date().valueOf());
        return { time: newTime, timeDate: new Date()  }
    }),
    onStart: () => set(({ elapsed, startTime, timeDate}) => {
        const now = new Date();
        const continueTime = new Date(now.valueOf() + (startTime?.valueOf() - timeDate.valueOf()));
        return {
            running: true,
            elapsed: true,
            startTime: elapsed ? continueTime : now,
        };
    }),
    onStop: () => set(() => ({ running: false, elapsed: true, stopTime: new Date() })),
    onReset: () => set(() => ({
        running: false,
        time: null,
        laps: [],
        elapsed: false,
        startTime: null,
        stopTime: null,
    })),
    onLap: () => set((state) => ({ laps: [...state.laps, state.time] })),
}), { name: 'timer-storage', getStorage: () => AsyncStorage }));
