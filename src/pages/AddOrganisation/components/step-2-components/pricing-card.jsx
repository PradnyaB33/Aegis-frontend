// import { AddCircle, QuestionMark } from "@mui/icons-material";
// import { IconButton } from "@mui/material";
// import React, { useState } from "react";
// import BasicButton from "../../../../components/BasicButton";
// import PackageInfo from "../../../../components/Modal/PackagesModal/package-info";
// const array = [
//   {
//     packageName: "Access control",
//     Basic: "✓",
//     Intermediate: "✓",
//     Enterprise: "✓",
//     Fullskape: "✓",
//   },
//   {
//     packageName: "Dual approval workflow",
//     Basic: "✓",
//     Intermediate: "✓",
//     Enterprise: "✓",
//   },
//   {
//     packageName: "Employee onboarding / offboarding",
//     Basic: "✓",
//     Intermediate: "✓",
//     Enterprise: "✓",
//     Fullskape: "✓",
//   },
//   {
//     packageName: "Department creation",
//     Basic: "✓",
//     Intermediate: "✓",
//     Enterprise: "✓",
//     Fullskape: "✓",
//   },
//   {
//     packageName: "Dashboard",
//     Basic: "✓",
//     Intermediate: "✓",
//     Enterprise: "✓",
//     Fullskape: "✓",
//   },
// ];
 
// const PricingCard = ({
//   h1 = "Basic Plan",
//   price = 55,
//   mapArray = array,
//   downDescriptionText = "Click to 11 more packages",
//   onChange = () => null,
//   packageId,
//   value,
//   disabled = false,
//   button = true,
// }) => {
//   const [confirmOpen, setConfirmOpen] = useState(false);

//   return (
//     <div
//       className={`group shadow-xl w-full max-w-[270px]  relative rounded-lg bg-white p-[20px] flex flex-col gap-2 border hover:border-brand/primary-blue ${
//         value?.packageId === packageId
//           ? "border-brand/primary-blue" // Highlight selected card
//           : "border-Brand-washed-blue/brand-washed-blue-8"
//       }`}
//       onClick={() => {
//         if (!disabled) {
//           onChange({ packageName: h1, packageId });
//         }
//       }}
//     >
//       <IconButton
//         color="info"
//         className="h-8 w-8 !absolute !bg-[#1414fe] right-4 top-4"
//         aria-label="check"
//         onClick={() => setConfirmOpen(true)}
//       >
//         <QuestionMark className="text-white text-xs" />
//       </IconButton>
//       <div className="flex-grow">
//         <h1 className="text-2xl font-medium">{h1}</h1>
//         <h3 className="text-lg font-bold">
//           ₹ {price} <span className="text-sm font-medium">/emp</span>
//         </h3>
//         <div className="text-sm">billed quarterly</div>
//         <div className="flex flex-col gap-2 text-sm">
//           {mapArray.map((doc, key) => (
//             <div key={key} className="flex gap-2">
//               <div className="w-6 h-6 text-center">✓</div>
//               <div className="text-Brand-washed-blue/brand-washed-blue-10">
//                 {doc?.packageName}
//               </div>
//             </div>
//           ))}
//           <div
//             className="flex gap-2 text-[#1414fe] cursor-pointer"
//             onClick={async () => setConfirmOpen(true)}
//           >
//             <div className="w-6 h-6 text-center ">
//               <AddCircle className="text-xs" fontSize="small" />
//             </div>
//             <div>{downDescriptionText}</div>
//           </div>
//         </div>
//       </div>
//       {button && (
//         <div className="w-full">
//           <BasicButton
//             className="!w-[100%]"
//             title={"Get Started"}
//             type="submit"
//             disabled={disabled}
//           />
//         </div>
//       )}
//       <PackageInfo
//         open={confirmOpen}
//         handleClose={() => {
//           setConfirmOpen(false);
//         }}
//       />
//     </div>
//   );
// };

// export default PricingCard;

import React, { useState } from "react";
import { AddCircle, QuestionMark } from "@mui/icons-material";
import { IconButton, Modal, Box } from "@mui/material";
import BasicButton from "../../../../components/BasicButton";

const tiers = [
  { tier: "Tier 1", students: 25, price: 16 },
  { tier: "Tier 2", students: 50, price: 14 },
  { tier: "Tier 3", students: 200, price: 12 },
];

const PricingCard = ({
  h1 = "Basic Plan",
  price = 55,
  mapArray = [],
  downDescriptionText = "Click to view more packages",
  onChange = () => null,
  packageId,
  value,
  disabled = false,
  button = true,
  onTierSelect = () => null,
  isFullskape = false, // New prop to handle Fullskape-specific logic
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    if (isFullskape && !selectedTier) {
      return; // Prevent modal from closing if no tier is selected
    }
    setOpenModal(false);
    setSelectedTier(null);
  };

  const handleTierSelect = (tier) => {
    setSelectedTier(tier);
    onChange({
      packageName: h1,
      packageId,
      price: tier.price, // Include selected tier price
      tier: tier.tier,   // Optional: include tier details
    });
    onTierSelect(tier.price); // Update display if needed
    setOpenModal(false);
  };
  

  return (
    <div
      className={`group shadow-xl w-full max-w-[270px] relative rounded-lg bg-white p-[20px] flex flex-col gap-2 border hover:border-brand/primary-blue ${
        value?.packageId === packageId
          ? "border-brand/primary-blue"
          : "border-Brand-washed-blue/brand-washed-blue-8"
      }`}
      onClick={() => {
        if (!disabled) {
          onChange({ packageName: h1, packageId });
        }
      }}
    >
      <IconButton
        color="info"
        className="h-8 w-8 !absolute !bg-[#1414fe] right-4 top-4"
        aria-label="check"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <QuestionMark className="text-white text-xs" />
      </IconButton>
      <div className="flex-grow">
        <h1 className="text-2xl font-medium">{h1}</h1>
        <h3 className="text-lg font-bold">
          {selectedTier?.price || price}{" "}
          <span className="text-sm font-medium">{isFullskape ? "/stu" : "/emp"}</span>
        </h3>
        <div className="text-sm">billed quarterly</div>
        <div className="flex flex-col gap-2 text-sm">
          {mapArray.map((doc, key) => (
            <div key={key} className="flex gap-2">
              <div className="w-6 h-6 text-center">✓</div>
              <div className="text-Brand-washed-blue/brand-washed-blue-10">
                {doc?.packageName}
              </div>
            </div>
          ))}
          <div
            className="flex gap-2 text-[#1414fe] cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal();
            }}
          >
            <div className="w-6 h-6 text-center">
              <AddCircle className="text-xs" fontSize="small" />
            </div>
            <div>{downDescriptionText}</div>
          </div>
        </div>
      </div>
      {button && (
        <div className="w-full">
          <BasicButton
            className="!w-[100%]"
            title={"Get Started"}
            type="submit"
            disabled={isFullskape && !selectedTier} // Disable until tier is selected for Fullskape
          />
        </div>
      )}
      {/* Modal for Tier Cards */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            width: "90%",
            maxWidth: 400,
            p: 4,
          }}
        >
          <div className="flex flex-col items-center">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className="p-4 mb-4 border rounded-lg shadow-md w-full cursor-pointer hover:bg-blue-50"
                onClick={() => handleTierSelect(tier)}
              >
                <h3 className="text-lg font-bold">{tier.tier}</h3>
                <p className="text-sm">
                  {tier.students} students at ₹{tier.price}/student
                </p>
              </div>
            ))}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default PricingCard;
