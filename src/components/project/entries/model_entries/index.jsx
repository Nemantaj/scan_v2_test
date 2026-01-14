import { memo, useState, useMemo, useCallback } from "react";
import { Divider, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import {
  TbChevronLeft,
  TbFileTypePdf,
  TbFileTypeXls,
  TbFilter,
} from "react-icons/tb";

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
import useExport from "../../../common/exports/hooks/useExports";

// Local components
import ModelItem from "./item";
import ModelSkeleton from "./ModelSkeleton";
import ModelSortDrawer from "./ModelSortDrawer";
import DeleteConfirmDrawer from "./DeleteConfirmDrawer";

// Utils & API
import { GetOrders } from "../libs";
import { processModelEntries } from "./utils";

const ModelEntries = () => {
  const [opened, { open, close }] = useDisclosure();
  const [deleteOpen, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [search, setSearch] = useState("");

  // Persistent State
  const [sortBy, setSortBy] = usePersistentSort("model-entries-sort");
  const [dateRange, setDateRange, dateRangeStr] = usePersistentDateRange(
    "model-entries-date-range"
  );

  const {
    data = [],
    isPending,
    isRefetching,
  } = useQuery({
    queryKey: ["orders", dateRangeStr],
    queryFn: () => GetOrders({ date: dateRange }),
  });

  const loading = isPending || isRefetching;

  // Process data (flatten, filter, sort)
  const processedData = useMemo(
    () => processModelEntries(data, search, sortBy),
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

  const handleDeleteClick = useCallback(
    (item) => {
      setSelectedItem(item);
      openDelete();
    },
    [openDelete]
  );

  const handleDeleteClose = useCallback(() => {
    closeDelete();
    setTimeout(() => setSelectedItem(null), 300);
  }, [closeDelete]);

  // Memoized render function for VirtualList
  const renderModelItem = useCallback(
    (item) => <ModelItem item={item} onDeleteClick={handleDeleteClick} />,
    [handleDeleteClick]
  );

  // Memoized header component
  const listHeader = useMemo(
    () => (
      <>
        <SectionHeader
          pt={72}
          title="Model Search"
          subtitle={`Showing ${processedData.length} models for ${dateRangeStr}`}
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
        message={search ? "No results found" : "No models"}
        description={
          search
            ? `No models match "${search}"`
            : "No models found for the selected date range."
        }
      />
    ),
    [search]
  );

  // Data preparation for Detailed Export (Flatten by IMEI)
  const flattenedByImei = useMemo(() => {
    return processedData.flatMap((doc) => {
      // If no codes, return the doc itself (or skip? User code mapped codes.map().flat())
      // User code: doc.codes.map(code => ...).flat()
      // If doc.codes is empty/null, map returns empty array, flat returns empty. So rows disappear.
      // I will replicate this behavior.
      return (doc.codes || []).map((code) => ({
        ...doc,
        imei: code,
      }));
    });
  }, [processedData]);

  // Hook for Summary Export
  const { exportExcel: exportSummary } = useExport({
    list: processedData,
    title: "Model_Summary",
    sort: { field: "Date", fieldType: "string" },
    fields: (doc) => ({
      Date: doc.date?.slice(0, 10) || "",
      Name: doc.orderName || "",
      Product: doc.productName || "",
      Details: doc.details || "",
      Price: doc.price || 0,
      IMEIs: doc.codes?.length || 0,
      IMEIDetail: (doc.codes || []).join(", "),
    }),
  });

  // Hook for Detailed Export
  const { exportExcel: exportDetailed } = useExport({
    list: flattenedByImei,
    title: "Model_Detailed",
    sort: { field: "Date", fieldType: "string" },
    fields: (doc) => ({
      Date: doc.date?.slice(0, 10) || "",
      Name: doc.orderName || "",
      Product: doc.productName || "",
      Details: doc.details || "",
      Price: doc.price || 0,
      IMEI: doc.imei || "",
    }),
  });

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
        estimateSize={96}
        loading={loading}
        loadingComponent={<ModelSkeleton />}
        renderItem={renderModelItem}
        header={listHeader}
        emptyComponent={listEmptyComponent}
      />

      <ShellFooter>
        <Group h="100%">
          <SearchBar
            placeholder="Search by model, details..."
            value={search}
            onChange={handleSearchChange}
          />
          <NavButton
            icon={TbFileTypeXls}
            tint="red"
            iconColor="red.0"
            onClick={exportSummary}
          />
          <NavButton
            icon={TbFileTypeXls}
            tint="green"
            iconColor="green.0"
            onClick={exportDetailed}
          />
        </Group>
      </ShellFooter>

      <SheetDrawer isDrawerOpen={opened} closeDrawer={close} title="Sort By">
        <ModelSortDrawer sortBy={sortBy} onSortChange={handleSortChange} />
      </SheetDrawer>

      <DeleteConfirmDrawer
        isOpen={deleteOpen}
        onClose={handleDeleteClose}
        item={selectedItem}
      />
    </>
  );
};

export default ModelEntries;
