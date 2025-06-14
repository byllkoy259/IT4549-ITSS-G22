import { useNavigate } from "react-router-dom";

const Start = () => {
    const navigate = useNavigate();
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm">
        <div className="text-warning"></div>
        <h2 className="text-center">Đăng Nhập </h2>
        <div className="d-flex justify-content-between mt-5 mb-2">
          <button type="button" className="btn btn-primary" onClick={() => {navigate("/admin-login")}}>
            Admin
          </button>
          <button type="button" className="btn btn-success" onClick={() => {navigate("/veterinarian-login")}}>
            Bác Sỹ 
          </button>
          <button type="button" className="btn btn-dark" onClick={() => {navigate("/owner-login")}}>
            Khách Hàng 
          </button>
        </div>
      </div>
    </div>
  );
};

export default Start;
