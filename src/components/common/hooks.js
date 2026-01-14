import { useMemo } from "react";
import { useLocalStorage } from "@mantine/hooks";
import moment from "moment";

export const usePersistentSort = (
  key,
  defaultField = "date",
  defaultDirection = "desc"
) => {
  const [sortBy, setSortBy] = useLocalStorage({
    key,
    defaultValue: { field: defaultField, direction: defaultDirection },
  });
  return [sortBy, setSortBy];
};

export const usePersistentDateRange = (key) => {
  const [dateRange, setDateRange] = useLocalStorage({
    key,
    defaultValue: [moment().subtract(29, "days").toDate(), moment().toDate()],
    deserialize: (value) => {
      if (!value)
        return [moment().subtract(29, "days").toDate(), moment().toDate()];
      try {
        const [start, end] = JSON.parse(value);
        return [new Date(start), new Date(end)];
      } catch (e) {
        return [moment().subtract(29, "days").toDate(), moment().toDate()];
      }
    },
  });

  const dateRangeStr = useMemo(
    () =>
      `${moment(dateRange[0]).format("D MMM YYYY")} - ${moment(
        dateRange[1]
      ).format("D MMM YYYY")}`,
    [dateRange]
  );

  return [dateRange, setDateRange, dateRangeStr];
};
