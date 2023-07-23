import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { useWebSocket } from './useWebSocket'; // Custom hook to handle WebSocket connection

export default function App() {
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    // Set the update interval for the accelerometer
    setUpdateIntervalForType(SensorTypes.accelerometer, 10);

    // Subscribe to the accelerometer data stream
    const accelerometerSubscription = accelerometer.subscribe(
      data => {
        setAccelerometerData(data);
        // Send accelerometer data to the backend through WebSocket
        sendDataToBackend('accelerometer', data);
      },
      error => {
        console.error('Error reading accelerometer data:', error);
      }
    );

    return () => {
      // Unsubscribe from the accelerometer data stream when the component is unmounted
      accelerometerSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Set the update interval for the gyroscope
    setUpdateIntervalForType(SensorTypes.gyroscope, 20);

    // Subscribe to the gyroscope data stream
    const gyroscopeSubscription = gyroscope.subscribe(
      data => {
        setGyroscopeData(data);
        // Send gyroscope data to the backend through WebSocket
        sendDataToBackend('gyroscope', data);
      },
      error => {
        console.error('Error reading gyroscope data:', error);
      }
    );

    return () => {
      // Unsubscribe from the gyroscope data stream when the component is unmounted
      gyroscopeSubscription.unsubscribe();
    };
  }, []);

  const sendDataToBackend = useWebSocket(); // Custom hook to handle WebSocket connection

  const { x: accelerometerX, y: accelerometerY, z: accelerometerZ } = accelerometerData;
  const { x: gyroscopeX, y: gyroscopeY, z: gyroscopeZ } = gyroscopeData;

  return (
    <View>
      <Text>Accelerometer Data: (in Gs where 1 G = 9.81 m/s^2)</Text>
      <Text>
        Accelerometer X: {round(accelerometerX)} Accelerometer Y: {round(accelerometerY)} Accelerometer Z: {round(accelerometerZ)}
      </Text>
      <Text>Gyroscope Data: (in rad/s)</Text>
      <Text>
        Gyroscope XX: {round(gyroscopeX)} Gyroscope Yy: {round(gyroscopeY)} Gyroscope Z: {round(gyroscopeZ)}
      </Text>
    </View>
  );
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
