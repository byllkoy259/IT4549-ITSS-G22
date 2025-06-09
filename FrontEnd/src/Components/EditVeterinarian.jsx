import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditVeterinarian = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [specialization, setSpecialization] = useState([]);
  const [category, setCategory] = useState([]);
  const [role, setRole] = useState([]);
  const [veterinarian, setVeterinarian] = useState({
    veterinarian_name: "",
    veterinarian_email: "",
    veterinarian_password: "",
    veterinarian_address: "",
    specialization_id: "",
    category_id: "",
    role_id: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra id hợp lệ
    if (!id || id === "undefined" || isNaN(id)) {
      setError("ID không hợp lệ hoặc không được cung cấp. Vui lòng kiểm tra lại link.");
      setLoading(false);
      return;
    }

    console.log("Received ID from useParams:", id);
    axios
      .get("[invalid url, do not cite]")
      .then((result) => {
        if (result.data.Status) {
          setSpecialization(result.data.Result);
        } else {
          setError(result.data.Error || "Không thể tải danh sách chuyên ngành.");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách chuyên ngành:", err);
        setError("Đã xảy ra lỗi khi tải danh sách chuyên ngành: " + (err.message || "Không xác định"));
      });

    axios
      .get("[invalid url, do not cite]")
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          setError(result.data.Error || "Không thể tải danh sách danh mục.");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách danh mục:", err);
        setError("Đã xảy ra lỗi khi tải danh sách danh mục: " + (err.message || "Không xác định"));
      });

    axios
      .get("[invalid url, do not cite]")
      .then((result) => {
        if (result.data.Status) {
          setRole(result.data.Result);
        } else {
          setError(result.data.Error || "Không thể tải danh sách vai trò.");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách vai trò:", err);
        setError("Đã xảy ra lỗi khi tải danh sách vai trò: " + (err.message || "Không xác định"));
      });

    axios
      .get("[invalid url, do not cite]")
      .then((result) => {
        console.log("API response for veterinarian:", result.data);
        if (result.data.Status && result.data.Result && result.data.Result.length > 0) {
          setVeterinarian({
            veterinarian_name: result.data.Result[0].veterinarian_name,
            veterinarian_email: result.data.Result[0].veterinarian_email,
            veterinarian_password: result.data.Result[0].veterinarian_password,
            veterinarian_address: result.data.Result[0].veterinarian_address,
            specialization_id: result.data.Result[0].specialization_id,
            category_id: result.data.Result[0].category_id,
            role_id: result.data.Result[0].role_id,
          });
          setError(null);
        } else {
          setError("Không tìm thấy thông tin bác sĩ thú y với ID này.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải thông tin bác sĩ thú y:", err);
        setError("Đã xảy ra lỗi khi tải thông tin bác sĩ thú y: " + (err.message || "Không xác định"));
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!id || id === "undefined" || isNaN(id)) {
      setError("ID không hợp lệ hoặc không được cung cấp. Vui lòng kiểm tra lại link.");
      return;
    }
    if (
      !veterinarian.veterinarian_name ||
      !veterinarian.veterinarian_email ||
      !veterinarian.veterinarian_password ||
      !veterinarian.veterinarian_address ||
      !veterinarian.specialization_id ||
      !veterinarian.category_id ||
      !veterinarian.role_id
    ) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    setLoading(true);
    setError(null);
    console.log("Submitting update for ID:", id, "with data:", veterinarian);
    axios
      .put("[invalid url, do not cite] veterinarian")
      .then((result) => {
        console.log("Update response:", result.data);
        if (result.data.Status) {
          navigate("/dashboard/veterinarians");
        } else {
          setError(result.data.Error || "Cập nhật bác sĩ thú y không thành công.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi cập nhật bác sĩ thú y:", err);
        setError("Đã xảy ra lỗi khi cập nhật bác sĩ thú y: " + (err.message || "Không xác định"));
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-3">
        <div className="p-3 rounded w-50 border">
          <h2>Chỉnh sửa bác sĩ thú y</h2>
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
        <h2>Chỉnh sửa bác sĩ thú y</h2>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Tên bác sĩ thú y
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Nhập tên bác sĩ thú y"
              value={veterinarian.veterinarian_name}
              onChange={(e) =>
                setVeterinarian({ ...veterinarian, veterinarian_name: e.target.value })
              }
              disabled={loading}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputEmail4" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail4"
              placeholder="Nhập email"
              value={veterinarian.veterinarian_email}
              autoComplete="off"
              onChange={(e) =>
                setVeterinarian({ ...veterinarian, veterinarian_email: e.target.value })
              }
              disabled={loading}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputPassword" className="form-label">
              Mật khẩu
            </label>
            <input
              type="password"
              className="form-control rounded-0"
              id="inputPassword"
              placeholder="Nhập mật khẩu"
              value={veterinarian.veterinarian_password}
              autoComplete="off"
              onChange={(e) =>
                setVeterinarian({ ...veterinarian, veterinarian_password: e.target.value })
              }
              disabled={loading}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">
              Địa chỉ
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputAddress"
              placeholder="Nhập địa chỉ"
              value={veterinarian.veterinarian_address}
              autoComplete="off"
              onChange={(e) =>
                setVeterinarian({ ...veterinarian, veterinarian_address: e.target.value })
              }
              disabled={loading}
            />
          </div>
          <div className="col-12">
            <label htmlFor="specialization" className="form-label">
              Chuyên ngành
            </label>
            <select
              name="Specialization"
              id="specialization"
              className="form-select"
              value={veterinarian.specialization_id}
              onChange={(e) =>
                setVeterinarian({
                  ...veterinarian,
                  specialization_id: e.target.value,
                })
              }
              disabled={loading}
            >
              <option value="">Chọn chuyên ngành</option>
              {specialization.map((vet) => (
                <option key={vet.specialization_id} value={vet.specialization_id}>
                  {vet.specialization_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="category" className="form-label">
              Danh mục
            </label>
            <select
              name="Category"
              id="category"
              className="form-select"
              value={veterinarian.category_id}
              onChange={(e) =>
                setVeterinarian({
                  ...veterinarian,
                  category_id: e.target.value,
                })
              }
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
              Vai trò
            </label>
            <select
              name="Role"
              id="role"
              className="form-select"
              value={veterinarian.role_id}
              onChange={(e) =>
                setVeterinarian({
                  ...veterinarian,
                  role_id: e.target.value,
                })
              }
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
          <div className="col-12 mt-4">
            <button
              type="submit"
              className="btn btn-success w-100 rounded-0 mb-2"
              disabled={loading}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật bác sĩ thú y"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVeterinarian;