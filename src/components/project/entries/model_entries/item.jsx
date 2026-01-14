import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import moment from "moment";

import { PrintBulkProductInvoice } from "../details/libs";
import ItemActionMenu from "../../../common/ItemActionMenu";
import { memo, useState } from "react";

const ModelItem = memo(({ item, onDeleteClick }) => {
  const navigate = useNavigate();
  const [printSuccess, setPrintSuccess] = useState(false);

  const codesCount = item.codes?.length || 0;

  // Print mutation
  const { mutate: printMutate, isPending: printLoading } = useMutation({
    mutationFn: () =>
      PrintBulkProductInvoice({
        id: item._id,
        filename: `Invoice_${item.productName}_${item.orderName}`,
      }),
    onSuccess: (result) => {
      if (result.success) {
        setPrintSuccess(true);
        setTimeout(() => setPrintSuccess(false), 2000);
      }
    },
  });

  const handlePrint = (e) => {
    e.preventDefault();
    e.stopPropagation();
    printMutate();
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/entries/${item.parentId}/edit`);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteClick?.(item);
  };

  return (
    <Link
      to={`/entries/${item.parentId}`}
      state={{ from: "/models" }}
      style={{
        textDecoration: "none",
        display: "block",
        backgroundColor: "white",
        padding: "14px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "nowrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", gap: 12, flex: 1, minWidth: 0 }}>
          {/* Gradient accent */}
          <div
            style={{
              width: 4,
              minHeight: 40,
              borderRadius: 3,
              background: "linear-gradient(180deg, #8B5CF6 0%, #EC4899 100%)",
              flexShrink: 0,
            }}
          />
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ fontWeight: 600, color: "#1F2937" }}>
              {" "}
              {/* dark.8 */}
              {item.productName}{" "}
              <span
                style={{
                  paddingLeft: 2,
                  fontWeight: 600,
                  color: "#2F9E44", // green.9
                }}
              >
                {item.details || "No details"}
              </span>
            </div>

            {item.price && (
              <div
                style={{
                  fontSize: "14px", // size="sm"
                  color: "#1C7ED6", // blue.7
                  fontWeight: 600,
                }}
              >
                ₹ {item.price?.toLocaleString("en-IN")}
              </div>
            )}

            <div
              style={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              <div style={{ fontSize: "14px", color: "#374151" }}>
                {" "}
                {/* gray.7 */}
                {item.orderName}
              </div>
              <div
                style={{
                  fontWeight: 500,
                  fontSize: "12px", // size="xs"
                  color: "#C92A2A", // red.9
                }}
              >
                {moment(item.date).format("DD MMM YYYY")} •{" "}
                <span style={{ fontWeight: 500, color: "#5C940D" }}>
                  {" "}
                  {/* lime.9 */}
                  {codesCount} Tokens
                </span>
              </div>
            </div>
          </div>
        </div>

        <ItemActionMenu
          onPrint={handlePrint}
          onEdit={handleEdit}
          onDelete={handleDelete}
          printLoading={printLoading}
          printSuccess={printSuccess}
        />
      </div>
    </Link>
  );
});

export default ModelItem;
