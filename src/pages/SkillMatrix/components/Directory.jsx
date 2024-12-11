/* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from "react";
// import { useQuery } from "react-query";
// import axios from "axios";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import { useParams } from "react-router-dom";
// import useAuthToken from "../../../hooks/Token/useAuth";

// const Directory = () => {
//   const [skills, setSkills] = useState([]);
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();

//   const fetchSkills = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching skills:", error);
//       return { data: [] };
//     }
//   };

//   const { data, isLoading, isError } = useQuery("skills", fetchSkills);

//   useEffect(() => {
//     if (data && data.success && Array.isArray(data.data)) {
//       setSkills(data.data);
//     } else {
//       setSkills([]); // Default to empty array if data is invalid
//     }
//   }, [data]);

//   const onDragEnd = (result) => {
//     const { destination, source } = result;

//     if (!destination) return; // If no valid drop location, do nothing

//     const updatedSkills = Array.from(skills);
//     const [movedSkill] = updatedSkills.splice(source.index, 1);
//     updatedSkills.splice(destination.index, 0, movedSkill);

//     setSkills(updatedSkills); // Update the skills order
//   };

//   if (isLoading) return <p>Loading...</p>;
//   if (isError) return <p>Error loading skills.</p>;

//   return (
//     <div>
//       <h2>Directory</h2>
//       <p>List of skill categories, teams, or departments.</p>

//       <DragDropContext onDragEnd={onDragEnd}>
//         {/* Droppable wrapper */}
//         <Droppable droppableId="skills-list">
//           {(provided) => (
//             <ul
//               {...provided.droppableProps}
//               ref={provided.innerRef}
//               style={{ listStyle: "none", padding: 0 }}
//             >
//               {skills.map((skill, index) => (
//                 <Draggable
//                   key={skill._id} // Unique key from the backend data
//                   draggableId={skill._id} // Unique draggable ID
//                   index={index}
//                 >
//                   {(provided) => (
//                     <li
//                       ref={provided.innerRef}
//                       {...provided.draggableProps}
//                       {...provided.dragHandleProps}
//                       style={{
//                         padding: "8px",
//                         margin: "4px",
//                         backgroundColor: "#f0f0f0",
//                         borderRadius: "4px",
//                         ...provided.draggableProps.style,
//                       }}
//                     >
//                       {skill.skillName} {/* Display skill name */}
//                     </li>
//                   )}
//                 </Draggable>
//               ))}
//               {provided.placeholder}
//             </ul>
//           )}
//         </Droppable>
//       </DragDropContext>
//     </div>
//   );
// };

// export default Directory;

// //morning>
// import React, { useState, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "react-query";
// import axios from "axios";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import { useParams } from "react-router-dom";
// import useAuthToken from "../../../hooks/Token/useAuth";

// const Directory = () => {
//   const [skills, setSkills] = useState([]); // Nested skills by categories
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();
//   const queryClient = useQueryClient();

//   // Fetch skills grouped by subheadings (categories)
//   const fetchSkills = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching skills:", error);
//       return { data: [] };
//     }
//   };

//   const { data, isLoading, isError } = useQuery("skills", fetchSkills, {
//     refetchOnWindowFocus: false,
//   });

//   useEffect(() => {
//     if (data && data.success && Array.isArray(data.data)) {
//       // Group skills by category
//       const groupedSkills = data.data.reduce((acc, skill) => {
//         const category = skill.category || "Uncategorized";
//         acc[category] = acc[category] || [];
//         acc[category].push(skill);
//         return acc;
//       }, {});
//       setSkills(groupedSkills);
//     } else {
//       setSkills({});
//     }
//   }, [data]);

//   // Update the skill hierarchy after drag and drop
//   const updateSkills = async (newSkills) => {
//     try {
//       await axios.put(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills/reorder`,
//         { skills: newSkills },
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       queryClient.invalidateQueries("skills"); // Refresh skills
//     } catch (error) {
//       console.error("Error updating skills hierarchy:", error);
//     }
//   };

