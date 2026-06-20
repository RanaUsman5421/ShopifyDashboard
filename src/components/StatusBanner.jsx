function StatusBanner({ connected, label, shopUrl }) {
  const normalizedUrl = shopUrl
    ? `https://${shopUrl.replace(/^https?:\/\//, "")}`
    : "";

  return (
    <section
      className={`mx-2 my-1.75 flex min-h-8.5 items-center justify-between gap-3 border px-3 py-1.75 max-[720px]:grid max-[720px]:grid-cols-1 max-[720px]:items-stretch max-[720px]:p-2.5 ${
        connected ? "border-[#b2ecc4] bg-[#c9f8d7]" : "border-[#e0e2e2] bg-[#f5f7f6]"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex size-3.5 rounded-full ${
            connected
              ? "bg-[#15c96a] shadow-[0_0_0_4px_rgba(21,201,106,0.12)]"
              : "bg-[#b8c0c5] shadow-[0_0_0_4px_rgba(184,192,197,0.16)]"
          }`}
        />
        <span className="text-[13px] text-[#26333a]">{label}</span>
      </div>
      {connected && normalizedUrl ? (
        <a
          className="rounded border border-[#dbe5df] bg-white px-2.75 py-1.25 text-xs text-[#3e4a51] no-underline transition-[border-color,background,color,transform] duration-160 ease-in-out"
          href={normalizedUrl}
          target="_blank"
          rel="noreferrer"
        >
          Go to Shopify store
        </a>
      ) : null}
    </section>
  );
}

export default StatusBanner;
