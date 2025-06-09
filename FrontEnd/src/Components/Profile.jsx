import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaUserCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState(""); // "Admin", "Veterinarian", "Owner"

  const getToken = () =>
    localStorage.getItem("token") ||
    document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    }
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3000/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data.result || res.data.Result || res.data.data);
        setForm(res.data.result || res.data.Result || res.data.data);
      } catch (err) {
        setProfile(null);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setEdit(true);
    setShowModal(true);
  };

  const handleCancel = () => {
    setEdit(false);
    setShowModal(false);
    setForm(profile);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = getToken();
      await axios.put(
        "http://localhost:3000/auth/profile",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(form);
      setEdit(false);
      setShowModal(false);
    } catch (err) {
      alert("Có lỗi khi cập nhật. Vui lòng thử lại!");
    }
  };

  if (loading)
    return (
      <div className="profile-loading">
        <div className="spinner-border text-primary" role="status"></div>
        <span className="ms-3">Đang tải thông tin cá nhân...</span>
      </div>
    );

  if (!profile)
    return (
      <div className="profile-empty">
        <FaUserCircle size={56} className="mb-2 text-muted" />
        <div>Không tìm thấy thông tin cá nhân!</div>
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-card">
        <FaUserCircle className="profile-avatar" />
        <div className="profile-info">
          {/* --- ADMIN --- */}
          {role === "Admin" && (
            <>
              <div className="profile-row">
                <span className="profile-label">Họ tên:</span>
                <span>{profile.admin_name || "Chưa có"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Vai trò:</span>
                <span>{profile.role_name || "Admin"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Phòng ban:</span>
                <span>{profile.category_name || "Chưa có"}</span>
              </div>
              {/* Không cho chỉnh sửa admin từ FE */}
            </>
          )}

          {/* --- VETERINARIAN --- */}
          {role === "Veterinarian" && (
            <>
              <div className="profile-row">
                <span className="profile-label">Họ tên:</span>
                <span>{profile.veterinarian_name || "Chưa có"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Email:</span>
                <span>{profile.veterinarian_email || "Chưa có"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Địa chỉ:</span>
                <span>{profile.veterinarian_address || "Chưa có"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Chuyên ngành:</span>
                <span>{profile.specialization_name || "Chưa có"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Vai trò:</span>
                <span>{profile.role_name || "Bác sĩ"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Phòng ban:</span>
                <span>{profile.category_name || "Chưa có"}</span>
              </div>
              <div className="profile-actions">
                <Button variant="primary" onClick={handleEdit}>
                  Chỉnh sửa
                </Button>
              </div>
            </>
          )}

          {/* --- OWNER --- */}
          {role === "Owner" && (
            <>
              <div className="profile-row">
                <span className="profile-label">Họ tên:</span>
                <span>{profile.owner_name || "Chưa có"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Email:</span>
                <span>{profile.owner_email || "Chưa có"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Số điện thoại:</span>
                <span>{profile.owner_phone || "Chưa có"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">EMSO:</span>
                <span>{profile.owner_emso || "Chưa có"}</span>
              </div>
              <div className="profile-actions">
                <Button variant="primary" onClick={handleEdit}>
                  Chỉnh sửa
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal chỉnh sửa */}
      {(role === "Veterinarian" || role === "Owner") && (
        <Modal show={showModal} onHide={handleCancel} centered>
          <Modal.Header closeButton>
            <Modal.Title>Cập nhật thông tin cá nhân</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {role === "Owner" && (
              <>
                <div className="mb-3">
                  <label className="form-label">Họ tên</label>
                  <input
                    type="text"
                    className="form-control"
                    name="owner_name"
                    value={form.owner_name || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="text"
                    className="form-control"
                    name="owner_phone"
                    value={form.owner_phone || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">EMSO</label>
                  <input
                    type="text"
                    className="form-control"
                    name="owner_emso"
                    value={form.owner_emso || ""}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            {role === "Veterinarian" && (
              <>
                <div className="mb-3">
                  <label className="form-label">Họ tên</label>
                  <input
                    type="text"
                    className="form-control"
                    name="veterinarian_name"
                    value={form.veterinarian_name || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Địa chỉ</label>
                  <input
                    type="text"
                    className="form-control"
                    name="veterinarian_address"
                    value={form.veterinarian_address || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Chuyên ngành (ID)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="specialization_id"
                    value={form.specialization_id || ""}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancel}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Lưu thay đổi
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Profile;
