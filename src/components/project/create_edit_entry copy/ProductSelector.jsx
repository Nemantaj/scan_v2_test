import { memo, useMemo, useState, useDeferredValue, useCallback } from "react";
import {
  Combobox,
  TextInput,
  ScrollArea,
  Text,
  Box,
  useCombobox,
} from "@mantine/core";
import { TbSearch, TbChevronDown, TbPackage } from "react-icons/tb";

// Memoized option component
const ProductOption = memo(({ name }) => (
  <Combobox.Option key={name} value={name} py={10} px={14}>
    <Text size="sm" fw={500} c="dark.7">
      {name}
    </Text>
  </Combobox.Option>
));

ProductOption.displayName = "ProductOption";

const ProductSelector = memo(
  ({ products = [], value, onChange, category, disabled = false, error }) => {
    const [search, setSearch] = useState("");
    const deferredSearch = useDeferredValue(search);

    const combobox = useCombobox({
      onDropdownClose: () => {
        combobox.resetSelectedOption();
        setSearch("");
      },
    });

    // Filter products based on deferred search (non-blocking)
    const filteredProducts = useMemo(() => {
      if (!products || products.length === 0) return [];
      if (!deferredSearch) return products;
      const lower = deferredSearch.toLowerCase();
      return products.filter((p) => p.name.toLowerCase().includes(lower));
    }, [products, deferredSearch]);

    // Memoized options list
    const options = useMemo(
      () =>
        filteredProducts.map((p) => (
          <ProductOption key={p.name} name={p.name} />
        )),
      [filteredProducts]
    );

    const handleChange = useCallback(
      (e) => {
        const val = e.target.value;
        setSearch(val);
        onChange(val);
        combobox.openDropdown();
        combobox.updateSelectedOptionIndex();
      },
      [onChange, combobox]
    );

    // For "Other" category, show a simple text input
    if (category === "Other") {
      return (
        <Box>
          <Text size="sm" fw={500} c={error ? "red.6" : "gray.7"} mb={8}>
            Product Name {error && "*"}
          </Text>
          <TextInput
            placeholder="Enter product name"
            size="lg"
            radius={12}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            error={!!error}
            leftSection={
              <TbPackage
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

    return (
      <Box>
        <Text size="sm" fw={500} c={error ? "red.6" : "gray.7"} mb={8}>
          Select Product {error && "*"}
        </Text>
        <Combobox
          store={combobox}
          onOptionSubmit={(val) => {
            onChange(val);
            combobox.closeDropdown();
          }}
          withinPortal={false}
        >
          <Combobox.Target>
            <TextInput
              placeholder={
                !category ? "Choose category first..." : "Search products..."
              }
              size="lg"
              radius={8}
              value={value || search}
              onChange={handleChange}
              onClick={() => combobox.openDropdown()}
              onFocus={() => combobox.openDropdown()}
              onBlur={() => combobox.closeDropdown()}
              leftSection={
                <TbSearch size={18} color={value ? "#8B5CF6" : undefined} />
              }
              rightSection={
                <TbChevronDown size={16} color="var(--mantine-color-gray-5)" />
              }
              disabled={disabled || !category}
              styles={{
                input: {
                  backgroundColor: disabled
                    ? "var(--mantine-color-gray-1)"
                    : "white",
                  border: "1.5px solid var(--mantine-color-gray-2)",
                  height: 48,
                  fontSize: 15,
                },
              }}
            />
          </Combobox.Target>

          <Combobox.Dropdown
            style={{
              border: "1.5px solid var(--mantine-color-gray-2)",
              borderRadius: 14,
              boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
              padding: 6,
            }}
          >
            <Combobox.Options>
              <ScrollArea.Autosize mah={220} type="auto" scrollbarSize={4}>
                {options.length > 0 ? (
                  options
                ) : (
                  <Box py={24} ta="center">
                    <TbPackage size={32} color="var(--mantine-color-gray-4)" />
                    <Text size="sm" c="gray.5" mt={8}>
                      {!category
                        ? "Select a category first"
                        : "No products found"}
                    </Text>
                  </Box>
                )}
              </ScrollArea.Autosize>
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
      </Box>
    );
  }
);

ProductSelector.displayName = "ProductSelector";

export default ProductSelector;
