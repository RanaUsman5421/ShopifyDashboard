import { useMemo, useState } from "react";
import { formatMoney, formatNumber } from "../utils/dashboardMetrics";
import DetailedLineChart from "./charts/DetailedLineChart";
import CircularChart from "./charts/CircularChart";

const rangeOptions = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "this-week", label: "This Week" },
  { id: "last-week", label: "Last Week" },
  { id: "last-month", label: "Last Month" },
  { id: "last-3-months", label: "Last 3 Months" },
  { id: "last-6-months", label: "Last 6 Months" },
  { id: "last-12-months", label: "This Year" },
];

function parseOrderDate(order) {
  const value = order?.createdAt || order?.created_at || order?.created || order?.updatedAt;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getRangeWindow(id) {
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  switch (id) {
    case "today":
      return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000) };
    case "yesterday": {
      const start = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      return { start, end: today };
    }
    case "this-week": {
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay());
      return { start, end: new Date(today.getTime() + 24 * 60 * 60 * 1000) };
    }
    case "last-week": {
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay() - 7);
      const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
      return { start, end };
    }
    case "last-month": {
      const start = new Date(today);
      start.setMonth(today.getMonth() - 1);
      return { start, end: today };
    }
    case "this-month": {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      end.setHours(0, 0, 0, 0);
      return { start, end };
    }
    case "last-quarter": {
      const year = today.getFullYear();
      const month = today.getMonth();
      const currentQuarter = Math.floor(month / 3);
      let q = currentQuarter - 1;
      let qYear = year;
      if (q < 0) {
        q = 3;
        qYear = year - 1;
      }
      const start = new Date(qYear, q * 3, 1);
      const end = new Date(qYear, q * 3 + 3, 1);
      return { start, end };
    }
    case "last-year": {
      const year = today.getFullYear();
      const start = new Date(year - 1, 0, 1);
      const end = new Date(year, 0, 1);
      return { start, end };
    }
    case "last-3-months": {
      const start = new Date(today);
      start.setMonth(today.getMonth() - 3);
      return { start, end: today };
    }
    case "last-6-months": {
      const start = new Date(today);
      start.setMonth(today.getMonth() - 6);
      return { start, end: today };
    }
    case "last-12-months": {
      const start = new Date(today);
      start.setMonth(today.getMonth() - 12);
      return { start, end: today };
    }
    default:
      return { start: new Date(0), end: new Date() };
  }
}

function filterOrders(orders, rangeId) {
  const { start, end } = getRangeWindow(rangeId);
  return orders.filter((order) => {
    const date = parseOrderDate(order);
    return date && date >= start && date < end;
  });
}

function getRangeSummary(orders, currency) {
  const rawOrders = Array.isArray(orders) ? orders : [];
  const amount = rawOrders.reduce((sum, order) => sum + Number.parseFloat(order?.totalPrice || 0), 0);
  return {
    count: rawOrders.length,
    totalSales: amount,
    average: rawOrders.length ? amount / rawOrders.length : 0,
    topLabel: rawOrders.length ? `Showing ${rawOrders.length} orders` : "No data available",
    currency,
  };
}

