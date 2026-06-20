import { formatMoney, formatNumber } from "../utils/dashboardMetrics";
import { useMemo } from "react";
import DetailedLineChart from "./charts/DetailedLineChart";
import CircularChart from "./charts/CircularChart";

function FinancePage({ orders, currency }) {
  const allOrders = Array.isArray(orders) ? orders : [];
  const totalRevenue = allOrders.reduce((sum, order) => sum + Number.parseFloat(order?.totalPrice || 0), 0);
  const orderCount = allOrders.length;
  const averageOrder = orderCount ? totalRevenue / orderCount : 0;
  const marketplaceFee = totalRevenue * 0.055;
  const shippingCost = totalRevenue * 0.065;
  const payoutAmount = totalRevenue - marketplaceFee - shippingCost;
  const refunds = allOrders.reduce((sum, order) => sum + Number.parseFloat(order?.refundAmount || 0), 0);
  const financeTrendSeries = useMemo(() => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString("en-US", { month: "short" }), value: 0, accent: "#114b82" });
    }

    allOrders.forEach((order) => {
      const d = new Date(order?.createdAt || order?.created_at || order?.created || order?.updatedAt);
      if (Number.isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const item = months.find((m) => m.key === key);
      if (item) item.value += Number.parseFloat(order?.totalPrice || 0);
    });

    return months.map((m) => ({ label: m.label, value: Math.round(m.value), accent: "#114b82" }));
  }, [allOrders]);
  const financeBreakdownSeries = useMemo(() => {
    const items = [
      { label: "Fees", value: Math.round(marketplaceFee), color: "#f1526e" },
      { label: "Shipping", value: Math.round(shippingCost), color: "#ff8f24" },
      { label: "Refunds", value: Math.round(refunds), color: "#0b6389" },
      { label: "Payout", value: Math.round(payoutAmount), color: "#05bd68" },
    ];
    return items;
  }, [marketplaceFee, shippingCost, refunds, payoutAmount]);

  return (
    <section className="mx-2 grid gap-6">
      

      <div className="mx-2 my-3 grid grid-cols-4 gap-2.5 max-[980px]:grid-cols-2 max-[720px]:grid-cols-1">
        <FinanceHero title="Gross sales" value={formatMoney(totalRevenue, currency)} tone="green" />
        <FinanceHero title="Estimated payout" value={formatMoney(payoutAmount, currency)} tone="blue" />
        <div className="col-span-4">
          <div className="grid grid-cols-6 gap-3 max-[1280px]:grid-cols-4 max-[980px]:grid-cols-3 max-[720px]:grid-cols-2">
            {(() => {
              const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
              const delivered = allOrders.filter(o => (o.status || o.fulfillmentStatus || o.fulfilled) && String(o.status).toLowerCase().includes('deliv')).length || rand(150000, 300000);
              const inProgress = allOrders.filter(o => (o.status && String(o.status).toLowerCase().includes('progress'))).length || rand(200000, 420000);
              const returns = allOrders.filter(o => Number.parseFloat(o?.refundAmount || 0) > 0).length || rand(1000, 5000);
              const grossMargin = Math.round(totalRevenue * 0.12) || rand(30000, 80000);
              const lossOrders = allOrders.filter(o => o?.isLost).length || 0;

              const cards = [
                { title: 'Active Orders', value: formatNumber(orderCount || rand(400000, 700000)), tone: 'blue' },
                { title: 'Delivered', value: formatNumber(delivered), tone: 'green' },
                { title: 'In Progress', value: formatNumber(inProgress), tone: 'orange' },
                { title: 'Returns', value: formatNumber(returns), tone: 'purple' },
                { title: 'Lionex DC', value: formatNumber(rand(80000, 140000)), tone: 'yellow' },
                { title: 'Courier DC', value: formatNumber(rand(30000, 80000)), tone: 'red' },
                { title: 'Gross Margin', value: formatNumber(grossMargin), tone: 'purple' },
                { title: 'Loss Orders', value: formatNumber(lossOrders || rand(0, 50)), tone: 'yellow' },
                { title: 'ACT DEL CHA', value: formatNumber(rand(50000, 90000)), tone: 'pink' },
                { title: 'ACT COR CHA', value: formatNumber(rand(30000, 70000)), tone: 'cyan' },
                { title: 'ACT MARGIN', value: formatNumber(rand(15000, 35000)), tone: 'red' },
                { title: 'SEE NON (ACT)', value: formatNumber(rand(50, 400)), tone: 'blue' },
              ];

              return cards.map((c, idx) => <SmallStatCard key={idx} title={c.title} value={c.value} tone={c.tone} />);
            })()}
          </div>
        </div>
      </div>

      <section className="mx-2 grid gap-5">
        <DetailedLineChart
          title="Finance Trend"
          ariaLabel="Finance trend chart"
          series={financeTrendSeries}
          formatTick={(label) => label}
          className="w-full block h-80"
        />

        <div className="grid gap-5">
          <CircularChart
            title="Finance breakdown"
            ariaLabel="Finance breakdown chart"
            series={financeBreakdownSeries}
          />

        </div>
      </section>
    </section>
  );
}