//   // const onDragEnd = (result) => {
//   //   const { source, destination } = result;

//   //   if (!destination) return;

//   //   const sourceCategory = source.droppableId;
//   //   const destinationCategory = destination.droppableId;

//   //   const updatedSkills = { ...skills };

//   //   const [movedSkill] = updatedSkills[sourceCategory].splice(source.index, 1);

//   //   if (sourceCategory === destinationCategory) {
//   //     updatedSkills[destinationCategory].splice(destination.index, 0, movedSkill);
//   //   } else {
//   //     updatedSkills[destinationCategory] = updatedSkills[destinationCategory] || [];
//   //     updatedSkills[destinationCategory].splice(destination.index, 0, movedSkill);
//   //   }

//   //   setSkills(updatedSkills);
//   //   updateSkills(updatedSkills); // Persist the changes
//   // };
//   const onDragEnd = (result) => {
//     const { destination, source } = result;
//     if (!destination) return;

//     const sourceGroup = groupedSkills[source.droppableId];
//     const destGroup = groupedSkills[destination.droppableId];

//     // Handle reordering within the same group
//     if (source.droppableId === destination.droppableId) {
//       const updatedGroup = Array.from(sourceGroup);
//       const [movedSkill] = updatedGroup.splice(source.index, 1);
//       updatedGroup.splice(destination.index, 0, movedSkill);

//       setSkills((prev) =>
//         prev.map((skill) =>
//           skill.groupName === source.droppableId ? updatedGroup : skill
//         )
//       );
//     } else {
//       // Handle moving between groups
//       const sourceCopy = Array.from(sourceGroup);
//       const destCopy = Array.from(destGroup);
//       const [movedSkill] = sourceCopy.splice(source.index, 1);

//       destCopy.splice(destination.index, 0, movedSkill);

//       setSkills((prev) =>
//         prev.map((skill) =>
//           skill.groupName === source.droppableId
//             ? sourceCopy
//             : skill.groupName === destination.droppableId
//             ? destCopy
//             : skill
//         )
//       );
//     }
//   };

//   if (isLoading) return <p>Loading...</p>;
//   if (isError) return <p>Error loading skills.</p>;

//   return (
//     <div>
//       <h2>Directory</h2>
//       <p>Manage skill categories and hierarchy.</p>
//       <DragDropContext onDragEnd={onDragEnd}>
//         {Object.keys(skills).map((category) => (
//           <Droppable key={category} droppableId={category}>
//             {(provided) => (
//               <div>
//                 <h3>{category}</h3>
//                 <ul
//                   {...provided.droppableProps}
//                   ref={provided.innerRef}
//                   style={{ listStyle: "none", padding: 0 }}
//                 >
//                   {skills[category].map((skill, index) => (
//                     <Draggable
//                       key={skill._id}
//                       draggableId={skill._id}
//                       index={index}
//                     >
//                       {(provided) => (
//                         <li
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           {...provided.dragHandleProps}
//                           style={{
//                             padding: "8px",
//                             margin: "4px",
//                             backgroundColor: "#f0f0f0",
//                             borderRadius: "4px",
//                             ...provided.draggableProps.style,
//                           }}
//                         >
//                           {skill.skillName}
//                         </li>
//                       )}
//                     </Draggable>
//                   ))}
//                   {provided.placeholder}
//                 </ul>
//               </div>
//             )}
//           </Droppable>
//         ))}
//       </DragDropContext>
//     </div>
//   );
// };

// export default Directory;

// import React, { useState, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "react-query";
// import axios from "axios";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import { useParams } from "react-router-dom";
// import useAuthToken from "../../../hooks/Token/useAuth";

// const Directory = () => {
//   const [groupedSkills, setGroupedSkills] = useState({});
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();
//   const queryClient = useQueryClient();

//   // Fetch skills grouped by groupName and subGroupName
//   const fetchSkills = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching skills:", error);
//       return { data: [] };
//     }
//   };

//   const { data, isLoading, isError } = useQuery("skills", fetchSkills, {
//     refetchOnWindowFocus: false,
//   });

