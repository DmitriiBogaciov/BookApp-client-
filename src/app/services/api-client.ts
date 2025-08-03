import { auth0 } from "@/lib/auth0";

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
      const { token } = await auth0.getAccessToken();
      headers['Authorization'] = `Bearer ${token}`;
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
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorText = await response.text();
        console.error(`GraphQL API returned error: ${response.status} ${response.statusText}`);
        console.error(`Error details:`, errorText);
        
        // Попытаемся распарсить JSON для более детальной информации
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.errors && Array.isArray(errorJson.errors)) {
            const errorDetails = errorJson.errors.map((err: any) => err.message || err).join(', ');
            errorMessage = `GraphQL errors: ${errorDetails}`;
          } else if (errorJson.message) {
            errorMessage = `API error: ${errorJson.message}`;
          } else {
            errorMessage = `API error: ${errorText}`;
          }
        } catch {
          // Если не JSON, используем текст как есть
          errorMessage = `API error: ${errorText}`;
        }
      } catch (textError) {
        console.error('Could not read error response body:', textError);
      }
      
      throw new Error(errorMessage);
    }

    const { data, errors } = await response.json();

    if (errors && errors.length > 0) {
      console.error('GraphQL response contained errors:', errors);
      const errorMessages = errors.map((err: any) => err.message || JSON.stringify(err)).join(', ');
      throw new Error(`GraphQL errors: ${errorMessages}`);
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
