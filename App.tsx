import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import Actions from './components/Actions';
import Laps from './components/Laps';
import Timer from './components/Timer';
import { Provider as PaperProvider } from 'react-native-paper';
import Notification from './components/Notification';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
});

const App = () => {
    return (
        <PaperProvider>
            <SafeAreaView style={styles.container}>
                <Notification />
                <View style={{ flex: 1 }}>
                    <Timer />
                    <Laps />
                </View>
                <Actions />
            </SafeAreaView>
        </PaperProvider>
    );
};

export default App;
