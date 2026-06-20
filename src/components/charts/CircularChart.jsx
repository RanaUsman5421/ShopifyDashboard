const CHART_SIZE = 220;
const CHART_CENTER = CHART_SIZE / 2;
const PIE_RADIUS = 82;
const START_ANGLE = -90;

function polarToCartesian(center, radius, angle) {
  const angleInRadians = (angle * Math.PI) / 180;

  return {
    x: center + radius * Math.cos(angleInRadians),
    y: center + radius * Math.sin(angleInRadians),
  };
}

function describePieSlice(startAngle, endAngle) {
  const start = polarToCartesian(CHART_CENTER, PIE_RADIUS, startAngle);
  const end = polarToCartesian(CHART_CENTER, PIE_RADIUS, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${CHART_CENTER} ${CHART_CENTER}`,
    `L ${start.x} ${start.y}`,
    `A ${PIE_RADIUS} ${PIE_RADIUS} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

function buildSegments(series) {
  const total = series.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = START_ANGLE;

  return series.map((item) => {
    const percent = total > 0 ? item.value / total : 0;
    const angleSize = percent * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angleSize;

    currentAngle += angleSize;

    return {
      ...item,
      percent,
      path: describePieSlice(startAngle, endAngle),
    };
  });
}

function CircularChart({ title, series, className = "block h-[min(330px,62vw)] max-h-82.5 w-full", legendClassName = "grid w-full max-w-82.5 grid-cols-2 gap-x-4 gap-y-2 text-sm text-[#4d5a61]" }) {
  const segments = buildSegments(series);

  return (
    <section className="grid min-h-113.75 overflow-hidden rounded-[7px] border border-[#d7d7d7] bg-white px-6 pt-4.5 pb-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.8)] max-[720px]:min-h-82.5 max-[720px]:px-4.5">
      <h2 className="mb-2 text-lg leading-none text-[#35464d] max-[720px]:text-[26px]">
        {title}
      </h2>

      <div className="grid place-items-center gap-3">
        <svg
          className={className}
          viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
          role="img"
          aria-label={`${title} chart`}
        >
          {segments.map((item) => (
            <path
              d={item.path}
              fill={item.color}
              stroke={item.color}
              strokeLinecap="butt"
              strokeLinejoin="round"
              strokeWidth="2"
              key={item.label}
            />
          ))}
        </svg>

        <ul className={legendClassName}>
          {segments.map((item) => (
            <li className="flex min-w-0 items-center justify-between gap-2" key={item.label}>
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate font-semibold">{item.label}</span>
              </span>
              <span className="shrink-0 font-extrabold text-[#26333a]">
                {Math.round(item.percent * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default CircularChart;
