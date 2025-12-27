import { apiConnector } from "./apiConnector";
import { auth } from "./apis";

export default async function checkLogin() {
  try {
    const res = await apiConnector("GET", auth.IS_LOGGED);

    if (res?.data?.success && res?.data?.user) {
      return {
        loggedIn: true,
        user: res.data.user,
      };
    }

    return { loggedIn: false };
  } catch (err) {
    // token invalid / expired / missing
    localStorage.removeItem("token");
    return { loggedIn: false };
  }
}
