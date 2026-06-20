import { useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Calendar,
  Check,
  ChevronUp,
  Clock,
  Copy,
  CreditCard,
  FileSpreadsheet,
  FileText,
  Grid,
  LayoutGrid,
  List,
  RefreshCcw,
  RotateCcw,
  Search,
  Send,
  Settings,
  ShoppingBag,
  Store,
  Truck,
  XCircle,
} from "lucide-react";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "sales-analytics", label: "Sales Analytics", icon: "analytics" },
  { id: "finance", label: "Finance", icon: "wallet" },
  { id: "couriers", label: "Couriers", icon: "truck" },
  { id: "all-orders", label: "All Orders", icon: "shoppingBag" },
  { id: "manage-store", label: "Manage Store", icon: "store" },
  { id: "store-settings", label: "Store Settings", icon: "settings" },
];
const orderTabs = [
  { label: "All Orders", icon: "orders" },
  { label: "Pending", icon: "clock" },
  { label: "Verified Orders", icon: "verified" },
  { label: "Fake Orders", icon: "alert" },
  { label: "Duplicate", icon: "copy" },
  { label: "Dispatched", icon: "send" },
  { label: "Cancelled", icon: "cancel" },
];


const buttonClass =
  "inline-flex min-h-[34px] cursor-pointer items-center justify-center whitespace-nowrap rounded border border-[#d4d9dd] px-[14px] py-[7px] text-[13px] leading-none font-semibold text-[#49565e] transition-[border-color,background,color,transform] duration-[160ms] ease-in-out  disabled:cursor-not-allowed disabled:opacity-65";
const rowClass =
  "mx-2 mb-[7px] flex gap-2 border border-[#e0e0e0] bg-white px-[10px] py-[9px] max-[720px]:grid max-[720px]:grid-cols-1 max-[720px]:items-stretch max-[720px]:p-2.5";
const tabToneClasses = [
  "border-[#7edda9] bg-[#bdf0d5] text-[#117a43] hover:bg-[#a9ecc7] hover:text-[#0f6d3d]",
  "border-[#80c6dd] bg-[#b8e4f2] text-[#135f78] hover:bg-[#a7ddec] hover:text-[#0f566d]",
  "border-[#b291df] bg-[#d8c5f3] text-[#67429a] hover:bg-[#ccb4ef] hover:text-[#5b358f]",
  "border-[#e28aa9] bg-[#f6bed3] text-[#99435f] hover:bg-[#f2abc6] hover:text-[#863851]",
  "border-[#f7c46b] bg-[#fdf0cc] text-[#8f5b04] hover:bg-[#f9dd9a] hover:text-[#6d4d15]",
  "border-[#99d8c8] bg-[#d4f3ea] text-[#11635c] hover:bg-[#b7ebdc] hover:text-[#0f574d]",
  "border-[#d9b4ff] bg-[#efe2ff] text-[#5a328d] hover:bg-[#dcc9ff] hover:text-[#4e2780]",
];

const iconMap = {
  dashboard: Grid,
  analytics: BarChart3,
  wallet: CreditCard,
  truck: Truck,
  chevronUp: ChevronUp,
  calendar: Calendar,
  search: Search,
  fileXls: FileSpreadsheet,
  filePdf: FileText,
  refresh: RefreshCcw,
  reset: RotateCcw,
  pages: LayoutGrid,
  orders: List,
  clock: Clock,
  verified: BadgeCheck,
  alert: AlertTriangle,
  copy: Copy,
  send: Send,
  cancel: XCircle,
  check: Check,
  shoppingBag: ShoppingBag,
  store: Store,
  settings: Settings,
};

function Icon({ name, className = "w-4 h-4" }) {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;

  return <IconComponent className={`shrink-0 ${className}`} size={16} />;
}

function Toolbar({ onRefresh, isRefreshing, activeTab, onSelectTab }) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      <section className={`${rowClass} items-center justify-between`}>
        <div className="flex flex-wrap items-center gap-1.75">
          {tabs.map((tab, index) => (
            <button
              className={`relative ${buttonClass} min-h-8 ${tabToneClasses[index]} ${activeTab === tab.id ? "scale-[1.02] shadow-sm" : "opacity-90"}`}
              type="button"
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
            >
              {activeTab === tab.id ? (
                <span className="absolute -right-2 -top-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#dbf2df] text-[#1f6f3d] shadow-sm">
                  <Icon name="check" className="size-3" />
                </span>
              ) : null}
              <Icon name={tab.icon} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <button
          className={`${buttonClass} min-w-32 max-[720px]:w-full`}
          type="button"
          onClick={() => setShowFilters((visible) => !visible)}
          aria-expanded={showFilters}
        >
          <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
          <Icon
            name="chevronUp"
            className={`size-3.5 text-[#fb7b25] transition-transform duration-200 ${showFilters ? "-rotate-180" : ""}`}
          />
        </button>
      </section>

      <section className={`${rowClass} flex-wrap items-center`}>
        <button className={buttonClass} type="button">
          <span>Today Results</span>
          <Icon name="calendar" />
        </button>
        <label className="relative max-w-130 flex-[1_1_280px] max-[720px]:w-full max-[720px]:max-w-none">
          <span className="sr-only">Search orders</span>
          <input
            className="min-h-8 w-full rounded border border-[#dfe3e5] bg-white py-1 pr-9.5 pl-3.5 font-inherit text-[#26333a]"
            placeholder="Search anything here"
          />
          <Icon name="search" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#c9ced2]" />
        </label>
        <button className={`${buttonClass} min-w-10 border-[#086b56] bg-[#098569] px-2 py-1 text-[10px] font-black text-white! hover:bg-[#08765d] hover:text-white!`} type="button" aria-label="Export spreadsheet">
          <Icon name="fileXls" className="size-4" />
          <span>XLS</span>
        </button>
        <button className={`${buttonClass} min-w-10 border-[#d82847] bg-[#ed3052] px-2 py-1 text-[10px] font-black text-white! hover:bg-[#d92747] hover:text-white!`} type="button" aria-label="Export PDF">
          <Icon name="filePdf" className="size-4" />
          <span>PDF</span>
        </button>
        <button className={`${buttonClass} border-[#073e8d] bg-[#094eaf] text-white! hover:bg-[#084798] hover:text-white!`} type="button" onClick={onRefresh} disabled={isRefreshing}>
          <span>{isRefreshing ? "Refreshing" : "Refresh"}</span>
          <Icon name="refresh" />
        </button>
        <button className={`${buttonClass} border-[#d82847] text-white bg-[#d92747] `} type="button">
          <span>Reset</span>
          <Icon name="reset" />
        </button>
        <button className={`${buttonClass} border-[#7a32df] text-[#7043c9] ring-2 ring-[#7a32df] ring-offset-0`} type="button">
          <Icon name="pages" />
          <span>50/Pages</span>
        </button>
      </section>

      {showFilters ? (
        <section className={`${rowClass} flex-wrap items-center py-2`}>
          {orderTabs.map((tab) => (
            <button className={`${buttonClass} min-w-23`} type="button" key={tab.label}>
              <Icon name={tab.icon} className="size-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </section>
      ) : null}
    </>
  );
}

export default Toolbar;
