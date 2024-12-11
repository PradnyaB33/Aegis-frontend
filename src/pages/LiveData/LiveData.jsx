



// import React from 'react';
// import { Checkbox, TextField, Button, FormControlLabel, FormGroup, FormControl, RadioGroup, Radio, FormLabel } from '@mui/material';



// import Setup from "../SetUpOrganization/Setup";

// const LiveData = () => {

//   return (
//     <>
//       <Setup>
//         <section className="bg-gray-50 min-h-screen w-full p-8">
//          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla repellat ipsum vitae quas expedita, dolorem, consectetur, dolor culpa necessitatibus error harum dicta.</p>
//         </section>
//       </Setup>
//     </>
//   );
// };

// export default LiveData;

//old one for LiveData

// import React, { useState, useEffect } from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
// import Setup from "../SetUpOrganization/Setup";

// const LiveData = () => {
//   const [data, setData] = useState([]);


//   useEffect(() => {
   
//     const fetchData = async () => {
     
//       const response = await fetch('/api/liveData');
//       const result = await response.json();
//       setData(result);
//     };

//     fetchData();
//   }, []);

//   return (
//     <Setup>
//       <section className="bg-gray-50 min-h-screen w-full p-8">
//         <Typography variant="h4" gutterBottom>
//           Live Data Table
//         </Typography>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>ID</TableCell>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Value</TableCell>
             
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {data.map((row) => (
//                 <TableRow key={row.id}>
//                   <TableCell>{row.id}</TableCell>
//                   <TableCell>{row.name}</TableCell>
//                   <TableCell>{row.value}</TableCell>
                
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </section>
//     </Setup>
//   );
// };

// export default LiveData;


//Updated LiveData Code'
// import React, { useState, useEffect } from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
// import Setup from "../SetUpOrganization/Setup";

// const LiveData = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('/api/punch-records'); // Adjust this endpoint to match your backend
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const result = await response.json();
//         setData(result);
//       } catch (error) {
//         console.error('Fetch error:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <Setup>
//       <section className="bg-gray-50 min-h-screen w-full p-8">
//         <Typography variant="h4" gutterBottom>
//           Punch Live Records
//         </Typography>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Employee ID</TableCell>
//                 <TableCell>First Name</TableCell>
//                 <TableCell>Department</TableCell>
//                 <TableCell>Date</TableCell>
//                 <TableCell>Punch Time</TableCell>
//                 <TableCell>Punch State</TableCell>
//                 <TableCell>Area</TableCell>
//                 <TableCell>Serial Number</TableCell>
//                 <TableCell>Device Name</TableCell>
//                 <TableCell>Upload Time</TableCell>
//                 <TableCell>Actual Temperature</TableCell>
//                 <TableCell>Organization ID</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {data.map((row) => (
//                 <TableRow key={row._id}> {/* Use MongoDB's unique _id field as the key */}
//                   <TableCell>{row.employeeID}</TableCell>
//                   <TableCell>{row.firstName}</TableCell>
//                   <TableCell>{row.department}</TableCell>
//                   <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell> {/* Format the date */}
//                   <TableCell>{row.punchTime}</TableCell>
//                   <TableCell>{row.punchState}</TableCell>
//                   <TableCell>{row.area}</TableCell>
//                   <TableCell>{row.serialNumber}</TableCell>
//                   <TableCell>{row.deviceName}</TableCell>
//                   <TableCell>{new Date(row.uploadTime).toLocaleString()}</TableCell> {/* Format the upload time */}
//                   <TableCell>{row.actualTemperature}</TableCell>
//                   <TableCell>{row.organizationID}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </section>
//     </Setup>
//   );
// };

// export default LiveData;



import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import Setup from "../SetUpOrganization/Setup";

const LiveData = () => {
  const [data, setData] = useState([]);
  console.log("yaha hai mera deta",data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/route/live-data');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Setup>
      <section className="bg-gray-50 min-h-screen w-full p-8">
        <Typography variant="h4" gutterBottom>
          Live Data Records
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Punch Time</TableCell>
                <TableCell>Punch State</TableCell>
                <TableCell>Area</TableCell>
                <TableCell>Serial Number</TableCell>
                <TableCell>Device Name</TableCell>
                <TableCell>Upload Time</TableCell>
                <TableCell>Actual Temperature</TableCell>
                <TableCell>Organization ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.employeeID}</TableCell>
                  <TableCell>{row.firstName}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell> {/* Format the date */}
                  <TableCell>{row.punchTime}</TableCell>
                  <TableCell>{row.punchState}</TableCell>
                  <TableCell>{row.area}</TableCell>
                  <TableCell>{row.serialNumber}</TableCell>
                  <TableCell>{row.deviceName}</TableCell>
                  <TableCell>{new Date(row.uploadTime).toLocaleString()}</TableCell> {/* Format the upload time */}
                  <TableCell>{row.actualTemperature || 'N/A'}</TableCell> {/* Handle empty values */}
                  <TableCell>{row.organizationID}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>
    </Setup>
  );
};

export default LiveData;
