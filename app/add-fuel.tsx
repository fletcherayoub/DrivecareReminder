import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Platform } from 'react-native';
import { TextInput, Button, useTheme, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFuelStore } from '@/store/fuelStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { FuelLog } from '@/types';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddFuelScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { addFuelLog } = useFuelStore();
  const { vehicles } = useVehicleStore();
  
  const activeVehicle = vehicles.find((v) => v.isDefault) || vehicles[0];

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [quantity, setQuantity] = useState('');
  const [mileage, setMileage] = useState('');

  const handleSave = () => {
    if (!activeVehicle) {
      alert('Please add a vehicle first.');
      return;
    }

    if (!pricePerUnit || !totalCost || !quantity || !mileage) {
      alert('Please fill out all required fields.');
      return;
    }

    const newFuelLog: FuelLog = {
      id: Math.random().toString(36).substring(2, 11),
      vehicleId: activeVehicle.id,
      date: date.toISOString().split('T')[0],
      pricePerUnit: parseFloat(pricePerUnit),
      totalCost: parseFloat(totalCost),
      quantity: parseFloat(quantity),
      mileage: parseInt(mileage, 10),
      isFullFill: true,
    };

    addFuelLog(newFuelLog);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16 }}>
          Log your fuel fill-up to track consumption and costs.
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

        <View style={styles.row}>
          <TextInput
            label="Total Cost *"
            value={totalCost}
            onChangeText={setTotalCost}
            keyboardType="decimal-pad"
            mode="outlined"
            style={[styles.input, { flex: 1, marginRight: 8 }]}
          />
          <TextInput
            label="Quantity (L/Gal) *"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="decimal-pad"
            mode="outlined"
            style={[styles.input, { flex: 1, marginLeft: 8 }]}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            label="Price per Unit *"
            value={pricePerUnit}
            onChangeText={setPricePerUnit}
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

        <Button 
          mode="contained" 
          onPress={handleSave} 
          style={styles.saveButton}
          contentStyle={{ paddingVertical: 8 }}
        >
          Save Fuel Log
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