//   useEffect(() => {
//     if (data && data.success && Array.isArray(data.data)) {
//       // Group skills by groupName and subGroupName
//       const skillsByGroup = data.data.reduce((acc, skill) => {
//         const group = skill.groupName || "Ungrouped";
//         const subGroup = skill.subGroupName || "No Subgroup";
//         acc[group] = acc[group] || {};
//         acc[group][subGroup] = acc[group][subGroup] || [];
//         acc[group][subGroup].push(skill);
//         return acc;
//       }, {});
//       setGroupedSkills(skillsByGroup);
//     } else {
//       setGroupedSkills({});
//     }
//   }, [data]);

//   // Update the skill hierarchy after drag-and-drop
//   const updateSkills = async (newSkills) => {
//     try {
//       await axios.put(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills/reorder`,
//         { skills: newSkills },
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       queryClient.invalidateQueries("skills"); // Refresh skills
//     } catch (error) {
//       console.error("Error updating skills hierarchy:", error);
//     }
//   };

//   const onDragEnd = (result) => {
//     const { source, destination } = result;
//     if (!destination) return;

//     const sourceGroup = groupedSkills[source.droppableId];
//     const destGroup = groupedSkills[destination.droppableId];

//     if (source.droppableId === destination.droppableId) {
//       // Reordering within the same group
//       const updatedGroup = Array.from(sourceGroup);
//       const [movedSkill] = updatedGroup.splice(source.index, 1);
//       updatedGroup.splice(destination.index, 0, movedSkill);

//       setGroupedSkills((prev) => ({
//         ...prev,
//         [source.droppableId]: updatedGroup,
//       }));
//     } else {
//       // Moving between groups
//       const sourceCopy = Array.from(sourceGroup);
//       const destCopy = Array.from(destGroup);
//       const [movedSkill] = sourceCopy.splice(source.index, 1);

//       destCopy.splice(destination.index, 0, movedSkill);

//       setGroupedSkills((prev) => ({
//         ...prev,
//         [source.droppableId]: sourceCopy,
//         [destination.droppableId]: destCopy,
//       }));
//     }

//     // Persist the updated hierarchy
//     const updatedSkills = Object.values(groupedSkills).flat();
//     updateSkills(updatedSkills);
//   };

//   if (isLoading) return <p>Loading...</p>;
//   if (isError) return <p>Error loading skills.</p>;

