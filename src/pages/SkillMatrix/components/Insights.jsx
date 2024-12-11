// Insights.jsx
import React from 'react';

const Insights = ({ userRole }) => {
  return (
    <div>
      <h2>My Insights</h2>
      <p>Summary of logged-in user's insights here.</p>

      {userRole === 'HR' || userRole === 'Manager' ? (
        <div>
          <h2>My Team's Insights</h2>
          <p>Team insights visible for authorized users.</p>
        </div>
      ) : null}

      {userRole === 'Super Admin' || userRole === 'HR' ? (
        <div>
          <h2>Organization Insights</h2>
          <p>Full organization insights visible for Super Admin/HR only.</p>
        </div>
      ) : null}
    </div>
  );
};

export default Insights;
