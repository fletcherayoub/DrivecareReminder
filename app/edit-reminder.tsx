import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Platform } from 'react-native';
import { TextInput, Button, useTheme, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useReminderStore } from '@/store/reminderStore';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditReminderScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { reminders, updateReminder } = useReminderStore();

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dueMileage, setDueMileage] = useState('');
  
  useEffect(() => {
    if (id) {
      const existing = reminders.find(r => r.id === id);
      if (existing) {
        setTitle(existing.title);
        if (existing.dueDate) {
          setDueDate(new Date(existing.dueDate));
        }
        if (existing.dueMileage) {
          setDueMileage(existing.dueMileage.toString());
        }
      }
    }
  }, [id, reminders]);

  const handleSave = () => {
    if (!title) {
      alert('Title is required.');
      return;
    }

    if (id) {
      updateReminder(id, {
        title,
        dueDate: dueDate ? dueDate.toISOString().split('T')[0] : undefined,
        dueMileage: dueMileage ? parseInt(dueMileage, 10) : undefined,
      });
    }

    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16 }}>
          Update your maintenance reminder.
        </Text>

        <TextInput
          label="Title *"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
        />

        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selectedDate) setDueDate(selectedDate);
            }}
          />
        )}

        <Pressable onPress={() => setShowDatePicker(true)}>
          <View pointerEvents="none">
            <TextInput
              label="Due Date"
              value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
              mode="outlined"
              style={styles.input}
              editable={false}
            />
          </View>
        </Pressable>

        <TextInput
          label="Due Mileage (Optional)"
          value={dueMileage}
          onChangeText={setDueMileage}
          keyboardType="number-pad"
          mode="outlined"
          style={styles.input}
        />

        <Button 
          mode="contained" 
          onPress={handleSave} 
          style={styles.saveButton}
          contentStyle={{ paddingVertical: 8 }}
        >
          Update Reminder
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
  saveButton: {
    marginTop: 16,
    borderRadius: 8,
  },
  cancelButton: {
    marginTop: 8,
  },
});
