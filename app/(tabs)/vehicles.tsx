import { StyleSheet, View, FlatList, Pressable, Image } from 'react-native';
import { Text, FAB, useTheme, Button } from 'react-native-paper';
import { useVehicleStore } from '@/store/vehicleStore';
import { Car, Star, StarOff, Hash, Info, FileText, Plus, Edit2, Trash2 } from 'lucide-react-native';
import { PremiumCard } from '@/components/PremiumCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInRight } from 'react-native-reanimated';

import { useRouter } from 'expo-router';
import { BottomBannerAd } from '@/components/adsComponents/BottomBannerAd';
import { useActionAd } from '@/hooks/useActionAd';

export default function VehiclesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const vehicles = useVehicleStore((state) => state.vehicles);
  const setDefaultVehicle = useVehicleStore((state) => state.setDefaultVehicle);
  const deleteVehicle = useVehicleStore((state) => state.deleteVehicle);
  const { runWithAd, isLoading } = useActionAd();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
          My Garage
        </Text>
      </View>

      {vehicles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Car size={64} color={theme.colors.onSurfaceDisabled} />
          <Text variant="titleMedium" style={{ marginTop: 16, color: theme.colors.onSurfaceVariant }}>
            No vehicles added yet
          </Text>
          <Text variant="bodyMedium" style={{ marginTop: 8, color: theme.colors.onSurfaceDisabled, textAlign: 'center' }}>
            Tap the + button below to add your first vehicle.
          </Text>
        </View>
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInRight.delay(index * 100).springify()}>
              <PremiumCard>
                {item.photo && (
                  <Image source={{ uri: item.photo }} style={styles.cardImage} />
                )}
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleRow}>
                    <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                      {item.nickname || item.model}
                    </Text>
                    {item.isDefault && (
                      <View style={[styles.defaultBadge, { backgroundColor: `${theme.colors.primary}20` }]}>
                        <Star size={14} color={theme.colors.primary} fill={theme.colors.primary} />
                        <Text variant="labelSmall" style={{ color: theme.colors.primary, marginLeft: 4 }}>Default</Text>
                      </View>
                    )}
                  </View>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    {item.year} {item.brand} {item.model}
                  </Text>
                </View>

                <View style={styles.cardDetails}>
                  <View style={styles.detailItem}>
                    <Hash size={16} color={theme.colors.onSurfaceVariant} />
                    <Text variant="bodySmall" style={[styles.detailText, { color: theme.colors.onSurfaceVariant }]}>
                      {item.plate || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Info size={16} color={theme.colors.onSurfaceVariant} />
                    <Text variant="bodySmall" style={[styles.detailText, { color: theme.colors.onSurfaceVariant }]}>
                      {item.engineType || item.fuelType || 'N/A'}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardActions}>
                  {!item.isDefault && (
                    <Button 
                      mode="text" 
                      onPress={() => setDefaultVehicle(item.id)}
                      icon={({ size, color }) => <StarOff size={size} color={color} />}
                    >
                      Make Default
                    </Button>
                  )}
                  <View style={{ flex: 1 }} />
                  <Pressable onPress={() => router.push(`/add-vehicle?id=${item.id}`)} style={{ padding: 8, justifyContent: 'center' }}>
                    <Edit2 size={20} color={theme.colors.primary} />
                  </Pressable>
                  <Pressable onPress={() => deleteVehicle(item.id)} style={{ padding: 8, justifyContent: 'center' }}>
                    <Trash2 size={20} color={theme.colors.error} />
                  </Pressable>
                  <Button mode="contained" onPress={() => router.push('/documents')} icon={({ size, color }) => <FileText size={size} color={color} />}>
                    Vault
                  </Button>
                </View>
              </PremiumCard>
            </Animated.View>
          )}
        />
      )}

      <FAB
        icon={({ color, size }) => <Plus color={color} size={size} />}
        style={[styles.fab, { backgroundColor: theme.colors.primaryContainer }]}
        onPress={() => runWithAd(() => router.push('/add-vehicle'))}
        loading={isLoading}
      />
      <BottomBannerAd />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 130, // Extra padding for FAB + Banner
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginBottom: 12,
    marginHorizontal: -16,
    marginTop: -16,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 6,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 60, // Above banner ad
  },
});
