const iconPaths = {
  store: (
    <>
      <path d="M4 10h16" />
      <path d="M5 10 6.5 4h11L19 10" />
      <path d="M6 10v10h12V10" />
      <path d="M9 20v-5h6v5" />
      <path d="M8 13h1" />
      <path d="M15 13h1" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
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

function StoreSelector({ stores, selectedStoreKey, onSelectStore, connectedStores }) {
  const visibleStores = stores.slice(0, 6);
  const buttonClass =
    "inline-flex min-h-[34px] cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded border border-[#d4d9dd] bg-white px-[14px] py-[7px] text-[13px] leading-none font-semibold text-[#49565e] transition-[border-color,background,color,transform] duration-[160ms] ease-in-out hover:border-[#f57c24] hover:text-[#172026] disabled:cursor-not-allowed disabled:opacity-65";

  return (
    <section className="mx-2 mb-1.75 flex items-center justify-between gap-2 border border-[#e0e0e0] bg-white px-4.5 py-2 max-[720px]:grid max-[720px]:grid-cols-1 max-[720px]:items-stretch max-[720px]:p-2.5">
      <div className="flex flex-wrap items-center gap-1.75">
        {visibleStores.map((store) => {
          const storeKey = store.shopDomain || store.storeName || store._id;

          return (
          <button
            className={`${buttonClass} ${
              selectedStoreKey === storeKey ? "border-[#f57c24] text-[#172026] shadow-[inset_0_-2px_0_#f57c24]" : ""
            }`}
            type="button"
            key={storeKey}
            onClick={() => onSelectStore(storeKey)}
          >
            <Icon name="store" />
            <span>{store.storeName || store.shopDomain}</span>
          </button>
          );
        })}
        {visibleStores.length === 0 ? (
          <span className="text-sm font-bold text-[#5d6970]">No connected stores yet</span>
        ) : null}
      </div>
      <div className="ml-auto flex items-center gap-2 text-[15px] font-medium text-[#26333a] max-[720px]:ml-0">
        <span className="inline-flex size-3.5 rounded-full bg-[#15c96a] shadow-[0_0_0_4px_rgba(21,201,106,0.12)]" />
        {connectedStores} Store {connectedStores === 1 ? "Connected" : "Connected"}
      </div>
      <button
        className={`${buttonClass} size-9.25 min-h-9.25 rounded-lg border-[#e86c1b] p-0 text-white! bg-[#e86c1b]!`}
        type="button"
        aria-label="Add store"
      >
        <Icon name="plus" className="size-5" />
      </button>
    </section>
  );
}

export default StoreSelector;
