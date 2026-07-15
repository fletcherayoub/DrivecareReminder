import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Platform } from 'react-native';
import { TextInput, Button, useTheme, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useMaintenanceStore } from '@/store/maintenanceStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { useReminderStore } from '@/store/reminderStore';
import { MaintenanceRecord } from '@/types';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddMaintenanceScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { addRecord } = useMaintenanceStore();
  const { addReminder } = useReminderStore();
  const { vehicles } = useVehicleStore();
  
  const activeVehicle = vehicles.find((v) => v.isDefault) || vehicles[0];

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [serviceType, setServiceType] = useState('');
  const [cost, setCost] = useState('');
  const [mileage, setMileage] = useState('');
  
  const [nextDueDate, setNextDueDate] = useState<Date | undefined>(undefined);
  const [showNextDatePicker, setShowNextDatePicker] = useState(false);
  
  const [nextDueMileage, setNextDueMileage] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!activeVehicle) {
      alert('Please add a vehicle first.');
      return;
    }

    if (!serviceType || !date || !mileage) {
      alert('Please fill out all required fields.');
      return;
    }

    const newRecord: MaintenanceRecord = {
      id: Math.random().toString(36).substring(2, 11),
      vehicleId: activeVehicle.id,
      date: date.toISOString().split('T')[0],
      serviceType,
      cost: cost ? parseFloat(cost) : 0,
      mileage: parseInt(mileage, 10),
      notes,
      nextDueMileage: nextDueMileage ? parseInt(nextDueMileage, 10) : undefined,
      nextDueDate: nextDueDate ? nextDueDate.toISOString().split('T')[0] : undefined,
    };

    addRecord(newRecord);
    
    // Auto-create reminder if next due date is provided
    if (nextDueDate) {
      addReminder({
        id: Math.random().toString(36).substring(2, 11),
        vehicleId: activeVehicle.id,
        title: serviceType,
        description: `Next due: ${serviceType}`,
        dueDate: nextDueDate.toISOString().split('T')[0],
        dueMileage: nextDueMileage ? parseInt(nextDueMileage, 10) : undefined,
        notificationEnabled: true,
        completed: false,
      });
    }

    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16 }}>
          Log service history and set reminders for future maintenance.
        </Text>

        <TextInput
          label="Service Type (e.g. Oil Change) *"
          value={serviceType}
          onChangeText={setServiceType}
          mode="outlined"
          style={styles.input}
        />

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <View style={styles.row}>
          <Pressable onPress={() => setShowDatePicker(true)} style={[{ flex: 1, marginRight: 8 }]}>
            <View pointerEvents="none">
              <TextInput
                label="Date *"
                value={date.toISOString().split('T')[0]}
                mode="outlined"
                style={styles.input}
                editable={false}
              />
            </View>
          </Pressable>
          
          <TextInput
            label="Odometer *"
            value={mileage}
            onChangeText={setMileage}
            keyboardType="number-pad"
            mode="outlined"
            style={[styles.input, { flex: 1, marginLeft: 8 }]}
          />
        </View>

        <TextInput
          label="Cost (Optional)"
          value={cost}
          onChangeText={setCost}
          keyboardType="decimal-pad"
          mode="outlined"
          style={styles.input}
        />

        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            Next Service Reminder
          </Text>
        </View>

        {showNextDatePicker && (
          <DateTimePicker
            value={nextDueDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowNextDatePicker(Platform.OS === 'ios');
              if (selectedDate) setNextDueDate(selectedDate);
            }}
          />
        )}

        <View style={styles.row}>
          <Pressable onPress={() => setShowNextDatePicker(true)} style={[{ flex: 1, marginRight: 8 }]}>
            <View pointerEvents="none">
              <TextInput
                label="Due Date - Optional"
                value={nextDueDate ? nextDueDate.toISOString().split('T')[0] : ''}
                mode="outlined"
                style={styles.input}
                editable={false}
              />
            </View>
          </Pressable>

          <TextInput
            label="Due Mileage"
            value={nextDueMileage}
            onChangeText={setNextDueMileage}
            keyboardType="number-pad"
            mode="outlined"
            style={[styles.input, { flex: 1, marginLeft: 8 }]}
          />
        </View>

        <TextInput
          label="Notes / Garage Name"
          value={notes}
          onChangeText={setNotes}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <Button 
          mode="contained" 
          onPress={handleSave} 
          style={styles.saveButton}
          contentStyle={{ paddingVertical: 8 }}
        >
          Save Service Record
        </Button>
        <Button 
          mode="text" 
          onPress={() => router.back()} 
          style={styles.cancelButton}
        >
          Cancel
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 16,
    borderRadius: 8,
  },
  cancelButton: {
    marginTop: 8,
  },
});
