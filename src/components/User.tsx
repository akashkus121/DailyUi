import React from "react";
import { useUser } from "../context/UserContext";

function UserProfile() {
  const { user } = useUser() || {};

  if (!user) return (
    <div className="user-profile-mini">
      <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>Guest Mode</p>
    </div>
  );

  return (
    <div className="user-profile-mini" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ textAlign: 'right' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>{user.name}</p>
        <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>Active</span>
      </div>
      <img 
        src={user.avatar} 
        alt="Avatar" 
        style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #6366f1' }} 
      />
    </div>
  );
}

export default UserProfile;