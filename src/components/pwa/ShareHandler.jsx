import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Text, Stack, Loader, Center } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import SectionHeader from "../common/SectionHeader";

/**
 * Share Target Handler
 * Receives shared content from other apps
 */
const ShareHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);
  const [sharedData, setSharedData] = useState(null);

  useEffect(() => {
    // Get shared data from URL params
    const title = searchParams.get("title") || "";
    const text = searchParams.get("text") || "";
    const url = searchParams.get("url") || "";

    // Check for shared files (from POST request)
    const checkForFiles = async () => {
      try {
        // In a real implementation, you'd handle the POST data
        // For now, we extract text that might be an IMEI
        const combinedText = `${title} ${text} ${url}`.trim();

        // Try to extract IMEI-like numbers (15 digits)
        const imeiPattern = /\b\d{15}\b/g;
        const foundImeis = combinedText.match(imeiPattern) || [];

        setSharedData({
          title,
          text,
          url,
          imeis: foundImeis,
        });

        if (foundImeis.length > 0) {
          notifications.show({
            title: "IMEI Detected",
            message: `Found ${foundImeis.length} IMEI code(s) in shared content`,
            color: "green",
          });
        }
      } catch (error) {
        console.error("Error processing shared data:", error);
      } finally {
        setProcessing(false);
      }
    };

    checkForFiles();
  }, [searchParams]);

  const handleCreateEntry = () => {
    // Navigate to create entry with pre-filled data
    navigate("/create", {
      state: { sharedImeis: sharedData?.imeis || [] },
    });
  };

  if (processing) {
    return (
      <Center h="100dvh">
        <Stack align="center" gap="md">
          <Loader size="lg" color="violet" />
          <Text c="gray.6">Processing shared content...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Box>
      <SectionHeader
        pt={72}
        title="Shared Content"
        subtitle="Content received from another app"
      />

      <Stack p="md" gap="md">
        {sharedData?.title && (
          <Box>
            <Text size="sm" c="gray.6">
              Title
            </Text>
            <Text>{sharedData.title}</Text>
          </Box>
        )}

        {sharedData?.text && (
          <Box>
            <Text size="sm" c="gray.6">
              Text
            </Text>
            <Text>{sharedData.text}</Text>
          </Box>
        )}

        {sharedData?.imeis?.length > 0 && (
          <Box>
            <Text size="sm" c="gray.6">
              Detected IMEIs
            </Text>
            {sharedData.imeis.map((imei, i) => (
              <Text key={i} ff="monospace" fw={500}>
                {imei}
              </Text>
            ))}
          </Box>
        )}

        {sharedData?.imeis?.length > 0 && (
          <Box
            onClick={handleCreateEntry}
            style={{
              padding: "12px 16px",
              background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
              borderRadius: 8,
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <Text c="white" fw={600}>
              Create Entry with IMEIs
            </Text>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default ShareHandler;
