// import React, { useContext, useState } from "react";
// import Setup from "../../SetUpOrganization/Setup";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// // import { useParams } from "react-router-dom";

// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// import { UseContext } from "../../../State/UseState/UseContext";

// const CateringAndFoodSetup = () => {
//   const [formData, setFormData] = useState({
//     vendorUpload: false,
//     menuApproval: false,
//     hrApproval: false,
//     selectedDocuments: [],
//   });
//   const { organisationId } = useParams();
//   const { setAppAlert } = useContext(UseContext);

//   const documentOptions = [
//     "Bank Account",
//     "Food Catering License",
//     "Aadhar",
//     "PAN",
//     "Shop Image"
//   ];

//   const handleDocumentChange = (option) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedDocuments: prev.selectedDocuments.includes(option)
//         ? prev.selectedDocuments.filter((doc) => doc !== option)
//         : [...prev.selectedDocuments, option],
//     }));
//   };

//   const handleRadioChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/vendor/foodsetuppage/${organisationId}`,
//         { formData }
//       );

//       console.log(response.data.message); // Check the response structure here
//       setAppAlert({
//         alert: true,
//         type: "success",
//         // msg: "Setup page updated successfully.",
//         msg: response.data.message,
//       });
//     } catch (error) {
//       console.error("API error:", error.response);

//       setAppAlert({
//         show: true,
//         type: "error",
//         msg: error?.response?.data?.message || "Something went wrong.",
//       });
//     }

//   };

//   return (
//     <BoxComponent sx={{ p: 0 }}>
//       <Setup>
//         <div className="h-[90vh] overflow-y-auto scroll px-3">
//           <div className="xs:block sm:block md:flex justify-between items-center ">
//             <HeadingOneLineInfo
//               className="!my-3"
//               heading="Food And Catering Setup Page"
//               info="Setup Your Vendor Page"
//             />
//           </div>
//           <form
//             onSubmit={handleSubmit}
//             className="max-w- mx-auto p-6 bg-white shadow-md rounded-lg"
//           >
//             <h1 className="!text-xl flex justify-center pb-7 font-bold">
//               Food And Catering Setup Page
//             </h1>

//             <div>
//               <label className="block text-m font-medium text-gray-700 mb-2">
//                 Can vendors upload documents on their own?
//               </label>
//               <div className="flex justify-center gap-6">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     value="yes"
//                     checked={formData.vendorUpload}
//                     onChange={() => handleRadioChange("vendorUpload", true)}
//                     className="mr-2"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     value="no"
//                     checked={!formData.vendorUpload}
//                     onChange={() => handleRadioChange("vendorUpload", false)}
//                     className="mr-2"
//                   />
//                   No
//                 </label>
//               </div>
//             </div>

//             <div>
//               <label className="block text-m font-medium text-gray-700 mb-2">
//                 Can menu prices be approved by HR?
//               </label>
//               <div className="flex justify-center gap-6">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     value="yes"
//                     checked={formData.menuApproval}
//                     onChange={() => handleRadioChange("menuApproval", true)}
//                     className="mr-2"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     value="no"
//                     checked={!formData.menuApproval}
//                     onChange={() => handleRadioChange("menuApproval", false)}
//                     className="mr-2"
//                   />
//                   No
//                 </label>
//               </div>
//             </div>

//             <div>
//               <label className="block text-m font-medium text-gray-700 mb-2">
//                 Select documents that can be uploaded by vendors:
//               </label>
//               {documentOptions.map((option, index) => (
//                 <div
//                   key={index}
//                   className="mb-2 ml-0 sm:ml-2 md:ml-4 lg:ml-[412px]"
//                 >
//                   <input
//                     type="checkbox"
//                     id={option}
//                     checked={formData.selectedDocuments.includes(option)}
//                     onChange={() => handleDocumentChange(option)}
//                     className="mr-2"
//                   />
//                   <label htmlFor={option} className="text-gray-700">
//                     {option}
//                   </label>
//                 </div>
//               ))}
//             </div>

//             <div>
//               <label className="block text-m font-medium text-gray-700 mb-2">
//                 Do documents uploaded by vendors need approval by HR?
//               </label>
//               <div className="flex justify-center gap-6">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     value="yes"
//                     checked={formData.hrApproval}
//                     onChange={() => handleRadioChange("hrApproval", true)}
//                     className="mr-2"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     value="no"
//                     checked={!formData.hrApproval}
//                     onChange={() => handleRadioChange("hrApproval", false)}
//                     className="mr-2"
//                   />
//                   No
//                 </label>
//               </div>
//             </div>

//             <div className="flex justify-center mt-8">
//               <button
//                 type="submit"
//                 className="w-72 bg-[#1414fe] text-white py-2 rounded-md"
//               >
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//       </Setup>
//     </BoxComponent >
//   );
// };

// export default CateringAndFoodSetup;



// import React, { useContext, useState, useEffect } from "react";
// import Setup from "../../SetUpOrganization/Setup";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import { UseContext } from "../../../State/UseState/UseContext";

