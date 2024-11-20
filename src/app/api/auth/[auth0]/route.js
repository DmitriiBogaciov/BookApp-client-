import { handleAuth, handleCallback } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  callback: handleCallback({
    afterCallback: async (req, session, state) => {
      console.log("state: ", state);
      const returnTo = state?.returnTo || '/';
      return {
        ...session,
        returnTo,
      };
    }
  }),
  onError(req, error) {
    console.error('Auth0 Error:', error);
  }
});