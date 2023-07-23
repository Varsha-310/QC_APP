import "./App.css";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import AppRoot from "./AppRoot";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <Navbar />
          <AppRoot />
          <Footer />
        </div>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
