import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Pedometer } from "expo-sensors";

const StartChallenge = () => {
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  const handlePedometerPermission = async () => {
    const permissions = await Pedometer.getPermissionsAsync();
    if (!permissions.granted) {
      const updatedPermissions = await Pedometer.requestPermissionsAsync();
      if (!updatedPermissions.granted) {
        Alert.alert("Permission Required", "You cannot earn coupons unless you share your steps taken");
        return false;
      }
    }
    return true;
  };

  const subscribeToPedometer = async () => {
    const hasPermission = await handlePedometerPermission();
    const isAvailable = await Pedometer.isAvailableAsync();

    if (isAvailable && hasPermission) {
      const subscription = Pedometer.watchStepCount(result => {
        setCurrentStepCount(result.steps);
      });
      setSubscription(subscription);
      setIsTracking(true);
    }
  };

  const unsubscribeFromPedometer = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
      setIsTracking(false);
    }
  };

  const toggleTracking = () => {
    if (isTracking) {
      unsubscribeFromPedometer();
    } else {
      subscribeToPedometer();
    }
  };

  const resetChallenge = () => {
    setCurrentStepCount(0);
  };

  useEffect(() => {
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [subscription]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Challenge</Text>
      <Text style={styles.stepCount}>{currentStepCount}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleTracking}>
          <Text style={styles.buttonText}>{isTracking ? 'Stop' : 'Start'} Challenge</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={resetChallenge}>
          <Text style={styles.buttonText}>Reset Challenge</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.appState}>App State: Active</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  stepCount: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#4a4a4a',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  appState: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default StartChallenge;