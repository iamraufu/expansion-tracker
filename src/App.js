import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import AuthProvider from "./context/AuthProvider";
import Login from "./pages/Login";
// import Home from "./pages/Home";
// import Dashboard from "./pages/Dashboard";
// import NotFound from "./components/NotFound";
import PrivateOutlet from "./components/PrivateOutlet";
import Register from "./pages/Register";
import NavBar from "./components/NavBar";
import AddInvestor from "./pages/AddInvestor";
import Map from "./pages/Map";
import Partners from "./pages/Partners";
import AddLandlord from "./pages/AddLandlord";
import InvestorDetails from "./pages/InvestorDetails";
import LandlordDetails from "./pages/LandlordDetails";
import CreateSite from "./pages/CreateSite";
import SiteList from "./pages/SiteList";

function App() {
  const { pathname } = useLocation();


  return (
    <AuthProvider>
      <main>
        {pathname !== '/login' && pathname !== '/register' && <NavBar />}
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route index path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Partners />} />

          <Route path="/" element={<PrivateOutlet />}>
            <Route path="/" element={<Partners />} />
            <Route path="/investor/:id" element={<InvestorDetails />} />
            <Route path="/landlord/:id" element={<LandlordDetails />} />
            {/* <Route path="/dashboard/" element={<Dashboard />} /> */}
            <Route path="/addInvestor" element={<AddInvestor />} />
            <Route path="/addLandlord" element={<AddLandlord />} />
            <Route path="/addSite" element={<CreateSite />} />
            <Route path="/siteList" element={<SiteList />} />
            <Route path="/map" element={<Map />} />
          </Route>
        </Routes>
      </main>
    </AuthProvider>
  );
}

export default App;
