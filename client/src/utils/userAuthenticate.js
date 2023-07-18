/**
 * To set user token
 * @param {string} token
 */
const setUserToken = (token) => {
  localStorage.setItem("qcUserToken", token);
};

/**
 * Returns user token
 * @returns {string}
 */
const getUserToken = () => {
  const token = localStorage.getItem("qcUserToken");

  return token ? token : null;
};

/**
 * To set merchant active status
 */
const setUserStatus = () => {
  localStorage.setItem("qcUserStatus", true);
};

/**
 * Returns merchant active status
 * @returns {boolean}
 */
const getUserStatus = () => {
  const status = localStorage.getItem("qcUserStatus");

  return status ? true : false;
};

/**
 * Returns true if user is authenticated
 * @returns {boolean}
 */
const isUserAuthenticated = () => {
  const token = getUserToken();
  const status = getUserStatus();

  if (token && status) {
    return true;
  } else {
    return false;
  }
};

export {
  getUserToken,
  setUserToken,
  getUserStatus,
  setUserStatus,
  isUserAuthenticated,
};
