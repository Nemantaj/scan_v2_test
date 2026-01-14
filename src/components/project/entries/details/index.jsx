import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Group,
  Loader,
  Center,
  Alert,
  Divider,
  Accordion,
} from "@mantine/core";
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
import { GetSingleOrder, PrintBulkProductInvoice } from "./libs";

const EntryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["order", id],
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

  return (
    <>
      {/* Header */}
      <ShellHeader>
        <Group h="100%" justify="space-between">
          <NavButton icon={TbChevronLeft} onClick={() => navigate(-1)} />
          <NavButton
            icon={TbPencil}
            tint="pink"
            tintOpacity={0.15}
            link={`/edit/${id}`}
          />
        </Group>
      </ShellHeader>

      <Box>
        {/* Loading State */}
        {isPending && (
          <Center py={100}>
            <Loader size="lg" color="violet" />
          </Center>
        )}

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
    </>
  );
};

export default EntryDetails;
