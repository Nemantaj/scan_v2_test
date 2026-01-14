import moment from "moment";

export const GetOrders = async ({ date }) => {
  try {
    if (date.length === 0) throw new Error("No date range selected");

    let date_1 = date[0],
      date_2 = date[1];

    if (!date_1 || !date_2) throw new Error("Invalid date range");

    let startDate = moment(date_1).startOf("day").toISOString();
    let endDate = moment(date_2).endOf("day").toISOString();

    let response = await fetch(
      `https://sca-token-api.vercel.app/orders?start=${startDate}&end=${endDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch orders");

    let data = await response.json();

    if (!data) throw new Error("No orders found");

    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
};
