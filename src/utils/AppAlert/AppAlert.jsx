import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useContext } from "react";
import { UseContext } from "../../State/UseState/UseContext";

export default function AppAlert() {
  const { appAlert, setAppAlert } = useContext(UseContext);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return setAppAlert({
        ...appAlert,
        alert: false,
      });
    }
    setAppAlert({
      ...appAlert,
      alert: false,
    });
  };
  return (
    <>
      <Snackbar
        open={appAlert.alert}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={appAlert.type}
          componentsProps={{ closeButton: { className: " !text-2xl" } }}
          sx={{ width: "100%" }}
          className="flex items-center !p-4 !px-8 !shadow-2xl !text-[1.1rem] !font-medium"
        >
          {appAlert.msg}
        </Alert>
      </Snackbar>
    </>
  );
}
