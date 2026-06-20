import { formatMoney, formatNumber } from "../utils/dashboardMetrics";

const smallCards = [
  ["totalOrders", "Total Orders", "blue"],
  ["verifiedOrders", "Verified Orders", "cyan"],
  ["fakeOrders", "Fake Orders", "purple"],
  ["cancelledOrders", "Cancelled Orders", "red"],
  ["dispatchedOrders", "Dispatched Orders", "blue"],
  ["pendingOrders", "Pending Verification", "cyan"],
  ["duplicateOrders", "Duplicate Orders", "purple"],
  ["connectedStores", "Connected Stores", "red"],
];

const metricBaseClass =
  "relative overflow-hidden rounded-[7px] text-white after:absolute after:inset-y-0 after:right-0 after:w-[46%] after:bg-white/18 after:[clip-path:polygon(30%_0,72%_0,100%_100%,58%_100%)] after:content-['']";
const heroMetricClass =
  `${metricBaseClass} col-span-2 grid min-h-[178px] gap-[14px] px-[54px] py-10 max-[720px]:col-span-1 max-[720px]:min-h-[140px] max-[720px]:p-7`;
const smallMetricClass = `${metricBaseClass} grid min-h-[88px] gap-1.5 px-[26px] py-[18px] max-[720px]:min-h-[78px]`;
const toneClasses = {
  blue: "bg-[linear-gradient(110deg,#1200af_0%,#5646c8_100%)]",
  cyan: "bg-[linear-gradient(110deg,#12a9c2_0%,#36c2ca_100%)]",
  purple: "bg-[linear-gradient(110deg,#9828e6_0%,#bd4fec_100%)]",
  red: "bg-[linear-gradient(110deg,#ed2d4f_0%,#f1526e_100%)]",
};

function MetricCards({ metrics }) {
  return (
    <section className="mx-2 my-3 grid grid-cols-4 gap-2.5 max-[980px]:grid-cols-2 max-[720px]:grid-cols-1">
      <article className={`${heroMetricClass} bg-[linear-gradient(110deg,#f06413_0%,#f47f28_100%)]`}>
        <span className="text-[26px] font-normal max-[720px]:text-[22px]">Orders Recieved</span>
        <strong className="text-[clamp(44px,6vw,62px)] leading-[0.95]">{formatNumber(metrics.ordersReceived)}</strong>
      </article>
      <article className={`${heroMetricClass} bg-[linear-gradient(110deg,#05bd68_0%,#0bc979_100%)]`}>
        <span className="text-[26px] font-normal max-[720px]:text-[22px]">Total Sales</span>
        <strong className="text-[clamp(44px,6vw,62px)] leading-[0.95]">{formatMoney(metrics.totalSales, metrics.currency)}</strong>
      </article>

      {smallCards.map(([key, label, tone]) => (
        <article className={`${smallMetricClass} ${toneClasses[tone]}`} key={key}>
          <span className="text-sm font-medium">{label}</span>
          <strong className="text-[clamp(28px,3vw,38px)] leading-none">{formatNumber(metrics[key])}</strong>
        </article>
      ))}
    </section>
  );
}

export default MetricCards;
