import { ServiceProvider } from "@/types/service";

export const API_URL = "http://localhost:5000";

export async function getServices(): Promise<ServiceProvider[]> {
  const res = await fetch(`${API_URL}/serviceproviders`);
  return res.json();
}