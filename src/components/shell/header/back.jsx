import { Link } from "react-router-dom";
import { ActionIcon, Paper } from "@mantine/core";
import { TbChevronLeft } from "react-icons/tb";

const BackButton = ({ link = "/", text = "Back" }) => {
  return (
    <>
      <Paper shadow="md" radius="xl">
        <ActionIcon
          size="xl"
          variant="white"
          color="dark"
          component={Link}
          to={link}
          radius="xl"
        >
          <TbChevronLeft size="1.5rem" />
        </ActionIcon>
      </Paper>
    </>
  );
};

export default BackButton;