// const CateringAndFoodSetup = () => {
//   const [formData, setFormData] = useState({
//     vendorUpload: false,
//     menuApproval: false,
//     hrApproval: false,
//     selectedDocuments: [],
//   });
//   const { organisationId } = useParams();
//   const { setAppAlert } = useContext(UseContext);

//   const documentOptions = [
//     "Bank Account",
//     "Food Catering License",
//     "Aadhar",
//     "PAN",
//     "Shop Image",
//   ];

//   useEffect(() => {
//     // Fetch the vendor setup data on component mount
//     const fetchVendorSetupData = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/vendor/foodsetuppage/selecteddoc/${organisationId}`
//         );
//         const setupData = response.data.data;

//         // Populate the formData with the fetched data
//         setFormData({
//           vendorUpload: setupData.vendorUpload,
//           menuApproval: setupData.menuApproval,
//           hrApproval: setupData.hrApproval,
//           selectedDocuments: setupData.selectedDocuments,
//         });
//       } catch (error) {
//         console.error("Error fetching vendor setup data:", error);
//         setAppAlert({
//           alert: true,
//           type: "error",
//           // msg: error.response?.data?.message || "Something went wrong while fetching setup data.",
//         });
//       }
//     };

//     fetchVendorSetupData();
//   }, [organisationId, setAppAlert]);

//   const handleDocumentChange = (option) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedDocuments: prev.selectedDocuments.includes(option)
//         ? prev.selectedDocuments.filter((doc) => doc !== option)
//         : [...prev.selectedDocuments, option],
//     }));
//   };

//   const handleRadioChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/vendor/foodsetuppage/${organisationId}`,
//         { formData }
//       );

//       console.log(response.data.message); // Check the response structure here
//       setAppAlert({
//         alert: true,
//         type: "success",
//         msg: response.data.message,
//       });
//     } catch (error) {
//       console.error("API error:", error.response);

//       setAppAlert({
//         show: true,
//         type: "error",
//         msg: error?.response?.data?.message || "Something went wrong.",
//       });
//     }
//   };

//   return (
//     <BoxComponent sx={{ p: 0 }}>
//       <Setup>
//         <div className="h-[90vh] overflow-y-auto scroll px-3">
//           <div className="xs:block sm:block md:flex justify-between items-center ">
//             <HeadingOneLineInfo
//               heading={"Food And Catering Setup Page"}
//               info={"Setup Your Vendor Page"}
//             />
//           </div>

//           <form
//             onSubmit={handleSubmit}
//             className="max-w- mx-auto p-6 bg-white shadow-md rounded-lg"
//           >
         
//             {/* Vendor Upload Radio */}
//             <div>
//               <label className="block text-m font-medium text-gray-700 mb-2">
//                 Can vendors upload documents on their own?
//               </label>
//               <div className="flex justify-center gap-6">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     value="yes"
//                     checked={formData.vendorUpload}
//                     onChange={() => handleRadioChange("vendorUpload", true)}
//                     className="mr-2"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     value="no"
//                     checked={!formData.vendorUpload}
//                     onChange={() => handleRadioChange("vendorUpload", false)}
//                     className="mr-2"
//                   />
//                   No
//                 </label>
//               </div>
//             </div>

//             {/* Menu Approval Radio */}
//             <div>
//               <label className="block text-m font-medium text-gray-700 mb-2">
//                 Can menu prices be approved by HR?
//               </label>
//               <div className="flex justify-center gap-6">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     value="yes"
//                     checked={formData.menuApproval}
//                     onChange={() => handleRadioChange("menuApproval", true)}
//                     className="mr-2"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     value="no"
//                     checked={!formData.menuApproval}
//                     onChange={() => handleRadioChange("menuApproval", false)}
//                     className="mr-2"
//                   />
//                   No
//                 </label>
//               </div>
//             </div>

//             {/* Select Documents */}
//             <div>
//               <label className="block text-m font-medium text-gray-700 mb-2">
//                 Select documents that can be uploaded by vendors:
//               </label>
//               {documentOptions.map((option, index) => (
//                 <div
//                   key={index}
//                   className="mb-2 ml-0 sm:ml-2 md:ml-4 lg:ml-[412px]"
//                 >
//                   <input
//                     type="checkbox"
//                     id={option}
//                     checked={formData.selectedDocuments.includes(option)}
//                     onChange={() => handleDocumentChange(option)}
//                     className="mr-2"
//                   />
//                   <label htmlFor={option} className="text-gray-700">
//                     {option}
//                   </label>
//                 </div>
//               ))}
//             </div>

//             {/* HR Approval Radio */}
//             <div>
//               <label className="block text-m font-medium text-gray-700 mb-2">
//                 Do documents uploaded by vendors need approval by HR?
//               </label>
//               <div className="flex justify-center gap-6">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     value="yes"
//                     checked={formData.hrApproval}
//                     onChange={() => handleRadioChange("hrApproval", true)}
//                     className="mr-2"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     value="no"
//                     checked={!formData.hrApproval}
//                     onChange={() => handleRadioChange("hrApproval", false)}
//                     className="mr-2"
//                   />
//                   No
//                 </label>
//               </div>
//             </div>

