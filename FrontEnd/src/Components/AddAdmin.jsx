import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddAdmin = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState([]);
    const [role, setRole] = useState([]);
    const [admin, setAdmin] = useState({
        admin_name: "", // Thay email bằng admin_name để đồng bộ với EditAdmin
        password: "",
        category_id: "",
        role_id: "",
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios
            .get("http://localhost:3000/auth/role-types")
            .then((result) => {
                if (result.data.Status) {
                    setRole(result.data.Result);
                } else {
                    setError(result.data.Error || "Không thể tải danh sách vai trò.");
                }
            })
            .catch((err) => {
                console.error("Error fetching roles:", err);
                setError("Đã có lỗi xảy ra khi tải danh sách vai trò: " + (err.message || "Không xác định"));
            });
    }, []);

    useEffect(() => {
        axios
            .get("http://localhost:3000/auth/categories")
            .then((result) => {
                if (result.data.Status) {
                    setCategory(result.data.Result);
                } else {
                    setError(result.data.Error || "Không thể tải danh sách danh mục.");
                }
            })
            .catch((err) => {
                console.error("Error fetching categories:", err);
                setError("Đã có lỗi xảy ra khi tải danh sách danh mục: " + (err.message || "Không xác định"));
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!admin.admin_name.trim() || !admin.password.trim() || !admin.category_id || !admin.role_id) {
            setError("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        setLoading(true);
        setError(null);
        axios
            .post("http://localhost:3000/auth/add-admin", admin)
            .then((result) => {
                if (result.data.Status) {
                    navigate("/dashboard");
                } else {
                    setError(result.data.Error || "Thêm admin không thành công.");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error adding admin:", err);
                setError("Đã có lỗi xảy ra khi thêm admin: " + (err.message || "Không xác định"));
                setLoading(false);
            });
    };

    return (
        <div className="d-flex justify-content-center align-items-center mt-5">
            <div className="p-3 rounded w-50 border">
                <div className="text-warning">
                    {error && <div>{error}</div>}
                </div>
                <h2>Add Admin</h2>
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
                        <label htmlFor="inputPassword4" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control rounded-0"
                            id="inputPassword4"
                            placeholder="Enter Password"
                            value={admin.password}
                            onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
                            disabled={loading}
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="category" className="form-label">
                            Select Category
                        </label>
                        <select
                            name="Category"
                            id="category"
                            className="form-select"
                            value={admin.category_id}
                            onChange={(e) => setAdmin({ ...admin, category_id: e.target.value })}
                            disabled={loading}
                        >
                            <option value="">Chọn danh mục</option>
                            {category.map((cat) => (
                                <option key={cat.category_id} value={cat.category_id}>
                                    {cat.category_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12">
                        <label htmlFor="role" className="form-label">
                            Select Role
                        </label>
                        <select
                            name="role"
                            id="role"
                            className="form-select"
                            value={admin.role_id}
                            onChange={(e) => setAdmin({ ...admin, role_id: e.target.value })}
                            disabled={loading}
                        >
                            <option value="">Chọn vai trò</option>
                            {role.map((rol) => (
                                <option key={rol.role_id} value={rol.role_id}>
                                    {rol.role_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12">
                        <button
                            type="submit"
                            className="btn btn-success w-100 rounded-0 mb-2"
                            disabled={loading}
                        >
                            {loading ? "Đang thêm..." : "Add Admin"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAdmin;