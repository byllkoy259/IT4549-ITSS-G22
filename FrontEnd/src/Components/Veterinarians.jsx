import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaCircle } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import "./Veterinarians.css";

const Veterinarians = () => {
  const [veterinarian, setVeterinarian] = useState([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/veterinarians")
      .then((result) => {
        if (result.data.Status) {
          setVeterinarian(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    // Lấy role từ token
    try {
      const token = getCookie("token");
      if (token) {
        const decodedToken = decodeJWT(token);
        if (decodedToken && decodedToken.role) {
          setRole(decodedToken.role.toLowerCase());
        }
      }
    } catch (error) {
      setRole("");
    }
  }, []);

  // Function to get cookie value by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return "";
  };

  // Function to decode JWT token manually
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return {};
    }
  };

  const handleDelete = (id) => {
    if(window.confirm("Bạn chắc chắn muốn xóa bác sĩ này?")) {
      axios
        .delete("http://localhost:3000/auth/delete-veterinarian/" + id)
        .then((result) => {
          if (result.data.Status) {
            setVeterinarian(prev => prev.filter(v => v.veterinarian_id !== id));
          } else {
            alert(result.data.Error);
          }
        });
    }
  };

  return (
    <div className="vet-container">
      <div className="vet-header">
        <div className="vet-header-title">
          <FaUserDoctor className="vet-header-icon" />
          <h3>Danh sách bác sĩ trong trung tâm</h3>
        </div>
        {role === "admin" && (
          <Link to="/dashboard/add-veterinarian" className="vet-add-btn">
            + Thêm bác sĩ
          </Link>
        )}
      </div>
      <div className="vet-table-wrap">
        {veterinarian.length === 0 ? (
          <div className="vet-empty">
            <FaUserDoctor className="vet-empty-icon" />
            <span>Không có bác sĩ nào trong danh sách.</span>
          </div>
        ) : (
          <table className="vet-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                {role === "admin" && <th>Thao tác</th>}
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {veterinarian.map((vets) => (
                <tr key={vets.veterinarian_id}>
                  <td>{vets.veterinarian_name}</td>
                  <td>{vets.veterinarian_email}</td>
                  {role === "admin" && (
                    <td>
                      <Link
                        to={`/dashboard/edit-veterinarian/${vets.veterinarian_id}`}
                        className="vet-edit-btn"
                        title="Sửa"
                      >
                        Sửa
                      </Link>
                      <button
                        className="vet-delete-btn"
                        onClick={() => handleDelete(vets.veterinarian_id)}
                        title="Xóa"
                      >
                        Xóa
                      </button>
                    </td>
                  )}
                  <td>
                    <FaCircle className="vet-online-icon" /> Đang hoạt động
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Veterinarians;
