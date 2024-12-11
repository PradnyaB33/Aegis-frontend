import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import OpenSurveyList from "./components/OpenSurveyList";
import CloseSurveyList from "./components/CloseSurveyList";
import SaveAsDraft from "./components/SaveAsDraft";
import UserProfile from "../../hooks/UserData/useUser";
import SaveSurveyList from "./components/SaveSurveyList";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BasicButton from "../../components/BasicButton";

const EmployeeSurvey = () => {
    // Hooks
    const { getCurrentUser, useGetCurrentRole } = UserProfile();
    const role = useGetCurrentRole();

    const navigate = useNavigate();
    const user = getCurrentUser();
    const param = useParams();
    const organisationId = param?.organisationId;
    const employeeId = param?.employeeId;

    console.log("employeeId", employeeId);

    // User Role Check
    const isAdminOrHR = user?.profile.includes('Super-Admin') || user?.profile.includes('HR');

    // Create new survey navigation
    const handleCreateNewSurvey = () => {
        navigate(`/organisation/${organisationId}/create-new-survey`);
    }

    return (
        <BoxComponent>
            <HeadingOneLineInfo
                heading="Employee Survey"
                info={
                    employeeId === undefined && isAdminOrHR && role !== 'Employee'
                        ? "Here you can create employee survey"
                        : "Here you can fill employee survey"
                }
            />
            {employeeId === undefined && isAdminOrHR && role !== 'Employee' && (
                <div className="flex justify-end w-full">
                    <BasicButton title={"Create New Survey"} onClick={handleCreateNewSurvey} />
                </div>
            )}
            <div className="px-4 py-2 bg-white w-full h-max shadow-md rounded-2m border my-8">
                <OpenSurveyList />
            </div>
            {employeeId === undefined && isAdminOrHR && role !== 'Employee' && (
                <>
                    <div className="px-4 py-2 bg-white w-full h-max shadow-md rounded-2m border my-8">
                        <SaveSurveyList />
                    </div>
                    <div className="px-4 py-2 bg-white w-full h-max shadow-md rounded-2m border my-8">
                        <CloseSurveyList />
                    </div>
                    <div className="px-4 py-2 bg-white w-full h-max shadow-md rounded-2m border my-8">
                        <SaveAsDraft />
                    </div>
                </>
            )}
        </BoxComponent>
    );
};

export default EmployeeSurvey;
