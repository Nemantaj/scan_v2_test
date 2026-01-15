/**
 * Sync Queue Service
 * Manages offline-first data storage and sync when back online
 * Uses localStorage for simplicity (could use IndexedDB for larger data)
 */

const SYNC_QUEUE_KEY = "marvans-sync-queue";

// Get all pending items from queue
export const getSyncQueue = () => {
  try {
    const queue = localStorage.getItem(SYNC_QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch {
    return [];
  }
};

// Save queue to storage
const saveSyncQueue = (queue) => {
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
};

// Add item to sync queue
export const addToSyncQueue = (action, data) => {
  const queue = getSyncQueue();
  const item = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    action, // 'create' | 'update' | 'delete'
    data,
    timestamp: Date.now(),
    retries: 0,
  };
  queue.push(item);
  saveSyncQueue(queue);

  // Update badge
  updateBadge(queue.length);

  return item;
};

// Remove item from queue after successful sync
export const removeFromSyncQueue = (id) => {
  const queue = getSyncQueue();
  const newQueue = queue.filter((item) => item.id !== id);
  saveSyncQueue(newQueue);

  // Update badge
  updateBadge(newQueue.length);

  return newQueue;
};

// Update retry count for failed sync
export const incrementRetry = (id) => {
  const queue = getSyncQueue();
  const item = queue.find((item) => item.id === id);
  if (item) {
    item.retries += 1;
    item.lastRetry = Date.now();
    saveSyncQueue(queue);
  }
  return queue;
};

// Get pending sync count
export const getPendingSyncCount = () => {
  return getSyncQueue().length;
};

// Update app badge
const updateBadge = (count) => {
  if ("setAppBadge" in navigator) {
    if (count > 0) {
      navigator.setAppBadge(count);
    } else {
      navigator.clearAppBadge();
    }
  }
};

// Process sync queue (call this when online)
export const processSyncQueue = async (handlers) => {
  const queue = getSyncQueue();

  if (queue.length === 0) return { success: true, processed: 0 };

  let processed = 0;
  const errors = [];

  for (const item of queue) {
    try {
      const handler = handlers[item.action];
      if (handler) {
        await handler(item.data);
        removeFromSyncQueue(item.id);
        processed++;
      }
    } catch (error) {
      console.error(`[SyncQueue] Failed to sync item ${item.id}:`, error);
      incrementRetry(item.id);
      errors.push({ id: item.id, error: error.message });
    }
  }

  return {
    success: errors.length === 0,
    processed,
    errors,
    remaining: getSyncQueue().length,
  };
};

// Clear entire queue (use with caution)
export const clearSyncQueue = () => {
  localStorage.removeItem(SYNC_QUEUE_KEY);
  updateBadge(0);
};

export default {
  getSyncQueue,
  addToSyncQueue,
  removeFromSyncQueue,
  getPendingSyncCount,
  processSyncQueue,
  clearSyncQueue,
};
