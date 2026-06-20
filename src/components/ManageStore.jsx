import { useState } from "react";

const buttonClass =
  "inline-flex min-h-[38px] cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded border px-4 py-2 text-sm leading-none font-bold transition-[border-color,background,color,transform] duration-[160ms] ease-in-out disabled:cursor-not-allowed disabled:opacity-65";

const iconPaths = {
  copy: (
    <>
      <path d="M8 8h11v11H8z" />
      <path d="M5 16H4V5h11v1" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.1 0l1.4-1.4a5 5 0 0 0-7.1-7.1L10.6 5.3" />
      <path d="M14 11a5 5 0 0 0-7.1 0l-1.4 1.4a5 5 0 0 0 7.1 7.1l.8-.8" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 0 1-13.5 5.8" />
      <path d="M4 12A8 8 0 0 1 17.5 6.2" />
      <path d="M17 3v4h-4" />
      <path d="M7 21v-4h4" />
    </>
  ),
  unplug: (
    <>
      <path d="m19 5-4 4" />
      <path d="m5 19 4-4" />
      <path d="M6 8h4" />
      <path d="M8 6v4" />
      <path d="M14 16h4" />
      <path d="M16 14v4" />
      <path d="m8 8 8 8" />
    </>
  ),
};

function Icon({ name, className = "size-4" }) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded border border-[#e2e5e7] bg-[#fbfbfb] px-3.5 py-3">
      <span className="block text-xs font-bold uppercase tracking-normal text-[#728087]">{label}</span>
      <strong className="mt-1 block wrap-break-word text-[15px] font-extrabold text-[#243139]">
        {value || "Pending"}
      </strong>
    </div>
  );
}

function ManageStore({
  generatedToken,
  isDisconnecting,
  isGenerating,
  onDisconnect,
  onGenerateToken,
  selectedUser,
  store,
}) {
  const [message, setMessage] = useState("");
  const isConnected = Boolean(store?.shopDomain || store?.storeName);
  const shopDomain = store?.shopDomain;
  const storeName = store?.storeName;
  const linkedAt = store?.linkedAt
    ? new Date(store.linkedAt).toLocaleString()
    : "";

  async function handleGenerateToken() {
    setMessage("");
    const token = await onGenerateToken();
    if (token) {
      setMessage("Token generated. Paste it into the Shopify app to connect another store to this dashboard user.");
    }
  }

  async function handleCopyToken() {
    if (!generatedToken) {
      return;
    }

    await navigator.clipboard.writeText(generatedToken);
    setMessage("Token copied.");
  }

  async function handleDisconnect() {
    setMessage("");
    const disconnected = await onDisconnect();
    if (disconnected) {
      setMessage("Store disconnected.");
    }
  }

  return (
    <section className="mx-2 grid gap-4">
      <div className="border border-[#e0e0e0] bg-white px-5 py-4">
        <div className="flex items-start justify-between gap-3 max-[720px]:grid max-[720px]:grid-cols-1">
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-[#fb7b25]">Manage Store</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-normal text-[#172026]">
              Shopify connection
            </h2>
            <p className="mt-1 text-sm font-medium text-[#5d6970]">
              Generate a link token, review connection status, or disconnect the selected Shopify store.
            </p>
          </div>
          <span
            className={`inline-flex min-h-8 items-center gap-2 rounded border px-3 py-1 text-sm font-extrabold ${
              isConnected
                ? "border-[#b2ecc4] bg-[#c9f8d7] text-[#117a43]"
                : "border-[#e2e5e7] bg-[#f5f7f6] text-[#5d6970]"
            }`}
          >
            <span
              className={`inline-flex size-3 rounded-full ${
                isConnected ? "bg-[#15c96a]" : "bg-[#b8c0c5]"
              }`}
            />
            {isConnected ? "Connected" : "Not connected"}
          </span>
        </div>

        {message ? (
          <p className="mt-4 rounded border border-[#cfe8d8] bg-[#f0fbf4] px-3 py-2 text-sm font-bold text-[#117a43]">
            {message}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-3 gap-3 max-[860px]:grid-cols-1">
        <DetailItem label="Dashboard user" value={selectedUser?.name || selectedUser?.username} />
        <DetailItem label="Selected store" value={isConnected ? storeName : "Not connected"} />
        <DetailItem label="Shop domain" value={isConnected ? shopDomain : "Pending"} />
        <DetailItem label="Linked at" value={isConnected ? linkedAt : "Pending"} />
        <DetailItem label="Token preview" value={selectedUser?.linkTokenPreview || "No token generated"} />
        <DetailItem label="Orders synced" value={String(store?.orders?.length || 0)} />
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_280px] gap-4 max-[860px]:grid-cols-1">
        <section className="border border-[#e0e0e0] bg-white px-5 py-4">
          <div className="flex items-center gap-2">
            <Icon name="link" className="size-5 text-[#fb7b25]" />
            <h3 className="text-lg font-extrabold text-[#172026]">Connection token</h3>
          </div>
          <p className="mt-2 text-sm font-medium text-[#5d6970]">
            Use this token inside the Shopify app connection screen. Each successful link is added to this user.
          </p>

          <div className="mt-4 flex gap-2 max-[720px]:grid max-[720px]:grid-cols-1">
            <button
              className={`${buttonClass} border-[#e86c1b] bg-[#fb7b25] text-white hover:bg-[#e86c1b]`}
              type="button"
              onClick={handleGenerateToken}
              disabled={isGenerating}
            >
              <Icon name="refresh" />
              <span>{isGenerating ? "Generating..." : "Generate Token"}</span>
            </button>
            <button
              className={`${buttonClass} border-[#d4d9dd] bg-white text-[#49565e] hover:border-[#f57c24] hover:text-[#172026]`}
              type="button"
              onClick={handleCopyToken}
              disabled={!generatedToken}
            >
              <Icon name="copy" />
              <span>Copy Token</span>
            </button>
          </div>

          {generatedToken ? (
            <code className="mt-4 block break-all rounded border border-[#dfe3e5] bg-[#fbfbfb] px-3 py-2 text-sm font-bold text-[#243139]">
              {generatedToken}
            </code>
          ) : selectedUser?.linkTokenPreview ? (
            <div className="mt-4 space-y-2">
              <code className="block break-all rounded border border-[#dfe3e5] bg-[#fbfbfb] px-3 py-2 text-sm font-bold text-[#728087]">
                Last token preview: {selectedUser.linkTokenPreview}
              </code>
              <p className="text-xs text-[#728087]">
                This is a preview only. Generate a fresh token and copy the full value before linking the store.
              </p>
            </div>
          ) : null}
        </section>

        <section className="border border-[#ffc8b9] bg-white px-5 py-4">
          <div className="flex items-center gap-2">
            <Icon name="unplug" className="size-5 text-[#d92747]" />
            <h3 className="text-lg font-extrabold text-[#172026]">Disconnect</h3>
          </div>
          <p className="mt-2 text-sm font-medium text-[#5d6970]">
            Disconnecting removes only the selected store from this dashboard user. Other stores stay connected.
          </p>
          <button
            className={`${buttonClass} mt-4 w-full border-[#d82847] bg-[#d92747] text-white hover:bg-[#c92240]`}
            type="button"
            onClick={handleDisconnect}
            disabled={!isConnected || isDisconnecting}
          >
            <Icon name="unplug" />
            <span>{isDisconnecting ? "Disconnecting..." : "Disconnect Store"}</span>
          </button>
        </section>
      </div>
    </section>
  );
}

export default ManageStore;
