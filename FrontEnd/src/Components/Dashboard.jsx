import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import Footer from "./Footer/Footer";
import "./Dashboard.css";

const SIDEBAR_WIDTH = 230; // Thay đổi chiều rộng sidebar ở đây nếu muốn

const Dashboard = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleLogout = () => {
    axios.get("http://localhost:3000/auth/logout").then((result) => {
      if (result.data.Status) {
        localStorage.removeItem("valid");
        navigate("/");
      }
    });
  };
  const getTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/dashboard/veterinarians":
        return "Veterinarians";
      case "/dashboard/pet-owners":
        return "Pet Owners";
      case "/dashboard/pets":
        return "Pets";
      case "/dashboard/categories":
        return "Categories";
      case "/dashboard/profile":
        return "Profile";
      default:
        return "Welcome!";
    }
  };
  return (
    <div className="dashboard-container">
      {/* Sidebar fixed */}
      <aside className="sidebar shadow-lg" style={{ width: SIDEBAR_WIDTH }}>
        <div className="sidebar-content">
          <Link to="/dashboard" className="sidebar-logo">
            <span>{getTitle()}</span>
          </Link>
          <ul className="sidebar-menu">
            <li>
              <Link to="/dashboard" className="sidebar-link">
                <i className="bi-speedometer2"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/veterinarians" className="sidebar-link">
                <i className="bi-people"></i>
                <span>Bác sĩ</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/pet-owners" className="sidebar-link">
                <i className="bi-clipboard-heart"></i>
                <span>Chủ Pet</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/pets" className="sidebar-link">
                <i className="bi-hearts"></i>
                <span>Pets</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/categories" className="sidebar-link">
                <i className="bi-columns"></i>
                <span>Danh mục</span>
              </Link>
            </li>
            {/* <li>
              <Link to="/dashboard/profile" className="sidebar-link">
                <i className="bi-person"></i>
                <span>Hồ sơ</span>
              </Link>
            </li> */}
            <li onClick={handleLogout}>
              <span className="sidebar-link logout-link" role="button">
                <i className="bi-power"></i>
                <span>Đăng xuất</span>
              </span>
            </li>
          </ul>
        </div>
      </aside>
      {/* Main content */}
      <div className="main-content-fixed">
        <header className="dashboard-header shadow-sm">
          <h4>Hệ thống quản lý phòng khám thú y</h4>
        </header>
        <div className="dashboard-outlet">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
