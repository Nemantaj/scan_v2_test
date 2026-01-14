import { useState, useEffect } from "react";
import { TextInput, Box } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { TbSearch } from "react-icons/tb";

const SearchBar = ({
  placeholder = "Search...",
  value = "",
  onChange = () => {},
  tint = "none",
  tintOpacity = 0.9,
  debounce = 300,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [debouncedValue] = useDebouncedValue(localValue, debounce);

  // Sync local value when external value changes
  useEffect(() => {
    console.log(value);
    setLocalValue(value);
  }, [value]);

  // Call onChange when debounced value changes
  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  // Color tint configurations (matching NavButton)
  const TINTS = {
    none: { bg: "255, 255, 255" },
    violet: { bg: "139, 92, 246" },
    pink: { bg: "236, 72, 153" },
    blue: { bg: "59, 130, 246" },
  };

  const bgColor = TINTS[tint]?.bg || TINTS.none.bg;

  return (
    <Box
      style={{
        background: `rgba(${bgColor}, ${tintOpacity})`,
        backdropFilter: "blur(0px) saturate(500%)",
        borderRadius: 24,
        boxShadow: `
          0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -2px rgba(0, 0, 0, 0.1),
          inset 0 2px 4px rgba(0, 0, 0, 0.06),
          inset 0 -1px 2px rgba(255, 255, 255, 0.5)
        `,
        flex: 1,
      }}
    >
      <TextInput
        variant="unstyled"
        size="md"
        leftSection={
          <TbSearch size="1.25rem" color="var(--mantine-color-gray-6)" />
        }
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        radius="xl"
        styles={{
          input: {
            height: 44,
            paddingLeft: 44,
            paddingRight: 16,
            fontSize: 14,
          },
          section: {
            width: 44,
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
