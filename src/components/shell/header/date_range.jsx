import { useState, useEffect } from "react";
import {
  Group,
  Text,
  Popover,
  Stack,
  Button,
  Divider,
  Paper,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { TbCalendar } from "react-icons/tb";
import moment from "moment";

const formatDateRange = (range) => {
  if (!range || !range[0]) return "Select dates";

  const startDate = moment(range[0]).format("D MMM");

  if (!range[1]) return startDate;

  const endDate = moment(range[1]).format("D MMM");
  return `${startDate} - ${endDate}`;
};

const DateRange = ({ value, onChange }) => {
  const [opened, setOpened] = useState(false);
  const [tempRange, setTempRange] = useState(value || [null, null]);

  // Sync tempRange when value changes externally
  useEffect(() => {
    if (!opened) {
      setTempRange(value || [null, null]);
    }
  }, [value, opened]);

  const handleApply = () => {
    onChange?.(tempRange);
    setOpened(false);
  };

  const handleClear = () => {
    setTempRange([null, null]);
  };

  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      position="bottom"
      shadow="lg"
      radius="lg"
      withinPortal
      zIndex={1000}
      transitionProps={{ transition: "scale", duration: 150 }}
    >
      <Popover.Target>
        <Paper
          withBorder
          style={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(0px) saturate(500%)",
            boxShadow: `
              0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -2px rgba(0, 0, 0, 0.1),
              inset 0 2px 4px rgba(0, 0, 0, 0.06),
              inset 0 -1px 2px rgba(255, 255, 255, 0.5)
            `,
          }}
          radius="xl"
        >
          <button
            type="button"
            onClick={() => setOpened((o) => !o)}
            className="flex items-center gap-2 px-5 h-11 bg-transparent rounded-full border-none cursor-pointer hover:bg-white/30 transition-all duration-200"
          >
            <TbCalendar size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-800">
              {formatDateRange(value)}
            </span>
          </button>
        </Paper>
      </Popover.Target>

      <Popover.Dropdown p={0}>
        <Stack gap={0}>
          {/* Calendar Section */}
          <Stack p="md" gap="sm">
            <DatePicker
              type="range"
              value={tempRange}
              onChange={setTempRange}
              maxDate={new Date()}
            />
          </Stack>

          <Divider />

          {/* Actions Section */}
          <Group p="sm" justify="space-between">
            <Button
              variant="subtle"
              color="gray"
              size="sm"
              onClick={handleClear}
            >
              Clear
            </Button>
            <Group gap="xs">
              <Button
                variant="light"
                color="gray"
                size="sm"
                onClick={() => setOpened(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleApply} disabled={!tempRange[0]}>
                Apply
              </Button>
            </Group>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default DateRange;
