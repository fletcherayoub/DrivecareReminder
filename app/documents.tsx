import React from 'react';
import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import { Text, useTheme, FAB, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDocumentStore } from '@/store/documentStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { PremiumCard } from '@/components/PremiumCard';
import { FileText, FileImage, ExternalLink, CalendarClock } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Linking from 'expo-linking';

export default function DocumentsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { documents } = useDocumentStore();
  const { vehicles } = useVehicleStore();
  const activeVehicle = vehicles.find((v) => v.isDefault) || vehicles[0];

  const vehicleDocs = documents.filter((d) => d.vehicleId === activeVehicle?.id);

  const openDocument = (uri: string) => {
    Linking.openURL(uri).catch((err) => console.error("Couldn't open document", err));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
          Document Vault
        </Text>
      </View>

      {vehicleDocs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FileText size={64} color={theme.colors.onSurfaceDisabled} />
          <Text variant="titleMedium" style={{ marginTop: 16, color: theme.colors.onSurfaceVariant }}>
            Vault is empty
          </Text>
          <Text variant="bodyMedium" style={{ marginTop: 8, color: theme.colors.onSurfaceDisabled, textAlign: 'center', paddingHorizontal: 40 }}>
            Store your digital registration, insurance cards, and repair invoices here securely.
          </Text>
        </View>
      ) : (
        <FlatList
          data={vehicleDocs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => {
            const isExpiringSoon = item.expiryDate && (new Date(item.expiryDate).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000);
            return (
              <Animated.View entering={FadeInUp.delay(index * 100).springify()}>
                <PremiumCard>
                  <View style={styles.docRow}>
                    <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
                      {item.uri.includes('pdf') ? (
                        <FileText size={24} color={theme.colors.primary} />
                      ) : (
                        <FileImage size={24} color={theme.colors.primary} />
                      )}
                    </View>
                    
                    <View style={styles.docInfo}>
                      <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                        {item.title}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                          {item.type}
                        </Text>
                        {item.expiryDate && (
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12 }}>
                            <CalendarClock size={12} color={isExpiringSoon ? theme.colors.error : theme.colors.onSurfaceVariant} style={{ marginRight: 4 }} />
                            <Text variant="labelMedium" style={{ color: isExpiringSoon ? theme.colors.error : theme.colors.onSurfaceVariant }}>
                              Exp: {item.expiryDate}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <Button mode="outlined" onPress={() => openDocument(item.uri)} compact>
                      Open
                    </Button>
                  </View>
                </PremiumCard>
              </Animated.View>
            );
          }}
        />
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primaryContainer }]}
        onPress={() => router.push('/add-document')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  docRow: {
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
  docInfo: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
