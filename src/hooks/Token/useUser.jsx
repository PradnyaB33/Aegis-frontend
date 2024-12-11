// useGetUser.js
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { UseContext } from "../../State/UseState/UseContext";
/**
 * @typedef {Object} User
 * @property {string} first_name - The first name of the user.
 * @property {string} last_name - The last name of the user.
 * @property {string} _id - The ID of the user.
 * @property {string} email - The email of the user.
 * @property {Array<string>} profile - The profile of the user.
 * @property {?string} organizationId - The organization ID of the user.
 * @property {?string} deptname - The department name of the user.
 * @property {?string} birthdate - The birth date of the user.
 */

/**
 * @typedef {Object} DecodedToken
 * @property {User} user - The user object.
 * @property {number} iat - The issued at timestamp.
 * @property {number} exp - The expiration timestamp.
 */

/**
 * @returns {{authToken: string, decodedToken: DecodedToken|null}} The auth token and the decoded token.
 */

const useGetUser = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  let decodedToken = null;
  if (authToken) {
    decodedToken = jwtDecode(authToken);
  }
  return { authToken, decodedToken };
};

export default useGetUser;
