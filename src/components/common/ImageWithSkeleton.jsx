import React, { useState, useEffect } from "react";
import { Image, Box } from "@mantine/core";
import DynamicSkeleton from "./DynamicSkeleton";

// Global cache to track loaded images across component mounts
const loadedImages = new Set();

const ImageWithSkeleton = ({
  src,
  alt,
  width,
  height,
  radius = "sm",
  fit = "contain",
  imageProps = {},
  skeletonProps = {},
  ...containerProps
}) => {
  // Initialize loading state based on whether this src has loaded before
  const [loading, setLoading] = useState(() => !loadedImages.has(src));

  // Update loading state if src changes
  useEffect(() => {
    if (loadedImages.has(src)) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [src]);

  const handleLoad = () => {
    if (src) {
      loadedImages.add(src);
    }
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
  };

  return (
    <Box
      bd="1px solid var(--mantine-color-gray-2)"
      style={{
        width: width || "100%",
        height: height || "100%",
        minWidth: width || "100%",
        minHeight: height || "100%",
        position: "relative",
        overflow: "hidden",
        borderRadius: `var(--mantine-radius-${radius})`,
      }}
      {...containerProps}
    >
      {loading && (
        <DynamicSkeleton
          width="100%"
          height="100%"
          radius={radius}
          style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
          {...skeletonProps}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width="100%"
        height="100%"
        radius={radius}
        fit={fit}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          display: loading ? "none" : "block", // Hide image until loaded to prevent layout shift or partial render
          width: "100%",
          height: "100%",
        }}
        {...imageProps}
      />
    </Box>
  );
};

export default ImageWithSkeleton;
