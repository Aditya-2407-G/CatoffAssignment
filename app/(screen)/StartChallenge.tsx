import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, AppState } from 'react-native';
import { Pedometer } from "expo-sensors";
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_FETCH_TASK = 'background-fetch-task';

// Define the background task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const now = new Date();
    const start = new Date(now.setHours(0, 0, 0, 0));
    const end = new Date();
    const result = await Pedometer.getStepCountAsync(start, end);
    console.log(`Background fetch: Updated steps: ${result.steps}`);
    // You might want to store this data or send it to a server
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.log('Error in background fetch', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

const StartChallenge = () => {
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [initialSteps, setInitialSteps] = useState(0);

  useEffect(() => {
    const loadInitialSteps = async () => {
      const permissions = await Pedometer.getPermissionsAsync();
      if (!permissions.granted) {
        const updatedPermissions = await Pedometer.requestPermissionsAsync();
        if (!updatedPermissions.granted) {
          Alert.alert("Permission Required", "You cannot earn coupons unless you share your steps taken");
          return;
        }
      }

      const isAvailable = await Pedometer.isAvailableAsync();
      if (isAvailable) {
        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0); // Today's midnight
        const result = await Pedometer.getStepCountAsync(start, end);
        setInitialSteps(result.steps);
        setCurrentStepCount(result.steps); // Initialize current step count
      }
    };

    loadInitialSteps();
    registerBackgroundFetch();

    // Subscribe to AppState changes
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      // Clean up the subscription
      appStateSubscription.remove();
      if (subscription) {
        subscription.remove();
      }
      unregisterBackgroundFetch();
    };
  }, []);

  const registerBackgroundFetch = async () => {
    try {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 15 * 60, // 15 minutes
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log('Background fetch registered');
    } catch (err) {
      console.log('Background fetch failed to register', err);
    }
  };

  const unregisterBackgroundFetch = async () => {
    try {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
      console.log('Background fetch unregistered');
    } catch (err) {
      console.log('Background fetch failed to unregister', err);
    }
  };

  const handleAppStateChange = async (nextAppState) => {
    if (nextAppState === 'active') {
      console.log("App is in the foreground");
      await updateStepCount();
    } else if (nextAppState === 'background') {
      console.log("App has gone to the background");
    }
  };

  const updateStepCount = async () => {
    const end = new Date();
    const start = new Date();
    start.setHours(0, 0, 0, 0); // Today's midnight
    const result = await Pedometer.getStepCountAsync(start, end);
    console.log(`Updated steps: ${result.steps} (Initial: ${initialSteps})`);
    setCurrentStepCount(result.steps - initialSteps);
  };

  const subscribeToPedometer = async () => {
    const hasPermission = await handlePedometerPermission();
    const isAvailable = await Pedometer.isAvailableAsync();
  
    if (isAvailable && hasPermission) {
      await updateStepCount(); // Get initial step count
      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0); // Today's midnight
      const initialStepCountResult = await Pedometer.getStepCountAsync(start, end);
      setInitialSteps(initialStepCountResult.steps);
      setCurrentStepCount(0); // Reset current step count
  
      const sub = Pedometer.watchStepCount(result => {
        setCurrentStepCount(prevCount => prevCount + result.steps);
        console.log(`Step count updated: ${result.steps}`);
      });
      setSubscription(sub);
      setIsTracking(true);
      console.log('Pedometer subscribed');
    }
  };

  const unsubscribeFromPedometer = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
      setIsTracking(false);
      console.log('Pedometer unsubscribed');
    }
  };

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

  const toggleTracking = async () => {
    if (isTracking) {
      unsubscribeFromPedometer();
    } else {
      await subscribeToPedometer();
    }
  };

  const resetChallenge = () => {
    setCurrentStepCount(0);
    setInitialSteps(0);
  };


  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(updateStepCount, 5000); // Update every 5 seconds
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTracking]);

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
      <Text style={styles.appState}>Tracking: {isTracking ? 'Active' : 'Inactive'}</Text>
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