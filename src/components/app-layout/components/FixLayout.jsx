import { AppBar, IconButton, Menu, Toolbar, Grid } from "@mui/material"
import React from 'react'
import NotificationIcon from "./NotificationIcon";
import ProfileIcon from "../../profieicon/profileIcon";
import TopBar from "./TopBar";
import LeftNavigation from "./LeftNavigation";

const FixLayout = () => {


    return (
        <Grid container md={12}>
            <Grid md={2}>
                <LeftNavigation />
            </Grid>
            <Grid md={10} sx={{ height: "200vh", bgcolor: "#F9FAFC" }}>
                <TopBar />
            </Grid>
        </Grid>
    )
}

export default FixLayout
