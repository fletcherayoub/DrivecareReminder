import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { useSettingsStore } from '@/store/settingsStore';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

import Colors from '@/constants/Colors';

function RootLayoutNav() {
  const systemColorScheme = useColorScheme();
  const themeSetting = useSettingsStore((state) => state.theme);
  
  const isDark = themeSetting === 'system' ? systemColorScheme === 'dark' : themeSetting === 'dark';
  
  const customDarkTheme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: Colors.dark.primary,
      background: Colors.dark.background,
      surface: Colors.dark.card,
      elevation: {
        ...MD3DarkTheme.colors.elevation,
        level1: Colors.dark.card,
        level2: Colors.dark.border,
      },
      error: Colors.dark.error,
      success: Colors.dark.success,
      warning: Colors.dark.warning,
    },
  };

  const customLightTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: Colors.light.primary,
      background: Colors.light.background,
      surface: Colors.light.card,
      elevation: {
        ...MD3LightTheme.colors.elevation,
        level1: Colors.light.card,
        level2: Colors.light.border,
      },
      error: Colors.light.error,
      success: Colors.light.success,
      warning: Colors.light.warning,
    },
  };

  const paperTheme = isDark ? customDarkTheme : customLightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="add-vehicle" options={{ presentation: 'modal', title: 'Add Vehicle' }} />
          <Stack.Screen name="add-fuel" options={{ presentation: 'modal', title: 'Log Fuel' }} />
          <Stack.Screen name="add-expense" options={{ presentation: 'modal', title: 'Add Expense' }} />
          <Stack.Screen name="add-maintenance" options={{ presentation: 'modal', title: 'Add Maintenance' }} />
          <Stack.Screen name="reminders" options={{ presentation: 'modal', title: 'Reminders' }} />
          <Stack.Screen name="documents" options={{ presentation: 'modal', title: 'Document Vault' }} />
          <Stack.Screen name="add-document" options={{ presentation: 'modal', title: 'Upload Document' }} />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}
