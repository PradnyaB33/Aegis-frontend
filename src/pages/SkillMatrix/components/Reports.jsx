// Reports.jsx
import React from 'react';

const Reports = () => {
  return (
    <div>
      <h2>Generate Reports</h2>
      <select>
        <option>Skill Gap Analysis</option>
        <option>Employee Skill Distribution</option>
      </select>
      <button>Generate Report</button>
      <p>Downloadable reports will be available here.</p>
    </div>
  );
};

export default Reports;
