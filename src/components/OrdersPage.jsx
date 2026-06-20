import { formatNumber } from "../utils/dashboardMetrics";

const tableColumns = [
  "Sr No",
  "Status",
  "Consignee",
  "City/Risk",
  "Type",
  "Booking Date",
  "Courier Booked",
  "COD",
  "Actions",
];

function OrdersPage({ orders, currency }) {
  const visibleOrders = Array.isArray(orders) ? orders : [];

  if (visibleOrders.length === 0) {
    return (
      <section className="mx-2 rounded-[5px] border border-[#dedede] bg-white px-4 py-5 text-sm font-bold text-[#4c5a61]">
        No Shopify orders found for the connected store.
      </section>
    );
  }

  return (
    <section className="mx-2 overflow-hidden rounded-[5px] border border-[#cfd6d2] bg-[#eef7f1]">
      <div className="grid min-h-14 grid-cols-[0.7fr_1.1fr_1.8fr_1.1fr_1.2fr_1.2fr_1.2fr_0.9fr_0.55fr] items-center bg-[#4d4d4d] px-4 text-sm font-extrabold text-white max-[980px]:hidden">
        {tableColumns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>

      <div className="grid gap-2.5 bg-[#e8f8ed] p-1.5">
        {visibleOrders.map((order, index) => (
          <OrderRow order={order} index={index} currency={currency} key={orderKey(order, index)} />
        ))}
      </div>
    </section>
  );
}

function OrderRow({ order, index, currency }) {
  const address = formatAddress(order.address);
  const city = order.address?.city || order.address?.province || "Unknown";
  const phone = order.phone || "No phone";
  const email = order.email || "No email";
  const deliveryChance = getDeliveryChance(order);
  const statusLabel = getStatusLabel(order);
  const statusTone = ["fulfilled", "partial"].includes(order.fulfillmentStatus) ? "green" : "green";
  const fulfillmentLabel = order.fulfillmentStatus || "unfulfilled";
  const financialLabel = order.financialStatus || "pending";

  return (
    <article className="overflow-hidden rounded-[5px] border border-[#d9d9d9] bg-white shadow-[0_1px_2px_rgba(36,49,57,0.08)]">
      <div className="grid min-h-23 grid-cols-[0.7fr_1.1fr_1.8fr_1.1fr_1.2fr_1.2fr_1.2fr_0.9fr_0.55fr] items-center gap-2 px-4 py-3 max-[980px]:grid-cols-2 max-[720px]:grid-cols-1">
        <div>
          <p className="text-lg font-black leading-none text-[#171f24]">{String(index + 1).padStart(2, "0")}</p>
          <p className="mt-1 text-[11px] font-bold text-[#3e4a51]">{order.orderName || `#${order.orderNumber || "Order"}`}</p>
        </div>

        <div className="grid gap-1">
          <StatusPill tone={statusTone}>{statusLabel}</StatusPill>
          <StatusPill tone="yellow">{fulfillmentLabel}</StatusPill>
        </div>

        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold text-[#8a949a]">{order.customerName || "Shopify Customer"}</p>
          <p className="truncate text-md font-black leading-tight text-[#1f2b31]">{phone}</p>
          <p className="truncate text-[11px] font-semibold text-[#66737b]">{email}</p>
        </div>

        <div>
          <p className="truncate text-sm font-extrabold text-[#26333a]">{city}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-[#59666d]">
            <span className="inline-flex size-1.5 rounded-full bg-[#15c96a]" />
            Low Risk
          </p>
        </div>

        <div className="grid gap-1">
          <StatusPill tone="dark">New Order</StatusPill>
          <StatusPill tone="red">{financialLabel}</StatusPill>
          <StatusPill tone="blue">{fulfillmentLabel}</StatusPill>
        </div>

        <DateCell date={order.createdAt} fallback="Not booked" />
        <DateCell date={order.updatedAt || order.createdAt} fallback="Not booked" />

        <div>
          <p className="text-lg font-black leading-none text-[#086399]">{formatCod(order.totalPrice, currency || order.currency)}</p>
          <StatusPill tone={financialLabel === "paid" ? "green" : "red"}>{financialLabel}</StatusPill>
        </div>

        <button
          className="ml-auto grid min-h-12 w-8 cursor-pointer place-items-center border-0 bg-transparent p-0 text-[#171f24] max-[980px]:ml-0"
          type="button"
          aria-label={`Open actions for ${order.orderName || order.orderNumber || "order"}`}
        >
          <span className="text-3xl leading-[0.55]">...</span>
        </button>
      </div>

      <div className="border-t border-[#e7e7e7] px-4 py-2 text-[11px] font-semibold text-[#26333a]">
        <span className="mr-2 text-[#f23847]">Location</span>
        {address}
      </div>

      <div className="grid grid-cols-[minmax(150px,1fr)_minmax(170px,1.2fr)_2fr] gap-3 bg-[#93edb7] px-4 py-2 max-[720px]:grid-cols-1">
        <FooterPill tone="dark">Order Verified by Ai</FooterPill>
        <FooterPill tone="red">Delivery Chances: {deliveryChance}%</FooterPill>
      </div>
    </article>
  );
}

function DateCell({ date, fallback }) {
  const formatted = formatDate(date);

  return (
    <div>
      <p className="text-md font-black leading-tight text-[#26333a]">{formatted || fallback}</p>
      <p className="mt-1 text-[11px] font-semibold text-[#7d878c]">{formatRelativeDate(date)}</p>
    </div>
  );
}

function StatusPill({ children, tone }) {
  const toneClasses = {
    blue: "bg-[#0d8ad7] text-white",
    dark: "bg-[#4d4d4d] text-white",
    green: "bg-[#48df8d] text-[#064d2a]",
    red: "bg-[#ee3c50] text-white",
    yellow: "bg-[#ffe522] text-[#514900]",
  };

  return (
    <span className={`inline-flex min-h-4 w-fit min-w-20 items-center justify-center rounded-sm px-2 py-0.5 text-[9px] font-black ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}

function FooterPill({ children, tone }) {
  const dotClass = tone === "red" ? "bg-[#ee3c50]" : "bg-[#26333a]";

  return (
    <span className="inline-flex min-h-4 items-center gap-1.5 rounded bg-white px-2 text-[11px] font-black text-[#26333a]">
      <span className={`inline-flex size-2 rounded-full ${dotClass}`} />
      {children}
    </span>
  );
}

function formatCod(value, currency = "PKR") {
  const amount = Number.parseFloat(value || "0");
  const formatted = formatNumber(Number.isFinite(amount) ? amount : 0);
  return currency ? formatted : formatted;
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatRelativeDate(value) {
  if (!value) {
    return "No date";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "No date";
  }

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.max(1, Math.round(Math.abs(diffMs) / 60000));
  const units = [
    ["year", 525600],
    ["month", 43800],
    ["day", 1440],
    ["hour", 60],
    ["minute", 1],
  ];
  const [unit, unitMinutes] = units.find(([, size]) => minutes >= size) || units.at(-1);
  const count = Math.max(1, Math.floor(minutes / unitMinutes));
  return `${count} ${unit}${count === 1 ? "" : "s"} ago`;
}

function formatAddress(address) {
  if (!address) {
    return "No address available";
  }

  return [address.address1, address.address2, address.city, address.province, address.country]
    .filter(Boolean)
    .join(", ") || "No address available";
}

function getStatusLabel(order) {
  if (["fulfilled", "partial"].includes(order.fulfillmentStatus)) {
    return "Courier Booked";
  }

  return "No Courier Booked";
}

function getDeliveryChance(order) {
  let score = 64;

  if (order.phone) score += 10;
  if (order.email) score += 6;
  if (order.address?.address1) score += 6;
  if (order.customerName) score += 4;
  if (order.financialStatus === "paid") score += 8;

  return Math.min(98, score);
}

function orderKey(order, index) {
  return order.shopifyOrderId || order.adminGraphqlApiId || order.orderName || order.orderNumber || index;
}

export default OrdersPage;
