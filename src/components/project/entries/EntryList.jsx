import { memo } from "react";
import { Divider, Stack } from "@mantine/core";
import EntryItem from "./item";
import EmptyList from "../../common/EmptyList";

// Memoized Entry List
const EntryList = memo(({ data, search }) => {
  if (data.length === 0) {
    return (
      <EmptyList
        message={search ? "No results found" : "No entries"}
        description={
          search
            ? `No entries match "${search}"`
            : "No entries found for the selected date range."
        }
      />
    );
  }

  return (
    <Stack gap={0}>
      {data.map((item, index) => (
        <>
          {index !== 0 && (
            <Divider key={`divider-${index}`} variant="dashed" size="sm" />
          )}
          <EntryItem key={item._id || index} item={item} />
        </>
      ))}
    </Stack>
  );
});

EntryList.displayName = "EntryList";

export default EntryList;
