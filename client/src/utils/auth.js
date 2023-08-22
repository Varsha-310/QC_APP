import { redirect } from "react-router";
import { isUserAuthenticated } from "./userAuthenticate";

export function checkAuthLoader(props) {
  const authenticated = isUserAuthenticated();

  if (!authenticated) {
    return redirect("/kyc-status");
  }

  //   return redirect("/");
}
