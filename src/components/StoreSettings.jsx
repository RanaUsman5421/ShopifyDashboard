import { useEffect, useMemo, useState } from "react";

const defaultSettings = {
  defaultCourier: "M&P",
  defaultWeight: "0.5",
  orderBooking: "Manual",
};

const settingsGroups = [
  {
    key: "defaultCourier",
    title: "Default Courier",
    description: "Used as the selected courier when booking orders.",
    options: ["M&P", "Leopards", "TCS", "BarqRaftaar", "Trax"],
  },
  {
    key: "defaultWeight",
    title: "Default Weight",
    description: "Used when an order or product does not include a weight.",
    options: ["0.5", "1", "1.5", "2", "2.5", "3"],
    suffix: "kg",
  },
  {
    key: "orderBooking",
    title: "Order Booking",
    description: "Controls whether orders are booked automatically or manually.",
    options: ["Auto", "Manual"],
  },
];

const buttonClass =
  "inline-flex min-h-[38px] cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded border px-4 py-2 text-sm leading-none font-bold transition-[border-color,background,color,transform] duration-[160ms] ease-in-out disabled:cursor-not-allowed disabled:opacity-65";

function normalizeSettings(settings) {
  return {
    ...defaultSettings,
    ...(settings || {}),
  };
}

function StoreSettings({ isSaving, onSave, saveError, selectedStore }) {
  const savedSettings = useMemo(
    () => normalizeSettings(selectedStore?.settings),
    [selectedStore?.settings]
  );
  const [draftSettings, setDraftSettings] = useState(savedSettings);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setDraftSettings(savedSettings);
    setMessage("");
  }, [savedSettings]);

  const hasChanges = settingsGroups.some(
    (group) => draftSettings[group.key] !== savedSettings[group.key]
  );
  const hasValidWeight = /^\d+(\.\d{1,2})?$/.test(draftSettings.defaultWeight)
    && Number(draftSettings.defaultWeight) > 0;

  function updateSetting(key, value) {
    setDraftSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }));
    setMessage("");
  }

  async function handleSave() {
    if (!hasValidWeight) {
      setMessage("Enter a valid default weight.");
      return;
    }

    setMessage("");
    const saved = await onSave(draftSettings);

    if (saved) {
      setMessage("Settings saved.");
    }
  }

  return (
    <section className="mx-2 grid gap-4">
      <div className="border border-[#e0e0e0] bg-white px-5 py-4">
        <div className="flex items-start justify-between gap-3 max-[720px]:grid max-[720px]:grid-cols-1">
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-[#fb7b25]">Store Settings</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-normal text-[#172026]">
              Default order settings
            </h2>
            <p className="mt-1 text-sm font-medium text-[#5d6970]">
              Save default courier, fallback order weight, and booking mode for {selectedStore?.storeName || "the selected store"}.
            </p>
          </div>
          <button
            className={`${buttonClass} border-[#e86c1b] bg-[#fb7b25] text-white hover:bg-[#e86c1b]`}
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || !hasValidWeight || isSaving}
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>

        {saveError ? (
          <p className="mt-4 rounded border border-[#ffc8b9] bg-[#fff1ed] px-3 py-2 text-sm font-bold text-[#a5321e]">
            {saveError}
          </p>
        ) : message ? (
          <p className="mt-4 rounded border border-[#cfe8d8] bg-[#f0fbf4] px-3 py-2 text-sm font-bold text-[#117a43]">
            {message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-3">
        {settingsGroups.map((group) => (
          <section className="border border-[#e0e0e0] bg-white px-5 py-4" key={group.key}>
            <div className="flex items-start justify-between gap-3 max-[720px]:grid max-[720px]:grid-cols-1">
              <div>
                <h3 className="text-lg font-extrabold text-[#172026]">{group.title}</h3>
                <p className="mt-1 text-sm font-medium text-[#5d6970]">{group.description}</p>
              </div>
              <span className="inline-flex min-h-8 items-center rounded border border-[#f5d6c1] bg-[#fff6ed] px-3 py-1 text-sm font-extrabold text-[#9a4a12]">
                {draftSettings[group.key]}
                {group.suffix ? ` ${group.suffix}` : ""}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {group.options.map((option) => {
                const isSelected = draftSettings[group.key] === option;

                return (
                  <button
                    className={`${buttonClass} ${
                      isSelected
                        ? "border-[#e86c1b] bg-[#fb7b25] text-white"
                        : "border-[#d4d9dd] bg-white text-[#49565e] hover:border-[#f57c24] hover:text-[#172026]"
                    }`}
                    type="button"
                    key={option}
                    onClick={() => updateSetting(group.key, option)}
                    aria-pressed={isSelected}
                  >
                    {option}
                    {group.suffix ? ` ${group.suffix}` : ""}
                  </button>
                );
              })}
            </div>

            {group.key === "defaultWeight" ? (
              <label className="mt-4 grid max-w-72 gap-1.5 text-sm font-bold text-[#26333a]">
                Manual Weight
                <div className="relative">
                  <input
                    className="min-h-10 w-full rounded border border-[#dfe3e5] bg-white px-3 pr-10 font-medium text-[#243139] outline-none transition-[border-color,box-shadow] duration-160 ease-in-out focus:border-[#fb7b25] focus:shadow-[0_0_0_3px_rgba(251,123,37,0.14)]"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={draftSettings.defaultWeight}
                    onChange={(event) => updateSetting(group.key, event.target.value)}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-extrabold text-[#728087]">
                    kg
                  </span>
                </div>
              </label>
            ) : null}
          </section>
        ))}
      </div>
    </section>
  );
}

export default StoreSettings;
