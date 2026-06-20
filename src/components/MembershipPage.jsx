function MembershipPage({ selectedStore, stores }) {
  return (
    <section className="mx-2 grid gap-4">
      <div className="border border-[#e0e0e0] bg-white px-5 py-4">
        <p className="text-xs font-black uppercase tracking-normal text-[#fb7b25]">Membership Plan</p>
        <h2 className="mt-1 text-2xl font-extrabold tracking-normal text-[#172026]">
          Store membership overview
        </h2>
        <p className="mt-1 text-sm font-medium text-[#5d6970]">
          Review the active store context and connected stores under this dashboard user.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 max-[860px]:grid-cols-1">
        <SummaryCard label="Selected store" value={selectedStore?.storeName || "No store selected"} />
        <SummaryCard label="Shop domain" value={selectedStore?.shopDomain || "Pending"} />
        <SummaryCard label="Synced orders" value={String(selectedStore?.orders?.length || 0)} />
      </div>

      <div className="border border-[#e0e0e0] bg-white px-5 py-4">
        <h3 className="text-lg font-extrabold text-[#172026]">Connected stores</h3>
        <div className="mt-3 grid gap-2">
          {stores.length === 0 ? (
            <p className="text-sm font-bold text-[#5d6970]">No stores connected yet.</p>
          ) : (
            stores.map((store) => (
              <div
                className="grid grid-cols-[1.2fr_1.4fr_0.7fr] gap-3 rounded border border-[#e2e5e7] bg-[#fbfbfb] px-3.5 py-3 text-sm max-[720px]:grid-cols-1"
                key={store.shopDomain || store.storeName}
              >
                <strong className="text-[#243139]">{store.storeName}</strong>
                <span className="wrap-break-word font-semibold text-[#5d6970]">{store.shopDomain || "No domain"}</span>
                <span className="font-black text-[#117a43]">{store.orders?.length || 0} orders</span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded border border-[#e2e5e7] bg-white px-3.5 py-3">
      <span className="block text-xs font-bold uppercase tracking-normal text-[#728087]">{label}</span>
      <strong className="mt-1 block wrap-break-word text-[15px] font-extrabold text-[#243139]">
        {value}
      </strong>
    </div>
  );
}

export default MembershipPage;
