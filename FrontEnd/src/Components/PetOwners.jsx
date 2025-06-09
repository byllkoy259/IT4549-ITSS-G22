import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPersonCircleXmark } from "react-icons/fa6";
import SearchBar from "./SearchBar/SearchBar";
import "./PetOwners.css";

const PetOwners = () => {
  const navigate = useNavigate();
  const [owner, setOwner] = useState([]);
  const [role, setRole] = useState(""); // State to store user role

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/pet-owners")
      .then((result) => {
        if (result.data.Status) {
          setOwner(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    // Fetch user role from token
    const token = getCookie("token");
    if (token) {
      const decodedToken = decodeJWT(token);
      setRole(decodedToken.role);
    }
  }, []);

  // Function to get cookie value by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  // Function to decode JWT token manually
  const decodeJWT = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  };

  const handleDeleteOwner = (id) => {
    axios
      .delete("http://localhost:3000/auth/delete-pet-owner/" + id)
      .then((result) => {
        if (result.data.Status) {
          setOwner(owner.filter(o => o.owner_id !== id));
        } else {
          alert(result.data.Error);
        }
      });
  };

  return (
    <div className="petowners-container">
      <div className="petowners-header-bar">
        <h3 className="petowners-title">Danh sách Người dùng</h3>
        <div className="flex-1 mx-2">
          <SearchBar />
        </div>
        {role === "admin" && (
          <Link to="/dashboard/add-pet-owners" className="petowners-add-btn">
            + Thêm người dùng
          </Link>
        )}
      </div>
      <div className="petowners-table-wrap">
        {owner.length === 0 ? (
          <div className="petowners-empty">
            <FaPersonCircleXmark className="petowners-empty-icon" />
            <div className="mt-2">Không tìm thấy người dùng nào!</div>
          </div>
        ) : (
          <table className="petowners-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>EMSO</th>
                <th>Số điện thoại</th>
                {role === "admin" && <th>Hành động</th>}
              </tr>
            </thead>
            <tbody>
              {owner.map((own) => (
                <tr
                  key={own.owner_id}
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/dashboard/pet-owner/${own.owner_id}`);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <td>{own.owner_name}</td>
                  <td>{own.owner_email}</td>
                  <td>{own.owner_emso}</td>
                  <td>{own.owner_phone}</td>
                  {role === "admin" && (
                    <td>
                      <Link
                        to={`/dashboard/edit-pet-owner/` + own.owner_id}
                        className="petowners-edit-btn"
                        onClick={e => e.stopPropagation()}
                      >
                        Sửa
                      </Link>
                      <button
                        className="petowners-delete-btn"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteOwner(own.owner_id);
                        }}
                      >
                        Xóa
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PetOwners;
