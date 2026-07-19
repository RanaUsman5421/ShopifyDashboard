import { useEffect, useMemo, useState } from "react";

const defaultSettings = {
  // Settings have been moved to the LionEx plugin Configuration page
  // (defaultCourier, defaultWeight, orderBooking)
};

const settingsGroups = [
  // All settings have been moved to the LionEx plugin Configuration page
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
  return (
    <section className="mx-2 grid gap-4">
      <div className="border border-[#e0e0e0] bg-white px-5 py-4">
        <div className="flex items-start justify-between gap-3 max-[720px]:grid max-[720px]:grid-cols-1">
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-[#fb7b25]">Store Settings</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-normal text-[#172026]">
              Settings Moved
            </h2>
            <p className="mt-1 text-sm font-medium text-[#5d6970]">
              Store settings including default courier, weight, and booking mode have been moved to the LionEx Plugin Configuration page for centralized management.
            </p>
          </div>
        </div>

        {saveError ? (
          <p className="mt-4 rounded border border-[#ffc8b9] bg-[#fff1ed] px-3 py-2 text-sm font-bold text-[#a5321e]">
            {saveError}
          </p>
        ) : null}
      </div>

      <div className="grid gap-3">
        <section className="border border-[#e0e0e0] bg-white px-5 py-4">
          <div className="flex items-start justify-between gap-3 max-[720px]:grid max-[720px]:grid-cols-1">
            <div>
              <h3 className="text-lg font-extrabold text-[#172026]">Configuration Location</h3>
              <p className="mt-1 text-sm font-medium text-[#5d6970]">
                To configure default courier, weight, and booking settings, please use the Configuration page in your LionEx Plugin.
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default StoreSettings;
