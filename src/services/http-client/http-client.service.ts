import { HttpMethod } from "./enum.http-client";
import { RequestType } from "./interface.http-client";

export class HTTPClient {
  static readonly DEFAULT_HEADERS: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0",
  };

  static async get(
    url: string,
    headers: Record<string, string> = {},
  ): Promise<RequestType> {
    return this.request(HttpMethod.GET, url, { headers });
  }

  static async post(
    url: string,
    data: object,
    headers: Record<string, string> = {},
  ): Promise<RequestType> {
    return this.request(HttpMethod.POST, url, {
      headers: { ...this.DEFAULT_HEADERS, ...headers },
      body: JSON.stringify(data),
    });
  }

  private static async request(
    method: HttpMethod,
    url: string,
    options: {
      headers?: Record<string, string>;
      body?: string;
    } = {},
  ): Promise<RequestType> {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method,
        url,
        data: options.body,
        headers: options.headers || {},
        onload: (response) => {
          if (response.status >= 200 && response.status < 300) {
            resolve(response.responseText);
          } else {
            reject(
              new Error(`HTTP ${response.status}: ${response.statusText}`),
            );
          }
        },
        onerror: () => reject(new Error("Network request failed")),
        ontimeout: () => reject(new Error("Request timed out")),
        onabort: () => reject(new Error("Request was aborted")),
      });
    });
  }
}
