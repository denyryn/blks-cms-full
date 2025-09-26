import config from "./config";

export default class Fetcher {
  constructor(baseUrl = config.apiUrl) {
    this.baseUrl = baseUrl;
  }

  static async csrf() {
    await fetch(`${config.apiUrl}/sanctum/csrf-cookie`, {
      method: "GET",
      credentials: "include",
    });
  }

  static async fetch(url, options = {}, isJSON = true) {
    const response = await fetch(`${config.apiUrl}${url}`, {
      ...options,
      headers: {
        ...(isJSON ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {}),
      },
      credentials: "include",
    });
    const data = await response.json();
    return { response, data };
  }
}
