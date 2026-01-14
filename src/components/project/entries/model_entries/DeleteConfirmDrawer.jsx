import { useState } from "react";
import { Box, Stack, Text, PinInput, Space } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TbLock } from "react-icons/tb";

import SheetDrawer from "../../../common/drawers/sheet";
import StyledButton from "../../../common/StyledButton";

import { notifications } from "@mantine/notifications";

const DELETE_OTP = "788983";

const DeleteConfirmDrawer = ({ isOpen, onClose, item, handleBack }) => {
  const queryClient = useQueryClient();

  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState(false);

  // Delete mutation
  const { mutate: deleteMutate, isPending: deleteLoading } = useMutation({
    mutationFn: async () => {
      const setForDeletion = await fetch(
        `https://sca-token-api.vercel.app/delete/get-otp/${item?._id}`
      );

      if (!setForDeletion.ok)
        throw new Error(`An error has occurred: ${setForDeletion.status}`);

      const res = await fetch(
        `https://sca-token-api.vercel.app/delete/validate-otp/7789?id=${item?._id}`
      );
      if (!res.ok) throw new Error(`An error has occurred: ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error("Delete failed");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      handleClose();

      if (handleBack) {
        handleBack();
      }
    },
    onError: (err) => {
      console.log(err);

      notifications.show({
        title: "Error",
        message: err?.message || "Something went wrong!",
        autoClose: 1500,
        color: "red",
      });
    },
  });

  const handleClose = () => {
    setOtpValue("");
    setOtpError(false);
    onClose();
  };

  const handleOtpConfirm = () => {
    if (otpValue !== DELETE_OTP) {
      setOtpError(true);
      return;
    }
    setOtpError(false);
    deleteMutate();
  };

  if (!item) return null;

  return (
    <SheetDrawer
      isDrawerOpen={isOpen}
      closeDrawer={handleClose}
      title="Delete Entry"
    >
      <Stack gap={20} py={24} align="center">
        <Box
          w={64}
          h={64}
          style={{
            borderRadius: 16,
            background: "linear-gradient(135deg, #EF4444, #F87171)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TbLock size={32} color="white" />
        </Box>

        <Stack gap={4} align="center">
          <Text size="lg" fw={600} c="dark.8">
            Confirm Deletion
          </Text>
          <Text size="sm" c="gray.7" ta="center" px="md">
            Enter the 6-digit code to delete{" "}
            <Text span fw={500} c="dark.7">
              {item.productName}
            </Text>
          </Text>
        </Stack>

        <PinInput
          length={6}
          size="md"
          type="number"
          value={otpValue}
          onChange={setOtpValue}
          error={otpError}
          styles={{
            input: {
              borderColor: otpError ? "var(--mantine-color-red-5)" : undefined,
            },
          }}
        />

        {otpError && (
          <Text size="sm" c="red.6">
            Invalid code. Please try again.
          </Text>
        )}
        <Space h={12} />
        <StyledButton
          tint="red"
          tintOpacity={0.95}
          fullWidth
          size="lg"
          onClick={handleOtpConfirm}
          loading={deleteLoading}
          disabled={otpValue.length !== 6}
        >
          Confirm Delete
        </StyledButton>
      </Stack>
    </SheetDrawer>
  );
};

export default DeleteConfirmDrawer;
