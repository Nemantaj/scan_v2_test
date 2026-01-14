import React from "react";
import { Skeleton } from "@mantine/core";

const DynamicSkeleton = ({
  width = "100%",
  height = "100%",
  radius = "sm",
  animate = true,
  circle = false,
  ...props
}) => {
  return (
    <Skeleton
      width={width}
      height={height}
      radius={radius}
      animate={animate}
      circle={circle}
      {...props}
    />
  );
};

export default DynamicSkeleton;
