import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
function AppLayout() {
  // const { loading } = useContext(AuthContext);

  return (
    <div className="bg-prigmayBG">
      <div>
        <Navbar />
        <div className="min-h-screen">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default AppLayout;
