import React from "react";
import useGetSinglePunch from "../../../hooks/QueryHook/Remote-Punch/components/hook";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

const MappedPunches = ({
  Id,
  setPunchObjectId,
  className = "",
  punchObjectId,
}) => {
  const { data } = useGetSinglePunch({ Id });
  console.log("all data in remote", data
  );

  return (
    <div className={`w-full  ${className} cursor-pointer`}>
      {data?.punchData?.punchData?.map((doc, idx) => {
        let distance = 0;
        let totalDistance = 0;
        console.log(
          `🚀 ~ file: mapped-punches.jsx:33 ~ totalDistance:`,
          totalDistance
        );

        if (doc.data && idx < doc.data.length - 1) {
          const currentData = doc.data[idx];
          const nextData = doc.data[idx + 1];
          distance =
            calculateDistance(
              currentData.lat,
              currentData.lng,
              nextData.lat,
              nextData.lng
            ).toFixed(2) + " km";
          totalDistance += distance;
        }

        return (
          <div
            key={idx}
            className={` rounded-lg bg-[white] flex flex-col mb-3 ${punchObjectId === doc._id ? "border border-primary" : ""
              }`}
            onClick={() => setPunchObjectId(doc._id)}
          >
            <div className="flex items-center  p-2">
              <div className="">
                {data?.punchData?.geoFencingArea ? null : <img
                  src={doc?.image}
                  height={55}
                  width={55}
                  className="w-[55px] h-[55px] bg-black rounded-full object-cover"
                  alt="op"
                ></img>}
              </div>
              <div className="pl-5 flex flex-col ">
                <h1>
                  Start Time:{" "}
                  {new Date(doc?.data[0]?.time).toLocaleTimeString()}
                </h1>
                {console.log("this is the doc", doc)}
                {doc?.stopEndTime === "stop" ? (
                  <h1>
                    End Time: {new Date(doc?.data[doc?.data?.length - 1]?.time).toLocaleTimeString()}
                  </h1>
                ) : null}
                {/* <h1>Distance Travelled: {doc?.distance}</h1> */}
                <h1>  Miss Punch time:{" "}

                  <span>{idx + 1}</span>
                </h1>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MappedPunches;
