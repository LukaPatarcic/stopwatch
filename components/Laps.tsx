import React, { FC } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useTimer } from '../store/useTimer';

const Laps: FC = () => {
    const laps = useTimer((state) => state.laps);
    if (!laps.length) return null;
    return (
        <FlatList
            data={laps}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
                <View
                    key={index}
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Text style={{ fontSize: 18 }}>
                        #{laps.length - index} - {item}
                    </Text>
                </View>
            )}
        />
    );
};

export default Laps;
