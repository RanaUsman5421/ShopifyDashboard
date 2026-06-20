import { useMemo } from 'react';
import { formatNumber } from '../utils/dashboardMetrics';

const CouriersPage = () => {
  return (
    <div>
      <CouriersOverview />
    </div>
  );
};

function CouriersOverview() {
  const couriers = [
    { name: "All Couriers", isAll: true },
    { name: "Leopards" },
    { name: "Trax" },
    { name: "TCS" },
    { name: "BarqRaftaar" },
    { name: "M&p" },
  ];

  // generate random stats once per render
  const stats = useMemo(() => {
    return couriers.map((courier) => ({
      name: courier.name,
      isAll: courier.isAll,
      active: Math.floor(Math.random() * 90000) + 1000,
      delivered: Math.floor(Math.random() * 90000) + 1000,
    }));
  }, []);

  const gradients = [
    "bg-[linear-gradient(90deg,#6b7280_0%,#9ca3af_100%)]",
    "bg-[linear-gradient(90deg,#3b82f6_0%,#60a5fa_100%)]",
    "bg-[linear-gradient(90deg,#10b981_0%,#34d399_100%)]",
    "bg-[linear-gradient(90deg,#f97316_0%,#fb923c_100%)]",
    "bg-[linear-gradient(90deg,#8b5cf6_0%,#a78bfa_100%)]",
    "bg-[linear-gradient(90deg,#ef4444_0%,#f97316_100%)]",
  ];

  return (
    <div className="mx-2 my-2">
      <h3 className="mb-2 text-sm font-bold text-[#5d6b72]">Couriers Overview</h3>
      <div className="grid grid-cols-3 gap-3 max-[1200px]:grid-cols-3 max-[720px]:grid-cols-2 max-[480px]:grid-cols-1">
        {stats.map((c, idx) => (
          <div key={c.name} className={`relative overflow-hidden rounded-lg p-4 text-white ${gradients[idx % gradients.length]}`}>
            <div className="absolute -left-6 -top-6 h-20 w-20 rotate-6 rounded-md bg-white/10" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase opacity-90">{c.name}</p>
                <p className="mt-2 text-2xl font-extrabold">{formatNumber(c.active)}</p>
                <p className="text-xs opacity-80 mt-1">Active Orders</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{formatNumber(c.delivered)}</p>
                <p className="text-xs opacity-80">Delivered</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CouriersPage;
