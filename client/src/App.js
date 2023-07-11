import { Outlet } from "react-router";
import "./App.css";
import DashboardMenu from "./components/DashboardMenu";

function App() {
  return (
    <div className="App">
      <div className="dashboard-container container_padding">
        <DashboardMenu />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
