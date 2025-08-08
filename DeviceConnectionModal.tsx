import React, { FC, useCallback, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Device } from "react-native-ble-plx";

type DeviceModalListItemProps = {
  item: ListRenderItemInfo<Device>;
  connectToPeripheral: (device: Device) => Promise<void>;
  closeModal: () => void;
  connectingDeviceId: string | null;
  setConnectingDeviceId: (id: string | null) => void;
};

type DeviceModalProps = {
  devices: Device[];
  visible: boolean;
  connectToPeripheral: (device: Device) => Promise<void>;
  closeModal: () => void;
};

const DeviceModalListItem: FC<DeviceModalListItemProps> = ({
  item,
  connectToPeripheral,
  closeModal,
  connectingDeviceId,
  setConnectingDeviceId,
}) => {
  const isConnecting = connectingDeviceId === item.item.id;

  const connectAndCloseModal = useCallback(async () => {
    if (isConnecting) return;
    try {
      setConnectingDeviceId(item.item.id);
      await connectToPeripheral(item.item);
      closeModal();
    } catch (error) {
      console.warn("Connection failed", error);
    } finally {
      setConnectingDeviceId(null);
    }
  }, [item.item, connectToPeripheral, closeModal, isConnecting]);

  return (
    <TouchableOpacity
      onPress={connectAndCloseModal}
      disabled={isConnecting}
      style={[
        modalStyle.ctaButton,
        isConnecting && modalStyle.disabledButton,
      ]}
      accessibilityRole="button"
    >
      {isConnecting ? (
        <View style={modalStyle.loadingContainer}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={modalStyle.ctaButtonTextConnecting}>Connecting...</Text>
        </View>
      ) : (
        <Text style={modalStyle.ctaButtonText}>
          {item.item.name ?? item.item.localName ?? "Unnamed Device"}
        </Text>
      )}
    </TouchableOpacity>
  );

};

const DeviceModal: FC<DeviceModalProps> = ({
  devices,
  visible,
  connectToPeripheral,
  closeModal,
}) => {
  const [connectingDeviceId, setConnectingDeviceId] = useState<string | null>(null);

  const renderDeviceModalListItem = useCallback(
    (item: ListRenderItemInfo<Device>) => (
      <DeviceModalListItem
        item={item}
        connectToPeripheral={connectToPeripheral}
        closeModal={closeModal}
        connectingDeviceId={connectingDeviceId}
        setConnectingDeviceId={setConnectingDeviceId}
      />
    ),
    [connectToPeripheral, closeModal, connectingDeviceId]
  );

  const handleClose = () => {
    setConnectingDeviceId(null);
    closeModal();
  };

  return (
    <Modal animationType="fade" transparent={false} visible={visible}>
      <SafeAreaView style={modalStyle.modalContainer}>
        <TouchableOpacity
          style={modalStyle.closeButton}
          onPress={handleClose}
          accessibilityRole="button"
        >
          <Text style={modalStyle.closeButtonText}>✕</Text>
        </TouchableOpacity>

        <Text style={modalStyle.modalTitleText}>Tap on a device to connect</Text>

        <FlatList
          contentContainerStyle={modalStyle.deviceListContainer}
          data={devices}
          renderItem={renderDeviceModalListItem}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    </Modal>
  );
};

const modalStyle = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modalTitleText: {
    marginTop: 60,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  deviceListContainer: {
    paddingBottom: 20,
  },
  ctaButton: {
    backgroundColor: "#a3bcafff",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginBottom: 10,
    borderRadius: 20,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    paddingHorizontal: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaButtonTextConnecting: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    paddingHorizontal: 12,
  },
});

export default DeviceModal;
