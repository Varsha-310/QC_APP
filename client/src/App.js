import "./App.css";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import AppRoot from "./AppRoot";

function App() {
  return (
    <div className="App">
      <Navbar />
      <AppRoot />
      <Footer />
    </div>
  );
}

export default App;
