import React, { FC, memo } from "react";
import { Text, View } from "react-native";

interface Props {
    laps: string[];
}

const Laps: FC<Props> = ({ laps }) => {
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

export default memo(
    Laps,
    (prevProps, nextProps) => prevProps.laps.length === nextProps.laps.length
);
