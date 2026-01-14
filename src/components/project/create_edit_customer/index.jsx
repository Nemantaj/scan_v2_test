import { useState } from "react";
import {
  Box,
  Divider,
  Group,
  Stack,
  TextInput,
  Text,
  Space,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { TbChevronLeft, TbCheck, TbUser, TbMapPin } from "react-icons/tb";

// Shell components
import ShellHeader from "../../shell/header";
import NavButton from "../../shell/header/menu";

// Common components
import SectionHeader from "../../common/SectionHeader";
import StyledButton from "../../common/StyledButton";

// API
import { CreateCustomer } from "../customers/libs";

const CreateNewCustomer = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      fullName: "",
      city: "",
    },
    validate: {
      fullName: (value) =>
        !value?.trim() ? "Customer name is required" : null,
      city: (value) => (!value?.trim() ? "City is required" : null),
    },
  });

  const createMutation = useMutation({
    mutationFn: CreateCustomer,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Customer created successfully",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      navigate("/customers");
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to create customer",
        color: "red",
      });
    },
  });

  const handleSubmit = () => {
    const validation = form.validate();
    if (validation.hasErrors) return;
    createMutation.mutate(form.values);
  };

  return (
    <>
      <ShellHeader>
        <Group h="100%" justify="space-between">
          <NavButton icon={TbChevronLeft} link="/customers" />
          <StyledButton
            tint="green"
            tintOpacity={0.75}
            leftSection={<TbCheck size="1.25rem" />}
            onClick={handleSubmit}
            loading={createMutation.isPending}
          >
            Save
          </StyledButton>
        </Group>
      </ShellHeader>

      <Box pb={100}>
        <SectionHeader
          pt={72}
          title="New Customer"
          subtitle="Fill the form below to add a new customer"
        />
        <Divider />

        <Box px={20} py={24}>
          <Stack gap="lg">
            {/* Customer Name */}
            <Box>
              <Text size="sm" fw={500} c="gray.7" mb={8}>
                Customer Name
              </Text>
              <TextInput
                placeholder="Enter customer name"
                size="md"
                leftSection={<TbUser size={18} />}
                {...form.getInputProps("fullName")}
                styles={{
                  input: {
                    borderRadius: 12,
                    backgroundColor: "white",
                    border: "1px solid var(--mantine-color-gray-3)",
                    "&:focus": {
                      borderColor: "var(--mantine-color-violet-5)",
                    },
                  },
                }}
              />
            </Box>

            {/* City */}
            <Box>
              <Text size="sm" fw={500} c="gray.7" mb={8}>
                City
              </Text>
              <TextInput
                placeholder="Enter city"
                size="md"
                leftSection={<TbMapPin size={18} />}
                {...form.getInputProps("city")}
                styles={{
                  input: {
                    borderRadius: 12,
                    backgroundColor: "white",
                    border: "1px solid var(--mantine-color-gray-3)",
                    "&:focus": {
                      borderColor: "var(--mantine-color-violet-5)",
                    },
                  },
                }}
              />
            </Box>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default CreateNewCustomer;
