import "./App.css";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import AppRoot from "./AppRoot";

import { Provider } from "react-redux";
import { store } from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Navbar />
        <AppRoot />
        <Footer />
      </div>
    </Provider>
  );
}

export default App;
