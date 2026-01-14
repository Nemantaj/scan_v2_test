import { useState } from "react";
import { Menu, ActionIcon, Loader } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  TbDotsVertical,
  TbPrinter,
  TbEdit,
  TbTrash,
  TbCheck,
} from "react-icons/tb";

/**
 * Reusable action menu for list items
 * @param {Object} props
 * @param {Function} props.onPrint - Print handler, receives (e) => void
 * @param {Function} props.onEdit - Edit handler, receives (e) => void
 * @param {Function} props.onDelete - Delete handler, receives (e) => void
 * @param {boolean} props.printLoading - Is print in progress
 * @param {boolean} props.printSuccess - Was print successful
 * @param {boolean} props.showPrint - Show print option (default: true)
 * @param {boolean} props.showEdit - Show edit option (default: true)
 * @param {boolean} props.showDelete - Show delete option (default: true)
 */
const ItemActionMenu = ({
  onPrint,
  onEdit,
  onDelete,
  printLoading = false,
  printSuccess = false,
  showPrint = true,
  showEdit = true,
  showDelete = true,
}) => {
  return (
    <Menu
      shadow="md"
      width={160}
      position="bottom-end"
      withArrow
      arrowPosition="center"
    >
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          radius="xl"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <TbDotsVertical size={20} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {showPrint && (
          <Menu.Item
            leftSection={
              printLoading ? (
                <Loader size={16} />
              ) : printSuccess ? (
                <TbCheck size={16} color="green" />
              ) : (
                <TbPrinter size={16} />
              )
            }
            onClick={onPrint}
            disabled={printLoading}
            c={printSuccess ? "green" : undefined}
          >
            {printSuccess ? "Printed!" : "Print Invoice"}
          </Menu.Item>
        )}
        {showEdit && (
          <Menu.Item leftSection={<TbEdit size={16} />} onClick={onEdit}>
            Edit Entry
          </Menu.Item>
        )}
        {(showPrint || showEdit) && showDelete && <Menu.Divider />}
        {showDelete && (
          <Menu.Item
            leftSection={<TbTrash size={16} />}
            color="red"
            onClick={onDelete}
          >
            Delete Entry
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

export default ItemActionMenu;
