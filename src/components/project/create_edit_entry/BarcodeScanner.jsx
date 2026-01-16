import { useState, useCallback, useEffect, useRef } from "react";
import {
  Box,
  Stack,
  Text,
  Group,
  TextInput,
  Paper,
  Select,
  Transition,
} from "@mantine/core";
import {
  TbCheck,
  TbRefresh,
  TbX,
  TbScan,
  TbBulb as TbFlash,
  TbBulbOff as TbFlashOff,
  TbCamera,
  TbPlayerPlay,
  TbPlayerStop,
  TbSwitchHorizontal,
} from "react-icons/tb";
import { Html5Qrcode } from "html5-qrcode";
import StyledButton from "../../common/StyledButton";

// Helper to clean scanned value
const cleanCode = (str) => str?.replace(/\s+/g, "").trim() || "";

const SCANNER_ID = "barcode-scanner-region";

// Custom transition styles
const fadeSlide = {
  in: { opacity: 1, transform: "translateY(0) scale(1)" },
  out: { opacity: 0, transform: "translateY(10px) scale(0.98)" },
  transitionProperty: "opacity, transform",
};

const fadeScale = {
  in: { opacity: 1, transform: "scale(1)" },
  out: { opacity: 0, transform: "scale(0.9)" },
  transitionProperty: "opacity, transform",
};

