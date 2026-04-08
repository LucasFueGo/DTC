import { BrowserRouter } from "react-router-dom"; 
import { ProviderWrapper } from "./context/AuthContext";
import App from "./App.jsx";

const AppLoader= () => {
  return (
    <BrowserRouter>
      <ProviderWrapper >
          <App />
      </ProviderWrapper >
    </BrowserRouter>
  )
}

export default AppLoader