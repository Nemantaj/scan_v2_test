import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";

const MantineUXProvider = ({ children }) => {
  return (
    <>
      <MantineProvider
        theme={{
          defaultRadius: "lg",
        }}
      >
        <Notifications position="top-center" />
        {children}
      </MantineProvider>
    </>
  );
};

export default MantineUXProvider;
