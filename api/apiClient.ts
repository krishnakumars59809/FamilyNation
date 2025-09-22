const API_BASE = process.env.VITE_API_BASE || 'http://localhost:4000/api';
console.log("API_BASE:", API_BASE);

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
    try {
  const res = await fetch(API_BASE + endpoint, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error: ${res.status} - ${errorText}`);
  }

  return res.json();
    } catch (error) {
        console.error("API Client Error:", error);
        throw error;
    }

}
