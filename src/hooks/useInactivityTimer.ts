// src/hooks/useInactivityTimer.ts
import { useEffect, useCallback } from 'react';

export function useInactivityTimer(onInactive: () => void, timeoutMinutes: number = 30) {
  const resetTimer = useCallback(() => {
    const existingTimer = window.localStorage.getItem('inactivityTimer');
    if (existingTimer) {
      window.clearTimeout(parseInt(existingTimer));
    }

    const newTimer = window.setTimeout(() => {
      onInactive();
    }, timeoutMinutes * 60 * 1000);

    window.localStorage.setItem('inactivityTimer', newTimer.toString());
  }, [onInactive, timeoutMinutes]);

  useEffect(() => {
    // Events to monitor for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    // Reset timer on any user activity
    const handleUserActivity = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity);
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      const existingTimer = window.localStorage.getItem('inactivityTimer');
      if (existingTimer) {
        window.clearTimeout(parseInt(existingTimer));
      }
    };
  }, [resetTimer]);
}