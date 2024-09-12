import { getAccessToken } from '@auth0/nextjs-auth0';

interface FetchOptions {
  id?: string;
  revalidate?: number; 
  useToken?: boolean; 
}

export const fetchGraphQL = async (query: string, variables: any, options: FetchOptions = {}) => {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (options.useToken) {
      const { accessToken } = await getAccessToken();
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const body = JSON.stringify({
      query,
      variables,
    });

    const fetchOptions: RequestInit = {
      method: 'POST',
      headers,
      body,
      ...(options.revalidate !== undefined
        ? { next: { revalidate: options.revalidate } } // если revalidate указано, используем кэш
        : { cache: 'no-store' }), // отключаем кэш, если revalidate не указано
    };

    const response = await fetch(`${process.env.API}`, fetchOptions);
    const { data } = await response.json();

    if (!data) {
      throw new Error('No data found');
    }

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};
