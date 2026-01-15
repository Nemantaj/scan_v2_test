/**
 * Vibration Service
 * Provides haptic feedback for various app actions
 */

// Check if vibration is supported
export const isVibrationSupported = () => "vibrate" in navigator;

// Vibration patterns (in milliseconds)
const PATTERNS = {
  // Short single vibration for success
  success: [50],

  // Two short vibrations for error
  error: [100, 50, 100],

  // Quick tap for button press
  tap: [10],

  // Medium vibration for scan detected
  scan: [100],

  // Long vibration for warning
  warning: [200],

  // Pattern for notification
  notification: [100, 100, 100],
};

/**
 * Trigger vibration with a predefined pattern
 * @param {string} type - Pattern name: 'success', 'error', 'tap', 'scan', 'warning', 'notification'
 * @returns {boolean} - Whether vibration was triggered
 */
export const vibrate = (type = "tap") => {
  if (!isVibrationSupported()) return false;

  const pattern = PATTERNS[type] || PATTERNS.tap;

  try {
    navigator.vibrate(pattern);
    return true;
  } catch {
    return false;
  }
};

/**
 * Trigger custom vibration pattern
 * @param {number[]} pattern - Array of vibration/pause durations in ms
 * @returns {boolean} - Whether vibration was triggered
 */
export const vibrateCustom = (pattern) => {
  if (!isVibrationSupported()) return false;

  try {
    navigator.vibrate(pattern);
    return true;
  } catch {
    return false;
  }
};

/**
 * Stop any ongoing vibration
 */
export const stopVibration = () => {
  if (isVibrationSupported()) {
    navigator.vibrate(0);
  }
};

export default {
  isSupported: isVibrationSupported,
  vibrate,
  vibrateCustom,
  stop: stopVibration,
};