const BarcodeScanner = ({ onScan, onClose, existingCodes = [] }) => {
  const [scanning, setScanning] = useState(false); // Start paused
  const [scannedValue, setScannedValue] = useState("");
  const [error, setError] = useState("");
  const [cameraError, setCameraError] = useState(false);
  const [torch, setTorch] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // Camera selection state
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [loadingCameras, setLoadingCameras] = useState(true);

  const scannerRef = useRef(null);
  const isMountedRef = useRef(true);

  // Load available cameras on mount
  useEffect(() => {
    const loadCameras = async () => {
      try {
        const availableCameras = await Html5Qrcode.getCameras();
        if (availableCameras && availableCameras.length > 0) {
          setCameras(availableCameras);

          // Try to find main back camera (prefer non-ultrawide)
          const backCameras = availableCameras.filter((cam) => {
            const label = cam.label.toLowerCase();
            return (
              label.includes("back") ||
              label.includes("rear") ||
              label.includes("environment")
            );
          });

          const candidates =
            backCameras.length > 0 ? backCameras : availableCameras;

          // Prefer main camera (exclude ultrawide/wide)
          const mainCamera = candidates.find((cam) => {
            const label = cam.label.toLowerCase();
            if (label.includes("ultra") || label.includes("wide")) return false;
            return true;
          });

          const defaultCamera =
            mainCamera || candidates[0] || availableCameras[0];
          setSelectedCameraId(defaultCamera.id);
          // Auto-start after loading cameras
          setScanning(true);
        }
      } catch (err) {
        console.error("Error loading cameras:", err);
        setCameraError(true);
      } finally {
        setLoadingCameras(false);
      }
    };

    loadCameras();
  }, []);

  // Start scanner when camera is selected and scanning is true
  useEffect(() => {
    if (!scanning || !selectedCameraId || loadingCameras) return;

    isMountedRef.current = true;
    setIsStarting(true);

    const initTimer = setTimeout(async () => {
      const scannerElement = document.getElementById(SCANNER_ID);
      if (!scannerElement || !isMountedRef.current) return;

      const html5QrCode = new Html5Qrcode(SCANNER_ID, { verbose: false });
      scannerRef.current = html5QrCode;

      const config = {
        fps: 60,
        qrbox: { width: 260, height: 70 },
        aspectRatio: 1.777778,
        disableFlip: false,
      };

      try {
        await html5QrCode.start(
          { deviceId: selectedCameraId },
          config,
          (decodedText) => {
            if (!isMountedRef.current) return;
            const cleaned = cleanCode(decodedText);
            if (cleaned.length >= 5) {
              html5QrCode.stop().catch(() => {});
              setScannedValue(cleaned);
              setScanning(false);

              if (existingCodes.includes(cleaned)) {
                setError("This code already exists");
              } else {
                setError("");
              }
            }
          }
        );

        if (isMountedRef.current) {
          setIsStarting(false);
        }
      } catch (err) {
        console.error("Scanner error:", err);
        if (isMountedRef.current) {
          setCameraError(true);
          setIsStarting(false);
        }
      }
    }, 100);

    return () => {
      isMountedRef.current = false;
      clearTimeout(initTimer);
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current.stop().catch(() => {});
          }
          scannerRef.current.clear();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [scanning, selectedCameraId, existingCodes, loadingCameras]);

  // Handle camera change
  const handleCameraChange = useCallback(
    async (newCameraId) => {
      if (!newCameraId || newCameraId === selectedCameraId) return;

      // Stop current scanner
      if (scannerRef.current && scannerRef.current.isScanning) {
        try {
          await scannerRef.current.stop();
        } catch (e) {
          // Ignore
        }
      }

      setSelectedCameraId(newCameraId);
      if (scanning) {
        setIsStarting(true);
      }
    },
    [selectedCameraId, scanning]
  );

  // Toggle scanning on/off
  const toggleScanning = useCallback(async () => {
    if (scanning) {
      // Stop scanner
      if (scannerRef.current && scannerRef.current.isScanning) {
        try {
          await scannerRef.current.stop();
        } catch (e) {
          // Ignore
        }
      }
      setScanning(false);
      setTorch(false);
    } else {
      // Start scanner
      setScanning(true);
    }
  }, [scanning]);

  const resetScanner = useCallback(() => {
    setScannedValue("");
    setError("");
    setScanning(true);
  }, []);

  const handleConfirm = useCallback(() => {
    if (scannedValue && !error) {
      onScan(scannedValue);
      resetScanner();
    }
  }, [scannedValue, error, onScan, resetScanner]);

  const handleManualChange = useCallback(
    (e) => {
      const cleaned = cleanCode(e.target.value);
      setScannedValue(cleaned);
      if (existingCodes.includes(cleaned)) {
        setError("This code already exists");
      } else {
        setError("");
      }
    },
    [existingCodes]
  );

  const toggleTorch = useCallback(() => {
    if (scannerRef.current) {
      const newTorchState = !torch;
      scannerRef.current
        .applyVideoConstraints({ advanced: [{ torch: newTorchState }] })
        .then(() => setTorch(newTorchState))
        .catch(() => {});
    }
  }, [torch]);

  // Format camera options for Select - shorten labels
  const cameraOptions = cameras.map((cam, index) => {
    let label = cam.label || `Camera ${index + 1}`;
    // Shorten common camera labels
    label = label
      .replace(/facing back/i, "Back")
      .replace(/facing front/i, "Front")
      .replace(/camera2/i, "")
      .replace(/\d+,\s*\d+/g, "")
      .replace(/\(\s*\)/g, "")
      .trim();
    return {
      value: cam.id,
      label: label || `Camera ${index + 1}`,
    };
  });

  const showControls = !loadingCameras && !cameraError && !scannedValue;
  const showScanner = scanning && !scannedValue && !cameraError;
  const showPaused =
    !scanning && !scannedValue && !cameraError && !loadingCameras;
  const showResult = !!scannedValue;

  return (
    <Stack gap={12} py={8}>
      {/* Scanner Container */}
      <Box
        style={{
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: "#000",
          position: "relative",
          minHeight: 280,
          transition: "all 0.3s ease",
        }}
      >
        {/* Camera Error State */}
        <Transition mounted={cameraError} transition={fadeScale} duration={300}>
          {(styles) => (
            <Stack
              align="center"
              justify="center"
              h={280}
              py={60}
              style={{ ...styles, position: "absolute", inset: 0, zIndex: 4 }}
            >
              <TbScan size={48} color="var(--mantine-color-gray-5)" />
              <Text size="sm" c="gray.5" ta="center" px={20}>
                Camera not available. Please check permissions.
              </Text>
            </Stack>
          )}
        </Transition>

        {/* Scanned Result State */}
        <Transition mounted={showResult} transition={fadeScale} duration={300}>
          {(styles) => (
            <Stack
              align="center"
              justify="center"
              h={280}
              py={40}
              gap={16}
              style={{ ...styles, position: "absolute", inset: 0, zIndex: 4 }}
            >
              <Box
                w={64}
                h={64}
                style={{
                  borderRadius: "50%",
                  background: error
                    ? "var(--mantine-color-red-6)"
                    : "linear-gradient(135deg, #22C55E, #16A34A)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.3s ease, transform 0.3s ease",
                  animation: "pulse 0.5s ease-out",
                }}
              >
                {error ? (
                  <TbX size={32} color="white" />
                ) : (
                  <TbCheck size={32} color="white" />
                )}
              </Box>
              <Text size="lg" c="white" fw={600}>
                {error ? "Duplicate Code" : "Code Detected!"}
              </Text>
            </Stack>
          )}
        </Transition>

        {/* Paused State */}
        <Transition mounted={showPaused} transition={fadeScale} duration={300}>
          {(styles) => (
            <Stack
              align="center"
              justify="center"
              h={280}
              py={40}
              gap={16}
              style={{ ...styles, position: "absolute", inset: 0, zIndex: 3 }}
            >
              <Box
                w={72}
                h={72}
                style={{
                  borderRadius: "50%",
                  background: "rgba(139, 92, 246, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid rgba(139, 92, 246, 0.4)",
                  transition: "all 0.3s ease",
                }}
              >
                <TbCamera size={36} color="var(--mantine-color-violet-4)" />
              </Box>
              <Text size="md" c="gray.4" fw={500}>
                Camera Paused
              </Text>
              <Text size="xs" c="gray.6">
                Tap play to resume scanning
              </Text>
            </Stack>
          )}
        </Transition>

        {/* Scanner View */}
        {showScanner && (
          <Box style={{ position: "relative" }}>
            {/* Scanner video container */}
            <Box
              id={SCANNER_ID}
              style={{
                width: "100%",
                height: 280,
                transition: "opacity 0.3s ease",
                opacity: isStarting || loadingCameras ? 0 : 1,
              }}
            />

            {/* Loading overlay */}
            <Transition
              mounted={isStarting || loadingCameras}
              transition="fade"
              duration={200}
            >
              {(styles) => (
                <Stack
                  align="center"
                  justify="center"
                  style={{
                    ...styles,
                    position: "absolute",
                    inset: 0,
                    background: "#000",
                    zIndex: 5,
                  }}
                >
                  <Box
                    style={{
                      animation: "spin 1.5s linear infinite",
                    }}
                  >
                    <TbScan size={40} color="var(--mantine-color-violet-5)" />
                  </Box>
                  <Text size="sm" c="gray.5">
                    {loadingCameras
                      ? "Loading cameras..."
                      : "Starting camera..."}
                  </Text>
                </Stack>
              )}
            </Transition>

            {/* Torch button - top right */}
            <Transition
              mounted={!isStarting && !loadingCameras}
              transition={fadeSlide}
              duration={200}
            >
              {(styles) => (
                <Box
                  style={{
                    ...styles,
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 10,
                  }}
                >
                  <StyledButton
                    tint={torch ? "yellow" : "dark"}
                    tintOpacity={torch ? 0.9 : 0.7}
                    size="sm"
                    onClick={toggleTorch}
                    style={{
                      padding: "8px 12px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Box
                      style={{
                        transition: "transform 0.2s ease",
                        transform: torch ? "rotate(0deg)" : "rotate(-15deg)",
                      }}
                    >
                      {torch ? <TbFlash size={18} /> : <TbFlashOff size={18} />}
                    </Box>
                  </StyledButton>
                </Box>
              )}
            </Transition>

            {/* Bottom hint */}
            <Transition
              mounted={!isStarting && !loadingCameras}
              transition={fadeSlide}
              duration={300}
            >
              {(styles) => (
                <Box
                  style={{
                    ...styles,
                    position: "absolute",
                    bottom: 12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0,0,0,0.7)",
                    borderRadius: 16,
                    padding: "6px 14px",
                    zIndex: 10,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <Text size="xs" c="white" fw={500}>
                    Align code in frame
                  </Text>
                </Box>
              )}
            </Transition>
          </Box>
        )}
      </Box>

      {/* Camera Controls Bar */}
      <Transition mounted={showControls} transition={fadeSlide} duration={250}>
        {(styles) => (
          <Paper
            p={10}
            radius={12}
            style={{
              ...styles,
              backgroundColor: "var(--mantine-color-gray-0)",
              border: "1px solid var(--mantine-color-gray-2)",
            }}
          >
            <Group gap={8} wrap="nowrap">
              {/* Play/Stop Button */}
              <StyledButton
                tint={scanning ? "red" : "green"}
                tintOpacity={0.8}
                size="sm"
                onClick={toggleScanning}
                style={{
                  padding: "8px 14px",
                  minWidth: 44,
                  transition: "all 0.25s ease",
                }}
              >
                <Box
                  style={{
                    transition: "transform 0.2s ease",
                    transform: scanning ? "scale(1)" : "scale(1.1)",
                  }}
                >
                  {scanning ? (
                    <TbPlayerStop size={18} />
                  ) : (
                    <TbPlayerPlay size={18} />
                  )}
                </Box>
              </StyledButton>

              {/* Camera Selector */}
              {cameras.length > 1 && (
                <Select
                  value={selectedCameraId}
                  onChange={handleCameraChange}
                  data={cameraOptions}
                  size="xs"
                  radius="md"
                  leftSection={<TbSwitchHorizontal size={14} />}
                  comboboxProps={{ withinPortal: false }}
                  placeholder="Select camera"
                  style={{ flex: 1 }}
                  styles={{
                    input: {
                      backgroundColor: "white",
                      border: "1px solid var(--mantine-color-gray-3)",
                      fontSize: 12,
                      height: 34,
                      transition:
                        "border-color 0.2s ease, box-shadow 0.2s ease",
                    },
                    section: {
                      color: "var(--mantine-color-gray-6)",
                    },
                  }}
                />
              )}

              {/* Single camera indicator */}
              {cameras.length === 1 && (
                <Group gap={6} style={{ flex: 1, paddingLeft: 4 }}>
                  <TbCamera size={14} color="var(--mantine-color-gray-5)" />
                  <Text size="xs" c="gray.6" truncate>
                    {cameraOptions[0]?.label || "Camera"}
                  </Text>
                </Group>
              )}
            </Group>
          </Paper>
        )}
      </Transition>

      {/* Scanned Value */}
      <Transition
        mounted={!!scannedValue}
        transition={fadeSlide}
        duration={300}
      >
        {(styles) => (
          <Paper
            p={16}
            radius={12}
            style={{
              ...styles,
              backgroundColor: error
                ? "var(--mantine-color-red-0)"
                : "var(--mantine-color-green-0)",
              border: `1px solid ${
                error
                  ? "var(--mantine-color-red-3)"
                  : "var(--mantine-color-green-3)"
              }`,
              transition: "background-color 0.3s ease, border-color 0.3s ease",
            }}
          >
            <Stack gap={12}>
              <Text size="xs" c={error ? "red.6" : "green.7"} fw={500}>
                {error ? "⚠️ Duplicate detected" : "✓ Ready to add"}
              </Text>
              <TextInput
                value={scannedValue}
                onChange={handleManualChange}
                size="md"
                radius="md"
                styles={{
                  input: {
                    fontFamily: "monospace",
                    letterSpacing: "1px",
                    fontSize: 16,
                    textAlign: "center",
                    fontWeight: 600,
                    transition: "border-color 0.2s ease",
                  },
                }}
              />
            </Stack>
          </Paper>
        )}
      </Transition>

      {/* Action Buttons */}
      <Transition
        mounted={!!scannedValue}
        transition={fadeSlide}
        duration={300}
      >
        {(styles) => (
          <Group gap={12} justify="space-between" wrap="nowrap" style={styles}>
            <StyledButton
              fullWidth
              tint="gray"
              tintOpacity={0.15}
              size="lg"
              style={{ flex: 1, transition: "all 0.2s ease" }}
              leftSection={<TbRefresh size={20} />}
              onClick={resetScanner}
            >
              Again
            </StyledButton>
            <StyledButton
              fullWidth
              tint="green"
              tintOpacity={0.5}
              size="lg"
              style={{ flex: 1, transition: "all 0.2s ease" }}
              leftSection={<TbCheck size={20} />}
              onClick={handleConfirm}
              disabled={!!error}
            >
              Add
            </StyledButton>
          </Group>
        )}
      </Transition>

      {/* Close Button for Camera Error */}
      <Transition mounted={cameraError} transition={fadeSlide} duration={300}>
        {(styles) => (
          <StyledButton
            tint="gray"
            tintOpacity={0.15}
            size="lg"
            fullWidth
            onClick={onClose}
            style={styles}
          >
            Close
          </StyledButton>
        )}
      </Transition>

      {/* Tips */}
      <Transition
        mounted={
          !scannedValue &&
          !cameraError &&
          !isStarting &&
          !loadingCameras &&
          scanning
        }
        transition="fade"
        duration={400}
      >
        {(styles) => (
          <Text size="xs" c="gray.5" ta="center" style={styles}>
            Hold steady • Good lighting • Keep barcode flat
          </Text>
        )}
      </Transition>

      {/* Hide html5-qrcode UI elements + animations */}
      <style>
        {`
          #${SCANNER_ID} {
            border: none !important;
            overflow: hidden;
            border-radius: 16px;
          }
          #${SCANNER_ID} video {
            object-fit: cover !important;
            width: 100% !important;
            height: 280px !important;
            transition: opacity 0.3s ease;
          }
          #${SCANNER_ID} > div:first-child {
            display: none !important;
          }
          #${SCANNER_ID} img,
          #${SCANNER_ID} span:not([id*="qr"]),
          #${SCANNER_ID} select,
          #${SCANNER_ID} button,
          #${SCANNER_ID} a {
            display: none !important;
          }
          #qr-shaded-region {
            border-color: rgba(139, 92, 246, 0.8) !important;
            transition: border-color 0.3s ease;
          }
          
          @keyframes pulse {
            0% { transform: scale(0.8); opacity: 0.5; }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); opacity: 1; }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </Stack>
  );
};

export default BarcodeScanner;
