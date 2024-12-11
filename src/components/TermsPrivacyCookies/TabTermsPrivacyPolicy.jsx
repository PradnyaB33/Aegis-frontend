import React, { useState } from "react";
import TermsAndConditionsPage from "./termsconditonpage";
import PrivacyPolicy from "./PrivacyPolicy";
import CookiesPolicy from "./CookiesPolicy";
function TabTermsPrivacyPolicy() {
  const [activeTab, setActiveTab] = useState("terms");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div style={{ width: "100%", fontFamily: "Arial", marginTop: "8%" }}>
      <div style={{ borderBottom: "1px solid #ccc" }}>
        <button
          style={{
            padding: "8px 16px",
            border: "none",
            background: "none",
            cursor: "pointer",
            marginRight: "16px",
            fontWeight: activeTab === "terms" ? "bold" : "normal",
            color: activeTab === "terms" ? "#000" : "#666",
          }}
          onClick={() => handleTabChange("terms")}
        >
          Terms and Conditions
        </button>
        <button
          style={{
            padding: "8px 16px",
            border: "none",
            background: "none",
            cursor: "pointer",
            marginRight: "16px",
            fontWeight: activeTab === "privacy" ? "bold" : "normal",
            color: activeTab === "privacy" ? "#000" : "#666",
          }}
          onClick={() => handleTabChange("privacy")}
        >
          Privacy Policy
        </button>
        <button
          style={{
            padding: "8px 16px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontWeight: activeTab === "cookies" ? "bold" : "normal",
            color: activeTab === "cookies" ? "#000" : "#666",
          }}
          onClick={() => handleTabChange("cookies")}
        >
          Cookies Policy
        </button>
      </div>
      <div style={{ marginTop: "16px" }}>
        {activeTab === "terms" && <TermsAndConditionsPage />}
        {activeTab === "privacy" && <PrivacyPolicy />}
        {activeTab === "cookies" && <CookiesPolicy />}
      </div>
    </div>
  );
}

export default TabTermsPrivacyPolicy;
