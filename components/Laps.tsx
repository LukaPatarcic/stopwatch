import React, { FC } from "react";
import { Text, View } from "react-native";
import { useTimer } from '../store/useTimer';

const Laps: FC = () => {
    const laps = useTimer((state) => state.laps);

    return (
        <>
            {laps.map((lap, index) => (
                <View key={index}>
                    <Text>
                        {index + 1}. lap - {lap}
                    </Text>
                </View>
            ))}
        </>
    );
};

export default Laps;
