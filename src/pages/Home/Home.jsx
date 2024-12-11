import { Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import "react-multi-carousel/lib/styles.css";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import organization from "../../assets/welOrganisation.svg";
import BoxComponent from "../../components/BoxComponent/BoxComponent";

const Home = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const getOrgList = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/organization/get`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const { data } = useQuery("orgDatas", getOrgList);

  return (
    <>
      <BoxComponent>
        <Grid container>
          <Grid item xs={12} md={7} sx={{ p: "10% 5%" }}>
            <Typography
              component="span"
              sx={{
                fontSize: { sm: "2.30rem", xs: "2rem" },
                fontWeight: "300",
              }}
            >
              Welcome to{" "}
              <Typography
                component="span"
                sx={{
                  fontSize: { sm: "2.30rem", xs: "1.5rem" },
                  color: "#1514FE",
                  fontWeight: "600",
                }}
              >
                AEGIS
              </Typography>
              <br />
              <Typography
                component="span"
                sx={{
                  fontSize: { sm: "2.30rem", xs: "2rem" },
                  fontWeight: "600",
                }}
              >
                Unleashing{" "}
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontSize: { sm: "2.30rem", xs: "2rem" },
                  color: "#1514FE",
                  fontWeight: "600",
                }}
              >
                Organisational Excellence
              </Typography>
            </Typography>
            <br />
            <Typography
              component="span"
              sx={{ fontSize: "1.25rem", lineHeight: "40px" }}
            >
              Empower your journey by making us your first choice. Elevate your
              experience with the{" "}
            </Typography>
            <Typography
              component="span"
              sx={{ color: "#1514FE", fontWeight: "600", fontSize: "1.25rem" }}
            >
              AEGIS
            </Typography>
            <Typography component="span" sx={{ fontSize: "1.25rem" }}>
              , Let's start
            </Typography>
            <br />
            <br />
            {data?.organizations.length <= 0 ? (
              <Link className="!w-max !block" to={"/add-organisation"}>
                <button className="!w-max flex group justify-center gap-2 items-center rounded-md px-4 py-3 text-md font-semibold text-white bg-blue-500 hover:bg-blue-600 focus-visible:outline-blue-500">
                  Create Your Organisation{" "}
                  <FaArrowCircleRight className="group-hover:translate-x-1 transition-all" />
                </button>
              </Link>
            ) : (
              <Link to={"/organizationList"} className="!w-max !block">
                <button className="flex group justify-center gap-2 items-center rounded-md p-2 !text-xs md:px-6 md:py-3 md:!text-[1em] font-semibold text-white bg-[#1514FE] hover:bg-blue-500 focus-visible:outline-blue-500">
                  Go To Organisation{" "}
                  <FaArrowCircleRight className="group-hover:translate-x-1 transition-all" />
                </button>
              </Link>
            )}
          </Grid>
          <Grid
            item
            xs={6}
            md={5}
            sx={{ py: "10%", display: { xs: "none", md: "block" } }}
          >
            <img
              src={organization}
              className="w-[800px] h-auto mix-blend-multiply"
              alt="Organization"
            />
          </Grid>
        </Grid>
      </BoxComponent>
    </>
  );
};

export default Home;
