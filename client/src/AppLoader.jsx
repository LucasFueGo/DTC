import { BrowserRouter } from "react-router-dom";
import { ProviderWrapper } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import App from "./App.jsx";

const AppLoader= () => {
  return (
    <BrowserRouter>
      <ProviderWrapper>
        <SearchProvider>
          <App />
        </SearchProvider>
      </ProviderWrapper>
    </BrowserRouter>
  )
}

export default AppLoader