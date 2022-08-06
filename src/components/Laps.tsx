import React, { FC } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useTimer } from '../store/useTimer';

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 18 },
});

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
                <View key={index} style={styles.container}>
                    <Text style={styles.text}>
                        #{laps.length - index} - {item}
                    </Text>
                </View>
            )}
        />
    );
};

export default Laps;
