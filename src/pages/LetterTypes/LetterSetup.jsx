import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import Setup from "../SetUpOrganization/Setup";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const LetterSetup = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const { organisationId } = useParams();
  const { setAppAlert } = useContext(UseContext);

  useEffect(() => {
    fetchData();

    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/letter/get/${organisationId}`
      );
      const fetchedData = response.data;

      // Update formData state with fetched data
      setFormData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // If there's an error fetching data, set a default form data based on document names
      const initialFormData = {};
      const documentNames = [
        "Employment Offer Letter",
        "Appointment Letter",
        "Promotion Letter",
        "Transfer Letter",
        "Termination Letter",
        "Resignation Acceptance Letter",
        "Confirmation Letter",
        "Performance Appraisal Letter",
        "Warning Letter",
        "Salary Increment Letter",
        "Training Invitation Letter",
        "Employee Recognition Letter",
      ];

      documentNames.forEach((name) => {
        initialFormData[name] = { workflow: false };
      });
      setFormData(initialFormData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/route/letter/post/${organisationId}`,
        formData
      );
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Changes Updated Successfully",
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      // Handle error if needed
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (documentName, checked) => {
    setFormData((prevData) => ({
      ...prevData,
      [documentName]: {
        ...prevData[documentName],
        workflow: checked,
      },
    }));
  };

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center ">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Letter Setup"
              info="Here you can manage different types of letters for your
                  organisation"
            />

          </div>
          <div className="mt-2 p-1 w-[840px]">
            <div className="flex items-center justify-center">
              <h2 className="text-sm text-gray-400 w-[300px]">
                Manager Workflow
              </h2>
            </div>
          </div>

          {Object.entries(formData).map(([documentName, values]) => (
            <div key={documentName} className="p-4">
              <div className="flex justify-start items-center mb-2">
                <h2 className="text-lg w-[300px]">
                  {documentName.replace(/([a-z])([A-Z])/g, "$1 $2")}
                </h2>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`${documentName}-managerWorkflow`}
                    checked={values.workflow}
                    onChange={(e) =>
                      handleChange(documentName, e.target.checked)
                    }
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="p-4">
            <button
              onClick={handleSubmit}
              className="bg-[#1414fe] text-white font-bold py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </Setup>
    </BoxComponent >
  );
};

export default LetterSetup;


