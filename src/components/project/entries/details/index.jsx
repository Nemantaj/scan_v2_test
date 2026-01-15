import { useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import { Box, Group, Alert, Divider, Accordion } from "@mantine/core";
import {
  TbChevronLeft,
  TbPackage,
  TbAlertCircle,
  TbPencil,
  TbChevronDown,
} from "react-icons/tb";
import moment from "moment";

import ShellHeader from "../../../shell/header";
import NavButton from "../../../shell/header/menu";
import SectionHeader from "../../../common/SectionHeader";
import EmptyList from "../../../common/EmptyList";
import ProductItem from "./ProductItem";
import DeleteConfirmDrawer from "../model_entries/DeleteConfirmDrawer";
import { GetSingleOrder, PrintBulkProductInvoice } from "./libs";
import EntryDetailsSkeleton from "./EntryDetailsSkeleton";

const EntryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [deleteOpen, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["orders", id],
    queryFn: () => GetSingleOrder(id),
    enabled: !!id,
  });

  const totalScans =
    data?.products?.reduce((acc, p) => acc + (p.codes?.length || 0), 0) || 0;

  const handlePrint = async () => {
    await PrintBulkProductInvoice({
      id,
      filename: `Invoice_${data?.name || id}`,
    });
  };

  const handleBack = () => {
    if (location.state?.from === "/models") {
      navigate("/models");
    } else {
      navigate("/");
    }
  };

  const handleDeleteClick = useCallback(
    (product) => {
      // Create a compatible item object for DeleteConfirmDrawer
      const itemToDelete = {
        ...product,
        parentId: product._id, // Use product ID for deletion
        productName: product.name,
      };
      setSelectedProduct(itemToDelete);
      openDelete();
    },
    [openDelete]
  );

  const handleDeleteClose = useCallback(() => {
    closeDelete();
    setTimeout(() => setSelectedProduct(null), 300);
  }, [closeDelete]);

  return (
    <>
      {/* Header */}
      <ShellHeader>
        <Group h="100%" justify="space-between">
          <NavButton icon={TbChevronLeft} onClick={handleBack} />
          <NavButton
            icon={TbPencil}
            tint="pink"
            tintOpacity={0.15}
            link={`/entries/${id}/edit`}
          />
        </Group>
      </ShellHeader>

      <Box>
        {/* Loading State */}
        {isPending && <EntryDetailsSkeleton />}

        {/* Error State */}
        {isError && (
          <Box pt={76} p="md">
            <Alert
              icon={<TbAlertCircle size={20} />}
              title="Error loading entry"
              color="red"
              variant="light"
              radius="md"
            >
              {error?.message ||
                "Failed to load entry details. Please try again."}
            </Alert>
          </Box>
        )}

        {/* Content */}
        {data && !isPending && (
          <>
            <SectionHeader
              pt={72}
              title={data.name || "Unknown Entry"}
              subtitle={`${moment(data.date).format(
                "DD MMM YYYY"
              )} • ${totalScans} total scans`}
            />
            <Divider />

            {/* Products List */}
            <Box pb="md">
              {data.products && data.products.length > 0 ? (
                <Accordion
                  variant="default"
                  radius="md"
                  chevronPosition="right"
                  chevron={<TbChevronDown size="1.25rem" />}
                  bg="#fff"
                >
                  {data.products.map((product) => (
                    <ProductItem
                      key={product._id || product.name}
                      product={product}
                      orderId={id}
                      onDeleteClick={handleDeleteClick}
                    />
                  ))}
                </Accordion>
              ) : (
                <EmptyList
                  icon={TbPackage}
                  message="No products"
                  description="This entry doesn't have any products yet."
                />
              )}
            </Box>
          </>
        )}
      </Box>

      <DeleteConfirmDrawer
        isOpen={deleteOpen}
        onClose={handleDeleteClose}
        item={selectedProduct}
        handleBack={handleBack}
      />
    </>
  );
};

export default EntryDetails;
