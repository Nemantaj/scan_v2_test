import { useState, useMemo, useCallback } from "react";
import { Divider, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { TbChevronLeft, TbFilter, TbPlus } from "react-icons/tb";

// Shell components
import ShellHeader from "../../../shell/header";
import ShellFooter from "../../../shell/footer";
import DateRange from "../../../shell/header/date_range";
import NavButton from "../../../shell/header/menu";
import SearchBar from "../../../shell/footer/search";

// Common components
import SectionHeader from "../../../common/SectionHeader";
import SheetDrawer from "../../../common/drawers/sheet";
import VirtualList from "../../../common/VirtualList";
import EmptyList from "../../../common/EmptyList";
import {
  usePersistentDateRange,
  usePersistentSort,
} from "../../../common/hooks";

// Local components
import ImeiItem from "./item";
import ImeiSkeleton from "./ImeiSkeleton";
import ImeiSortDrawer from "./ImeiSortDrawer";

// Utils & API
import { GetOrders } from "../libs";
import { processImeiEntries } from "./utils";

const ImeiEntries = () => {
  const [opened, { open, close }] = useDisclosure();

  const [search, setSearch] = useState("");

  // Persistent State
  const [sortBy, setSortBy] = usePersistentSort("imei-entries-sort");
  const [dateRange, setDateRange, dateRangeStr] = usePersistentDateRange(
    "imei-entries-date-range"
  );

  const {
    data = [],
    isPending,
    isRefetching,
  } = useQuery({
    queryKey: ["orders", dateRangeStr],
    queryFn: () => GetOrders({ date: dateRange }),
  });

  const loading = isPending && data.length === 0;

  // Process data (flatten, filter, sort)
  const processedData = useMemo(
    () => processImeiEntries(data, search, sortBy),
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
  const renderImeiItem = useCallback((item) => <ImeiItem item={item} />, []);

  // Memoized header component
  const listHeader = useMemo(
    () => (
      <>
        <SectionHeader
          pt={72}
          title="IMEI Entries"
          subtitle={`Showing ${processedData.length} codes for ${dateRangeStr}`}
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
        message={search ? "No results found" : "No IMEI codes"}
        description={
          search
            ? `No codes match "${search}"`
            : "No IMEI codes found for the selected date range."
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
          <DateRange value={dateRange} onChange={handleDateRangeChange} />
          <NavButton icon={TbFilter} onClick={open} iconColor="#121212" />
        </Group>
      </ShellHeader>

      <VirtualList
        data={processedData}
        height="100dvh"
        paddingTop={0}
        overscan={10}
        estimateSize={85}
        loading={loading}
        loadingComponent={<ImeiSkeleton />}
        renderItem={renderImeiItem}
        header={listHeader}
        emptyComponent={listEmptyComponent}
      />

      <ShellFooter>
        <Group h="100%">
          <SearchBar
            placeholder="Search by IMEI, product, or date"
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
        <ImeiSortDrawer sortBy={sortBy} onSortChange={handleSortChange} />
      </SheetDrawer>
    </>
  );
};

export default ImeiEntries;
