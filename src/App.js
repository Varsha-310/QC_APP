import { Outlet } from "react-router";
import "./App.css";
import { PrimaryBtn, TabBox, TabItemLable } from "./components/Components";
import Navbar from "./layouts/Navbar";
import DashboardMenu from "./components/DashboardMenu";

function App() {
  return (
    <div className="App">
      {/* <Navbar /> */}
      <div className="dashboard-container container_padding">
        <DashboardMenu />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
