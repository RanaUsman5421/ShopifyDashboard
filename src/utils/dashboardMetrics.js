export function moneyValue(order) {
  const value = Number.parseFloat(order?.totalPrice || "0");
  return Number.isFinite(value) ? value : 0;
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

export function formatMoney(value, currency = "PKR") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function buildDashboardMetrics({ users, stores, selectedData }) {
  const allOrders = stores.flatMap((store) => (Array.isArray(store.orders) ? store.orders : []));
  const selectedOrders = selectedData?.store?.orders || [];
  const orders = selectedOrders.length > 0 ? selectedOrders : allOrders;
  const currency = orders.find((order) => order.currency)?.currency || "PKR";

  const verifiedOrders = orders.filter((order) => order.financialStatus === "paid").length;
  const cancelledOrders = orders.filter((order) => order.financialStatus === "voided").length;
  const dispatchedOrders = orders.filter((order) =>
    ["fulfilled", "partial"].includes(order.fulfillmentStatus)
  ).length;
  const pendingOrders = orders.filter((order) => !order.fulfillmentStatus).length;
  const duplicateOrders = Math.max(0, orders.length - new Set(orders.map(orderKey)).size);
  const fakeOrders = orders.filter((order) => !order.email && !order.phone).length;
  const totalSales = orders.reduce((sum, order) => sum + moneyValue(order), 0);

  return {
    allOrders,
    orders,
    connectedStores: stores.length,
    totalStores: stores.length,
    totalUsers: users.length,
    currency,
    ordersReceived: orders.length,
    totalSales,
    totalOrders: allOrders.length,
    verifiedOrders,
    fakeOrders,
    cancelledOrders,
    dispatchedOrders,
    pendingOrders,
    duplicateOrders,
  };
}

function orderKey(order) {
  return order.shopifyOrderId || order.adminGraphqlApiId || order.orderName || order.orderNumber;
}
