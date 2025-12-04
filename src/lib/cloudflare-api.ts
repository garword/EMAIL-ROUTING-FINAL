import { db } from "@/lib/db";

export async function getCloudflareConfig() {
  try {
    const config = await db.cloudflareConfig.findFirst();
    return config;
  } catch (error) {
    console.error("Error fetching Cloudflare config:", error);
    return null;
  }
}

export async function callCloudflareAPI(
  endpoint: string,
  method: string = "GET",
  body?: Record<string, any>
) {
  const config = await getCloudflareConfig();

  if (!config) {
    throw new Error("Cloudflare config tidak ditemukan. Silakan setup API Config terlebih dahulu.");
  }

  const url = `https://api.cloudflare.com/client/v4${endpoint}`;
  const headers: HeadersInit = {
    "Authorization": `Bearer ${config.apiToken}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudflare API Error:", data);
      throw new Error(data.errors?.[0]?.message || "Cloudflare API Error");
    }

    return data;
  } catch (error) {
    console.error("Error calling Cloudflare API:", error);
    throw error;
  }
}
