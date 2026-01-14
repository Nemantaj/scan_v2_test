import { useState, useMemo, useCallback } from "react";
import { Divider, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { TbChevronLeft, TbFilter, TbPlus } from "react-icons/tb";

// Shell components
import ShellHeader from "../../shell/header";
import ShellFooter from "../../shell/footer";
import NavButton from "../../shell/header/menu";
import SearchBar from "../../shell/footer/search";

// Common components
import SectionHeader from "../../common/SectionHeader";
import VirtualList from "../../common/VirtualList";
import EmptyList from "../../common/EmptyList";
import SheetDrawer from "../../common/drawers/sheet";
import { usePersistentSort } from "../../common/hooks";

// Local components
import CustomerItem from "./CustomerItem";
import CustomerSkeleton from "./CustomerSkeleton";
import DeleteCustomerDrawer from "./DeleteCustomerDrawer";
import CustomerSortDrawer from "./CustomerSortDrawer";

// API
import { GetCustomers } from "./libs";

// Filter and sort customers
const processCustomers = (customers, search, sortBy) => {
  let result = [...customers];

  // Filter by search
  if (search.trim()) {
    const searchLower = search.toLowerCase();
    result = result.filter(
      (c) =>
        c.fullName?.toLowerCase().includes(searchLower) ||
        c.city?.toLowerCase().includes(searchLower)
    );
  }

  // Sort
  result.sort((a, b) => {
    const aVal = (a[sortBy.field] || "").toLowerCase();
    const bVal = (b[sortBy.field] || "").toLowerCase();
    const comparison = aVal.localeCompare(bVal);
    return sortBy.direction === "asc" ? comparison : -comparison;
  });

  return result;
};

const Customers = () => {
  const [search, setSearch] = useState("");

  // Persistent Sort State
  const [sortBy, setSortBy] = usePersistentSort(
    "customers-sort",
    "fullName",
    "asc"
  );
  const [sortOpened, { open: openSort, close: closeSort }] =
    useDisclosure(false);
  const [deleteOpen, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const {
    data = [],
    isPending,
    isRefetching,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: GetCustomers,
  });

  const loading = isPending || isRefetching;

  // Filter and sort data
  const processedData = useMemo(
    () => processCustomers(data, search, sortBy),
    [data, search, sortBy]
  );

  // Stable callbacks
  const handleSearchChange = useCallback((value) => {
    setSearch(value);
  }, []);

  const handleSortChange = useCallback((newSort) => {
    setSortBy(newSort);
  }, []);

  const handleDeleteClick = useCallback(
    (customer) => {
      setSelectedCustomer(customer);
      openDelete();
    },
    [openDelete]
  );

  const handleDeleteClose = useCallback(() => {
    closeDelete();
    setTimeout(() => setSelectedCustomer(null), 300);
  }, [closeDelete]);

  // Memoized render function for VirtualList
  const renderCustomerItem = useCallback(
    (item) => <CustomerItem item={item} onDeleteClick={handleDeleteClick} />,
    [handleDeleteClick]
  );

  // Memoized header component
  const listHeader = useMemo(
    () => (
      <>
        <SectionHeader
          pt={72}
          title="Customers"
          subtitle={`Showing ${processedData.length} customers`}
        />
        <Divider />
      </>
    ),
    [processedData.length]
  );

  // Memoized empty component
  const listEmptyComponent = useMemo(
    () => (
      <EmptyList
        message={search ? "No results found" : "No customers"}
        description={
          search
            ? `No customers match "${search}"`
            : "No customers found. Add one to get started."
        }
      />
    ),
    [search]
  );

  return (
    <>
      <ShellHeader>
        <Group h="100%" justify="space-between">
          <NavButton icon={TbChevronLeft} link="/" />
          <NavButton icon={TbFilter} onClick={openSort} iconColor="#121212" />
        </Group>
      </ShellHeader>

      <VirtualList
        data={processedData}
        height="100dvh"
        paddingTop={0}
        loading={loading}
        loadingComponent={<CustomerSkeleton />}
        renderItem={renderCustomerItem}
        header={listHeader}
        emptyComponent={listEmptyComponent}
      />

      <ShellFooter>
        <Group h="100%">
          <SearchBar
            placeholder="Search customers by name or city"
            value={search}
            onChange={handleSearchChange}
          />
          <NavButton
            icon={TbPlus}
            tint="green"
            link="/customers/new"
            tintOpacity={0.75}
            iconColor="#121212"
          />
        </Group>
      </ShellFooter>

      <SheetDrawer
        isDrawerOpen={sortOpened}
        closeDrawer={closeSort}
        title="Sort By"
      >
        <CustomerSortDrawer sortBy={sortBy} onSortChange={handleSortChange} />
      </SheetDrawer>

      <DeleteCustomerDrawer
        isOpen={deleteOpen}
        onClose={handleDeleteClose}
        customer={selectedCustomer}
      />
    </>
  );
};

export default Customers;
