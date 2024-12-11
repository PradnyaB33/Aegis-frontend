import { Avatar, Card, CardContent } from "@mui/material";
import React from "react";

const DataCard = ({ icon: Icon, title, desc, svg, color }) => {
  return (
    <Card className="w-[25%]" elevation={3}>
      <CardContent>
        <div className="flex gap-4 mb-3 items-center ">
          <Avatar
            sx={{
              height: 36,
              width: 36,
            }}
            className={`${color}`}
            variant="rounded"
          >
            {Icon && <Icon />}
          </Avatar>
          <h1 className="text-2xl font-semibold">{desc ?? 256}</h1>
        </div>
        <h1 className="text-lg">{title}</h1>
      </CardContent>
    </Card>
  );
};

export default DataCard;
