/* eslint-disable no-unused-vars */
import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useContext, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate ,useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import useOrg from "../../../State/Org/Org";
import PackageInfo from "../../../components/Modal/PackagesModal/package-info";
import useGetUser from "../../../hooks/Token/useUser";
import { packageArray } from "../../../utils/Data/data";
import { packagesArray } from "./data";
import PricingCard from "./step-2-components/pricing-card";
import BasicButton from "../../../components/BasicButton";

const Step4 = ({ prevStep }) => {
  // to define state , hook , import other function
  const [confirmOpen, setConfirmOpen] = useState(false); 
  const data = useOrg();
  const { handleAlert } = useContext(TestContext);
  const navigate = useNavigate();
  const { authToken, decodedToken } = useGetUser();
  const [selectedPlan, setselectedPlan] = useState('');
  const config = {
    headers: {
      Authorization: authToken,
    },
  };
  // const { organisationId } = useOrg();
  // to define the handleForm function to add organization
  const handleForm = async () => {
    if (data.packageInfo === undefined) {
      return "Please Select Plan And Package";
    }

    let totalPrice =
      getPriceMain * data?.count -
      (data?.verifyToken?.discount
        ? Number((getPriceMain * data?.count) / data?.verifyToken?.discount) ??
        0
        : 0);
    const mainData = {
      ...data,
      coupan: data?.verifyToken?.coupan,
      packageInfo: data?.packageInfo?.packageName,
      totalPrice: totalPrice + totalPrice * 0.02,
      // selectedPlan: selectedPlan, 
      selectedPlan,
    };

    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/organization`,
      mainData,
      config
    );
    return response?.data;
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: handleForm,
    onSuccess: async (data) => {
      console.log('API Response Data:', data);
      console.log("Skill Matrix Plan Sent:",selectedPlan);
     

      if (data?.paymentType === "Phone_Pay") {
        window.location.href = data?.redirectUrl;
      } else if (data?.paymentType === "RazorPay") {
        const options = {
          key: data?.key,
          amount: data?.order?.amount,
          currency: "INR",
          name: "Aegis Plan for software", //your business name
          description: "Get Access to all premium keys",
          image: data?.organization?.image,
          order_id: data?.order?.id, //This
          callback_url: data?.callbackURI, 
          prefill: {
            name: `${decodedToken?.user?.first_name} ${decodedToken?.user?.last_name}`, //your customer's name
            email: decodedToken?.user?.email,
            contact: decodedToken?.user?.phone_number,
          },
          notes: {
            address:
              "C503, The Onyx-Kalate Business Park, near Euro School, Shankar Kalat Nagar, Wakad, Pune, Pimpri-Chinchwad, Maharashtra 411057",
          },
          theme: {
            color: "#1976d2",
          },
          modal: {
            ondismiss: function () {
              console.log("Checkout form closed by the user");
            },
          },         
        };
        const razor = new window.Razorpay(options);
        razor.open();
      } else {

        console.log('Organization Data:', data?.org?._id);
        handleAlert(true, "success", data?.message);
        //
        // navigate("/organizationList");
        // navigate("/setup")
        // navigate(`/organisation/${data?.organization?.id}/setup/add-roles`);
          
         navigate(`/organisation/${data?.org?._id}/setup/add-roles`);

        // if (organisationId) {
        //   navigate(`/organisation/${organisationId}/setup/add-roles`);
        // } else {
        //   console.error("Organisation ID not found");
        //   handleAlert(true, "error", "Organisation ID not found");
        // }

      }
    },
    onError: async (data) => {
      console.error(`🚀 ~ file: mini-form.jsx:48 ~ data:`, data);
      console.log(data?.response?.data?.message);
      handleAlert(
        true,
        "error",
        data?.response?.data?.message || "Please fill all mandatory field"
      );
    },
  });

  const getPackagesPrice = packagesArray
    .filter((item) => data?.packages?.find((pkg) => item?.label === pkg.label))
    .reduce((acc, item) => acc + item.price, 0);


const calculateFinalPrice = () => {

  // console.log("Selected Skill Matrix Plan:", data?.selectedPlan);
  console.log("Selected Skill Matrix Plan:", selectedPlan); // Direct reference instead of data?.selectedPlan
  console.log("Included Packages:", data?.packages);
  // Calculate the base price based on the package and count
  let basePrice = getPriceMain * data?.count;

  // Calculate the discount if available
  let discount = 0;
  if (data?.verifyToken?.discount) {
    discount = (basePrice * data?.verifyToken?.discount) / 100;
  }

  // Get the Skills Matrix package details from the packagesArray
  const skillMatrixPackage = packagesArray.find(pkg => pkg.label === "Skills Matrix");

 
  let skillMatrixCost = 0;

  // Check if the Skills Matrix module is selected and handle pricing accordingly
  if (data?.packages?.some(pkg => pkg.label === "Skills Matrix")) {
    console.log("Available Skills Matrix Plans:", skillMatrixPackage?.plans);
    const selectedPlan = skillMatrixPackage?.plans?.find(
      plan => plan.name === selectedPlan 
    );

    if (selectedPlan) {
      if (selectedPlan.name === "SM No Cost") {
        
        skillMatrixCost = 0;
      } else if (selectedPlan.name === "Alliance") {
       
        skillMatrixCost = selectedPlan.price * data?.count;
      }
    }
  }

  // Calculate the final price by subtracting the discount, adding the skill matrix cost, and including the 2% additional charge
  const finalPrice = basePrice - discount + skillMatrixCost + (basePrice * 0.02);
  return finalPrice;
};





  // to define the function for package calculation
  const getPriceMain = useMemo(() => {
    
  
    const expirationDate = moment().add(3 * data?.cycleCount, "months");
    const dateDifference = expirationDate.diff(moment(), "days");
  
    if (data?.packageInfo?.packageName === "Basic Plan") {
      const perDayPrice = 55 / dateDifference;
      return Math.round(perDayPrice * dateDifference);
    } else if (data?.packageInfo?.packageName === "Essential Plan") {
      const perDayPrice = 30 / dateDifference;
      return Math.round(perDayPrice * dateDifference);
    } else if (data?.packageInfo?.packageName === "Intermediate Plan") {
      const perDayPrice = 85 / dateDifference;
      return Math.round(perDayPrice * dateDifference);
    } else if (data?.packageInfo?.packageName === "Fullskape Plan") {
      let perDayPrice;
      if (data.count <= 25) {
        perDayPrice = 16 / dateDifference;
      } else if (data.count >= 26 && data.count <= 199) {
        perDayPrice = 14 / dateDifference;
      } else if (data.count <= 200) {
        perDayPrice = 12 / dateDifference;
      }
      return Math.round(perDayPrice * dateDifference);
    } else {
      return 115 + Number(getPackagesPrice) ?? 0;
    }

  }, [data?.cycleCount, data?.packageInfo?.packageName, data?.count, getPackagesPrice]);
  if (!data?.packageInfo) {

    return "Please Select Plan And Package";
  }
 
  if (isLoading) {
    return <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="70vh"
    >
      <CircularProgress />
    </Box>;

  }
  return (
    <div className="grid bg-[#f8fafb] rounded-md items-center">
      <div className="gap-4 flex flex-col items-center">
        <div className="">
          <h2 className="font-semibold text-gray-500 text-xl text-center">
            Your Package Pricing
          </h2>
          <p className="text-gray-500 text-center">
            {`You have selected the ${data?.packageInfo?.packageName} package.`}
          </p>
          <p className="text-gray-500 text-center">
            {data?.verifyToken?.discount ? (
              <>
                Base Price: ₹{(getPriceMain * data?.count).toFixed(2)} <br />
                Discount: {data?.verifyToken?.discount}% <br />
                <span className="font-semibold">
                  Total Price After Discount and Charges: ₹
                  {calculateFinalPrice().toFixed(2)}
                </span>
              </>
            ) : (
              <>
                {/* Base Price: ₹{(getPriceMain * data?.count).toFixed(2)} <br /> */}
                <span className="font-semibold">
                  Total Price: ₹{calculateFinalPrice().toFixed(2)}
                </span>
              </>
            )}
          </p>
        </div>
        <div className="flex flex-col gap-2 !row-span-4">
          <PricingCard
            setConfirmOpen={setConfirmOpen}
            h1={data?.packageInfo?.packageName}
            downDescriptionText="Click to view the other benefits"
            packageId={process.env.REACT_APP_BASICPLAN || "plan_NgWEcv4vEvrZFc"}
            value={data?.packageId}
            price={getPriceMain}
            mapArray={returnArray(data?.packageInfo?.packageName)}
            button={false}
          />
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          <BasicButton title="Back" variant="outlined" onClick={prevStep} />
          <BasicButton
            onClick={(e) => {
              e.preventDefault();
              mutate();
            }}
            type="submit"
            title="Submit"
          />
          <PackageInfo
            open={confirmOpen}
            handleClose={() => {
              setConfirmOpen(false);
            }}
          />
        </div>
        {/* <p className="text-gray-500">
  {`Total price will be ₹${calculateFinalPrice().toFixed(2)}`}
</p> */}

      </div>
    </div>
  );
  

};

export default Step4;

const returnArray = (plan = "Basic Plan") => {
  if (plan === "Basic Plan") {
    return packageArray.filter((doc, index) => doc.Basic === "✓" && index <= 5);
  } else if (plan === "Intermediate Plan") {
    return packageArray
      .filter((doc, index) => doc.Intermediate === "✓" && index <= 5)
      .reverse();
  } else if (plan === "Essential Plan") {
    return packageArray
      .filter((doc, index) => doc.Essential === "✓" && index <= 5)
      .reverse();
  }else if (plan === "Fullskape Plan") {
    return packageArray
      .filter((doc, index) => doc.Fullskape === "✓" && index <= 5)
      .reverse();
  } 
  
  else {
    return packageArray
      .filter((doc, index) => doc.Enterprise === "✓")
      .reverse()
      .filter((doc, index) => index <= 5);
  }
};



// git commit -m "[2020-26-11] [Bug] [Orgnization]:[Done] : Resolved bug error while creating Organization"