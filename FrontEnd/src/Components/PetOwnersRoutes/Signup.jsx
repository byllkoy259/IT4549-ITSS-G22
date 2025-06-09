import { useState } from "react";
import "../style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [value, setValue] = useState({
    owner_name: "",
    owner_birthdate: "",
    owner_email: "",
    owner_password: "",
    confirm_password: "",
    owner_phone: "",
    owner_address: "",
  });

  const [error, setError] = useState(null);

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      value.owner_name.trim() === "" ||
      value.owner_birthdate.trim() === "" ||
      value.owner_email.trim() === "" ||
      value.owner_password.trim() === "" ||
      value.confirm_password.trim() === "" ||
      value.owner_phone.trim() === "" ||
      value.owner_address.trim() === ""
    ) {
      setError("Vui lòng nhập đầy đủ tất cả các trường!");
      return;
    }
    if (value.owner_password !== value.confirm_password) {
      setError("Mật khẩu và Nhập lại mật khẩu không khớp!");
      return;
    }
    axios
      .post("http://localhost:3000/owner/register", {
        owner_name: value.owner_name,
        owner_birthdate: value.owner_birthdate,
        owner_email: value.owner_email,
        owner_password: value.owner_password,
        owner_phone: value.owner_phone,
        owner_address: value.owner_address,
      })
      .then((result) => {
        if (result.data.Status) {
          navigate("/owner-login");
        } else {
          setError(result.data.Error);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi đăng ký:", err);
        setError("Đã xảy ra lỗi khi đăng ký: " + (err.message || "Không xác định"));
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm">
        <div className="text-warning">{error && <div>{error}</div>}</div>
        <h2>Trang đăng ký</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="owner_name">
              <strong>Tên:</strong>
            </label>
            <input
              type="text"
              name="owner_name"
              autoComplete="off"
              placeholder="Nhập tên của bạn"
              className="form-control rounded-0"
              value={value.owner_name}
              onChange={(e) => setValue({ ...value, owner_name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="owner_birthdate">
              <strong>Ngày sinh:</strong>
            </label>
            <input
              type="date"
              name="owner_birthdate"
              className="form-control rounded-0"
              value={value.owner_birthdate}
              onChange={(e) => setValue({ ...value, owner_birthdate: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="owner_email">
              <strong>Email:</strong>
            </label>
            <input
              type="email"
              name="owner_email"
              autoComplete="off"
              placeholder="Nhập địa chỉ email của bạn"
              className="form-control rounded-0"
              value={value.owner_email}
              onChange={(e) => setValue({ ...value, owner_email: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="owner_password">
              <strong>Mật khẩu:</strong>
            </label>
            <input
              type="password"
              name="owner_password"
              placeholder="Nhập mật khẩu của bạn"
              className="form-control rounded-0"
              value={value.owner_password}
              onChange={(e) => setValue({ ...value, owner_password: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirm_password">
              <strong>Nhập lại mật khẩu:</strong>
            </label>
            <input
              type="password"
              name="confirm_password"
              placeholder="Nhập lại mật khẩu của bạn"
              className="form-control rounded-0"
              value={value.confirm_password}
              onChange={(e) => setValue({ ...value, confirm_password: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="owner_phone">
              <strong>Số điện thoại:</strong>
            </label>
            <input
              type="text"
              name="owner_phone"
              autoComplete="off"
              placeholder="Nhập số điện thoại"
              className="form-control rounded-0"
              value={value.owner_phone}
              onChange={(e) => setValue({ ...value, owner_phone: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="owner_address">
              <strong>Địa chỉ:</strong>
            </label>
            <input
              type="text"
              name="owner_address"
              autoComplete="off"
              placeholder="Nhập địa chỉ của bạn"
              className="form-control rounded-0"
              value={value.owner_address}
              onChange={(e) => setValue({ ...value, owner_address: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0 mb-2">
            Đăng ký
          </button>
        </form>
        <div className="text-center mt-2">
          <p>
            Đã có tài khoản?{" "}
            <a href="/owner-login" style={{ color: "red", fontWeight: "bold" }}>
              Đăng nhập
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;