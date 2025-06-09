import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditAdmin = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [admin, setAdmin] = useState({
        admin_name: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Kiểm tra id hợp lệ
        console.log("Received ID from useParams:", id);
        if (!id || id === "undefined" || isNaN(id)) {
            setError("ID không hợp lệ hoặc không được cung cấp. Vui lòng kiểm tra lại link.");
            setLoading(false);
            return;
        }

        setLoading(true);
        axios.get(`http://localhost:3000/auth/admin/${id}`)
            .then(result => {
                console.log("API response for admin:", result.data);
                if (result.data.Status && result.data.Result && result.data.Result.length > 0) {
                    setAdmin({
                        admin_name: result.data.Result[0].admin_name,
                        password: result.data.Result[0].admin_password,
                    });
                    setError(null);
                } else {
                    setError(result.data.Error || "Không tìm thấy dữ liệu admin với ID này.");
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("API error while fetching admin:", err);
                setError("Đã có lỗi xảy ra khi lấy dữ liệu: " + (err.message || "Không xác định"));
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!id || id === "undefined" || isNaN(id)) {
            setError("ID không hợp lệ hoặc không được cung cấp. Vui lòng kiểm tra lại link.");
            return;
        }
        if (!admin.admin_name.trim() || !admin.password.trim()) {
            setError("Vui lòng nhập đầy đủ tên quản trị và mật khẩu!");
            return;
        }
        setError(null);
        console.log("Submitting update for ID:", id, "with data:", admin);
        axios.put(`http://localhost:3000/auth/edit-admin/${id}`, admin)
            .then(result => {
                console.log("Update response:", result.data);
                if (result.data.Status) {
                    navigate("/dashboard");
                } else {
                    setError(result.data.Error || "Cập nhật không thành công.");
                }
            })
            .catch(err => {
                console.error("Update error:", err);
                setError("Đã có lỗi xảy ra khi cập nhật: " + (err.message || "Không xác định"));
            });
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center mt-3">
                <div className="p-3 rounded w-50 border">
                    <h2>Edit Admin</h2>
                    <div>Đang tải dữ liệu...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex justify-content-center align-items-center mt-3">
            <div className="p-3 rounded w-50 border">
                <div className="text-warning">
                    {error && <div>{error}</div>}
                </div>
                <h2>Edit Admin</h2>
                <form className="row g-1" onSubmit={handleSubmit}>
                    <div className="col-12">
                        <label htmlFor="inputAdminName" className="form-label">
                            Admin Name
                        </label>
                        <input
                            type="text"
                            className="form-control rounded-0"
                            id="inputAdminName"
                            placeholder="Enter Admin Name"
                            value={admin.admin_name}
                            autoComplete="off"
                            onChange={(e) => setAdmin({ ...admin, admin_name: e.target.value })}
                            disabled={loading}
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputPassword" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control rounded-0"
                            id="inputPassword"
                            placeholder="Enter Password"
                            value={admin.password}
                            autoComplete="off"
                            onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
                            disabled={loading}
                        />
                    </div>
                    <div className="col-12 mt-4">
                        <button
                            className="btn btn-success w-100 rounded-0 mb-2"
                            disabled={loading}
                        >
                            Edit Admin
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAdmin;