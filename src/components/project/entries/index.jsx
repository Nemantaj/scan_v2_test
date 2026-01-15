import { useState, useMemo, useCallback } from "react";
import { Box, Divider, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { TbFilter, TbPlus } from "react-icons/tb";

// Shell components
import ShellHeader from "../../shell/header";
import ShellFooter from "../../shell/footer";
import DateRange from "../../shell/header/date_range";
import NavButton from "../../shell/header/menu";
import NavMenu from "../../shell/header/nav_menu";
import SearchBar from "../../shell/footer/search";

// Common components
import SectionHeader from "../../common/SectionHeader";
import SheetDrawer from "../../common/drawers/sheet";
import VirtualList from "../../common/VirtualList";
import EmptyList from "../../common/EmptyList";
import { usePersistentDateRange, usePersistentSort } from "../../common/hooks";

// Local components
import EntryItem from "./item";
import EntrySkeleton from "./EntrySkeleton";
import SortDrawerContent from "./SortDrawer";

// Utils & API
import { GetOrders } from "./libs";
import { processEntries } from "./utils";

const ProjectEntries = () => {
  const [opened, { open, close }] = useDisclosure();

  const [search, setSearch] = useState("");

  // Persistent State
  const [sortBy, setSortBy] = usePersistentSort("project-entries-sort");
  const [dateRange, setDateRange, dateRangeStr] = usePersistentDateRange(
    "project-entries-date-range"
  );

  const {
    data = [],
    isPending,
    isRefetching,
  } = useQuery({
    queryKey: ["orders", dateRangeStr],
    queryFn: () => GetOrders({ date: dateRange }),
  });

  // Only show loading skeleton on initial load, not on refetch
  // isRefetching will update data in background while showing cached data
  const showSkeleton = isPending && data.length === 0;

  // Filter and sort data
  const processedData = useMemo(
    () => processEntries(data, search, sortBy),
    [data, search, sortBy]
  );

  // Stable callbacks
  const handleSearchChange = useCallback((value) => {
    setSearch(value);
  }, []);

  const handleSortChange = useCallback((newSort) => {
    setSortBy(newSort);
  }, []);

  const handleDateRangeChange = useCallback((value) => {
    setDateRange(value);
  }, []);

  // Memoized render function for VirtualList
  const renderEntryItem = useCallback((item) => <EntryItem item={item} />, []);

  // Memoized header component
  const listHeader = useMemo(
    () => (
      <>
        <SectionHeader
          pt={72}
          title="Main Entries"
          subtitle={`Showing ${processedData.length} entries for ${dateRangeStr}`}
        />
        <Divider />
      </>
    ),
    [processedData.length, dateRangeStr]
  );

  // Memoized empty component
  const listEmptyComponent = useMemo(
    () => (
      <EmptyList
        message={search ? "No results found" : "No entries"}
        description={
          search
            ? `No entries match "${search}"`
            : "No entries found for the selected date range."
        }
      />
    ),
    [search]
  );

  return (
    <>
      <ShellHeader>
        <Group h="100%" justify="space-between">
          <NavMenu />
          <DateRange value={dateRange} onChange={handleDateRangeChange} />
          <NavButton icon={TbFilter} onClick={open} iconColor="#121212" />
        </Group>
      </ShellHeader>

      <VirtualList
        data={processedData}
        height="100dvh"
        paddingTop={0}
        loading={showSkeleton}
        loadingComponent={<EntrySkeleton />}
        renderItem={renderEntryItem}
        header={listHeader}
        emptyComponent={listEmptyComponent}
      />

      <ShellFooter>
        <Group h="100%">
          <SearchBar
            placeholder="Search with name, date, imei"
            value={search}
            onChange={handleSearchChange}
          />
          <NavButton
            icon={TbPlus}
            tint="green"
            link="/create"
            tintOpacity={0.75}
            iconColor="#121212"
          />
        </Group>
      </ShellFooter>

      <SheetDrawer isDrawerOpen={opened} closeDrawer={close} title="Sort By">
        <SortDrawerContent sortBy={sortBy} onSortChange={handleSortChange} />
      </SheetDrawer>
    </>
  );
};

export default ProjectEntries;
