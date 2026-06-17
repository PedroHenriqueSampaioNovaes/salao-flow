const URL_BASE = process.env.API_URL;

type FetchOptions = Omit<RequestInit, 'method' | 'headers' | 'body'> & {
  token?: string;
  body?: unknown;
};

export default class FetchApi {
  static async get<T>(url: string, options: Omit<FetchOptions, 'body'> = {}) {
    const response = await fetch(`${URL_BASE}${url}`, {
      method: 'GET',
      headers: {
        Authorization: options.token ? `Bearer ${options.token}` : '',
      } as HeadersInit,
      ...options,
    });

    return await FetchApi.extractData<T>(response);
  }

  static async post<T>(url: string, options: FetchOptions = {}) {
    const response = await fetch(`${URL_BASE}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: options.token ? `Bearer ${options.token}` : '',
      } as HeadersInit,
      body: options.body ? JSON.stringify(options.body) : null,
    });

    return await FetchApi.extractData<T>(response);
  }

  static async patch<T>(url: string, options: FetchOptions = {}) {
    const response = await fetch(`${URL_BASE}${url}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: options.token ? `Bearer ${options.token}` : '',
      } as HeadersInit,
      body: options.body ? JSON.stringify(options.body) : null,
    });

    return await FetchApi.extractData<T>(response);
  }

  static async delete<T>(url: string, token?: string) {
    const response = await fetch(`${URL_BASE}${url}`, {
      method: 'DELETE',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      } as HeadersInit,
    });

    return await FetchApi.extractData<T>(response);
  }

  private static async extractData<T>(response: Response) {
    let content;

    try {
      content = await response.json();
    } catch {
      if (!response.ok) {
        throw new Error(
          `Ocorreu um erro inesperado com o servidor. Tente novamente mais tarde.`,
        );
      }

      return null;
    }

    if (!response.ok) {
      throw new Error(content?.message);
    }

    return content as T;
  }
}
