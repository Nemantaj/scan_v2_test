import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Center, Loader, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";

/**
 * Protocol Handler
 * Handles web+marvans:// URLs for deep linking
 *
 * Supported protocols:
 * - web+marvans://entry/{id} - Open entry details
 * - web+marvans://create - Open create entry
 * - web+marvans://scan/{imei} - Open with IMEI pre-filled
 */
const ProtocolHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const data = searchParams.get("data") || "";

    try {
      // Parse the protocol URL
      // Format: web+marvans://action/param
      const decoded = decodeURIComponent(data);
      const match = decoded.match(/web\+marvans:\/\/(.+)/);

      if (!match) {
        notifications.show({
          title: "Invalid Link",
          message: "Could not parse the shared link",
          color: "red",
        });
        navigate("/");
        return;
      }

      const path = match[1];
      const [action, ...params] = path.split("/");

      switch (action) {
        case "entry":
          // Open entry details
          if (params[0]) {
            navigate(`/entries/${params[0]}`);
          } else {
            navigate("/");
          }
          break;

        case "create":
          // Open create entry
          navigate("/create");
          break;

        case "scan":
          // Open create with IMEI pre-filled
          const imei = params[0];
          if (imei) {
            navigate("/create", {
              state: { sharedImeis: [imei] },
            });
            notifications.show({
              title: "IMEI Loaded",
              message: `IMEI ${imei} ready to add`,
              color: "green",
            });
          } else {
            navigate("/create");
          }
          break;

        case "models":
          navigate("/models");
          break;

        case "imei":
          navigate("/imei");
          break;

        default:
          navigate("/");
      }
    } catch (error) {
      console.error("Protocol handler error:", error);
      notifications.show({
        title: "Error",
        message: "Could not process the link",
        color: "red",
      });
      navigate("/");
    }
  }, [searchParams, navigate]);

  return (
    <Center h="100dvh">
      <Stack align="center" gap="md">
        <Loader size="lg" color="violet" />
        <Text c="gray.6">Processing link...</Text>
      </Stack>
    </Center>
  );
};

export default ProtocolHandler;
