import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import StatusBanner from "../components/StatusBanner";
import Toolbar from "../components/Toolbar";
import MetricCards from "../components/MetricCards";
import OverallOrdersChart from "../components/charts/OverallOrdersChart";
import CircularChart from "../components/charts/CircularChart";
import StoreSelector from "../components/StoreSelector";
import OrdersPage from "../components/OrdersPage";
import SalesAnalytics from "../components/SalesAnalytics";
import FinancePage from "../components/FinancePage";
import CouriersPage from "../components/CouriersPage";
import ManageStore from "../components/ManageStore";
import StoreSettings from "../components/StoreSettings";
import MembershipPage from "../components/MembershipPage";
import { orderMixSeries, overallOrdersSeries, storeMixSeries } from "../data/sampleCharts";
import {
  disconnectMyShopifyStore,
  generateMyShopifyLinkToken,
  getMyShopifyData,
  loginDashboardUser,
  seedDashboardUsers,
  updateMyStoreSettings,
} from "../services/dashboardApi";
import { buildDashboardMetrics } from "../utils/dashboardMetrics";

const SESSION_KEY = "shopifyDashboardSession";

function readSavedSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

function ShopifyDashboardPage() {
  const [session, setSession] = useState(readSavedSession);
  const [users, setUsers] = useState(() => (session?.user ? [session.user] : []));
  const [stores, setStores] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedStoreKey, setSelectedStoreKey] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(session?.token));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [generatedToken, setGeneratedToken] = useState("");
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const [isDisconnectingStore, setIsDisconnectingStore] = useState(false);
  const [isSavingStoreSettings, setIsSavingStoreSettings] = useState(false);
  const lastLoadedSessionToken = useRef(null);

  const selectedUser = useMemo(
    () => users.find((user) => user._id === selectedUserId) || null,
    [selectedUserId, users]
  );

  const displayStores = useMemo(() => {
    if (stores.length > 0) {
      return stores;
    }

    return selectedData?.store ? [selectedData.store] : [];
  }, [selectedData?.store, stores]);

  const metrics = useMemo(
    () => buildDashboardMetrics({ users, stores: displayStores, selectedData }),
    [users, displayStores, selectedData]
  );

  const selectedStore = useMemo(() => {
    return (
      displayStores.find((store) => {
        const key = store.shopDomain || store.storeName || store._id;
        return key === selectedStoreKey;
      }) ||
      selectedData?.store ||
      displayStores[0] ||
      null
    );
  }, [displayStores, selectedData?.store, selectedStoreKey]);

  const updateDashboardData = useCallback((nextData) => {
    const nextUser = nextData?.user;

    if (!nextUser) {
      return;
    }

    const nextStores = Array.isArray(nextData.stores)
      ? nextData.stores
      : nextData.store
        ? [nextData.store]
        : [];
    const nextStore = nextData.store || nextStores[0] || null;
    const nextStoreKey = nextStore?.shopDomain || nextStore?.storeName || nextStore?._id || "";

    setUsers([nextUser]);
    setSelectedUserId(nextUser._id || "");
    setStores(nextStores);
    setSelectedStoreKey(nextStoreKey);
    setSelectedData(nextData);

    setSession((currentSession) => {
      if (!currentSession) {
        return currentSession;
      }

      const nextSession = { ...currentSession, user: nextUser };
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
      return nextSession;
    });
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setUsers([]);
    setStores([]);
    setSelectedData(null);
    setSelectedUserId("");
    setSelectedStoreKey("");
    setGeneratedToken("");
    setIsLoading(false);
  }, []);

  const loadDashboard = useCallback(async ({ seedIfEmpty = true } = {}) => {
    if (!session?.token) {
      return;
    }

    setError("");
    setIsRefreshing(true);

    try {
      if (seedIfEmpty) {
        await seedDashboardUsers();
      }

      const myData = await getMyShopifyData(session.token, selectedStoreKey);
      console.log("Fetched Shopify dashboard data for logged in user:", myData);

      const nextUser = myData.user || session.user;
      const nextStores = Array.isArray(myData.stores)
        ? myData.stores
        : myData.store
          ? [myData.store]
          : [];
      const nextStore = myData.store || nextStores[0] || null;
      const nextStoreKey = nextStore?.shopDomain || nextStore?.storeName || nextStore?._id || "";

      setUsers(nextUser ? [nextUser] : []);
      setStores(nextStores);
      setSelectedData(myData);
      setSelectedUserId(nextUser?._id || "");
      setSelectedStoreKey(nextStoreKey);

      const nextSession = { ...session, user: nextUser };
      setSession(nextSession);
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    } catch (loadError) {
      setError(loadError.message);
      if (loadError.message === "Login is required") {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [handleLogout, selectedStoreKey, session]);

  useEffect(() => {
    if (!session?.token || lastLoadedSessionToken.current === session.token) {
      return undefined;
    }

    lastLoadedSessionToken.current = session.token;
    loadDashboard();

    return undefined;
  }, [loadDashboard, session?.token]);

  async function handleLogin(credentials) {
    setError("");
    setIsLoading(true);

    try {
      await seedDashboardUsers();
      const nextSession = await loginDashboardUser(credentials);
      setSession(nextSession);
      setUsers(nextSession.user ? [nextSession.user] : []);
      setSelectedUserId(nextSession.user?._id || "");
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    } catch (loginError) {
      setError(loginError.message);
      setIsLoading(false);
    }
  }

  async function handleSelectStore(storeKey) {
    if (!storeKey) {
      return;
    }

    setSelectedStoreKey(storeKey);

    const localStore = displayStores.find((store) => {
      const currentKey = store.shopDomain || store.storeName || store._id;
      return currentKey === storeKey;
    });

    setSelectedData((currentData) => ({
      ...(currentData || {}),
      store: localStore || currentData?.store || null,
    }));

    if (!session?.token) {
      return;
    }

    try {
      const nextData = await getMyShopifyData(session.token, storeKey);
      updateDashboardData(nextData);
    } catch (selectError) {
      setError(selectError.message);
    }
  }

  async function handleGenerateToken() {
    if (!session?.token) {
      return "";
    }

    setError("");
    setIsGeneratingToken(true);

    try {
      const response = await generateMyShopifyLinkToken(session.token);
      setGeneratedToken(response.token);
      setUsers([response.user]);
      return response.token;
    } catch (tokenError) {
      setError(tokenError.message);
      return "";
    } finally {
      setIsGeneratingToken(false);
    }
  }

  async function handleDisconnectStore() {
    const storeKey = selectedStore?.shopDomain || selectedStore?.storeName || selectedStore?._id;

    if (!session?.token || !storeKey) {
      return false;
    }

    const shouldDisconnect = window.confirm(
      `Disconnect ${selectedStore?.storeName || "this Shopify store"} from the logged in dashboard user?`
    );

    if (!shouldDisconnect) {
      return false;
    }

    setError("");
    setIsDisconnectingStore(true);

    try {
      const nextData = await disconnectMyShopifyStore(session.token, storeKey);
      setGeneratedToken("");
      updateDashboardData(nextData);
      return true;
    } catch (disconnectError) {
      setError(disconnectError.message);
      return false;
    } finally {
      setIsDisconnectingStore(false);
    }
  }

  async function handleSaveStoreSettings(settings) {
    const storeKey = selectedStore?.shopDomain || selectedStore?.storeName || selectedStore?._id;

    if (!session?.token || !storeKey) {
      return false;
    }

    setError("");
    setIsSavingStoreSettings(true);

    try {
      const nextData = await updateMyStoreSettings(session.token, storeKey, settings);
      updateDashboardData({
        ...selectedData,
        user: nextData.user,
        stores: displayStores.map((store) => {
          const currentKey = store.shopDomain || store.storeName || store._id;
          return currentKey === storeKey ? nextData.store : store;
        }),
        store: nextData.store,
      });
      return true;
    } catch (settingsError) {
      setError(settingsError.message);
      return false;
    } finally {
      setIsSavingStoreSettings(false);
    }
  }

  const connectionLabel = selectedStore
    ? `${selectedStore.storeName || selectedStore.shopDomain} is selected`
    : "No Shopify store connected for the selected user";

  if (!session?.token) {
    return <LoginView error={error} isLoading={isLoading} onLogin={handleLogin} />;
  }

  return (
    <main className="grid min-h-screen min-w-[320px] grid-cols-[270px_minmax(0,1110px)] bg-white font-[Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-[#243139] max-[980px]:grid-cols-1">
      <Sidebar activeSection={activeSection} onSelectSection={setActiveSection} />

      <section className="min-h-screen border-l-8 border-white bg-[#f6f6f6] pb-6 max-[980px]:border-l-0">
        <div className="flex min-h-18 w-full items-center justify-end gap-3 bg-[#fb7b25] px-5 text-white max-[720px]:min-h-13.5 max-[720px]:justify-between">
          <span className="text-sm font-bold tracking-normal">
            Logged in as {selectedUser?.username || session.user?.username}
          </span>
          <button
            className="min-h-8 rounded border border-white/60 bg-white/15 px-3 py-1 text-sm font-bold text-white"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <StatusBanner
          connected={Boolean(selectedStore)}
          label={connectionLabel}
          shopUrl={selectedStore?.shopDomain}
        />

        {error ? (
          <p className="m-2 rounded-[5px] border border-[#ffc8b9] bg-[#fff1ed] px-3.5 py-3 font-bold text-[#a5321e]">
            {error}
          </p>
        ) : null}

        <Toolbar
          onRefresh={() => loadDashboard({ seedIfEmpty: false })}
          isRefreshing={isRefreshing}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        <StoreSelector
          stores={displayStores}
          selectedStoreKey={selectedStore?.shopDomain || selectedStore?.storeName || selectedStore?._id || selectedStoreKey}
          onSelectStore={handleSelectStore}
          connectedStores={metrics.connectedStores}
        />

        {isLoading ? (
          <section className="m-2 rounded-[5px] border border-[#dedede] bg-white px-3.5 py-3 font-bold text-[#4c5a61]">
            Loading Shopify dashboard data...
          </section>
        ) : activeTab === "manage-store" || activeSection === "manage-store" ? (
          <ManageStore
            generatedToken={generatedToken}
            isDisconnecting={isDisconnectingStore}
            isGenerating={isGeneratingToken}
            onDisconnect={handleDisconnectStore}
            onGenerateToken={handleGenerateToken}
            selectedUser={selectedUser}
            store={selectedStore}
          />
        ) : activeTab === "store-settings" || activeSection === "store-settings" ? (
          <StoreSettings
            key={selectedStore?.shopDomain || selectedStore?.storeName || "store-settings"}
            isSaving={isSavingStoreSettings}
            onSave={handleSaveStoreSettings}
            selectedStore={selectedStore}
          />
        ) : activeTab === "all-orders" || activeSection === "orders" ? (
          <OrdersPage orders={metrics.orders} currency={metrics.currency} />
        ) : activeSection === "membership" ? (
          <MembershipPage selectedStore={selectedStore} stores={displayStores} />
        ) : activeTab === "sales-analytics" ? (
          <SalesAnalytics orders={metrics.orders} currency={metrics.currency} />
        ) : activeTab === "finance" ? (
          <FinancePage orders={metrics.orders} currency={metrics.currency} />
        ) : activeTab === "couriers" ? (
          <CouriersPage />
        ) : (
          <>
            <MetricCards metrics={metrics} />

            <OverallOrdersChart series={overallOrdersSeries} />

            <section className="mx-2 grid grid-cols-2 gap-5.5 max-[720px]:grid-cols-1">
              <CircularChart title="Order Status Share" series={orderMixSeries} variant="pie" />
              <CircularChart title="Store Connection Share" series={storeMixSeries} variant="donut" />
            </section>
          </>
        )}
      </section>
    </main>
  );
}

function LoginView({ error, isLoading, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onLogin({ username, password });
  }

  return (
    <main className="grid min-h-screen min-w-[320px] place-items-center bg-[#f6f6f6] px-4 font-[Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-[#243139]">
      <form
        className="grid w-full max-w-95 gap-4 rounded-[5px] border border-[#dedede] bg-white p-6 shadow-[0_14px_34px_rgba(36,49,57,0.10)]"
        onSubmit={handleSubmit}
      >
        <div>
          <h1 className="text-2xl font-extrabold tracking-normal text-[#172026]">Shopify Dashboard Login</h1>
          <p className="mt-1 text-sm font-medium text-[#5d6970]">Login is required to open your dashboard.</p>
        </div>

        {error ? (
          <p className="rounded-[5px] border border-[#ffc8b9] bg-[#fff1ed] px-3 py-2 text-sm font-bold text-[#a5321e]">
            {error}
          </p>
        ) : null}

        <label className="grid gap-1.5 text-sm font-bold text-[#26333a]">
          Username
          <input
            className="min-h-10 rounded border border-[#dfe3e5] px-3 font-medium"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label className="grid gap-1.5 text-sm font-bold text-[#26333a]">
          Password
          <input
            className="min-h-10 rounded border border-[#dfe3e5] px-3 font-medium"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <button
          className="min-h-10 rounded border border-[#e86c1b] bg-[#fb7b25] px-4 py-2 font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-65"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}

export default ShopifyDashboardPage;
