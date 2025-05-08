export const apiFetch = async (url: string, options: RequestInit = {}) => {
    return fetch(`https://api.mountmerusoyco.rw${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  };