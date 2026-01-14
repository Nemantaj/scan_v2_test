import { memo } from "react";
import { Divider, Stack } from "@mantine/core";
import ModelItem from "./item";
import EmptyList from "../../../common/EmptyList";

// Memoized Model List Component
const ModelList = memo(({ data, search }) => {
  if (data.length === 0) {
    return (
      <EmptyList
        message={search ? "No results found" : "No models"}
        description={
          search
            ? `No models match "${search}"`
            : "No models found for the selected date range."
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
              key={`${item.parentId}-${item._id}-${index}-divider`}
              variant="dashed"
              size="sm"
            />
          )}
          <ModelItem
            key={`${item.parentId}-${item._id}-${index}`}
            item={item}
          />
        </>
      ))}
    </Stack>
  );
});

ModelList.displayName = "ModelList";

export default ModelList;
