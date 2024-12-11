import { CircularProgress } from "@mui/material";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserProfile from "../hooks/UserData/useUser";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { getCurrentUser, useGetCurrentRole } = UserProfile();

  const [user, setUser] = useState(null); // Initialize user as null initially
  const [isLoading, setIsLoading] = useState(false); // Initialize user as null initially

  const role = useGetCurrentRole(); // Call useGetCurrentRole directly here

  useEffect(() => {
    setIsLoading(true);
    setUser(getCurrentUser());
    setIsLoading(false);
    // eslint-disable-next-line
  }, []); // Ensure the effect runs when getCurrentUser changes

  return (
    <AuthContext.Provider value={{ user, role, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

function RequireAuth({
  children,
  permission = [
    "Super-Admin",
    "Delegate-Super-Admin",
    "Department-Head",
    "Delegate-Department-Head",
    "Department-Admin",
    "Delegate-Department-Admin",
    "Accountant",
    "Delegate-Accountant",
    "HR",
    "Manager",
    "Employee",
    "Teacher",
  ],
}) {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const isAuthPage =
    window.location.pathname.includes("sign-in") ||
    window.location.pathname.includes("sign-up");

  const isPermission = permission?.includes(role);

  useEffect(() => {
    if (!isPageLoaded) {
      return;
    }

    let timer;
    if ((!user || !isPermission) && !isAuthPage) {
      setIsPageLoaded(true);
      timer = setTimeout(() => {
        return navigate("/sign-in");
      }, 1000);
    }

    return () => {
      clearTimeout(timer);
    };

    // eslint-disable-next-line
  }, [isPageLoaded, isPermission]);

  useEffect(() => {
    // Simulate page loading completion after 1 second
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // if (!user && !isAuthPage) return <Navigate to={"/sign-in"} />;

  if (!isPageLoaded) {
    return (
      <div className="flex items-center justify-center bg-gray-50   w-full h-[90vh]">
        <div className="grid place-items-center gap-2">
          <CircularProgress />
          <h1 className="text-center text-xl w-full">Loading</h1>
        </div>
      </div>
    );
  }

  if (user && isPermission) {
    return (
      <>
        {/* <SwipeableTemporaryDrawer /> */}
        {children}
      </>
    );
  }
}

export default RequireAuth;
