import { memo } from "react";
import { Divider, Stack } from "@mantine/core";
import ImeiItem from "./item";
import EmptyList from "../../../common/EmptyList";

// Memoized IMEI List Component
const ImeiList = memo(({ data, search }) => {
  if (data.length === 0) {
    return (
      <EmptyList
        message={search ? "No results found" : "No IMEI codes"}
        description={
          search
            ? `No codes match "${search}"`
            : "No IMEI codes found for the selected date range."
        }
      />
    );
  }

  return (
    <Stack gap={0}>
      {data.map((item, index) => (
        <>
          {index !== 0 && (
            <Divider
              key={`${item.orderId}-${item.codes}-${index}-divider`}
              variant="dashed"
              size="sm"
            />
          )}
          <ImeiItem
            key={`${item.orderId}-${item.codes}-${index}`}
            item={item}
          />
        </>
      ))}
    </Stack>
  );
});

ImeiList.displayName = "ImeiList";

export default ImeiList;