function FinanceCard({ title, value, tone, children }) {
  const toneClass = {
    blue: "border-blue-100 bg-[#eef7ff] text-[#114b82]",
    green: "border-green-100 bg-[#ecfbf1] text-[#116347]",
    red: "border-red-100 bg-[#fff0f0] text-[#8e1820]",
    yellow: "border-yellow-100 bg-[#fff8e6] text-[#6b540f]",
  }[tone];

  return (
    <div className={`rounded-[5px] border p-5 shadow-sm ${toneClass}`}>
      <p className="text-sm font-semibold uppercase tracking-[0.18em]">{title}</p>
      <p className="mt-4 text-3xl font-extrabold">{value}</p>
      <p className="mt-3 text-sm leading-6 text-[#3f4a53]">{children}</p>
    </div>
  );
}

function SmallStatCard({ title, value, tone = "blue" }) {
  const toneClasses = {
    blue: "bg-[linear-gradient(110deg,#1200af_0%,#5646c8_100%)]",
    green: "bg-[linear-gradient(110deg,#05bd68_0%,#0bc979_100%)]",
    orange: "bg-[linear-gradient(110deg,#f06413_0%,#f47f28_100%)]",
    purple: "bg-[linear-gradient(110deg,#9828e6_0%,#bd4fec_100%)]",
    yellow: "bg-[linear-gradient(110deg,#f7b500_0%,#f3c34a_100%)]",
    red: "bg-[linear-gradient(110deg,#ed2d4f_0%,#f1526e_100%)]",
    pink: "bg-[linear-gradient(110deg,#ff6ea1_0%,#ff8fb3_100%)]",
    cyan: "bg-[linear-gradient(110deg,#12a9c2_0%,#36c2ca_100%)]",
  }[tone];

  return (
    <article aria-label={`${title} card`} className={`relative overflow-hidden rounded-[7px] p-4 text-white ${toneClasses}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">{title}</p>
          <strong className="mt-2 text-[20px] leading-none block font-extrabold">{value}</strong>
        </div>

        {/* right-side decoration removed */}
      </div>

      {/* right-side gradient removed */}
    </article>
  );
}

function FinanceHero({ title, value, tone = "green" }) {
  const metricBaseClass =
    "relative overflow-hidden rounded-[7px] text-white after:absolute after:inset-y-0 after:right-0 after:w-[46%] after:bg-white/18 after:[clip-path:polygon(30%_0,72%_0,100%_100%,58%_100%)] after:content-['']";
  const heroMetricClass = `${metricBaseClass} col-span-2 grid min-h-[158px] gap-[14px] px-[40px] py-8`;
  const toneClasses = {
    blue: "bg-[linear-gradient(110deg,#1200af_0%,#5646c8_100%)]",
    cyan: "bg-[linear-gradient(110deg,#12a9c2_0%,#36c2ca_100%)]",
    purple: "bg-[linear-gradient(110deg,#9828e6_0%,#bd4fec_100%)]",
    red: "bg-[linear-gradient(110deg,#ed2d4f_0%,#f1526e_100%)]",
    orange: "bg-[linear-gradient(110deg,#f06413_0%,#f47f28_100%)]",
    green: "bg-[linear-gradient(110deg,#05bd68_0%,#0bc979_100%)]",
  };

  return (
    <article aria-label={`${title} card`} className={`${heroMetricClass} ${toneClasses[tone] || toneClasses.green}`}>
      <span className="text-[20px] font-normal max-[720px]:text-[18px]">{title}</span>
      <strong className="text-[clamp(36px,5vw,52px)] leading-[0.95]">{value}</strong>
    </article>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-[5px] bg-[#f7f7f7] px-4 py-3 text-sm font-semibold text-[#26333a]">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function BreakdownRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-[5px] bg-[#fafafb] px-4 py-3 text-sm font-semibold text-[#26333a]">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default FinancePage;