function SalesAnalytics({ orders, currency }) {
  const [activeRange, setActiveRange] = useState("today");
  const allOrders = Array.isArray(orders) ? orders : [];

  const selectedOrders = useMemo(() => filterOrders(allOrders, activeRange), [activeRange, allOrders]);
  const selectedSummary = useMemo(() => getRangeSummary(selectedOrders, currency), [selectedOrders, currency]);
  const revenueTrendSeries = useMemo(() => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString("en-US", { month: "short" }), value: 0, accent: "#0b8d5b" });
    }

    allOrders.forEach((order) => {
      const d = parseOrderDate(order);
      if (!d) return;
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const item = months.find((m) => m.key === key);
      if (item) item.value += Number.parseFloat(order?.totalPrice || 0);
    });

    return months.map((m) => ({ label: m.label, value: Math.round(m.value), accent: "#0b8d5b" }));
  }, [allOrders]);
  const revenueShareSeries = useMemo(() => {
    const total = allOrders.reduce((sum, o) => sum + Number.parseFloat(o?.totalPrice || 0), 0);
    return [
      { label: "Paid", value: Math.round(total * 0.72), color: "#0b8d5b" },
      { label: "Pending", value: Math.round(total * 0.28), color: "#fb7b25" },
    ];
  }, [allOrders]);
  const rangeSummaries = useMemo(
    () =>
      rangeOptions.map((range) => {
        const filtered = filterOrders(allOrders, range.id);
        return {
          id: range.id,
          label: range.label,
          orderCount: filtered.length,
          totalSales: filtered.reduce((sum, order) => sum + Number.parseFloat(order?.totalPrice || 0), 0),
        };
      }),
    [allOrders]
  );

  const cardColors = {
    "all-time": "bg-[#6b7280]",
    "today": "bg-[#3b82f6]",
    "yesterday": "bg-[#8b5cf6]",
    "this-week": "bg-[#ec4899]",
    "last-week": "bg-[#a78bfa]",
    "last-month": "bg-[#f97316]",
    "last-3-months": "bg-[#ec4899]",
    "last-6-months": "bg-[#06b6d4]",
    "last-12-months": "bg-[#06b6d4]",
  };

  const cardColorsExtended = {
    ...cardColors,
    "this-month": "bg-[#10b981]",
    "last-quarter": "bg-[#ef4444]",
    "last-year": "bg-[#22c55e]",
  };

  const allRanges = [
    { id: "all-time", label: "All Time" },
    { id: "today", label: "Today" },
    { id: "yesterday", label: "Yesterday" },
    { id: "this-week", label: "This Week" },
    { id: "last-week", label: "Last Week" },
    { id: "this-month", label: "This Month" },
    { id: "last-month", label: "Last Month" },
    { id: "last-3-months", label: "Last 3 Months" },
    { id: "last-6-months", label: "Last 6 Months" },
    { id: "last-quarter", label: "Last Quarter" },
    { id: "last-year", label: "Last Year" },
    { id: "last-12-months", label: "Last 12 Months" },
  ];
  const allRangeSummaries = useMemo(
    () =>
      allRanges.map((range) => {
        const filtered = filterOrders(allOrders, range.id === "all-time" ? "last-12-months" : range.id);
        return {
          id: range.id,
          label: range.label,
          orderCount: filtered.length,
          totalSales: filtered.reduce((sum, order) => sum + Number.parseFloat(order?.totalPrice || 0), 0),
        };
      }),
    [allOrders]
  );

  return (
    <section className="mx-2 grid gap-6">
      
      <div className="mx-2 my-3 grid grid-cols-6 gap-3 max-[1400px]:grid-cols-4 max-[980px]:grid-cols-2 max-[720px]:grid-cols-1">
        {allRangeSummaries.map((range) => (
          <article key={range.id} className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
            <div className={`${cardColorsExtended[range.id] || "bg-[#6b7280]"} px-4 py-1 text-white flex items-center justify-between`}>
              <span className="text-sm font-bold">{range.label}</span>
              <button className="p-1 hover:bg-white/20 rounded transition-colors" type="button" aria-label="Options">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
            <div className="px-4">
              <div className="flex justify-between items-center">
                <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide">Orders</p>
                <p className="text-xl font-bold text-[#1f2937] mt-1">{formatNumber(range.orderCount)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide">COD Amount</p>
                <p className="text-lg font-bold text-[#059669]">{formatMoney(range.totalSales, currency)}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Charts */}
      <section className="mx-2 grid gap-5">
        <DetailedLineChart
          title="Revenue Trend"
          ariaLabel="Revenue trend chart"
          series={revenueTrendSeries}
          formatTick={(label) => label}
          className="w-full block h-80"
        />

        <div className="grid gap-5">
          <CircularChart
            title="Revenue Share"
            ariaLabel="Revenue share chart"
            series={revenueShareSeries}
          />          
        </div>
      </section>
    </section>
  );
}

export default SalesAnalytics;
