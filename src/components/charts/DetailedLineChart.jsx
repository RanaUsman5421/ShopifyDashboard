import React, { useState } from "react";

function DetailedLineChart({
  series = [],
  title = "Trend",
  ariaLabel = "detailed line chart",
  className = "w-full block h-75",
  formatTick = (label) => label,
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const maxValue = Math.max(...series.map((s) => s.value), 1);
  const paddingLeft = 40;
  const paddingRight = 20;
  const chartWidth = 520 - paddingLeft - paddingRight;
  const chartTop = 24;
  const chartBottom = 200;

  const step = series.length > 1 ? chartWidth / (series.length - 1) : 0;

  const points = series.map((item, idx) => {
    const x = paddingLeft + idx * step;
    const y = chartBottom - (item.value / maxValue) * (chartBottom - chartTop);
    return { ...item, x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")} L ${paddingLeft + chartWidth} ${chartBottom} L ${paddingLeft} ${chartBottom} Z`;

  const handlePointHover = (point) => {
    setHoveredPoint(point);
  };

  const handleChartLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <section className="mx-2 mb-2.5 overflow-hidden rounded-[7px] border border-[#d7d7d7] bg-white shadow-sm">
      <h3 className="mt-4 mb-2 ml-4 text-lg font-semibold text-[#123b2a]">{title}</h3>
      <svg
        className={className}
        viewBox="0 0 520 240"
        role="img"
        aria-label={ariaLabel}
        onMouseLeave={handleChartLeave}
      >
        {/* horizontal grid */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={paddingLeft} x2={paddingLeft + chartWidth} y1={chartTop + (i * (chartBottom - chartTop)) / 4} y2={chartTop + (i * (chartBottom - chartTop)) / 4} stroke="#eef0f2" strokeWidth="1" />
        ))}

        <defs>
          <linearGradient id="dlcArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#e6f8f0" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* area */}
        <path d={areaPath} fill="url(#dlcArea)" />

        {/* line */}
        <path d={linePath} fill="none" stroke="#0a8d5b" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* points and labels */}
        {points.map((p, idx) => (
          <g
            key={p.label}
            onMouseEnter={() => handlePointHover(p)}
            style={{ cursor: "pointer" }}
          >
            <circle cx={p.x} cy={p.y} r={4} fill="#fff" stroke={p.accent || "#0a8d5b"} strokeWidth={2} />
            <text x={p.x} y={p.y - 8} fontSize="11" fill="#0f3740" textAnchor="middle">{p.value}</text>
            <text x={p.x} y={chartBottom + 18} fontSize="11" fill="#68757f" textAnchor="middle">{formatTick(p.label)}</text>
          </g>
        ))}

        {/* tooltip */}
        {hoveredPoint && (
          <g>
            {/* vertical guide line */}
            <line
              x1={hoveredPoint.x}
              x2={hoveredPoint.x}
              y1={chartTop}
              y2={chartBottom}
              stroke="#0a8d5b"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.4"
            />
            {/* tooltip box */}
            <rect
              x={hoveredPoint.x - 50}
              y={hoveredPoint.y - 38}
              width="100"
              height="32"
              fill="#0c1223"
              rx="4"
              opacity="0.95"
            />
            {/* tooltip text - date */}
            <text
              x={hoveredPoint.x}
              y={hoveredPoint.y - 22}
              fontSize="12"
              fill="#ffffff"
              textAnchor="middle"
              fontWeight="600"
            >
              {formatTick(hoveredPoint.label)}
            </text>
            {/* tooltip text - value */}
            <text
              x={hoveredPoint.x}
              y={hoveredPoint.y - 8}
              fontSize="13"
              fill="#0a8d5b"
              textAnchor="middle"
              fontWeight="700"
            >
              {hoveredPoint.value}
            </text>
          </g>
        )}
      </svg>
    </section>
  );
}

export default DetailedLineChart;
