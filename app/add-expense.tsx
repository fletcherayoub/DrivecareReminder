import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Platform } from 'react-native';
import { TextInput, Button, useTheme, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useExpenseStore } from '@/store/expenseStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { Expense } from '@/types';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddExpenseScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { addExpense, updateExpense, expenses } = useExpenseStore();
  const { vehicles } = useVehicleStore();
  
  const activeVehicle = vehicles.find((v) => v.isDefault) || vehicles[0];

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [mileage, setMileage] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (id) {
      const existingExpense = expenses.find(e => e.id === id);
      if (existingExpense) {
        setDate(new Date(existingExpense.date));
        setCategory(existingExpense.category);
        setAmount(existingExpense.amount.toString());
        setMileage(existingExpense.mileage.toString());
        setNotes(existingExpense.notes || '');
      }
    }
  }, [id, expenses]);

  const handleSave = () => {
    if (!activeVehicle) {
      alert('Please add a vehicle first.');
      return;
    }

    if (!category || !amount || !mileage) {
      alert('Please fill out all required fields.');
      return;
    }

    if (id) {
      updateExpense(id, {
        date: date.toISOString().split('T')[0],
        category,
        amount: parseFloat(amount),
        mileage: parseInt(mileage, 10),
        notes,
      });
    } else {
      const newExpense: Expense = {
        id: Math.random().toString(36).substring(2, 11),
        vehicleId: activeVehicle.id,
        date: date.toISOString().split('T')[0],
        category,
        amount: parseFloat(amount),
        mileage: parseInt(mileage, 10),
        notes,
      };
      addExpense(newExpense);
    }
    
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16 }}>
          Track vehicle-related expenses like insurance, maintenance, and registration.
        </Text>

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

        <Pressable onPress={() => setShowDatePicker(true)}>
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
          label="Category (e.g. Maintenance, Insurance) *"
          value={category}
          onChangeText={setCategory}
          mode="outlined"
          style={styles.input}
        />

        <View style={styles.row}>
          <TextInput
            label="Amount *"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            mode="outlined"
            style={[styles.input, { flex: 1, marginRight: 8 }]}
          />
          <TextInput
            label="Odometer (km/mi) *"
            value={mileage}
            onChangeText={setMileage}
            keyboardType="number-pad"
            mode="outlined"
            style={[styles.input, { flex: 1, marginLeft: 8 }]}
          />
        </View>

        <TextInput
          label="Notes (Optional)"
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
          {id ? 'Update Expense' : 'Save Expense'}
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
  saveButton: {
    marginTop: 16,
    borderRadius: 8,
  },
  cancelButton: {
    marginTop: 8,
  },
});
