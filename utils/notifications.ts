import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications behave when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  //jids
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

export async function scheduleReminderNotification(
  title: string,
  body: string,
  dateString: string
): Promise<string | undefined> {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return undefined;

  const triggerDate = new Date(dateString);
  // Default to 9:00 AM on the due date for the notification
  triggerDate.setHours(9, 0, 0, 0);

  // If the date is already in the past, don't schedule
  if (triggerDate.getTime() < Date.now()) {
    return undefined;
  }

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });
    return id;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return undefined;
  }
}

export async function cancelReminderNotification(notificationId?: string) {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
}

export async function triggerImmediateNotification(title: string, body: string) {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null, // null means trigger immediately
    });
  } catch (error) {
    console.error('Error triggering immediate notification:', error);
  }
}
