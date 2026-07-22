import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, useTheme, Button, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useVehicleStore } from '@/store/vehicleStore';
import { useMaintenanceStore } from '@/store/maintenanceStore';
import { useReminderStore } from '@/store/reminderStore';
import { StatCard } from '@/components/StatCard';
import { PremiumCard } from '@/components/PremiumCard';
import { Car, Activity, Wrench, Droplet, CalendarClock, Plus, Gauge, Edit2, Trash2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable } from 'react-native';
import { triggerImmediateNotification } from '@/utils/notifications';
import { BottomBannerAd } from '@/components/adsComponents/BottomBannerAd';
import { useActionAd } from '@/hooks/useActionAd';

export default function DashboardScreen() {
  const theme = useTheme();
  const router = useRouter();
  const vehicles = useVehicleStore((state) => state.vehicles);
  const updateVehicle = useVehicleStore((state) => state.updateVehicle);
  const activeVehicle = vehicles.find((v) => v.isDefault) || vehicles[0];
  const reminders = useReminderStore((state) => state.reminders);
  const deleteReminder = useReminderStore((state) => state.deleteReminder);
  const { runWithAd, isLoading } = useActionAd();

  const [odometerInput, setOdometerInput] = useState('');
  
  const handleUpdateOdometer = async () => {
    if (!activeVehicle || !odometerInput) return;
    const newMileage = parseInt(odometerInput, 10);
    if (isNaN(newMileage)) return;

    // Update vehicle
    updateVehicle(activeVehicle.id, {
      currentMileage: newMileage,
      lastMileageUpdate: new Date().toISOString(),
    });

    // Check for due reminders based on new mileage
    const dueReminders = reminders.filter(
      (r) => r.vehicleId === activeVehicle.id && !r.completed && r.dueMileage && r.dueMileage <= newMileage
    );

    if (dueReminders.length > 0) {
      const serviceNames = dueReminders.map(r => r.title).join(', ');
      await triggerImmediateNotification(
        'Mileage Alert ⚠️',
        `Your ${serviceNames} is due based on your new odometer reading!`
      );
    }

    setOdometerInput('');
  };

  const isOdometerStale = React.useMemo(() => {
    if (!activeVehicle?.lastMileageUpdate) return true;
    const daysSinceUpdate = (new Date().getTime() - new Date(activeVehicle.lastMileageUpdate).getTime()) / (1000 * 3600 * 24);
    return daysSinceUpdate > 7;
  }, [activeVehicle?.lastMileageUpdate]);

  const upcomingMaintenance = React.useMemo(() => {
    if (!activeVehicle) return [];
    return reminders
      .filter((r) => r.vehicleId === activeVehicle.id && !r.completed && r.dueDate)
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 3);
  }, [reminders, activeVehicle]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }]}>
          <View>
            <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
              {activeVehicle ? activeVehicle.nickname || activeVehicle.model : 'Dashboard'}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {activeVehicle ? `${activeVehicle.year} ${activeVehicle.brand} • ${activeVehicle.currentMileage.toLocaleString()} km` : 'No vehicles added yet'}
            </Text>
          </View>
        </View>

        {activeVehicle && (
          <PremiumCard delay={50} style={{ marginBottom: 16, borderColor: isOdometerStale ? theme.colors.error : 'transparent', borderWidth: isOdometerStale ? 1 : 0 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Gauge size={20} color={isOdometerStale ? theme.colors.error : theme.colors.primary} style={{ marginRight: 8 }} />
              <Text variant="titleMedium" style={{ fontWeight: 'bold', color: isOdometerStale ? theme.colors.error : theme.colors.onSurface }}>
                {isOdometerStale ? 'Update Odometer (Overdue)' : 'Current Odometer'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                mode="outlined"
                keyboardType="number-pad"
                placeholder={activeVehicle.currentMileage.toString()}
                value={odometerInput}
                onChangeText={setOdometerInput}
                style={{ flex: 1, backgroundColor: 'transparent', height: 46 }}
                dense
              />
              <Button mode="contained" onPress={handleUpdateOdometer} style={{ marginLeft: 12, height: 46, justifyContent: 'center' }}>
                Update
              </Button>
            </View>
          </PremiumCard>
        )}

        <View style={styles.statsRow}>
          <StatCard
            title="Health Score"
            value={activeVehicle?.healthScore ? `${activeVehicle.healthScore}%` : 'N/A'}
            icon={Activity}
            color={(theme.colors as any).success}
            style={styles.statCard}
            delay={100}
          />
          <StatCard
            title="Total Vehicles"
            value={vehicles.length}
            icon={Car}
            color={theme.colors.primary}
            style={styles.statCard}
            delay={200}
          />
        </View>

        <PremiumCard title="Quick Actions" delay={300}>
          <View style={styles.quickActions}>
            <ActionIcon icon={Wrench} label="Service" color={theme.colors.primary} onPress={() => runWithAd(() => router.push('/add-maintenance'))} />
            <ActionIcon icon={Droplet} label="Fuel" color={theme.colors.error} onPress={() => router.push('/add-fuel')} />
            <ActionIcon icon={CalendarClock} label="Reminder" color={(theme.colors as any).warning} onPress={() => router.push('/reminders')} />
          </View>
        </PremiumCard>

        <PremiumCard title="Upcoming Maintenance" delay={400}>
          {upcomingMaintenance.length > 0 ? (
            upcomingMaintenance.map((item, index) => {
              const isDueSoon = new Date(item.dueDate!).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;
              return (
                <View key={item.id} style={[styles.maintenanceItem, index < upcomingMaintenance.length - 1 ? styles.borderBottom : undefined, { borderColor: theme.colors.outlineVariant }]}>
                  <View style={[styles.iconContainer, { backgroundColor: isDueSoon ? `${theme.colors.error}15` : `${theme.colors.primary}15` }]}>
                    <Wrench size={20} color={isDueSoon ? theme.colors.error : theme.colors.primary} />
                  </View>
                  <View style={styles.maintenanceText}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>{item.title}</Text>
                    <Text variant="bodyMedium" style={{ color: isDueSoon ? theme.colors.error : theme.colors.onSurfaceVariant }}>
                      Due: {item.dueDate}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Pressable onPress={() => router.push(`/edit-reminder?id=${item.id}`)} hitSlop={8}>
                      <Edit2 size={18} color={theme.colors.primary} />
                    </Pressable>
                    <Pressable onPress={() => deleteReminder(item.id)} hitSlop={8}>
                      <Trash2 size={18} color={theme.colors.error} />
                    </Pressable>
                    <Button mode={isDueSoon ? "contained" : "outlined"} onPress={() => useReminderStore.getState().updateReminder(item.id, { completed: true, notificationEnabled: false })} compact>
                      Done
                    </Button>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyMaintenance}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>No upcoming maintenance scheduled.</Text>
            </View>
          )}
          <Button 
            mode="text" 
            icon={({ size, color }) => <Plus size={size} color={color} />} 
            style={{ marginTop: 8 }}
            onPress={() => runWithAd(() => router.push('/add-maintenance'))}
            loading={isLoading}
          >
            Log Service
          </Button>
        </PremiumCard>

      </ScrollView>
      <BottomBannerAd />
    </SafeAreaView>
  );
}

function ActionIcon({ icon: Icon, label, color, onPress }: { icon: any, label: string, color: string, onPress?: () => void }) {
  const theme = useTheme();
  return (
    <View style={styles.actionItem}>
      <Button onPress={onPress} style={{ padding: 0, margin: 0, minWidth: 0, borderRadius: 28 }} contentStyle={{ width: 56, height: 56 }} mode="text">
        <View style={[styles.actionIconBg, { backgroundColor: `${color}15` }]}>
          <Icon size={24} color={color} />
        </View>
      </Button>
      <Text variant="labelMedium" style={{ color: theme.colors.onSurface, marginTop: 8 }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintenanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  maintenanceText: {
    flex: 1,
  },
  emptyMaintenance: {
    alignItems: 'center',
    paddingVertical: 16,
  },
});
