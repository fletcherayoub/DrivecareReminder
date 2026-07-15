import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { LucideIcon } from 'lucide-react-native';
import { PremiumCard } from './PremiumCard';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
  delay?: number;
  color?: string;
}

export function StatCard({ title, value, icon: Icon, subtitle, style, delay = 0, color }: StatCardProps) {
  const theme = useTheme();
  const iconColor = color || theme.colors.primary;

  return (
    <PremiumCard style={[styles.container, style]} delay={delay}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <Icon size={20} color={iconColor} />
        </View>
        <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {title}
        </Text>
      </View>
      <Text variant="headlineMedium" style={[styles.value, { color: theme.colors.onSurface }]}>
        {value}
      </Text>
      {subtitle && (
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
          {subtitle}
        </Text>
      )}
    </PremiumCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  value: {
    fontWeight: 'bold',
  },
});
