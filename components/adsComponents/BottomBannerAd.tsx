import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useTheme } from 'react-native-paper';
import { getAdUnitId } from '@/constants/ads';

export function BottomBannerAd() {
  const theme = useTheme();
  // Ensure we use the banner unit ID
  const adUnitId = getAdUnitId('banner');

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.elevation.level1 }]}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error) => {
          console.log('Banner Ad failed to load:', error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    // Add safe area margin for the bottom if not handled by layout
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.1)',
  }
});
