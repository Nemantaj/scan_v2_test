export const GetSingleOrder = async (id) => {
  if (!id) {
    console.error("Order ID is required");
    return {};
  }

  try {
    const res = await fetch(`https://sca-token-api.vercel.app/order/${id}`);

    if (!res.ok) {
      console.error(`Fetch failed with status: ${res.status}`);
      return {};
    }

    const data = await res.json();
    return data || {};
  } catch (err) {
    console.error("Error fetching single order:", err);
    return {};
  }
};

export const PrintBulkProductInvoice = async ({ id, filename = "invoice" }) => {
  // Validate required parameters
  if (!id?.trim()) {
    console.error("PrintProductInvoice: Order ID is required");
    return { success: false, error: "Missing required parameters" };
  }

  // Sanitize inputs
  const sanitizedId = encodeURIComponent(id.trim());

  let objectUrl = null;

  try {
    const res = await fetch(
      `https://sca-token-api.vercel.app/pdf/${sanitizedId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/pdf",
        },
      }
    );

    // Check response status
    if (!res.ok) {
      const errorMessage = `Server responded with status ${res.status}: ${res.statusText}`;
      console.error("PrintProductInvoice:", errorMessage);
      return { success: false, error: errorMessage };
    }

    // Validate content type
    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/pdf")) {
      console.error(
        "PrintBulkProductInvoice: Invalid content type received:",
        contentType
      );
      return { success: false, error: "Invalid response format" };
    }

    // Get blob and validate
    const blob = await res.blob();
    if (!blob || blob.size === 0) {
      console.error("PrintBulkProductInvoice: Empty PDF received");
      return { success: false, error: "Empty file received" };
    }

    // Create download link
    objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `${filename.replace(/[^a-zA-Z0-9-_]/g, "_")}.pdf`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true };
  } catch (err) {
    console.error("PrintBulkProductInvoice: Unexpected error:", err);
    return {
      success: false,
      error: err.message || "An unexpected error occurred",
    };
  } finally {
    // Clean up object URL to prevent memory leak
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  }
};

export const PrintProductInvoice = async ({
  id,
  imei,
  filename = "invoice",
}) => {
  // Validate required parameters
  if (!id?.trim() || !imei?.trim()) {
    console.error("PrintProductInvoice: Order ID and IMEI are required");
    return { success: false, error: "Missing required parameters" };
  }

  // Sanitize inputs
  const sanitizedId = encodeURIComponent(id.trim());
  const sanitizedImei = encodeURIComponent(imei.trim());

  let objectUrl = null;

  try {
    const res = await fetch(
      `https://sca-token-api.vercel.app/pdf-single/${sanitizedId}/${sanitizedImei}`
    );

    // Check response status
    if (!res.ok) {
      const errorMessage = `Server responded with status ${res.status}: ${res.statusText}`;
      console.error("PrintProductInvoice:", errorMessage);
      return { success: false, error: errorMessage };
    }

    // Get blob
    const blobz = await res.blob();
    if (!blobz || blobz.size <= 0) {
      console.error("PrintProductInvoice: Empty PDF received");
      return { success: false, error: "Empty file received" };
    }

    // Create blob with explicit PDF type (key fix!)
    objectUrl = window.URL.createObjectURL(
      new Blob([blobz], { type: "application/pdf" })
    );

    // Create download link
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `${filename.replace(/[^a-zA-Z0-9-_]/g, "_")}.pdf`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true };
  } catch (err) {
    console.error("PrintProductInvoice: Unexpected error:", err);
    return {
      success: false,
      error: err.message || "An unexpected error occurred",
    };
  } finally {
    // Clean up object URL to prevent memory leak
    if (objectUrl) {
      window.URL.revokeObjectURL(objectUrl);
    }
  }
};
