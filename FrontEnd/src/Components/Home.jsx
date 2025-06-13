import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaCircle } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Home.css";

const Home = () => {
    const [adminTotal, setAdminTotal] = useState();
    const [veterinariansTotal, setVeterinariansTotal] = useState();
    const [petOwnersTotal, setPetOwnersTotal] = useState();
    const [petsTotal, setPetsTotal] = useState();
    const [admins, setAdmins] = useState([]);
    const [events, setEvents] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [role, setRole] = useState(""); // State để lưu vai trò người dùng
    const [error, setError] = useState(null); // State để hiển thị lỗi

    useEffect(() => {
        // Lấy vai trò người dùng từ token
        const token = getCookie("token");
        if (token) {
            const decodedToken = decodeJWT(token);
            setRole(decodedToken.role);
        }

        adminCount();
        veterinariansCount();
        AdminRecords();
        petOwnersCount();
        petsCount();
        fetchAppointments();
    }, []);

    // Hàm lấy giá trị cookie theo tên
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    };

    // Hàm giải mã JWT token thủ công
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

    const AdminRecords = () => {
        axios
            .get("http://localhost:3000/auth/admin-records")
            .then((result) => {
                if (result.data.Status) {
                    setAdmins(result.data.Result);
                } else {
                    setError(result.data.Error);
                }
            })
            .catch((err) => {
                setError("Đã xảy ra lỗi khi tải danh sách quản trị viên: " + (err.message || "Không xác định"));
            });
    };

    const adminCount = () => {
        axios
            .get("http://localhost:3000/auth/admin-count")
            .then((result) => {
                if (result.data.Status) {
                    setAdminTotal(result.data.Result[0].admin);
                }
            })
            .catch((err) => {});
    };

    const veterinariansCount = () => {
        axios
            .get("http://localhost:3000/auth/veterinarians-count")
            .then((result) => {
                if (result.data.Status) {
                    setVeterinariansTotal(result.data.Result[0].veterinarian);
                }
            })
            .catch((err) => {});
    };

    const petsCount = () => {
        axios
            .get("http://localhost:3000/auth/pets-count")
            .then((result) => {
                if (result.data.Status) {
                    setPetsTotal(result.data.Result[0].pets);
                }
            })
            .catch((err) => {});
    };

    const petOwnersCount = () => {
        axios
            .get("http://localhost:3000/auth/pet-owners-count")
            .then((result) => {
                if (result.data.Status) {
                    setPetOwnersTotal(result.data.Result[0].petowners);
                }
            })
            .catch((err) => {});
    };

    const handleDeleteAdmin = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa quản trị viên này không?")) {
            axios
                .delete(`http://localhost:3000/auth/delete-admin/${id}`)
                .then((result) => {
                    if (result.data.Status) {
                        setAdmins(admins.filter((admin) => admin.admin_id !== id));
                    } else {
                        setError(result.data.Error);
                    }
                })
                .catch((err) => {
                    setError("Đã xảy ra lỗi khi xóa quản trị viên: " + (err.message || "Không xác định"));
                });
        }
    };

    const fetchAppointments = () => {
        axios
            .get("http://localhost:3000/auth/appointments-combined")
            .then((result) => {
                if (result.data.status) {
                    setEvents(result.data.result);
                } else {
                    setError(result.data.error);
                }
            })
            .catch((err) => {
                setError("Đã xảy ra lỗi khi tải lịch hẹn: " + (err.message || "Không xác định"));
            });
    };

    // Hàm tính tổng chi phí các lịch hẹn (an toàn, đúng chuẩn)
    const calcTotalCost = (appointments) => {
        if (!Array.isArray(appointments)) return 0;
        return appointments.reduce((acc, event) => {
            const price = Number(event.service_price) || 0;
            return acc + price;
        }, 0);
    };

    useEffect(() => {
        // Tính tổng chi phí khi sự kiện hoặc ngày thay đổi
        const filteredAppointments = events.filter((event) =>
            moment(event.appointments_starts_at).isBetween(
                moment(startDate).startOf("day"),
                moment(endDate).endOf("day"),
                undefined,
                "[]"
            )
        );
        setTotalCost(calcTotalCost(filteredAppointments));
    }, [events, startDate, endDate]);

    const filteredAppointments = events.filter((event) =>
        moment(event.appointments_starts_at).isBetween(
            moment(startDate).startOf("day"),
            moment(endDate).endOf("day"),
            undefined,
            "[]"
        )
    );

   return (
  <div className="dashboard-home">

    {/* Tổng quan */}
    <div className="dashboard-stats">
      <div className="dashboard-stat-card admin">
        <div className="stat-icon"><RiAdminFill size={28} /></div>
        <div>
          <div className="stat-label">Quản trị viên</div>
          <div className="stat-value">{adminTotal ?? 0}</div>
        </div>
      </div>
      <div className="dashboard-stat-card vet">
        <div className="stat-icon"><FaCircle size={22} color="#36c" /></div>
        <div>
          <div className="stat-label">Bác sĩ</div>
          <div className="stat-value">{veterinariansTotal ?? 0}</div>
        </div>
      </div>
      <div className="dashboard-stat-card owner">
        <div className="stat-icon"><FaCircle size={22} color="#4cd137" /></div>
        <div>
          <div className="stat-label">Khách hàng</div>
          <div className="stat-value">{petOwnersTotal ?? 0}</div>
        </div>
      </div>
      <div className="dashboard-stat-card pet">
        <div className="stat-icon"><FaCircle size={22} color="#f39c12" /></div>
        <div>
          <div className="stat-label">Thú cưng</div>
          <div className="stat-value">{petsTotal ?? 0}</div>
        </div>
      </div>
    </div>

    {/* Lịch hẹn */}
    <div className="dashboard-section mt-4">
      <div className="dashboard-section-header">
        <h3>Lịch hẹn</h3>
        <div className="dashboard-date-controls">
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="dd-MM-yyyy"
            className="dashboard-datepicker"
            placeholderText="Ngày bắt đầu"
          />
          <span className="mx-2">-</span>
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="dd-MM-yyyy"
            className="dashboard-datepicker"
            placeholderText="Ngày kết thúc"
          />
          <Link to="/dashboard/preview-appointment" className="btn btn-light mx-2">
            Xem lịch
          </Link>
          <Link to="/dashboard/add-appointment" className="btn btn-success mx-1">
            Đặt lịch hẹn
          </Link>
        </div>
      </div>
      <div className="dashboard-table-wrap">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th style={{ minWidth: 105 }}>Ngày</th>
              <th className="text-center" style={{ width: 90 }}>Bắt đầu</th>
              <th className="text-center" style={{ width: 90 }}>Kết thúc</th>
              <th style={{ minWidth: 120 }}>Dịch vụ</th>
              <th style={{ minWidth: 105 }}>Thú cưng</th>
              <th style={{ minWidth: 110 }}>Bác sĩ</th>
              <th className="text-end" style={{ width: 100 }}>Chi phí</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((event) => (
                <tr key={event.appointments_id}>
                  <td>{moment(event.appointments_starts_at).format("DD-MM-YYYY")}</td>
                  <td className="text-center">{moment(event.appointments_starts_at).format("LT")}</td>
                  <td className="text-center">{moment(event.appointments_ends_at).format("LT")}</td>
                  <td>{event.service_name}</td>
                  <td>{event.pet_name}</td>
                  <td>{event.veterinarian_name}</td>
                  <td className="text-end">
                    {Number(event.service_price).toLocaleString()} €
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted py-3">
                  <FaCalendarAlt /> Không tìm thấy lịch hẹn.
                </td>
              </tr>
            )}
            <tr className="dashboard-total-row">
              <td><b>Tổng chi phí:</b></td>
              <td colSpan="5"></td>
              <td className="text-end"><b>{Number(totalCost).toLocaleString()} €</b></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* Danh sách quản trị viên */}
    <div className="dashboard-section mt-5">
      <div className="dashboard-section-header">
        <h3>Danh sách quản trị viên</h3>
        {role === "admin" && (
          <Link to="/dashboard/add-admin" className="btn btn-success">
            Thêm quản trị viên
          </Link>
        )}
      </div>
      <div className="dashboard-table-wrap">
        {error && <div className="text-danger mb-2">{error}</div>}
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Tên quản trị viên</th>
              <th>Trạng thái</th>
              {role === "admin" && <th>Hành động</th>}
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan={role === "admin" ? 3 : 2} className="text-center text-muted py-3">
                  <RiAdminFill /> Không tìm thấy quản trị viên.
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.admin_id}>
                  <td>{admin.admin_name || "N/A"}</td>
                  <td><FaCircle color="green" /> Có sẵn</td>
                  {role === "admin" && (
                    <td>
                      <Link
                        to={`/dashboard/edit-admin/${admin.admin_id}`}
                        className="btn btn-success btn-sm me-2"
                      >Sửa</Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteAdmin(admin.admin_id)}
                      >Xóa</button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

};

export default Home;
