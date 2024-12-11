import { Search } from "@mui/icons-material";
import { Grid, Skeleton } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { useDrawer } from "../../components/app-layout/components/Drawer";
import BasicButton from "../../components/BasicButton";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import useOrgList from "../../hooks/QueryHook/Orglist/hook";
import Organisation from "../Home/components/Organisation";

const SkeletonLoader = ({ open }) => {
  const itemSize = open ? 4 : 3;

  return (
    <Grid item lg={itemSize} md={itemSize} sm={6} xs={12}>
      <div
        style={{
          padding: "16px",
          borderRadius: "8px",
          backgroundColor: "#f0f0f0",
        }}
      >
        <Skeleton variant="rectangular" height={150} />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
      </div>
    </Grid>
  );
};

const OrgList = () => {
  const { open } = useDrawer();
  const { data, isLoading, refetch } = useOrgList();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = debounce((query) => {
    setSearchQuery(query);
  });

  const filteredOrganizations = data?.organizations?.filter((org) =>
    org.orgName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

  return (
    <BoxComponent sx={{ px: { xs: "5%", sm: "2%" } }}>
      <HeadingOneLineInfo
        heading="Organisation List"
        info="Here you can select and manage organisation"
      />
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Grid item xs={12} sm={6} md={6}>
          <div
            className={` 
              md:w-[60%] mr-2 outline-none border-gray-200 border-[0.5px] flex rounded-md items-center px-2 bg-white py-3 md:py-[6px]
            `}
          >
            <Search className="text-gray-700 md:text-lg !text-[1em]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search Organisation"
              className="border-none bg-white w-full outline-none px-2"
              formNoValidate
            />
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <BasicButton
            title={"Add Organisation"}
            component="link"
            to={"/add-organisation"}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {isLoading
          ? Array.from(new Array(6)).map((_, index) => (
              <SkeletonLoader key={index} open={open} />
            ))
          : filteredOrganizations?.map((item, index) => (
              <Grid
                item
                lg={open ? 4 : 3}
                sm={open ? 6 : 6}
                md={open ? 6 : 4}
                xs={12}
                key={index}
              >
                <Organisation item={item} />
              </Grid>
            ))}
      </Grid>
    </BoxComponent>
  );
};

export default OrgList;
