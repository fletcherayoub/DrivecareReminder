import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, useTheme, Button, Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReminderStore } from '@/store/reminderStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { CalendarClock, CheckCircle, Clock } from 'lucide-react-native';
import { PremiumCard } from '@/components/PremiumCard';

export default function RemindersScreen() {
  const theme = useTheme();
  const vehicles = useVehicleStore((state) => state.vehicles);
  const activeVehicle = vehicles.find((v) => v.isDefault) || vehicles[0];
  
  const { getRemindersByVehicle, updateReminder, deleteReminder } = useReminderStore();
  
  const reminders = activeVehicle ? getRemindersByVehicle(activeVehicle.id) : [];
  
  const sortedReminders = [...reminders].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            Maintenance Reminders
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Manage your scheduled notifications
          </Text>
        </View>

        {sortedReminders.length > 0 ? (
          sortedReminders.map((reminder) => {
            const isDueSoon = reminder.dueDate && (new Date(reminder.dueDate).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000);
            
            return (
              <PremiumCard key={reminder.id} style={styles.reminderCard}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: reminder.completed ? `${(theme.colors as any).success}15` : isDueSoon ? `${theme.colors.error}15` : `${theme.colors.primary}15` }]}>
                    {reminder.completed ? (
                      <CheckCircle size={24} color={(theme.colors as any).success} />
                    ) : (
                      <CalendarClock size={24} color={isDueSoon ? theme.colors.error : theme.colors.primary} />
                    )}
                  </View>
                  <View style={styles.titleContainer}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                      {reminder.title}
                    </Text>
                    <View style={styles.dueRow}>
                      <Clock size={14} color={reminder.completed ? theme.colors.onSurfaceVariant : (isDueSoon ? theme.colors.error : theme.colors.primary)} />
                      <Text variant="bodySmall" style={{ marginLeft: 4, color: reminder.completed ? theme.colors.onSurfaceVariant : (isDueSoon ? theme.colors.error : theme.colors.primary) }}>
                        {reminder.dueDate ? `Due: ${reminder.dueDate}` : 'No date set'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.switchContainer}>
                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 4 }}>Notify</Text>
                    <Switch
                      value={reminder.notificationEnabled}
                      onValueChange={(val) => updateReminder(reminder.id, { notificationEnabled: val })}
                      color={theme.colors.primary}
                      disabled={reminder.completed}
                    />
                  </View>
                </View>

                {reminder.dueMileage && (
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}>
                    Due at: {reminder.dueMileage.toLocaleString()} km
                  </Text>
                )}

                <View style={styles.actionRow}>
                  {!reminder.completed && (
                    <Button 
                      mode="contained" 
                      onPress={() => updateReminder(reminder.id, { completed: true, notificationEnabled: false })}
                      style={styles.actionBtn}
                      buttonColor={(theme.colors as any).success}
                    >
                      Mark Complete
                    </Button>
                  )}
                  <Button 
                    mode="outlined" 
                    textColor={theme.colors.error}
                    style={[styles.actionBtn, { borderColor: theme.colors.error }]}
                    onPress={() => deleteReminder(reminder.id)}
                  >
                    Delete
                  </Button>
                </View>
              </PremiumCard>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <CalendarClock size={48} color={theme.colors.onSurfaceVariant} style={{ opacity: 0.5, marginBottom: 16 }} />
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>No Reminders</Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8 }}>
              When you log a future maintenance service, it will automatically appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  reminderCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  switchContainer: {
    alignItems: 'center',
    marginLeft: 8,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
