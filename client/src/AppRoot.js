import { Outlet } from "react-router";
import "./App.css";
import DashboardMenu from "./components/DashboardMenu";

const AppRoot = () => {
  return (
    <div className="dashboard-container container_padding">
      <DashboardMenu />
      <Outlet />
    </div>
  );
};

export default AppRoot;
