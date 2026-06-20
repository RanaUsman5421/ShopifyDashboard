function OverallOrdersChart({ series }) {
  const maxValue = Math.max(...series.map((item) => item.value));
  const points = series.map((item, index) => {
    const x = 38 + index * 108;
    const y = 238 - (item.value / maxValue) * 190;
    return { ...item, x, y };
  });
  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <section className="mx-2 mb-2.5 min-h-105 overflow-hidden rounded-[7px] border border-[#d7d7d7] bg-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.8)] max-[720px]:min-h-72.5">
      <h2 className="mt-4.5 mr-6.5 mb-0 ml-6.5 text-[34px] leading-none text-[#0a8d5b] max-[720px]:ml-4.5 max-[720px]:text-[26px]">
        Overall Orders
      </h2>
      <svg
        className="mx-auto block h-auto max-h-102.5 w-[min(100%,980px)] [&_text]:text-[22px] [&_text]:font-bold"
        viewBox="0 0 520 280"
        role="img"
        aria-label="Sample overall orders chart"
      >
        {[...Array(10)].map((_, index) => (
          <line className="stroke-[#e5e5e5] stroke-1" x1="8" x2="512" y1={28 + index * 24} y2={28 + index * 24} key={index} />
        ))}
        <path className="fill-none stroke-black/17 stroke-5 [stroke-linecap:round]" d={linePath} />
        <path className="fill-none stroke-[#bbbbbb] stroke-3 [stroke-linecap:round]" d={linePath} />
        {points.map((point, index) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="8" fill={point.accent} />
            {index > 0 ? (
              <>
                <path
                  className="opacity-95 filter-[drop-shadow(0_-6px_10px_rgba(91,26,151,0.16))]"
                  d={`M ${point.x - 34} 266 L ${point.x} ${point.y + 70} L ${point.x + 34} 266 Z`}
                  fill={point.accent}
                />
                <text x={point.x - 24} y={point.y + 50} fill={point.accent}>
                  +{(point.value - points[index - 1].value + 11.5).toFixed(1)}
                </text>
              </>
            ) : null}
          </g>
        ))}
      </svg>
    </section>
  );
}

export default OverallOrdersChart;
