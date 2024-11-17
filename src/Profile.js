// src/Profile.js
import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserData, saveUserData } from './db';

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Fetch user data from database
      getUserData(user.sub).then(data => {
        setUserData(data);
      });
    }
  }, [isAuthenticated, user]);

  const handleSaveData = () => {
    if (isAuthenticated && user) {
      saveUserData(user.sub, { someData: 'test' });
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      {userData && <p>Data: {JSON.stringify(userData)}</p>}
      <button onClick={handleSaveData}>Save Data</button>
    </div>
  );
};

export default Profile;
