import { Button, Chip, Skeleton } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const SubscriptionRow = ({ leftText, rightText, chip, loading, isUrl }) => {
  return (
    <>
      <div className="col-span-1 !text-md !text-bold text-Brand-neutrals/brand-neutrals-3">
        {leftText}
      </div>
      <div
        className={`col-span-1 font-bold text-Brand-neutrals/brand-neutrals-3 truncate`}
      >
        {chip === true ? (
          <Chip
            size="large"
            variant="outlined"
            color="info"
            label={loading ? <Skeleton width={100} /> : rightText}
          />
        ) : loading ? (
          <Skeleton width={100} />
        ) : isUrl ? (
          <Link target="_blank" to={rightText}>
            <Button variant="contained" size="small">
              Click Here for Payment
            </Button>
          </Link>
        ) : (
          rightText
        )}
      </div>
    </>
  );
};

export default SubscriptionRow;
