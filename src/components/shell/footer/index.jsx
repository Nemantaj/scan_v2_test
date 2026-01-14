import { AppShellFooter, Box, Container } from "@mantine/core";

const ShellFooter = ({ children }) => {
  return (
    <AppShellFooter bg="linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 1) 100%)">
      <Container size="xs" px={0}>
        <Box h={72} px={16}>
          {children}
        </Box>
      </Container>
    </AppShellFooter>
  );
};

export default ShellFooter;
