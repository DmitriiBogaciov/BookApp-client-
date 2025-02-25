import { getAccessToken } from '@auth0/nextjs-auth0';

interface FetchOptions {
  id?: string;
  revalidate?: number; 
  useToken?: boolean; 
}

export const fetchGraphQL = async (query: string, variables: any, options: FetchOptions = {}) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (options.useToken) {
    try {
      const { accessToken } = await getAccessToken();
      headers['Authorization'] = `Bearer ${accessToken}`;
    } catch (error) {
      console.error('Error fetching access token:', error);
      throw new Error('Failed to retrieve access token.');
    }
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
      ? { next: { revalidate: options.revalidate } }
      : { cache: 'no-store' }),
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BAOBOOX_API_GRAPHQL}`, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GraphQL API returned error: ${response.status} ${response.statusText}`);
      console.error(`Error details: ${errorText}`);
      throw new Error(`GraphQL API error: ${response.statusText}`);
    }

    const { data, errors } = await response.json();

    if (errors) {
      console.error('GraphQL response contained errors:', errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(errors)}`);
    }

    if (!data) {
      throw new Error('No data returned from GraphQL API.');
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchGraphQL:', error);
    throw error; 
  }
};
