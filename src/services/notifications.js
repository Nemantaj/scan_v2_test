/**
 * Push Notifications Service
 * Handles notification permissions, subscription, and display
 */

// Check if notifications are supported
export const isNotificationSupported = () =>
  "Notification" in window && "serviceWorker" in navigator;

// Get current permission status
export const getNotificationPermission = () => {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
};

/**
 * Request notification permission
 * @returns {Promise<string>} - 'granted', 'denied', or 'default'
 */
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) return "unsupported";

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return "denied";
  }
};

/**
 * Show a local notification
 * @param {string} title - Notification title
 * @param {object} options - Notification options
 */
export const showNotification = async (title, options = {}) => {
  if (!isNotificationSupported()) return null;
  if (Notification.permission !== "granted") return null;

  const defaultOptions = {
    icon: "/android-chrome-192x192.png",
    badge: "/favicon-32x32.png",
    vibrate: [100, 50, 100],
    requireInteraction: false,
    ...options,
  };

  try {
    const registration = await navigator.serviceWorker.ready;
    return registration.showNotification(title, defaultOptions);
  } catch {
    // Fallback to regular notification if service worker not available
    return new Notification(title, defaultOptions);
  }
};

/**
 * Show sync complete notification
 * @param {number} count - Number of items synced
 */
export const showSyncCompleteNotification = (count) => {
  return showNotification("Sync Complete", {
    body: `${count} item${count !== 1 ? "s" : ""} synced successfully`,
    tag: "sync-complete",
    data: { type: "sync", count },
  });
};

/**
 * Show entry created notification
 * @param {string} entryName - Name of the created entry
 */
export const showEntryCreatedNotification = (entryName) => {
  return showNotification("Entry Created", {
    body: `"${entryName}" has been saved`,
    tag: "entry-created",
    data: { type: "entry" },
  });
};

/**
 * Show offline queue notification
 * @param {number} count - Number of items in queue
 */
export const showOfflineQueueNotification = (count) => {
  return showNotification("Items Queued", {
    body: `${count} item${count !== 1 ? "s" : ""} will sync when online`,
    tag: "offline-queue",
    data: { type: "queue", count },
  });
};

export default {
  isSupported: isNotificationSupported,
  getPermission: getNotificationPermission,
  requestPermission: requestNotificationPermission,
  show: showNotification,
  showSyncComplete: showSyncCompleteNotification,
  showEntryCreated: showEntryCreatedNotification,
  showOfflineQueue: showOfflineQueueNotification,
};
