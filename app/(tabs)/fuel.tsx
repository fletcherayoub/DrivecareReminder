import { StyleSheet, View, FlatList } from 'react-native';
import { Text, FAB, useTheme, Button } from 'react-native-paper';
import { useFuelStore } from '@/store/fuelStore';
import { Droplet, TrendingDown, Plus } from 'lucide-react-native';
import { PremiumCard } from '@/components/PremiumCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInRight } from 'react-native-reanimated';

import { useRouter } from 'expo-router';

export default function FuelScreen() {
  const theme = useTheme();
  const router = useRouter();
  const fuelLogs = useFuelStore((state) => state.fuelLogs);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
          Fuel Log
        </Text>
      </View>

      {fuelLogs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Droplet size={64} color={theme.colors.onSurfaceDisabled} />
          <Text variant="titleMedium" style={{ marginTop: 16, color: theme.colors.onSurfaceVariant }}>
            No fuel logs yet
          </Text>
          <Text variant="bodyMedium" style={{ marginTop: 8, color: theme.colors.onSurfaceDisabled, textAlign: 'center' }}>
            Track your fill-ups to monitor fuel economy and spending trends.
          </Text>
        </View>
      ) : (
        <FlatList
          data={fuelLogs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInRight.delay(index * 100).springify()}>
              <PremiumCard>
                <View style={styles.cardHeader}>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
                    {item.date}
                  </Text>
                  <Text variant="titleMedium" style={{ color: theme.colors.error, fontWeight: 'bold' }}>
                    ${item.totalCost.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.cardDetails}>
                  <View>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Volume</Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>{item.quantity} L</Text>
                  </View>
                  <View>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Price/Unit</Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>${item.pricePerUnit}</Text>
                  </View>
                  <View>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Mileage</Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>{item.mileage} km</Text>
                  </View>
                </View>
              </PremiumCard>
            </Animated.View>
          )}
        />
      )}

      <FAB
        icon={({ color, size }) => <Plus color={color} size={size} />}
        style={[styles.fab, { backgroundColor: theme.colors.primaryContainer }]}
        onPress={() => router.push('/add-fuel')}
      />
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
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
