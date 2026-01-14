// API functions for customers

export const GetCustomers = async () => {
  const res = await fetch("https://sca-token-api.vercel.app/customers");
  if (!res.ok) {
    throw new Error("There was an error while retrieving customers!");
  }
  return res.json();
};

export const CreateCustomer = async ({ fullName, city }) => {
  const res = await fetch("https://sca-token-api.vercel.app/customer/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fullName, city }),
  });

  if (!res.ok) {
    throw new Error("There was an error creating the customer!");
  }
  return res.json();
};

export const DeleteCustomer = async (id) => {
  const res = await fetch(`https://sca-token-api.vercel.app/customer/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("An error occurred while trying to delete this customer!");
  }
  return { success: true };
};
