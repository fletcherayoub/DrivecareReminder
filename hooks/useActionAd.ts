import { useState, useEffect, useRef, useCallback } from 'react';
import { RewardedAd, RewardedAdEventType, AdEventType } from 'react-native-google-mobile-ads';
import { getAdUnitId } from '@/constants/ads';

export function useActionAd() {
  const adUnitId = getAdUnitId('rewarded');
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const rewardedAdRef = useRef<RewardedAd | null>(null);
  const actionCallbackRef = useRef<(() => void) | null>(null);
  const pendingShowRef = useRef(false);

  const loadAd = useCallback(() => {
    try {
      setIsReady(false);
      const rewarded = RewardedAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
      });

      const unsubscribeLoaded = rewarded.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => {
          setIsReady(true);
          setIsLoading(false);
          if (pendingShowRef.current) {
            pendingShowRef.current = false;
            rewarded.show();
          }
        }
      );

      const unsubscribeClosed = rewarded.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          setIsReady(false);
          if (actionCallbackRef.current) {
            actionCallbackRef.current();
            actionCallbackRef.current = null;
          }
          // Preload the next rewarded ad
          loadAd();
        }
      );

      const unsubscribeEarned = rewarded.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          // No points logic here, just acknowledge it.
        }
      );

      const unsubscribeFailed = rewarded.addAdEventListener(
        AdEventType.ERROR,
        (error) => {
          console.warn('Action ad failed to load: ', error);
          setIsLoading(false);
          setIsReady(false);
          if (pendingShowRef.current) {
            pendingShowRef.current = false;
            // Fallback: execute action immediately if ad fails
            if (actionCallbackRef.current) {
               actionCallbackRef.current();
               actionCallbackRef.current = null;
            }
          }
        }
      );

      rewardedAdRef.current = rewarded;
      rewarded.load();

      return () => {
        unsubscribeLoaded();
        unsubscribeClosed();
        unsubscribeEarned();
        unsubscribeFailed();
      };
    } catch (e) {
      console.error("Failed to create Action Ad", e);
    }
  }, [adUnitId]);

  useEffect(() => {
    const cleanUp = loadAd();
    return () => {
      if (cleanUp) cleanUp();
    };
  }, [loadAd]);

  const runWithAd = useCallback((callback: () => void) => {
    actionCallbackRef.current = callback;

    if (isReady && rewardedAdRef.current) {
      rewardedAdRef.current.show();
    } else {
      setIsLoading(true);
      pendingShowRef.current = true;
      loadAd();
      
      // Fallback timeout
      setTimeout(() => {
        if (pendingShowRef.current) {
          pendingShowRef.current = false;
          setIsLoading(false);
          if (actionCallbackRef.current) {
            actionCallbackRef.current();
            actionCallbackRef.current = null;
          }
        }
      }, 5000);
    }
  }, [isReady, loadAd]);

  return { runWithAd, isReady, isLoading };
}
