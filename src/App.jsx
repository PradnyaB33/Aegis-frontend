import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import Route from "./Route";
import TestState from "./State/Function/Main";
import UseEffectState from "./State/UseEffect/UseEffectContext";
import UseState from "./State/UseState/UseContext";
import { AuthProvider } from "./context/AuthProvider";
import AppAlert from "./utils/AppAlert/AppAlert";
import AppLoader from "./utils/AppLoader/AppLoader";
import TopLoadingBar from "./utils/TopLoadingBar/TopLoadingBar";

function App() {
  const location = useLocation();
  const isNavEnabled = ["/sign-in", "/sign-up", "/terms-and-conditions"];

  // Hide the loading page after React is ready
  const hideLoadingScreen = () => {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.style.display = "none";
    }
  };

  // Ensure the loading screen is hidden after the app is mounted
  useEffect(() => {
    hideLoadingScreen();
  }, []);

  //TODO: remove the issue
  return (
    <>
      <UseState>
        <TestState>
          <AuthProvider>
            <UseEffectState>
              <TopLoadingBar />
              <AppLoader />
              <AppAlert />

              <div
                className={`h-full  ${!isNavEnabled.some((value) => {
                  return location.pathname.includes(value);
                })
                  } `}
              >
                {/* <SwipeableTemporaryDrawer /> */}
                {/* <BackComponent /> */}
                <Toaster />

                <div style={{ height: "100%", width: "100%" }}>
                  <Route />
                </div>
              </div>
            </UseEffectState>
          </AuthProvider>
        </TestState>
      </UseState>
    </>
  );
}

export default App;
