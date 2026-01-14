import React, { useRef, useEffect, useCallback, memo } from "react";
import { Box, Divider, Space } from "@mantine/core";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useLocation } from "react-router-dom";

// Store scroll positions per route
const scrollPositions = new Map();

// Optimized row styles for GPU acceleration
const rowBaseStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  willChange: "transform",
  contain: "layout style paint",
};

// Memoized row component with GPU-optimized styles
const VirtualRow = memo(
  ({
    virtualRow,
    item,
    renderItem,
    withDivider,
    dividerProps,
    striped,
    stripeColor,
    measureElement,
  }) => {
    return (
      <div
        ref={measureElement}
        data-index={virtualRow.index}
        style={{
          ...rowBaseStyle,
          transform: `translateY(${virtualRow.start}px)`,
          backgroundColor:
            striped && virtualRow.index % 2 !== 0 ? stripeColor : undefined,
        }}
      >
        {withDivider && virtualRow.index !== 0 && (
          <Divider w="100%" {...dividerProps} />
        )}
        {renderItem(item, virtualRow.index)}
      </div>
    );
  }
);

VirtualRow.displayName = "VirtualRow";

const VirtualList = ({
  data = [],
  renderItem,
  estimateSize = 100,
  overscan = 3,
  height = "calc(100vh - 64px)",
  paddingTop = 0,
  paddingBottom = 92,
  loading = false,
  loadingComponent,
  emptyComponent,
  withDivider = true,
  dividerProps = { variant: "dashed", size: "sm" },
  striped = false,
  stripeColor = "gray.0",
  scrollKey,
  header,
  dynamicSize = true,
}) => {
  const parentRef = useRef(null);
  const hasRestoredRef = useRef(false);
  const location = useLocation();

  const persistKey = scrollKey || location.pathname;

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  useEffect(() => {
    hasRestoredRef.current = false;
  }, [persistKey]);

  useEffect(() => {
    if (!loading && data.length > 0 && !hasRestoredRef.current) {
      const savedPosition = scrollPositions.get(persistKey);
      if (savedPosition !== undefined && savedPosition > 0) {
        hasRestoredRef.current = true;
        requestAnimationFrame(() => {
          rowVirtualizer.scrollToOffset(savedPosition, { align: "start" });
        });
      } else {
        hasRestoredRef.current = true;
      }
    }
  }, [loading, data.length, persistKey, rowVirtualizer]);

  const handleScroll = useCallback(() => {
    if (parentRef.current) {
      scrollPositions.set(persistKey, parentRef.current.scrollTop);
    }
  }, [persistKey]);

  useEffect(() => {
    const element = parentRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll, { passive: true });
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  if (loading && loadingComponent) {
    return (
      <Box pt={paddingTop} style={{ height, overflowY: "auto" }}>
        {loadingComponent}
      </Box>
    );
  }

  if (!loading && data.length === 0 && emptyComponent) {
    return (
      <Box pt={paddingTop} style={{ height, overflowY: "auto" }}>
        {emptyComponent}
      </Box>
    );
  }

  return (
    <>
      <Space h={paddingTop} />
      <div
        ref={parentRef}
        style={{
          height,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
        }}
      >
        {header}
        <div
          style={{
            height: `${totalSize}px`,
            width: "100%",
            position: "relative",
            contain: "strict",
          }}
        >
          {virtualItems.map((virtualRow) => (
            <VirtualRow
              key={virtualRow.key}
              virtualRow={virtualRow}
              item={data[virtualRow.index]}
              renderItem={renderItem}
              withDivider={withDivider}
              dividerProps={dividerProps}
              striped={striped}
              stripeColor={stripeColor}
              measureElement={
                dynamicSize ? rowVirtualizer.measureElement : undefined
              }
            />
          ))}
        </div>
        <Space h={paddingBottom} />
      </div>
    </>
  );
};

export default memo(VirtualList);
