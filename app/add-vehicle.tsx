import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Image, Pressable } from 'react-native';
import { TextInput, Button, useTheme, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useVehicleStore } from '@/store/vehicleStore';
import { Vehicle } from '@/types';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';

export default function AddVehicleScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { vehicles, addVehicle, updateVehicle } = useVehicleStore();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [plate, setPlate] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [currentMileage, setCurrentMileage] = useState('');

  useEffect(() => {
    if (id) {
      const existingVehicle = vehicles.find(v => v.id === id);
      if (existingVehicle) {
        setImageUri(existingVehicle.photo || null);
        setNickname(existingVehicle.nickname || '');
        setBrand(existingVehicle.brand);
        setModel(existingVehicle.model);
        setYear(existingVehicle.year.toString());
        setPlate(existingVehicle.plate || '');
        setFuelType(existingVehicle.fuelType || '');
        setCurrentMileage(existingVehicle.currentMileage.toString());
      }
    }
  }, [id, vehicles]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!brand || !model || !year || !currentMileage) {
      alert('Please fill out all required fields.');
      return;
    }

    if (id) {
      updateVehicle(id, {
        photo: imageUri || undefined,
        nickname: nickname || model,
        brand,
        model,
        year: parseInt(year, 10),
        plate,
        fuelType,
        currentMileage: parseInt(currentMileage, 10),
      });
    } else {
      const isFirst = vehicles.length === 0;

      const newVehicle: Vehicle = {
        id: Math.random().toString(36).substring(2, 11),
        photo: imageUri || undefined,
        nickname: nickname || model,
        brand,
        model,
        year: parseInt(year, 10),
        plate,
        fuelType,
        currentMileage: parseInt(currentMileage, 10),
        purchaseDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isDefault: isFirst,
        healthScore: 100,
      };

      addVehicle(newVehicle);
    }
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Pressable onPress={pickImage} style={[styles.imageContainer, { backgroundColor: theme.colors.elevation.level2 }]}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.vehicleImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Camera size={40} color={theme.colors.onSurfaceVariant} />
              <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                Add Vehicle Photo
              </Text>
            </View>
          )}
        </Pressable>

        <TextInput
          label="Nickname (Optional)"
          value={nickname}
          onChangeText={setNickname}
          mode="outlined"
          style={styles.input}
        />
        <View style={styles.row}>
          <TextInput
            label="Make/Brand *"
            value={brand}
            onChangeText={setBrand}
            mode="outlined"
            style={[styles.input, { flex: 1, marginRight: 8 }]}
          />
          <TextInput
            label="Model *"
            value={model}
            onChangeText={setModel}
            mode="outlined"
            style={[styles.input, { flex: 1, marginLeft: 8 }]}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            label="Year *"
            value={year}
            onChangeText={setYear}
            keyboardType="number-pad"
            mode="outlined"
            style={[styles.input, { flex: 1, marginRight: 8 }]}
          />
          <TextInput
            label="Plate Number"
            value={plate}
            onChangeText={setPlate}
            autoCapitalize="characters"
            mode="outlined"
            style={[styles.input, { flex: 1, marginLeft: 8 }]}
          />
        </View>

        <TextInput
          label="Fuel Type (e.g., Petrol, Diesel, EV)"
          value={fuelType}
          onChangeText={setFuelType}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Current Mileage (km/mi) *"
          value={currentMileage}
          onChangeText={setCurrentMileage}
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
          {id ? 'Update Vehicle' : 'Save Vehicle'}
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
  imageContainer: {
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
