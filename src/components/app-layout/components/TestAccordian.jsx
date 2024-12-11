import { ChevronRight } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useDrawer } from "./Drawer";
import { useContext, useState } from "react";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { UseContext } from "../../../State/UseState/UseContext";
import UserProfile from "../../../hooks/UserData/useUser";

const TestAccordian = ({
  role,
  routes,
  isVisible,
  valueBoolean,
  handleAccordianClick,
}) => {
  const { pinned, setOpen } = useDrawer();
  const currentRoute = useLocation().pathname;

  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const employeeId = user?._id;

  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const [favoriteRoles, setFavoriteRoles] = useState([]);

  const uniqueStoredRoles = Array.from(new Set([role]));

  const queryClient = useQueryClient();

  // Fetch favorite roles from the server
  useQuery(
    ["favoriteRoles", employeeId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get-fav-navigation-items/${employeeId}`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data.favItems || [];
    },
    {
      enabled: !!employeeId,
      onSuccess: (data) => setFavoriteRoles(data),
    }
  );

  const isRouteFavorite = (routeText) =>
    favoriteRoles.some((fav) => fav.text === routeText);

  const mutation = useMutation(
    async (formData) => {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/add-fav-navigation-item`,
        formData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("favoriteRoles");
      },
      onError: (error) => {
        console.error("Error updating favorite roles", error);
      },
    }
  );

  const deleteFavoriteItem = useMutation(
    async ({ employeeId, itemToDelete }) => {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/route/delete-fav-navigation-items/${employeeId}`,
        {
          headers: { Authorization: authToken },
          data: { itemToDelete },
        }
      );
      return response.data.favItems;
    },
    {
      onSuccess: (data) => {
        // setFavoriteRoles(data);
        queryClient.invalidateQueries("favoriteRoles");
      },
      onError: (error) => {
        console.error("Error deleting favorite item", error);
      },
    }
  );

  const handleToggleFavorite = (favItem) => {
    if (isRouteFavorite(favItem.text)) {
      // If favorite, delete it
      deleteFavoriteItem.mutate({ employeeId, itemToDelete: favItem });
    } else {
      // If not favorite, add it
      const updatedRoles = [...favoriteRoles, favItem];
      setFavoriteRoles(updatedRoles);

      // Save favorite roles
      mutation.mutate({
        employeeId,
        favItems: updatedRoles,
      });
    }
  };

  const handleClick = () => {
    if (!pinned) {
      setOpen(false);
    }
  };

  return (
    <div className={`block ${!isVisible && "hidden"}`}>
      {uniqueStoredRoles.map((uniqueRole, index) => (
        <div key={index}>
          <div
            className="my-2 flex gap-3 justify-between px-4 text-sm items-center cursor-pointer"
            onClick={handleAccordianClick}
          >
            <h1 className="py-1 text-base tracking-tighter font-bold">
              {uniqueRole}
            </h1>
            <div className="flex items-center gap-2">
              <ChevronRight
                className={`text-gray-500 !h-5 transition-all ${valueBoolean ? "transform rotate-90" : "rotate-0"
                  }`}
              />
            </div>
          </div>

          {valueBoolean &&
            routes.map((route, i) => (
              <div
                className={`${route.isVisible ? "block" : "hidden"
                  } flex px-4 `}
                key={`${route.text}-${i}`}
              >
                <div
                  onClick={() =>
                    handleToggleFavorite({ text: route.text, link: route.link })
                  }
                  className="flex items-center"
                >
                  {isRouteFavorite(route.text) ? (
                    <StarIcon
                      style={{ fontSize: "16px" }}
                      className="text-yellow-500 cursor-pointer"
                    />
                  ) : (
                    <StarBorderIcon
                      style={{ fontSize: "16px" }}
                      className="text-gray-500 cursor-pointer"
                    />
                  )}
                </div>
                <Link
                  to={route.link}
                  onClick={handleClick}
                  className={`w-full rounded-md flex gap-1 py-2 text-gray-500 
                    ${currentRoute === route.link
                      ? "!text-white !bg-[#1414fe]"
                      : ""
                    }
                    pl-6 transition duration-200 hover:!text-white hover:!bg-[#1414fe]`}
                >
                  {route.icon}
                  <h1 className="tracking-tight font-bold text-sm">
                    {route.text}
                  </h1>
                </Link>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default TestAccordian;
