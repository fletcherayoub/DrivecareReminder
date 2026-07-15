import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Image, Platform } from 'react-native';
import { TextInput, Button, useTheme, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDocumentStore } from '@/store/documentStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { Document } from '@/types';
import * as DocumentPicker from 'expo-document-picker';
import { FileUp, FileText } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddDocumentScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { addDocument } = useDocumentStore();
  const { vehicles } = useVehicleStore();
  
  const activeVehicle = vehicles.find((v) => v.isDefault) || vehicles[0];

  const [title, setTitle] = useState('');
  const [type, setType] = useState('Insurance');
  
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        setFileUri(result.assets[0].uri);
        setFileName(result.assets[0].name);
      }
    } catch (error) {
      console.log('Error picking document', error);
    }
  };

  const handleSave = () => {
    if (!activeVehicle) {
      alert('Please add a vehicle first.');
      return;
    }

    if (!title || !fileUri) {
      alert('Please provide a title and attach a file.');
      return;
    }

    const newDoc: Document = {
      id: Math.random().toString(36).substring(2, 11),
      vehicleId: activeVehicle.id,
      title,
      type: type as any,
      uri: fileUri,
      expiryDate: expiryDate ? expiryDate.toISOString().split('T')[0] : undefined,
      dateAdded: new Date().toISOString(),
    };

    addDocument(newDoc);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16 }}>
          Upload digital copies of your vehicle's registration, insurance, and service receipts.
        </Text>

        <Pressable onPress={pickDocument} style={[styles.uploadContainer, { backgroundColor: theme.colors.elevation.level2, borderColor: theme.colors.outlineVariant }]}>
          {fileUri ? (
            <View style={styles.filePlaceholder}>
              <FileText size={40} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginTop: 8, textAlign: 'center' }}>
                {fileName}
              </Text>
            </View>
          ) : (
            <View style={styles.filePlaceholder}>
              <FileUp size={40} color={theme.colors.onSurfaceVariant} />
              <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                Tap to Select File
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                (PDF or Image)
              </Text>
            </View>
          )}
        </Pressable>

        <TextInput
          label="Document Title *"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Document Type (e.g. Insurance, Receipt)"
          value={type}
          onChangeText={setType}
          mode="outlined"
          style={styles.input}
        />

        {showDatePicker && (
          <DateTimePicker
            value={expiryDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selectedDate) setExpiryDate(selectedDate);
            }}
          />
        )}

        <Pressable onPress={() => setShowDatePicker(true)}>
          <View pointerEvents="none">
            <TextInput
              label="Expiry Date - Optional"
              value={expiryDate ? expiryDate.toISOString().split('T')[0] : ''}
              mode="outlined"
              style={styles.input}
              editable={false}
            />
          </View>
        </Pressable>

        <Button 
          mode="contained" 
          onPress={handleSave} 
          style={styles.saveButton}
          contentStyle={{ paddingVertical: 8 }}
        >
          Save Document
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
  uploadContainer: {
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
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
