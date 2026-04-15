import { BrowserRouter } from "react-router-dom";
import { ProviderWrapper } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import { StatsProvider } from "./context/StatsContext";
import { EquipmentProvider } from "./context/EquipmentContext";
import App from "./App.jsx";

const AppLoader= () => {
  return (
    <BrowserRouter>
      <ProviderWrapper>
        <StatsProvider>
          <SearchProvider>
            <EquipmentProvider>
              <App />
            </EquipmentProvider>
          </SearchProvider>
        </StatsProvider>
      </ProviderWrapper>
    </BrowserRouter>
  )
}

export default AppLoader