//             <div className="flex justify-center mt-8">
//               <button
//                 type="submit"
//                 className="w-72 bg-[#1414fe] text-white py-2 rounded-md"
//               >
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//       </Setup>
//     </BoxComponent>
//   );
// };

// export default CateringAndFoodSetup;




import React, { useContext, useState, useEffect } from "react";
import Setup from "../../SetUpOrganization/Setup";
import axios from "axios";
import { useParams } from "react-router-dom";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import { UseContext } from "../../../State/UseState/UseContext";
import { FormControlLabel, Checkbox,Button } from "@mui/material"; // Import Material-UI components


const CateringAndFoodSetup = () => {
  const [formData, setFormData] = useState({
    vendorUpload: false,
    menuApproval: false,
    hrApproval: false,
    selectedDocuments: [],
  });
  const { organisationId } = useParams();
  const { setAppAlert } = useContext(UseContext);

  const documentOptions = [
    "Bank Account",
    "Food Catering License",
    "Aadhar",
    "PAN",
    "Shop Image",
  ];

  useEffect(() => {
    // Fetch the vendor setup data on component mount
    const fetchVendorSetupData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/vendor/foodsetuppage/selecteddoc/${organisationId}`
        );
        const setupData = response.data.data;

        // Populate the formData with the fetched data
        setFormData({
          vendorUpload: setupData.vendorUpload,
          menuApproval: setupData.menuApproval,
          hrApproval: setupData.hrApproval,
          selectedDocuments: setupData.selectedDocuments,
        });
      } catch (error) {
        console.error("Error fetching vendor setup data:", error);
        setAppAlert({
          alert: true,
          type: "error",
        });
      }
    };

    fetchVendorSetupData();
  }, [organisationId, setAppAlert]);

  const handleDocumentChange = (option) => {
    setFormData((prev) => ({
      ...prev,
      selectedDocuments: prev.selectedDocuments.includes(option)
        ? prev.selectedDocuments.filter((doc) => doc !== option)
        : [...prev.selectedDocuments, option],
    }));
  };

  const handleRadioChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/vendor/foodsetuppage/${organisationId}`,
        { formData }
      );

      console.log(response.data.message); // Check the response structure here
      setAppAlert({
        alert: true,
        type: "success",
        msg: response.data.message,
      });
    } catch (error) {
      console.error("API error:", error.response);

      setAppAlert({
        show: true,
        type: "error",
        msg: error?.response?.data?.message || "Something went wrong.",
      });
    }
  };

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center">
            <HeadingOneLineInfo
              heading={"Food And Catering "}
              info={"Vendor document and menu management settings"}
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className="max-w- mx-auto p-6 bg-white shadow-md rounded-lg"
          >
            {/* Vendor Upload Radio */}
            <div>
              <label className="block text-m font-medium text-gray-700 mb-2">
                Can vendors upload documents on their own?
              </label>
              <div className="flex justify-center gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="yes"
                    checked={formData.vendorUpload}
                    onChange={() => handleRadioChange("vendorUpload", true)}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="no"
                    checked={!formData.vendorUpload}
                    onChange={() => handleRadioChange("vendorUpload", false)}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            {/* Menu Approval Radio */}
            <div>
              <label className="block text-m font-medium text-gray-700 mb-2">
                Can menu prices be approved by HR?
              </label>
              <div className="flex justify-center gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="yes"
                    checked={formData.menuApproval}
                    onChange={() => handleRadioChange("menuApproval", true)}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="no"
                    checked={!formData.menuApproval}
                    onChange={() => handleRadioChange("menuApproval", false)}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            {/* Select Documents */}
            <div>
              <label className="block text-m font-medium text-gray-700 mb-2">
                Select documents that can be uploaded by vendors:
              </label>
              {documentOptions.map((option, index) => (
                <div
                  key={index}
                  className="mb-2 ml-0 sm:ml-2 md:ml-4 lg:ml-[412px]"
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.selectedDocuments.includes(option)}
                        onChange={() => handleDocumentChange(option)}
                        name={option}
                      />
                    }
                    label={option}
                  />
                </div>
              ))}
            </div>

            {/* HR Approval Radio */}
            <div>
              <label className="block text-m font-medium text-gray-700 mb-2">
                Do documents uploaded by vendors need approval by HR?
              </label>
              <div className="flex justify-center gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="yes"
                    checked={formData.hrApproval}
                    onChange={() => handleRadioChange("hrApproval", true)}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="no"
                    checked={!formData.hrApproval}
                    onChange={() => handleRadioChange("hrApproval", false)}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            
              {/* <button
                type="submit"
                className="w-72 bg-[#1414fe] text-white py-2 rounded-md"
              >
                Submit
              </button> */}

<Button type="submit" variant="contained" color="primary" sx={{ bgcolor: "#1414FE" }}>
              submit
              
              </Button>
           
          </form>
        </div>
      </Setup>
    </BoxComponent>
  );
};

export default CateringAndFoodSetup;
