import React from "react";
import useGetDelegateSuperAdmin from "../../hooks/QueryHook/Delegate-Super-Admin/hook";
import MiniForm from "./components/form";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import { Box, CircularProgress } from "@mui/material";

const AddDelegate = () => {
  const { data, isLoading, isFetching } = useGetDelegateSuperAdmin();

  return (
    <>
      <BoxComponent>
        <HeadingOneLineInfo heading={"Add Delegate Super Admin"} /> {isLoading || isFetching ? <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="80vh"
        >
          <CircularProgress />
        </Box> : <MiniForm data={data} />} </BoxComponent>
    </>
  );
};

export default AddDelegate;
