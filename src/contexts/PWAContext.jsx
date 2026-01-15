import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

const PWAContext = createContext(null);

export const PWAProvider = ({ children }) => {
  // Online/Offline status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Install prompt
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Pending sync count for badge
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Service worker registration
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      console.log("[PWA] Service worker registered:", swUrl);
      // Check for updates periodically
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Check every hour
      }
    },
    onRegisterError(error) {
      console.error("[PWA] Service worker registration error:", error);
    },
  });

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger sync when back online
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.sync?.register("sync-entries");
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Handle install prompt
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Update badge count
  useEffect(() => {
    if ("setAppBadge" in navigator) {
      if (pendingSyncCount > 0) {
        navigator.setAppBadge(pendingSyncCount);
      } else {
        navigator.clearAppBadge();
      }
    }
  }, [pendingSyncCount]);

  // Install app
  const installApp = useCallback(async () => {
    if (!installPrompt) return false;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      setInstallPrompt(null);
      return true;
    }
    return false;
  }, [installPrompt]);

  // Update service worker
  const updateApp = useCallback(() => {
    updateServiceWorker(true);
  }, [updateServiceWorker]);

  // Close update/offline ready prompts
  const closePrompts = useCallback(() => {
    setNeedRefresh(false);
    setOfflineReady(false);
  }, [setNeedRefresh, setOfflineReady]);

  const value = {
    // Status
    isOnline,
    isOffline: !isOnline,
    isInstalled,
    canInstall: !!installPrompt && !isInstalled,

    // Update
    needRefresh,
    offlineReady,
    updateApp,
    closePrompts,

    // Install
    installApp,

    // Sync
    pendingSyncCount,
    setPendingSyncCount,
  };

  return <PWAContext.Provider value={value}>{children}</PWAContext.Provider>;
};

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error("usePWA must be used within a PWAProvider");
  }
  return context;
};

export default PWAContext;
