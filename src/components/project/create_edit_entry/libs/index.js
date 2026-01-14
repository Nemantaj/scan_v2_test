import moment from "moment";

export const GetProducts = async () => {
  try {
    const response = await fetch(
      "https://sca-token-api.vercel.app/get-products"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching products:", err);
    return {
      iphones: [],
      ipods: [],
      iwatches: [],
    };
  }
};

export const GetEntry = async (id) => {
  try {
    const response = await fetch(
      `https://sca-token-api.vercel.app/order/${id}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching entry:", err);
    return null;
  }
};

export const CreateEntry = async ({ name, date, products }) => {
  try {
    const req_data = {
      name,
      date: moment(date).toISOString(),
      products,
    };

    const response = await fetch("https://sca-token-api.vercel.app/order/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req_data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { success: true };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err?.message || "Failed to create entry",
    };
  }
};

export const EditEntry = async ({ _id, name, date, products }) => {
  try {
    const req_data = {
      _id,
      name,
      date: moment(date).toISOString(),
      products,
    };

    const response = await fetch(
      "https://sca-token-api.vercel.app/order/edit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req_data),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { success: true };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err?.message || "Failed to update entry",
    };
  }
};
