import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { LayoutDashboard, Car, CircleDollarSign, Settings, Droplet } from 'lucide-react-native';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarStyle: {
          backgroundColor: theme.colors.elevation.level2,
          borderTopWidth: 0,
        },
        headerStyle: {
          backgroundColor: theme.colors.elevation.level2,
        },
        headerTintColor: theme.colors.onSurface,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }: { color: string }) => (
            <LayoutDashboard size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="vehicles"
        options={{
          title: 'Vehicles',
          tabBarIcon: ({ color }: { color: string }) => (
            <Car size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="fuel"
        options={{
          title: 'Fuel Log',
          tabBarIcon: ({ color }: { color: string }) => (
            <Droplet size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color }: { color: string }) => (
            <CircleDollarSign size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }: { color: string }) => (
            <Settings size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
