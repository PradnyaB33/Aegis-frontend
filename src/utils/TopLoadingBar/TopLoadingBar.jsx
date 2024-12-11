import React, { useContext } from "react";
import LoadingBar from "react-top-loading-bar";
import { UseContext } from "../../State/UseState/UseContext";

const TopLoadingBar = () => {
  // to get the setProgess , progress from UseContext
  const { setProgress, progress } = useContext(UseContext);
  return (
    <LoadingBar
      color="#1976d2"
      progress={progress}
      onLoaderFinished={() => setProgress(0)}
    />
  );
};

export default TopLoadingBar;
