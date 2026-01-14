import { AppShell, AppShellMain, Container } from "@mantine/core";

const Shell = ({ children }) => {
  return (
    <>
      <AppShell withBorder={false}>
        <AppShellMain bg="gray.0">
          <Container size="xs" px={0}>
            {children}
          </Container>
        </AppShellMain>
      </AppShell>
    </>
  );
};

export default Shell;
