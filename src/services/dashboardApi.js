const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok || !data.success) {
    if (data?.message) {
      throw new Error(data.message);
    }

    throw new Error(
      `API request failed (${response.status}) for ${url}. Check that the backend server is running with the latest routes.`
    );
  }

  return data;
}

export async function getDashboardUsers() {
  const response = await request("/api/users");
  return response.data;
}

export async function seedDashboardUsers() {
  const response = await request("/api/users/seed", { method: "POST" });
  return response.data;
}

export async function loginDashboardUser({ username, password }) {
  const response = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  return {
    token: response.token,
    user: response.data,
  };
}

function storeQuery(storeKey) {
  return storeKey ? `?shopDomain=${encodeURIComponent(storeKey)}` : "";
}

export async function getMyShopifyData(token, storeKey = "") {
  const response = await request(`/api/auth/me/shopify-data${storeQuery(storeKey)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function generateMyShopifyLinkToken(token) {
  const response = await request("/api/auth/me/token", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    token: response.token,
    user: response.data,
  };
}

export async function disconnectMyShopifyStore(token, storeKey) {
  const response = await request(
    `/api/auth/me/stores/${encodeURIComponent(storeKey)}/disconnect`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shopDomain: storeKey }),
    }
  );

  return response.data;
}

export async function disconnectMyPrimaryShopifyStore(token) {
  const response = await request("/api/auth/me/disconnect-shopify", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function updateMyStoreSettings(token, storeKey, settings) {
  const response = await request(`/api/auth/me/stores/${encodeURIComponent(storeKey)}/settings`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...settings,
      shopDomain: storeKey,
    }),
  });

  return response.data;
}

export async function getUserShopifyData(userId, storeKey = "") {
  const response = await request(`/api/users/${userId}/shopify-data${storeQuery(storeKey)}`);
  return response.data;
}

export async function getAllStores() {
  const response = await request("/api/stores");
  return response.data;
}
