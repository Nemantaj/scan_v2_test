import { Paper, Stack, Text, TextInput, Group, Box } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { TbUser, TbCalendar } from "react-icons/tb";

const Section1CustomerInfo = ({ form }) => {
  return (
    <Paper
      p="lg"
      //   style={{
      //     background:
      //       "linear-gradient(135deg, var(--mantine-color-violet-0) 0%, var(--mantine-color-pink-0) 100%)",
      //   }}
      radius={0}
    >
      <Stack gap={16}>
        {/* Section Header */}
        <Group gap={10}>
          <Box
            w={4}
            h={24}
            style={{
              borderRadius: 2,
              background: "linear-gradient(180deg, #8B5CF6 0%, #EC4899 100%)",
            }}
          />
          <Text fw={600} c="dark.8">
            Party Information
          </Text>
        </Group>

        {/* Customer Name Input */}
        <TextInput
          placeholder="Enter Party name"
          size="md"
          radius="md"
          leftSection={<TbUser size={18} />}
          styles={{
            input: {
              backgroundColor: "white",
              border: "1px solid var(--mantine-color-gray-3)",
              "&:focus": {
                borderColor: "var(--mantine-color-violet-5)",
              },
            },
          }}
          {...form.getInputProps("name")}
        />

        {/* Date Picker */}
        <DatePickerInput
          placeholder="Select entry date"
          size="md"
          radius="md"
          leftSection={<TbCalendar size={18} />}
          valueFormat="DD MMM YYYY"
          maxDate={new Date()}
          styles={{
            input: {
              backgroundColor: "white",
              border: "1px solid var(--mantine-color-gray-3)",
              "&:focus": {
                borderColor: "var(--mantine-color-violet-5)",
              },
            },
          }}
          {...form.getInputProps("date")}
        />
      </Stack>
    </Paper>
  );
};

export default Section1CustomerInfo;
