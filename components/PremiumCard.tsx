import React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Surface, useTheme, Text } from 'react-native-paper';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface PremiumCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  title?: string;
  delay?: number;
}

export function PremiumCard({ children, style, title, delay = 0 }: PremiumCardProps) {
  const theme = useTheme();

  return (
    <Animated.View entering={FadeInUp.delay(delay).springify()}>
      <Surface style={[styles.card, { backgroundColor: theme.colors.elevation.level1 }, style]} elevation={2}>
        {title && (
          <Text variant="titleMedium" style={[styles.title, { color: theme.colors.primary }]}>
            {title}
          </Text>
        )}
        {children}
      </Surface>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.1)',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
