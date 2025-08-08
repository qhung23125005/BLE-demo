// App.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import DeviceModal from "./DeviceConnectionModal";
import useBLE from "./useBLE";

const App = () => {
  const {
    allDevices,
    connectedDevice,
    connectToDevice,
    disconnectFromDevice,
    reloadScan,
    requestPermissions,
    scanForPeripherals,
    deviceValue,
  } = useBLE();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const hideModal = () => setIsModalVisible(false);
  const openModal = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
      setIsModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7FA" />
      <Text style={styles.title}> BLE Thermometer</Text>

      <View style={styles.card}>
        {connectedDevice ? (
          <>
            <Text style={styles.connectedText}>
               Connected to: {connectedDevice.name}
            </Text>
            {deviceValue ? (
              <View style={styles.dataContainer}>
                <Text style={styles.dataItem}>Temperature: {deviceValue.temperature}</Text>
                <Text style={styles.dataItem}>Humidity: {deviceValue.humidity}</Text>
                <Text style={styles.dataItem}>Battery: {deviceValue.batteryVoltage}</Text>
              </View>
            ) : (
              <Text style={styles.waitingText}>Receiving data...</Text>
            )}
          </>
        ) : (
          <Text style={styles.disconnectedText}>No device connected</Text>
        )}
      </View>

      {connectedDevice && (
        <TouchableOpacity onPress={disconnectFromDevice} style={[styles.ctaButton, styles.disconnectButton]}>
          <Text style={styles.ctaButtonText}>Disconnect</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={openModal} style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>
          {connectedDevice ? "Reconnect" : "Connect Device"}
        </Text>
      </TouchableOpacity>

      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        
        devices={allDevices}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FA",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 20,
    alignItems: "center",
  },
  connectedText: {
    fontSize: 18,
    color: "#2E7D32",
    fontWeight: "600",
    marginBottom: 10,
  },
  disconnectedText: {
    fontSize: 18,
    color: "#D32F2F",
    textAlign: "center",
    fontWeight: "500",
  },
  waitingText: {
    fontSize: 16,
    color: "#999",
    fontStyle: "italic",
    marginTop: 10,
  },
  dataContainer: {
    marginTop: 10,
    alignItems: "flex-start",
    width: "100%",
  },
  dataItem: {
    fontSize: 18,
    marginVertical: 4,
    color: "#333",
  },
  ctaButton: {
    backgroundColor: "#1976D2",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  disconnectButton: {
    backgroundColor: "#D32F2F",
  },
  reloadButton: {
    backgroundColor: "#FF9800",
  },
});

export default App;
