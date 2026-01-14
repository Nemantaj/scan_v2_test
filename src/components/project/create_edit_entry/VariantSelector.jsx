import { memo, useMemo } from "react";
import { Box, Chip, Text, TextInput, ScrollArea } from "@mantine/core";
import { TbInfoCircle } from "react-icons/tb";

const VariantSelector = memo(
  ({ variants = [], value, onChange, category, disabled = false, error }) => {
    // Determine variants to show
    const displayVariants = useMemo(() => {
      if (category === "Airpods") return ["Default"];
      return variants;
    }, [category, variants]);

    // For "Other", show simple text input
    if (category === "Other") {
      return (
        <Box>
          <Text size="sm" fw={500} c={error ? "red.6" : "gray.7"} mb={8}>
            Details / Variant {error && "*"}
          </Text>
          <TextInput
            placeholder="Enter details"
            size="lg"
            radius={12}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            error={!!error}
            leftSection={
              <TbInfoCircle
                size={18}
                color={error ? "var(--mantine-color-red-6)" : "#8B5CF6"}
              />
            }
            styles={{
              input: {
                backgroundColor: "white",
                border: "1.5px solid var(--mantine-color-gray-2)",
                height: 48,
                fontSize: 15,
              },
            }}
          />
        </Box>
      );
    }

    // For products with variants (including Airpods), show chips
    return (
      <Box>
        <Text size="sm" fw={500} c={error ? "red.6" : "gray.7"} mb={8}>
          Select Variant {error && "*"}
        </Text>

        {displayVariants.length > 0 ? (
          <ScrollArea scrollbarSize={0} type="scroll" offsetScrollbars={false}>
            <Chip.Group value={value} onChange={onChange}>
              <Box
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "nowrap",
                  paddingBottom: 4,
                }}
              >
                {displayVariants.map((variant) => (
                  <Chip
                    key={variant}
                    value={variant}
                    size="md"
                    radius={10}
                    variant="outline"
                    color="#fff"
                    styles={{
                      label: {
                        height: 40,
                        paddingLeft: 16,
                        paddingRight: 16,
                        fontSize: 14,
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        border:
                          value === variant
                            ? "none"
                            : "1.5px solid var(--mantine-color-gray-2)",
                        background:
                          value === variant
                            ? "linear-gradient(135deg, #8B5CF6, #A78BFA)"
                            : "white",
                        color:
                          value === variant
                            ? "white"
                            : "var(--mantine-color-gray-7)",
                      },
                      iconWrapper: {
                        display: value === variant ? "flex" : "none",
                      },
                    }}
                  >
                    {variant}
                  </Chip>
                ))}
              </Box>
            </Chip.Group>
          </ScrollArea>
        ) : (
          <Box
            py={16}
            px={12}
            style={{
              borderRadius: 12,
              backgroundColor: "var(--mantine-color-gray-0)",
              border: "1.5px dashed var(--mantine-color-gray-3)",
            }}
          >
            <Text size="sm" c="gray.5" ta="center">
              Select a product to see variants
            </Text>
          </Box>
        )}
      </Box>
    );
  }
);

VariantSelector.displayName = "VariantSelector";

export default VariantSelector;
