import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, useTheme, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PremiumCard } from '@/components/PremiumCard';
import { BarChart } from 'react-native-gifted-charts';
import { CircleDollarSign, Plus, Receipt, Fuel, Edit2, Trash2 } from 'lucide-react-native';
import { useExpenseStore } from '@/store/expenseStore';
import { useVehicleStore } from '@/store/vehicleStore';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Pressable } from 'react-native';

import { useRouter } from 'expo-router';

export default function ExpensesScreen() {
  const theme = useTheme();
  const router = useRouter();

  const expenses = useExpenseStore((state) => state.expenses);
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);
  const vehicles = useVehicleStore((state) => state.vehicles);
  const activeVehicle = vehicles.find((v) => v.isDefault) || vehicles[0];

  const barData = React.useMemo(() => {
    const data = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const targetMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = targetMonth.toLocaleString('default', { month: 'short' });
      
      const monthExpenses = expenses.filter(e => {
        if (activeVehicle && e.vehicleId !== activeVehicle.id) return false;
        const eDate = new Date(e.date);
        return eDate.getMonth() === targetMonth.getMonth() && eDate.getFullYear() === targetMonth.getFullYear();
      });
      
      const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
      data.push({ value: total, label: monthLabel });
    }
    
    return data;
  }, [expenses, activeVehicle]);

  const chartMaxValue = Math.max(Math.ceil(Math.max(...barData.map(d => d.value)) / 100) * 100, 100);

  const recentExpenses = React.useMemo(() => {
    if (!activeVehicle) return [];
    return expenses
      .filter(e => e.vehicleId === activeVehicle.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [expenses, activeVehicle]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            Expenses
          </Text>
        </View>

        <PremiumCard title="Monthly Spending" delay={100}>
          <View style={styles.chartContainer}>
            <BarChart
              data={barData}
              barWidth={22}
              spacing={24}
              roundedTop
              roundedBottom
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: theme.colors.onSurfaceVariant }}
              xAxisLabelTextStyle={{ color: theme.colors.onSurfaceVariant }}
              noOfSections={3}
              maxValue={chartMaxValue}
              frontColor={theme.colors.primary}
            />
          </View>
        </PremiumCard>

        <View style={styles.listHeader}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
            Recent Expenses
          </Text>
        </View>

        {recentExpenses.length > 0 ? (
          recentExpenses.map((expense, index) => {
            const isFuel = expense.category.toLowerCase().includes('fuel');
            return (
            <Animated.View key={expense.id} entering={FadeInRight.delay(index * 100).springify()}>
              <PremiumCard style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: `${theme.colors.primary}15`, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                    {isFuel ? (
                      <Fuel size={20} color={theme.colors.primary} />
                    ) : (
                      <Receipt size={20} color={theme.colors.primary} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>{expense.category}</Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{expense.date}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text variant="titleMedium" style={{ color: theme.colors.error, fontWeight: 'bold', marginBottom: 8 }}>
                      ${expense.amount.toFixed(2)}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 16 }}>
                      <Pressable onPress={() => router.push(`/add-expense?id=${expense.id}`)} hitSlop={8}>
                        <Edit2 size={16} color={theme.colors.primary} />
                      </Pressable>
                      <Pressable onPress={() => deleteExpense(expense.id)} hitSlop={8}>
                        <Trash2 size={16} color={theme.colors.error} />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </PremiumCard>
            </Animated.View>
          )})
        ) : (
          <PremiumCard delay={200}>
            <View style={styles.emptyContainer}>
              <CircleDollarSign size={48} color={theme.colors.onSurfaceDisabled} />
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                No recent expenses.
              </Text>
            </View>
          </PremiumCard>
        )}
      </ScrollView>

      <FAB
        icon={({ color, size }) => <Plus color={color} size={size} />}
        style={[styles.fab, { backgroundColor: theme.colors.primaryContainer }]}
        onPress={() => router.push('/add-expense')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 24,
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  listHeader: {
    marginBottom: 12,
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
