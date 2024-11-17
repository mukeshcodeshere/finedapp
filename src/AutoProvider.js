// src/AuthProvider.js
import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

const AuthProvider = ({ children }) => {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN} // From Auth0 dashboard
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID} // From Auth0 dashboard
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProvider;
