import { Box, Container, Stack, Text } from "@mantine/core";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { useCallback } from "react";

const SheetDrawer = ({ isDrawerOpen, closeDrawer, title, children }) => {
  const controls = useDragControls();

  // Handle Drag to close
  const onDragEnd = useCallback(
    (event, info) => {
      if (info.offset.y > 100 || info.velocity.y > 500) {
        closeDrawer();
      }
    },
    [closeDrawer]
  );

  return (
    <>
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black/20 z-[9990]"
              style={{ willChange: "opacity" }}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              drag="y"
              dragControls={controls}
              dragListener={false}
              dragConstraints={{ top: 0 }}
              dragElastic={0.05}
              onDragEnd={onDragEnd}
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 9991,
                maxHeight: "90vh",
                willChange: "transform",
              }}
              className="w-full bg-white rounded-t-3xl flex flex-col"
            >
              {/* Handle */}
              <div
                onPointerDown={(e) => controls.start(e)}
                className="w-full pt-4 pb-2 flex justify-center cursor-grab active:cursor-grabbing touch-none"
              >
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Content */}
              <Box className="flex-1 overflow-y-auto px-4 pb-safe-bottom">
                <Container size="xs" pb="xl">
                  <Stack gap="xl" pt="xs">
                    {/* Title */}
                    <Text
                      ta="center"
                      size="lg"
                      fw={600}
                      // tt="uppercase"
                      c="black"
                      className="tracking-tight"
                    >
                      {title}
                    </Text>
                    {children}
                  </Stack>
                </Container>
              </Box>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SheetDrawer;
