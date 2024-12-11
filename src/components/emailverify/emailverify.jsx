import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import styles from "./styles.module.css";
function Emailverify() {
  const { handleAlert } = useContext(TestContext);
  const [validUrl, setValidUrl] = useState(true);
  const param = useParams();
  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `${process.env.REACT_APP_API}/route/employee/verify/${param.token}`;
        const { data } = await axios.get(url);
        setValidUrl(true);
      } catch (error) {
        handleAlert(
          true,
          "error",
          error?.response?.data?.message ||
            "Failed to sign in. Please try again."
        );
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [param.token, handleAlert]);
  return (
    <>
      {validUrl ? (
        <div className={styles.container}>
          <img
            src="/success.png"
            alt="success_img"
            className={styles.success_img}
          />
          <h1>Email verified successfully</h1>
          <Link to="/sign-in">
            <button className={styles.green_btn}>Login</button>
          </Link>
        </div>
      ) : (
        <h1>404 Not Found</h1>
      )}
    </>
  );
}

export default Emailverify;
