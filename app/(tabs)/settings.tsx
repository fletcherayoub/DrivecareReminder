import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, useTheme, List, Switch, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsStore, ThemeType, UnitType } from '@/store/settingsStore';
import { Moon, Sun, Monitor, Globe, Bell, FileDown, UploadCloud, Banknote, Ruler } from 'lucide-react-native';
import { PremiumCard } from '@/components/PremiumCard';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BottomBannerAd } from '@/components/adsComponents/BottomBannerAd';

export default function SettingsScreen() {
  const theme = useTheme();
  const { 
    theme: currentTheme, 
    setTheme, 
    unit, 
    setUnit,
    notificationsEnabled,
    setNotificationsEnabled,
    currency
  } = useSettingsStore();

  const handleThemeChange = (value: string) => {
    setTheme(value as ThemeType);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            Settings
          </Text>
        </View>

        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <PremiumCard title="Appearance">
            <List.Item
              title="System Theme"
              left={() => <Monitor size={24} color={theme.colors.onSurfaceVariant} style={styles.icon} />}
              right={() => (
                <Switch
                  value={currentTheme === 'system'}
                  onValueChange={(val) => handleThemeChange(val ? 'system' : 'light')}
                />
              )}
            />
            <Divider />
            <List.Item
              title="Dark Mode"
              disabled={currentTheme === 'system'}
              left={() => currentTheme === 'dark' 
                ? <Moon size={24} color={theme.colors.onSurfaceVariant} style={styles.icon} />
                : <Sun size={24} color={theme.colors.onSurfaceVariant} style={styles.icon} />
              }
              right={() => (
                <Switch
                  disabled={currentTheme === 'system'}
                  value={currentTheme === 'dark'}
                  onValueChange={(val) => handleThemeChange(val ? 'dark' : 'light')}
                />
              )}
            />
          </PremiumCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <PremiumCard title="Preferences">
            <List.Item
              title="Distance Unit"
              description={unit === 'km' ? 'Kilometers' : 'Miles'}
              left={() => <Ruler size={24} color={theme.colors.onSurfaceVariant} style={styles.icon} />}
              onPress={() => setUnit(unit === 'km' ? 'mi' : 'km')}
            />
            <Divider />
            <List.Item
              title="Currency"
              description={currency}
              left={() => <Banknote size={24} color={theme.colors.onSurfaceVariant} style={styles.icon} />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Language"
              description="English"
              left={() => <Globe size={24} color={theme.colors.onSurfaceVariant} style={styles.icon} />}
              onPress={() => {}}
            />
          </PremiumCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <PremiumCard title="Notifications">
            <List.Item
              title="Enable Reminders"
              left={() => <Bell size={24} color={theme.colors.onSurfaceVariant} style={styles.icon} />}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                />
              )}
            />
          </PremiumCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <PremiumCard title="Data & Backup">
            <List.Item
              title="Export Data (CSV)"
              left={() => <FileDown size={24} color={theme.colors.primary} style={styles.icon} />}
              onPress={() => {}}
            />
            <Divider />
            <List.Item
              title="Backup to Cloud"
              left={() => <UploadCloud size={24} color={theme.colors.primary} style={styles.icon} />}
              onPress={() => {}}
            />
          </PremiumCard>
        </Animated.View>
        
      </ScrollView>
      <BottomBannerAd />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  icon: {
    marginRight: 8,
    alignSelf: 'center',
  },
});
