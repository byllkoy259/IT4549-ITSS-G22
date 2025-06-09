import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BasicBookAppointmentCalendar = () => {
  const navigate = useNavigate();
  const [veterinarian, setVeterinarian] = useState([]);
  const [owner, setOwner] = useState([]);
  const [pet, setPet] = useState([]);
  const [service, setService] = useState([]);
  const [appointment, setAppointment] = useState({
    appointments_created_at: "",
    appoitments_starts_at: "",
    appointments_ends_at: "",
    owner_id: "",
    veterinarian_id: "",
    pet_id: "",
    service_id: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/veterinarians")
      .then((result) => {
        if (result.data.Status) {
          setVeterinarian(result.data.Result);
        } else {
          setError(result.data.Error || "Không thể tải danh sách thú y.");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách thú y:", err);
        setError("Đã xảy ra lỗi khi tải danh sách thú y: " + (err.message || "Không xác định"));
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/pets")
      .then((result) => {
        if (result.data.Status) {
          setPet(result.data.Result);
        } else {
          setError(result.data.Error || "Không thể tải danh sách thú cưng.");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách thú cưng:", err);
        setError("Đã xảy ra lỗi khi tải danh sách thú cưng: " + (err.message || "Không xác định"));
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/pet-owners")
      .then((result) => {
        if (result.data.Status) {
          setOwner(result.data.Result);
        } else {
          setError(result.data.Error || "Không thể tải danh sách chủ sở hữu.");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách chủ sở hữu:", err);
        setError("Đã xảy ra lỗi khi tải danh sách chủ sở hữu: " + (err.message || "Không xác định"));
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/services")
      .then((result) => {
        if (result.data.Status) {
          setService(result.data.Result);
        } else {
          setError(result.data.Error || "Không thể tải danh sách dịch vụ.");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách dịch vụ:", err);
        setError("Đã xảy ra lỗi khi tải danh sách dịch vụ: " + (err.message || "Không xác định"));
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !appointment.appointments_created_at ||
      !appointment.appoitments_starts_at ||
      !appointment.appointments_ends_at ||
      !appointment.owner_id ||
      !appointment.veterinarian_id ||
      !appointment.pet_id ||
      !appointment.service_id
    ) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    setLoading(true);
    setError(null);
    const formattedAppointment = {
      ...appointment,
      appointments_created_at: new Date(appointment.appointments_created_at).toISOString(),
      appoitments_starts_at: new Date(appointment.appoitments_starts_at).toISOString(),
      appointments_ends_at: new Date(appointment.appointments_ends_at).toISOString(),
    };
    axios
      .post("http://localhost:3000/auth/add-appointment", formattedAppointment)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/preview-appointment");
        } else {
          setError(result.data.Error || "Thêm lịch hẹn không thành công.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi thêm lịch hẹn:", err);
        setError("Đã xảy ra lỗi khi thêm lịch hẹn: " + (err.message || "Không xác định"));
        setLoading(false);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <div className="text-warning">
          {error && <div>{error}</div>}
        </div>
        <h2>Thêm lịch hẹn</h2>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputCreated" className="form-label">
              Ngày tạo lịch hẹn
            </label>
            <input
              type="datetime-local"
              className="form-control rounded-0"
              id="inputCreated"
              placeholder="Nhập ngày tạo lịch hẹn"
              autoComplete="off"
              onChange={(e) =>
                setAppointment({
                  ...appointment,
                  appointments_created_at: e.target.value,
                })
              }
              disabled={loading}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputStart4" className="form-label">
              Thời gian bắt đầu
            </label>
            <input
              type="datetime-local"
              className="form-control rounded-0"
              id="inputStart4"
              placeholder="Nhập thời gian bắt đầu"
              autoComplete="off"
              onChange={(e) =>
                setAppointment({
                  ...appointment,
                  appoitments_starts_at: e.target.value,
                })
              }
              disabled={loading}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputEndDate4" className="form-label">
              Thời gian kết thúc
            </label>
            <input
              type="datetime-local"
              className="form-control rounded-0"
              id="inputEndDate4"
              placeholder="Nhập thời gian kết thúc"
              onChange={(e) =>
                setAppointment({
                  ...appointment,
                  appointments_ends_at: e.target.value,
                })
              }
              disabled={loading}
            />
          </div>
          <div className="col-12">
            <label htmlFor="owner" className="form-label">
              Chọn chủ sở hữu
            </label>
            <select
              name="owner"
              id="owner"
              className="form-select"
              value={appointment.owner_id}
              onChange={(e) =>
                setAppointment({
                  ...appointment,
                  owner_id: e.target.value,
                })
              }
              disabled={loading}
            >
              <option value="">Chọn chủ sở hữu</option>
              {owner.map((own) => (
                <option key={own.owner_id} value={own.owner_id}>
                  {own.owner_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="vet" className="form-label">
              Chọn thú y
            </label>
            <select
              name="vet"
              id="vet"
              className="form-select"
              value={appointment.veterinarian_id}
              onChange={(e) =>
                setAppointment({
                  ...appointment,
                  veterinarian_id: e.target.value,
                })
              }
              disabled={loading}
            >
              <option value="">Chọn thú y</option>
              {veterinarian.map((vet) => (
                <option key={vet.veterinarian_id} value={vet.veterinarian_id}>
                  {vet.veterinarian_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="pet" className="form-label">
              Chọn thú cưng
            </label>
            <select
              name="pet"
              id="pet"
              className="form-select"
              value={appointment.pet_id}
              onChange={(e) =>
                setAppointment({
                  ...appointment,
                  pet_id: e.target.value,
                })
              }
              disabled={loading}
            >
              <option value="">Chọn thú cưng</option>
              {pet.map((p) => (
                <option key={p.pet_id} value={p.pet_id}>
                  {p.pet_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="service" className="form-label">
              Chọn dịch vụ
            </label>
            <select
              name="service"
              id="service"
              className="form-select"
              value={appointment.service_id}
              onChange={(e) =>
                setAppointment({
                  ...appointment,
                  service_id: e.target.value,
                })
              }
              disabled={loading}
            >
              <option value="">Chọn dịch vụ</option>
              {service.map((serv) => (
                <option key={serv.service_id} value={serv.service_id}>
                  {serv.service_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <button
              type="submit"
              className="btn btn-success w-100 rounded-0 mb-2 mt-3"
              disabled={loading}
            >
              {loading ? "Đang thêm..." : "Thêm lịch hẹn"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BasicBookAppointmentCalendar;