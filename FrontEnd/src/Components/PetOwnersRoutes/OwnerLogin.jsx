import { useState } from "react";
import "../style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OwnerLogin = () => {
  const [value, setValue] = useState({
    owner_email: "",
    owner_password: "",
  });

  const [error, setError] = useState(null);

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (value.owner_email.trim() === "" || value.owner_password.trim() === "") {
      setError("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }
    axios
      .post("http://localhost:3000/owner/owner-login", value)
      .then((result) => {
        if (result.data.loginStatus) {
          localStorage.setItem("ownerId", result.data.id);
          localStorage.setItem("valid", true);
          
          navigate("/HomePage/" + result.data.id);
        } else {
          setError(result.data.Error);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi đăng nhập:", err);
        setError("Đã xảy ra lỗi khi đăng nhập: " + (err.message || "Không xác định"));
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm">
        <div className="text-warning">{error && <div>{error}</div>}</div>
        <h2>Trang đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email:</strong>
            </label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Nhập địa chỉ email của bạn"
              className="form-control rounded-0"
              onChange={(e) => setValue({ ...value, owner_email: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Mật khẩu:</strong>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu của bạn"
              className="form-control rounded-0"
              onChange={(e) => setValue({ ...value, owner_password: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0 mb-2">
            Đăng nhập
          </button>
          <div className="mb-1">
            <input type="checkbox" name="tick" id="tick" className="me-2" />
            <label className="mx-1" htmlFor="tick">
              Nhớ tôi
            </label>
          </div>
        </form>
        <div className="text-center mt-2">
          <p>
            Chưa có tài khoản?{" "}
            <a href="/signup" >
              Đăng ký
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerLogin;