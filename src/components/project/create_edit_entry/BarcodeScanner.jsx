import { useState, useCallback, useEffect, useRef } from "react";
import {
  Box,
  Stack,
  Text,
  Group,
  TextInput,
  Paper,
  Select,
} from "@mantine/core";
import {
  TbCheck,
  TbRefresh,
  TbX,
  TbScan,
  TbBulb as TbFlash,
  TbBulbOff as TbFlashOff,
  TbCamera,
} from "react-icons/tb";
import { Html5Qrcode } from "html5-qrcode";
import StyledButton from "../../common/StyledButton";

// Helper to clean scanned value
const cleanCode = (str) => str?.replace(/\s+/g, "").trim() || "";

const SCANNER_ID = "barcode-scanner-region";

const BarcodeScanner = ({ onScan, onClose, existingCodes = [] }) => {
  const [scanning, setScanning] = useState(true);
  const [scannedValue, setScannedValue] = useState("");
  const [error, setError] = useState("");
  const [cameraError, setCameraError] = useState(false);
  const [torch, setTorch] = useState(false);
  const [isStarting, setIsStarting] = useState(true);

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

  // Start scanner when camera is selected
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
      setScanning(true);
      setIsStarting(true);
    },
    [selectedCameraId]
  );

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

  // Format camera options for Select
  const cameraOptions = cameras.map((cam, index) => ({
    value: cam.id,
    label: cam.label || `Camera ${index + 1}`,
  }));

  return (
    <Stack gap={16} py={8}>
      {/* Camera Selector - shown when multiple cameras available */}
      {cameras.length > 1 && scanning && !isStarting && (
        <Select
          value={selectedCameraId}
          onChange={handleCameraChange}
          data={cameraOptions}
          size="sm"
          radius="md"
          leftSection={<TbCamera size={16} />}
          placeholder="Select camera"
          styles={{
            input: {
              backgroundColor: "var(--mantine-color-gray-0)",
              border: "1px solid var(--mantine-color-gray-3)",
            },
          }}
        />
      )}

      {/* Scanner Container */}
      <Box
        style={{
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: "#000",
          position: "relative",
        }}
      >
        {cameraError ? (
          <Stack align="center" justify="center" h={280} py={60}>
            <TbScan size={48} color="var(--mantine-color-gray-5)" />
            <Text size="sm" c="gray.5" ta="center" px={20}>
              Camera not available. Please check permissions.
            </Text>
          </Stack>
        ) : !scanning ? (
          <Stack align="center" justify="center" h={280} py={40} gap={16}>
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
        ) : (
          <Box style={{ position: "relative" }}>
            {/* Scanner video container */}
            <Box
              id={SCANNER_ID}
              style={{
                width: "100%",
                height: 280,
              }}
            />

            {/* Loading overlay */}
            {(isStarting || loadingCameras) && (
              <Stack
                align="center"
                justify="center"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#000",
                  zIndex: 5,
                }}
              >
                <TbScan size={40} color="var(--mantine-color-violet-5)" />
                <Text size="sm" c="gray.5">
                  {loadingCameras ? "Loading cameras..." : "Starting camera..."}
                </Text>
              </Stack>
            )}

            {/* Torch button */}
            {!isStarting && !loadingCameras && (
              <Box
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  zIndex: 10,
                }}
              >
                <StyledButton
                  tint={torch ? "yellow" : "gray"}
                  tintOpacity={torch ? 0.9 : 0.6}
                  size="sm"
                  onClick={toggleTorch}
                  style={{ padding: "8px 12px" }}
                >
                  {torch ? <TbFlash size={18} /> : <TbFlashOff size={18} />}
                </StyledButton>
              </Box>
            )}

            {/* Bottom hint */}
            {!isStarting && !loadingCameras && (
              <Box
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(0,0,0,0.7)",
                  borderRadius: 16,
                  padding: "6px 14px",
                  zIndex: 10,
                }}
              >
                <Text size="xs" c="white" fw={500}>
                  Align code in frame
                </Text>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Scanned Value */}
      {scannedValue && (
        <Paper
          p={16}
          radius={12}
          style={{
            backgroundColor: error
              ? "var(--mantine-color-red-0)"
              : "var(--mantine-color-green-0)",
            border: `1px solid ${
              error
                ? "var(--mantine-color-red-3)"
                : "var(--mantine-color-green-3)"
            }`,
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
                },
              }}
            />
          </Stack>
        </Paper>
      )}

      {/* Buttons */}
      <Group gap={12} justify="space-between" wrap="nowrap">
        {scannedValue ? (
          <>
            <StyledButton
              fullWidth
              tint="gray"
              tintOpacity={0.15}
              size="lg"
              style={{ flex: 1 }}
              leftSection={<TbRefresh size={20} />}
              onClick={resetScanner}
            >
              Scan
            </StyledButton>
            <StyledButton
              fullWidth
              tint="green"
              tintOpacity={0.5}
              size="lg"
              style={{ flex: 1 }}
              leftSection={<TbCheck size={20} />}
              onClick={handleConfirm}
              disabled={!!error}
            >
              Add Code
            </StyledButton>
          </>
        ) : cameraError ? (
          <StyledButton
            tint="gray"
            tintOpacity={0.15}
            size="lg"
            fullWidth
            onClick={onClose}
          >
            Close
          </StyledButton>
        ) : null}
      </Group>

      {/* Tips */}
      {!scannedValue && !cameraError && !isStarting && !loadingCameras && (
        <Text size="xs" c="gray.5" ta="center">
          Hold steady • Good lighting • Keep barcode flat
        </Text>
      )}

      {/* Hide html5-qrcode UI elements */}
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
          }
        `}
      </style>
    </Stack>
  );
};

export default BarcodeScanner;
