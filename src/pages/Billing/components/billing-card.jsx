import {
  AttachMoney,
  Autorenew,
  Circle,
  ControlPoint,
  Discount,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Loop,
  People,
  PriorityHigh,
  RecyclingRounded,
  ShoppingBag,
  Subscriptions,
  TrendingUp,
} from "@mui/icons-material";
import { Box, Button, Dialog, DialogContent, Grid, IconButton, Menu, MenuItem, Typography, alpha, styled } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import DescriptionBox from "./descripton-box";
import PaySubscription from "./package/pay-sub";
import RenewPackage from "./package/renew";
import UpgradePackage from "./package/upgrade";
import hrmsImg from "../../../assets/hrmsImg.png"
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
import { toWords } from 'number-to-words';
import QRcodeImg from "../../../assets/QRcode.svg";
import SignImg from "../../../assets/sign.png"
import html2pdf from "html2pdf.js";
import BasicButton from "../../../components/BasicButton";
const StyledMenu = styled((props) => (
  <Menu
    style={{ background: "rgb(244 247 254 / var(--tw-bg-opacity))" }}
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 140,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const BillingCard = ({ doc }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [confirmOpen1, setConfirmOpen1] = useState(false);
  const [confirmOpen2, setConfirmOpen2] = useState(false);
  const [confirmOpen3, setConfirmOpen3] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const checkHasOrgDisabled = () => {
    // if organization subscriptionDetails.status is pending and the difference between the current date and the expiration date is greater than 0 then return true else return false
    if (doc?.subscriptionDetails?.status === "Active") {
      // check if expired by checking subscriptionDetails.expirationDate
      if (
        moment(doc?.subscriptionDetails?.expirationDate).diff(
          moment(),
          "days"
        ) > 0
      ) {
        return false;
      } else {
        if (doc?.upcomingPackageInfo?.packageName) {
          return false;
        } else {
          return true;
        }
      }
    } else if (doc?.subscriptionDetails?.status === "Pending") {
      return true;
      //
    }
    return true;
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModal = () => {
    setOpenModal(true)
  }

  // const exportPDF = async () => {
  //   const pdfContent = document.getElementById("pdfContent");

  //   html2canvas(pdfContent, {
  //     logging: true,
  //     letterRendering: 1,
  //     useCORS: true,
  //   }).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("landscape", "mm", "a4");
  //     pdf.addImage(
  //       imgData,
  //       0,
  //       0,
  //       pdf.internal.pageSize.width,
  //       pdf.internal.pageSize.height
  //     );
  //     pdf.save("billing-details.pdf");
  //   });
  // };

  // const handleDownloadClick = () => {
  //   exportPDF();
  // };
  const handleDownloadClick = () => {
    const element = document.getElementById('pdfContent'); // Ya ID la refer kara jithe tumcha content aahe
    const opt = {
      margin: 1,
      filename: 'invoice.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } // A4 size setup
    };

    html2pdf().from(element).set(opt).save();
  };
  const getPrice = (packageInfo) => {
    switch (packageInfo) {
      case 'Essential Plan':
        return '30';
      case 'Basic Plan':
        return '55';
      case 'Intermediate Plan':
        return '85';
      case 'Enterprise Plan':
        return '115';
      default:
        return '0';
    }
  };

  const memberCount = Number(doc?.memberCount) || 0;
  const cycleCount = Number(doc?.cycleCount) || 0;
  const pricePerEmployee = getPrice(doc?.packageInfo);

  const formatCurrency = (amount) => `₹ ${amount.toFixed(2)}`;
  const totalIntermediatePrice = pricePerEmployee * memberCount;
  const GST = totalIntermediatePrice * 0.18;
  const Total = totalIntermediatePrice + GST;
  const capitalizeFirstLetter = (text) => {
    return text
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  let amountInWords = toWords(Total);

  amountInWords = capitalizeFirstLetter(amountInWords.replace(/[-,]/g, ''));

  const data = [
    '1',
    `Aegis HRMS Software (${doc?.packageInfo})`,
    '997331',
    `₹ ${pricePerEmployee}`,
    cycleCount,
    memberCount,
    `₹ ${totalIntermediatePrice}`,
    `₹ ${GST}`,
    `₹ ${Total}`
  ];
  const data1 = [
    '',
    `Total`,
    '',
    '',
    '',
    '',
    '',
    formatCurrency(GST),
    formatCurrency(Total)
  ];

  const paymentDate = new Date(doc?.subscriptionDetails?.paymentDate);
  const paymentformattedDate = `${String(paymentDate.getDate()).padStart(2, '0')}-${String(paymentDate.getMonth() + 1).padStart(2, '0')}-${paymentDate.getFullYear()}`;
  const expirationDate = doc?.subscriptionDetails?.expirationDate;
  const date = new Date(expirationDate);
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  console.log("doc", doc?.subscriptionDetails?.invoiceNumber);

  const formattedInvoiceNumber = String(doc?.subscriptionDetails?.invoiceNumber).padStart(4, '0');

  return (<>
    <div className="grid grid-cols-6">
      <div className="col-span-6 md:col-span-5 pl-4 pt-4 pb-4 gap-4 flex flex-col">
        <div className=" bg-white p-4">
          <div className="flex justify-between ">
            <div className="flex gap-4 items-end">
              <img
                src={doc?.logo_url}
                alt=""
                className="h-10 w-10 rounded-md border border-brand/purple"
              />
              <div className="text-2xl font-bold">{doc?.orgName}</div>
            </div>
            <div className="flex gap-4">
              {window.innerWidth > 300 && checkHasOrgDisabled() && (
                // <Button onClick={() => setConfirmOpen3(true)} variant="contained">
                //   Pay
                // </Button>
                <BasicButton title={"Pay"} onClick={() => setConfirmOpen3(true)} />
              )}
              <Button
                id="demo-customized-button"
                aria-controls={open ? "demo-customized-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                variant="outlined"
                disableElevation
                onClick={handleClick}
                endIcon={open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              >
                Options
              </Button>
            </div>
            <StyledMenu
              id="demo-customized-menu"
              MenuListProps={{
                "aria-labelledby": "demo-customized-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  setConfirmOpen1(true);
                }}
                disableRipple
              >
                <Autorenew />
                Renew
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setConfirmOpen2(true);
                  handleClose();
                }}
                disableRipple
              >
                <TrendingUp />
                Upgrade
              </MenuItem>
              {window.innerWidth < 300 && checkHasOrgDisabled() && (
                <MenuItem
                  onClick={() => {
                    setConfirmOpen2(true);
                    handleClose();
                  }}
                  disableRipple
                >
                  <TrendingUp />
                  Pay
                </MenuItem>
              )}
            </StyledMenu>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {!checkHasOrgDisabled() ? (
              <>
                <DescriptionBox
                  Icon={Subscriptions}
                  descriptionText={"Subscription charge date"}
                  mainText={moment(doc?.subscriptionDetails?.paymentDate).format(
                    "DD MMM YYYY"
                  )}
                />
                <DescriptionBox
                  Icon={Subscriptions}
                  descriptionText={"Subscription end date"}
                  mainText={moment(
                    doc?.subscriptionDetails?.expirationDate ?? moment()
                  ).format("DD MMM YYYY")}
                />
              </>
            ) : (
              <>
                <DescriptionBox
                  Icon={RecyclingRounded}
                  descriptionText={"Your subscription is on trial"}
                  mainText={
                    moment(doc?.createdAt).add(7, "days").diff(moment(), "days") >
                      0
                      ? `Only ${moment(doc?.createdAt)
                        .add(7, "days")
                        .diff(moment(), "days")} days left`
                      : "But trial has expired"
                  }
                />
                <DescriptionBox
                  Icon={RecyclingRounded}
                  descriptionText={"Your subscription trial start Date"}
                  mainText={moment(doc?.createdAt).format("DD MMM YYYY")}
                />
              </>
            )}
            <DescriptionBox
              Icon={AttachMoney}
              descriptionText={"Billing frequency"}
              mainText={"Quarterly"}
            />
            <DescriptionBox
              Icon={ShoppingBag}
              descriptionText={"Purchased Plan"}
              mainText={doc?.packageInfo}
            />
            <DescriptionBox
              Icon={People}
              descriptionText={"Allowed employee count"}
              mainText={doc?.memberCount}
            />
            <DescriptionBox
              Icon={Circle}
              descriptionText={"Subscription status"}
              mainText={doc?.subscriptionDetails?.status}
            />
            {moment(doc?.subscriptionDetails?.expirationDate).diff(
              moment(new Date()),
              "days"
            ) > 0 && (
                <DescriptionBox
                  Icon={Loop}
                  descriptionText={"Your next renewal is after"}
                  mainText={`${moment(
                    doc?.subscriptionDetails?.expirationDate
                  ).diff(moment(new Date()), "days")} days`}
                />
              )}
            <DescriptionBox
              Icon={Discount}
              descriptionText={"Organisation discount for next subscription"}
              mainText={`${Math.round(doc?.remainingBalance)}`}
            />
          </div>
        </div>
      </div>
      <div className=" col-span-1 justify-center items-center hidden md:flex">
        {doc?.subscriptionDetails?.status === "Active" ? (
          <div className="flex justify-center items-start p-8 rounded-full animate-pulse">
            <BasicButton title={"Invoice"} onClick={handleModal} variant="outlined" />
          </div>
        ) : doc?.subscriptionDetails?.status === "Pending" ? (
          <div className="bg-[#E8A454] flex justify-center items-start p-2 rounded-full animate-pulse">
            <PriorityHigh className="text-white " fontSize="large" />
          </div>
        ) : doc?.subscriptionDetails?.status === "Expired" ? (
          <div className="bg-[#6578DB] flex justify-center items-start p-8 rounded-full animate-pulse">
            <ControlPoint className="text-white " fontSize="large" />
          </div>
        ) : null}
      </div>

      <RenewPackage
        open={confirmOpen1}
        handleClose={() => {
          setConfirmOpen1(false);
          handleClose();
        }}
        organisation={doc}
      />

      <UpgradePackage
        open={confirmOpen2}
        handleClose={() => {
          setConfirmOpen2(false);
          handleClose();
        }}
        organisation={doc}
      />
      <PaySubscription
        open={confirmOpen3}
        handleClose={() => {
          setConfirmOpen3(false);
          handleClose();
        }}
        organisation={doc}
      />
    </div>
    <Dialog open={openModal} onClose={() => setOpenModal(false)}
      maxWidth="lg"
      fullWidth={true}
    >
      <DialogContent>

        <Grid
          lg={12}
          md={12}
          sm={12}
          xs={12}
          container
          id="pdfContent"
          direction="row"
          sx={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            border: '1px solid grey'
          }}
        >
          <Grid lg={12}
            md={12}
            sm={12}
            xs={12} className="flex justify-center" sx={{ borderBottom: "1px solid grey", pb: 1 }}>
            <Typography sx={{ fontSize: "28px" }}>Tax Invoice</Typography>
          </Grid>
          <Grid item lg={3} md={3}
            sm={6}
            xs={12}>
            <img src={hrmsImg} alt="" style={{ width: '150px' }} />
          </Grid>
          <Grid item lg={9} md={9}
            sm={6}
            xs={12} sx={{ textAlign: 'right', pr: 2, pb: 2 }}>
            <Typography variant="h5">
              Argan Technology Services Private Limited
            </Typography>
            <Typography variant="body2">
              Address: office no.C503, The Onyx-Kalate Business Park, near Euro School,<br />
              Shankar Kalat Nagar, Wakad, Pune, Pimpri-Chinchwad, Maharashtra 411057.<br />
              Ph. no.: 9082462161 Email: sales@aegishrms.com<br />
              GSTIN: 27AAVCA3805B1ZS<br />
              State: 27-Maharashtra
            </Typography>
          </Grid>
          <Grid container lg={12} >
            <Grid item lg={6} sx={{ borderRight: '1px solid grey' }}>
              <Box sx={{ bgcolor: '#1976d2', pb: 2, px: 2 }}>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  Bill To
                </Typography>
              </Box>
              <Box sx={{ pb: 2, px: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {`${doc?.orgName}`}
                </Typography>
                <Typography variant="body2">
                  {`${doc?.location?.address}`}
                  <br />
                  Contact No.: {`${doc?.contact_number}`}
                </Typography>
              </Box>
            </Grid>
            <Grid item lg={6} sx={{ borderRight: '1px solid grey', textAlign: 'right' }}>
              <Box sx={{ bgcolor: '#1976d2', pb: 2, px: 2 }}>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  Invoice Details
                </Typography>
              </Box>
              <Box sx={{ pb: 2, px: 2 }}>
                <Typography variant="body2">
                  Invoice No.: 24-25/ATS/IT{formattedInvoiceNumber}<br />
                  Date: {paymentformattedDate}<br />
                  Due Date: {formattedDate}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Grid container >
            <Grid container item >
              {['Sr. No', 'Item Name', 'SAC', 'Essential price per Employee', 'Total number of months', 'Total Employee/Nos', 'Total Intermediate Price', 'GST Amount (18%)', 'Total  Amount'].map((heading, index) => (
                <Grid item xs={1.33} key={index} sx={{ bgcolor: '#1976d2', borderRight: '1px solid grey', wordWrap: "break-word" }}>
                  <Typography variant="body1" sx={{ color: 'white', textAlign: 'center', p: 1 }}>
                    {heading}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            <Grid container item sx={{ borderBottom: "1px solid grey" }}>
              {/* Map through `data` array */}
              {data.map((cellData, colIndex) => (
                <Grid item xs={1.33} key={colIndex} sx={{ borderRight: '1px solid grey', pb: 2, px: 2, wordWrap: "break-word" }}>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    {cellData}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            <Grid container item >
              {/* Map through `data1` array */}
              {data1.map((cellData, colIndex) => (
                <Grid item xs={1.33} key={colIndex} sx={{ borderRight: '1px solid grey', pb: 2, px: 2 }}>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    {cellData}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid container >
            <Grid lg={5.985} sx={{ borderRight: "1px solid grey" }}>
              <Grid sx={{ bgcolor: '#1976d2', borderRight: '1px solid grey', pb: 2, px: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white', p: 1 }} >
                  Amount In Words
                </Typography>
              </Grid>
              <Box sx={{ pb: 2, px: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {amountInWords} Rupees Only
                </Typography>
              </Box>
            </Grid>
            <Grid container lg={5.985}>
              <Grid container item >
                {/* Map through `data1` array */}
                {['Sub Total', `₹ ${totalIntermediatePrice}`].map((cellData, colIndex) => (
                  <Grid item xs={6} key={colIndex} sx={{ bgcolor: '#1976d2', borderRight: '1px solid grey', pb: 3, px: 2, pt: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'center', color: 'white' }}>
                      {cellData}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
              <Grid container item sx={{ borderBottom: "1px solid grey" }}>
                {/* Map through `data1` array */}
                {/* {['Balance Amount', 0].map((cellData, colIndex) => (
                  <Grid item xs={6} key={colIndex} sx={{ borderRight: '1px solid grey', pb: 2, px: 2 }}>
                    <Typography variant="body2" sx={{ textAlign: 'center' }}>
                      {cellData}
                    </Typography>
                  </Grid>
                ))} */}
              </Grid> <Grid container item >
                {/* Map through `data1` array */}
                {['Total Amount', `₹ ${Total}`].map((cellData, colIndex) => (
                  <Grid item xs={6} key={colIndex} sx={{ borderRight: '1px solid grey', pb: 2, px: 2 }}>
                    <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                      {cellData}
                    </Typography>
                  </Grid>
                ))}
              </Grid> </Grid>
          </Grid>  <Grid container sx={{ mb: 4 }} >
            <Grid item lg={12} sx={{ borderRight: '1px solid grey', borderBottom: "1px solid grey" }}>
              <Box sx={{ bgcolor: '#1976d2', pb: 2, px: 2 }}>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  Bank Details
                </Typography>
              </Box>
              <Grid container sx={{ borderRight: "1px solid grey", height: "300px" }}>
                <Grid lg={6} sx={{ borderRight: "1px solid grey", p: 2 }}>
                  <Box sx={{ display: "flex" }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Name : HDFC BANK, WAKAD<br />
                      Account No. : 50200060324080<br />
                      IFSC code : HDFC0004887<br />
                      Name : Argan Technology Services Pvt Ltd
                    </Typography>
                    <img src={QRcodeImg} alt="" style={{ width: "150px", height: "200px", marginLeft: "20px" }} />
                  </Box>
                </Grid>
                <Grid container lg={6} sx={{ p: 2, alignItems: "center", justifyContent: "center" }}>
                  <Grid item lg={12} sx={{ textAlign: "center" }}>
                    <Typography variant="p" sx={{ fontSize: "30px" }}>
                      Authorized Signature
                    </Typography><br />
                  </Grid>
                  <Grid item lg={12} sx={{ display: "flex", justifyContent: "center", }}>
                    <img src={SignImg} alt="" style={{ width: "250px" }} />
                  </Grid>
                  <Typography variant="p" sx={{ fontSize: "22px" }}>
                    Rahul Gaikwad
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid sx={{ borderTop: "1px solid grey", p: 2, mt: "100px" }}>
            <Typography variant="body2">

              1. AEGIS HRMS subscription will be activated post receipt of complete payment of selected subscription module.<br />
              2. Client has to provide necessary date related to Company Name, Hierarchy/Organisation Structure, employee details, Attendance System if any to integrate the input data in AEGIS HRMS for smooth operations.
              <br />   3. Revised scope in subscription, change in employee numbers, additional customised modules apart from selected subscription will lead to price revision & to be paid separately.
              <br />  4. Applicable 18 % GST as Indian Govt Taxation rules will be extra.
              <br />  5. Validity of this proposal is for 14 days from the date of the proposal.
              <br />  6. All AEGIS HRMS subscription /licence needs to be renewed per year as these Solutions are valid for 1 year from the date of activation.
              <br />  7. All AEGIS HRMS subscription /licence operates on the Auto renewal mode unless notified for deactivation.
              <br />  8. All AEGIS HRMS subscription /licence require Internet Connection during the operation.
              <br />  9. All AEGIS HRMS subscription /licence provides inbuilt Data management & secure file exchange features.
              <br /> 10. Technical Updates:-As per the application update cycle for 1 year
              Technical Support:- One Year.
              Training:-3 to 4 days Dedicated Session on AEGIS HRMS online or at Pune location at no other extra charges.
              <br />  11. AEGIS HRMS will provide training to client nominated reps for smoother operations through online.
              <br /> 12. The proposal does not cover the costs for travel to client premises if any post installation for training etc. All such cost be extra.
              <br /> 13. Terms & Conditions ,Intellectual Property Rights and Other conditions are applicable as mentioned on our website www.aegishrms.com
              <br /> 14. Subject to Pune, Maharashtra Jurisdiction

            </Typography>
            <Typography sx={{ fontWeight: "bold", }}>Note:-Payment made & Order once placed cannot be cancelled.</Typography>
          </Grid>
        </Grid>


        <div className="flex justify-end item-right">
          <IconButton onClick={handleDownloadClick}>
            <Button variant="outlined" >Download</Button>
          </IconButton>
        </div>
      </DialogContent>
    </Dialog >
  </>
  );
};

export default BillingCard;