//   return (
//     <div>
//       <h2>Directory</h2>
//       <p>Manage skill categories and hierarchy.</p>
//       <DragDropContext onDragEnd={onDragEnd}>
//         {Object.keys(groupedSkills).map((group) => (
//           <div key={group}>
//             <h3>{group}</h3>
//             {Object.keys(groupedSkills[group]).map((subGroup) => (
//               <Droppable key={subGroup} droppableId={subGroup}>
//                 {(provided) => (
//                   <div>
//                     <h4>{subGroup}</h4>
//                     <ul
//                       {...provided.droppableProps}
//                       ref={provided.innerRef}
//                       style={{ listStyle: "none", padding: 0 }}
//                     >
//                       {groupedSkills[group][subGroup].map((skill, index) => (
//                         <Draggable
//                           key={skill._id}
//                           draggableId={skill._id}
//                           index={index}
//                         >
//                           {(provided) => (
//                             <li
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               style={{
//                                 padding: "8px",
//                                 margin: "4px",
//                                 backgroundColor: "#f0f0f0",
//                                 borderRadius: "4px",
//                                 ...provided.draggableProps.style,
//                               }}
//                             >
//                               {skill.skillName}
//                             </li>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                     </ul>
//                   </div>
//                 )}
//               </Droppable>
//             ))}
//           </div>
//         ))}
//       </DragDropContext>
//     </div>
//   );
// };

// export default Directory;

//✅

// import React, { useState, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "react-query";
// import axios from "axios";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import { useParams } from "react-router-dom";
// import useAuthToken from "../../../hooks/Token/useAuth";

// const Directory = () => {
//   const [groupedSkills, setGroupedSkills] = useState({});
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();
//   const queryClient = useQueryClient();

//   // Fetch skills grouped by groupName and subGroupName
//   const fetchSkills = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching skills:", error);
//       return { data: [] };
//     }
//   };

//   const { data, isLoading, isError } = useQuery("skills", fetchSkills, {
//     refetchOnWindowFocus: false,
//   });

//   useEffect(() => {
//     if (data && data.success && Array.isArray(data.data)) {
//       const skillsByGroup = data.data.reduce((acc, skill) => {
//         const group = skill.groupName || "Ungrouped";
//         const subGroup = skill.subGroupName || "No Subgroup";
//         acc[group] = acc[group] || {};
//         acc[group][subGroup] = acc[group][subGroup] || [];
//         acc[group][subGroup].push(skill);
//         return acc;
//       }, {});
//       setGroupedSkills(skillsByGroup);
//     } else {
//       setGroupedSkills({});
//     }
//   }, [data]);

//   // Update the skill hierarchy after drag-and-drop
//   const updateSkills = async (updatedGroupedSkills) => {
//     try {
//       const skillsPayload = [];
//       Object.keys(updatedGroupedSkills).forEach((group) => {
//         Object.keys(updatedGroupedSkills[group]).forEach((subGroup) => {
//           updatedGroupedSkills[group][subGroup].forEach((skill, index) => {
//             skillsPayload.push({
//               _id: skill._id,
//               groupName: group,
//               subGroupName: subGroup,
//               position: index,
//             });
//           });
//         });
//       });

//       await axios.put(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills/reorder`,
//         { skills: skillsPayload },
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       queryClient.invalidateQueries("skills"); // Refresh skills
//     } catch (error) {
//       console.error("Error updating skills hierarchy:", error);
//     }
//   };

//   const onDragEnd = (result) => {
//     const { source, destination } = result;
//     if (!destination) return;

//     const sourceGroup = source.droppableId.split("/");
//     const destGroup = destination.droppableId.split("/");

//     const sourceSkills = Array.from(
//       groupedSkills[sourceGroup[0]][sourceGroup[1]]
//     );
//     const destSkills =
//       sourceGroup[0] === destGroup[0] && sourceGroup[1] === destGroup[1]
//         ? sourceSkills
//         : Array.from(groupedSkills[destGroup[0]][destGroup[1]]);

//     const [movedSkill] = sourceSkills.splice(source.index, 1);
//     destSkills.splice(destination.index, 0, movedSkill);

//     const updatedGroupedSkills = {
//       ...groupedSkills,
//       [sourceGroup[0]]: {
//         ...groupedSkills[sourceGroup[0]],
//         [sourceGroup[1]]: sourceSkills,
//       },
//       [destGroup[0]]: {
//         ...groupedSkills[destGroup[0]],
//         [destGroup[1]]: destSkills,
//       },
//     };

//     setGroupedSkills(updatedGroupedSkills);
//     updateSkills(updatedGroupedSkills);
//   };

//   if (isLoading) return <p>Loading...</p>;
//   if (isError) return <p>Error loading skills.</p>;

//   return (
//     <div>
//       <h2>Directory</h2>
//       <p>Manage skill categories and hierarchy.</p>
//       <DragDropContext onDragEnd={onDragEnd}>
//         {Object.keys(groupedSkills).map((group) => (
//           <div key={group}>
//             <h3>{group}</h3>
//             {Object.keys(groupedSkills[group]).map((subGroup) => (
//               <Droppable
//                 key={`${group}/${subGroup}`}
//                 droppableId={`${group}/${subGroup}`}
//               >
//                 {(provided) => (
//                   <div>
//                     <h4>{subGroup}</h4>
//                     <ul
//                       {...provided.droppableProps}
//                       ref={provided.innerRef}
//                       style={{ listStyle: "none", padding: 0 }}
//                     >
//                       {groupedSkills[group][subGroup].map((skill, index) => (
//                         <Draggable
//                           key={skill._id}
//                           draggableId={skill._id}
//                           index={index}
//                         >
//                           {(provided) => (
//                             <li
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               style={{
//                                 padding: "8px",
//                                 margin: "4px",
//                                 backgroundColor: "#f0f0f0",
//                                 borderRadius: "4px",
//                                 ...provided.draggableProps.style,
//                               }}
//                             >
//                               {skill.skillName}
//                             </li>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                     </ul>
//                   </div>
//                 )}
//               </Droppable>
//             ))}
//           </div>
//         ))}
//       </DragDropContext>
//     </div>
//   );
// };

// export default Directory;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import useAuthToken from "../../../hooks/Token/useAuth";

const Directory = () => {
  const [groupedSkills, setGroupedSkills] = useState({});
  const { organisationId } = useParams();
  const authToken = useAuthToken();
  const queryClient = useQueryClient();

  // Fetch skills grouped by groupName and subGroupName
  const fetchSkills = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching skills:", error);
      return { data: [] };
    }
  };

  const { data, isLoading, isError } = useQuery("skills", fetchSkills, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data && data.success && Array.isArray(data.data)) {
      // Group skills by groupName and subGroupName
      const skillsByGroup = data.data.reduce((acc, skill) => {
        const group = skill.groupName || "Ungrouped";
        const subGroup = skill.subGroupName || "No Subgroup";
        acc[group] = acc[group] || {};
        acc[group][subGroup] = acc[group][subGroup] || [];
        acc[group][subGroup].push(skill);
        return acc;
      }, {});
      setGroupedSkills(skillsByGroup);
    } else {
      setGroupedSkills({});
    }
  }, [data]);

  // Update the skill hierarchy after drag-and-drop
  const updateSkills = async (updatedSkills) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills/reorder`,
        { skills: updatedSkills },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      queryClient.invalidateQueries("skills");
    } catch (error) {
      console.error("Error updating skills hierarchy:", error);
    }
  };

  // const onDragEnd = (result) => {
  //   const { source, destination } = result;
  //   if (!destination) return; // If dropped outside, do nothing

  //   // Get the group and subgroup names from droppableId
  //   const [sourceGroupName, sourceSubGroupName] = source.droppableId.split('-');
  //   const [destGroupName, destSubGroupName] = destination.droppableId.split('-');

  //   const sourceGroup = groupedSkills[sourceGroupName];
  //   const destGroup = groupedSkills[destGroupName];

  //   let updatedSourceGroup = [...sourceGroup[sourceSubGroupName]];
  //   let updatedDestGroup = [...destGroup[destSubGroupName]];

  //   // Reordering within the same group
  //   if (source.droppableId === destination.droppableId) {
  //     const [movedSkill] = updatedSourceGroup.splice(source.index, 1);
  //     updatedSourceGroup.splice(destination.index, 0, movedSkill);
  //     setGroupedSkills((prev) => ({
  //       ...prev,
  //       [sourceGroupName]: {
  //         ...prev[sourceGroupName],
  //         [sourceSubGroupName]: updatedSourceGroup,
  //       },
  //     }));
  //   } else {
  //     // Moving between groups
  //     const [movedSkill] = updatedSourceGroup.splice(source.index, 1);
  //     updatedDestGroup.splice(destination.index, 0, movedSkill);

  //     setGroupedSkills((prev) => ({
  //       ...prev,
  //       [sourceGroupName]: {
  //         ...prev[sourceGroupName],
  //         [sourceSubGroupName]: updatedSourceGroup,
  //       },
  //       [destGroupName]: {
  //         ...prev[destGroupName],
  //         [destSubGroupName]: updatedDestGroup,
  //       },
  //     }));
  //   }

  //   // Prepare updated skills for the backend
  //   const updatedSkills = Object.entries(groupedSkills).flatMap(([group, subGroups]) => {
  //     return Object.entries(subGroups).flatMap(([subGroup, skills]) => {
  //       return skills.map((skill, index) => ({
  //         ...skill,
  //         groupName: group,
  //         subGroupName: subGroup,
  //         position: index,
  //       }));
  //     });
  //   });

  //   // Send the updated skills to the backend
  //   updateSkills(updatedSkills);
  // };

  // const onDragEnd = (result) => {
  //   const { source, destination } = result;
  //   if (!destination) return; // If dropped outside, do nothing

  //   // Retrieve source and destination groups
  //   const sourceGroup = groupedSkills[source.droppableId];
  //   const destGroup = groupedSkills[destination.droppableId];

  //   // Ensure we are moving the skill between groups or within the same group
  //   const sourceCopy = Array.from(sourceGroup[source.droppableId]);
  //   const destCopy = Array.from(destGroup[destination.droppableId]);

  //   // Moving within the same group
  //   if (source.droppableId === destination.droppableId) {
  //     const [movedSkill] = sourceCopy.splice(source.index, 1);
  //     sourceCopy.splice(destination.index, 0, movedSkill);

  //     // Update groupedSkills state to reflect the new order
  //     setGroupedSkills((prev) => ({
  //       ...prev,
  //       [source.droppableId]: sourceCopy,
  //     }));

  //     // Prepare the updated skills list to be sent to the backend
  //     const updatedSkills = sourceCopy.map((skill, index) => ({
  //       ...skill,
  //       position: index, // Update position
  //       groupName: source.droppableId, // Maintain groupName
  //       subGroupName: skill.subGroupName || "No Subgroup", // Ensure subGroupName is sent
  //     }));

  //     // Call the backend to update skill order
  //     updateSkills(updatedSkills);

  //   } else {
  //     // Moving between different groups
  //     const [movedSkill] = sourceCopy.splice(source.index, 1);
  //     destCopy.splice(destination.index, 0, movedSkill);

  //     // Update groupedSkills state to reflect the new order in both groups
  //     setGroupedSkills((prev) => ({
  //       ...prev,
  //       [source.droppableId]: sourceCopy,
  //       [destination.droppableId]: destCopy,
  //     }));

  //     // Prepare the updated skills list to be sent to the backend
  //     const updatedSkills = [
  //       ...sourceCopy.map((skill, index) => ({
  //         ...skill,
  //         position: index,
  //         groupName: source.droppableId,
  //         subGroupName: skill.subGroupName || "No Subgroup",
  //       })),
  //       ...destCopy.map((skill, index) => ({
  //         ...skill,
  //         position: index,
  //         groupName: destination.droppableId,
  //         subGroupName: skill.subGroupName || "No Subgroup",
  //       })),
  //     ];

  //     // Call the backend to update skill order
  //     updateSkills(updatedSkills);
  //   }
  // };
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    // Extract groupName and subGroupName from droppableId
    const [sourceGroupName, sourceSubGroupName] = source.droppableId.split("-");
    const [destGroupName, destSubGroupName] =
      destination.droppableId.split("-");

    const sourceGroup = groupedSkills[sourceGroupName];
    const destGroup = groupedSkills[destGroupName];

    // Ensure the group and subgroup exist
    if (!sourceGroup || !destGroup) return;

    let updatedSourceGroup = [...sourceGroup[sourceSubGroupName]];
    let updatedDestGroup = [...destGroup[destSubGroupName]];

    // Moving within the same group
    if (source.droppableId === destination.droppableId) {
      const [movedSkill] = updatedSourceGroup.splice(source.index, 1);
      updatedSourceGroup.splice(destination.index, 0, movedSkill);

      setGroupedSkills((prev) => ({
        ...prev,
        [sourceGroupName]: {
          ...prev[sourceGroupName],
          [sourceSubGroupName]: updatedSourceGroup,
        },
      }));
    } else {
      // Moving between different groups
      const [movedSkill] = updatedSourceGroup.splice(source.index, 1);
      updatedDestGroup.splice(destination.index, 0, movedSkill);

      setGroupedSkills((prev) => ({
        ...prev,
        [sourceGroupName]: {
          ...prev[sourceGroupName],
          [sourceSubGroupName]: updatedSourceGroup,
        },
        [destGroupName]: {
          ...prev[destGroupName],
          [destSubGroupName]: updatedDestGroup,
        },
      }));
    }

    // Prepare updated skills list to be sent to the backend
    const updatedSkills = [
      ...updatedSourceGroup.map((skill, index) => ({
        ...skill,
        position: index,
        groupName: sourceGroupName,
        subGroupName: sourceSubGroupName,
      })),
      ...updatedDestGroup.map((skill, index) => ({
        ...skill,
        position: index,
        groupName: destGroupName,
        subGroupName: destSubGroupName,
      })),
    ];

    // Call the backend to update skill order
    updateSkills(updatedSkills);
  };

  // Helper function to update skills in backend
  // const updateSkills = async (updatedSkills) => {
  //   try {
  //     await axios.put(
  //       `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills/reorder`,
  //       { skills: updatedSkills },
  //       {
  //         headers: {
  //           Authorization: authToken,
  //         },
  //       }
  //     );
  //     queryClient.invalidateQueries("skills"); // Refetch the skills to sync the UI
  //   } catch (error) {
  //     console.error("Error updating skills hierarchy:", error);
  //   }
  // };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading skills.</p>;

  return (
    // <div>
    //   <h2>Directory</h2>
    //   <p>Manage skill categories and hierarchy.</p>
    //   <DragDropContext onDragEnd={onDragEnd}>
    //     {Object.keys(groupedSkills).map((group) => (
    //       <div key={group}>
    //         <h3>{group}</h3>
    //         {Object.keys(groupedSkills[group]).map((subGroup) => (
    //           <Droppable key={subGroup} droppableId={`${group}-${subGroup}`}>
    //             {(provided) => (
    //               <div>
    //                 <h4>{subGroup}</h4>
    //                 <ul
    //                   {...provided.droppableProps}
    //                   ref={provided.innerRef}
    //                   style={{ listStyle: "none", padding: 0 }}
    //                 >
    //                   {groupedSkills[group][subGroup].map((skill, index) => (
    //                     <Draggable key={skill._id} draggableId={skill._id} index={index}>
    //                       {(provided) => (
    //                         <li
    //                           ref={provided.innerRef}
    //                           {...provided.draggableProps}
    //                           {...provided.dragHandleProps}
    //                           style={{
    //                             padding: "8px",
    //                             margin: "4px",
    //                             backgroundColor: "#f0f0f0",
    //                             borderRadius: "4px",
    //                             ...provided.draggableProps.style,
    //                           }}
    //                         >
    //                           {skill.skillName}
    //                         </li>
    //                       )}
    //                     </Draggable>
    //                   ))}
    //                   {provided.placeholder}
    //                 </ul>
    //               </div>
    //             )}
    //           </Droppable>
    //         ))}
    //       </div>
    //     ))}
    //   </DragDropContext>
    // </div>

    <div>
      <h2>Directory</h2>
      <p>Manage skill categories and hierarchy.</p>
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.keys(groupedSkills).map((group) => (
          <div key={group} style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.5rem", color: "#333" }}>{group}</h3>
            {Object.keys(groupedSkills[group]).map((subGroup) => (
              <Droppable key={subGroup} droppableId={`${group}-${subGroup}`}>
                {(provided) => (
                  <div
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      backgroundColor: "#f9f9f9",
                    }}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <h4 style={{ fontSize: "1.2rem", color: "#555" }}>
                      {subGroup}
                    </h4>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      {groupedSkills[group][subGroup].map((skill, index) => (
                        <Draggable
                          key={skill._id}
                          draggableId={skill._id}
                          index={index}
                        >
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                padding: "8px",
                                margin: "4px 0",
                                backgroundColor: "#f0f0f0",
                                borderRadius: "4px",
                                cursor: "move",
                                ...provided.draggableProps.style,
                              }}
                            >
                              {skill.skillName}
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        ))}
      </DragDropContext>
    </div>
  );
};

export default Directory;
