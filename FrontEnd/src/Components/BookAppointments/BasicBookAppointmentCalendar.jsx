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
    appointments_starts_at: "",
    appointments_ends_at: "",
    owner_id: "",
    veterinarian_id: "",
    pet_id: "",
    service_id: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách bác sĩ, chủ nuôi, pet, dịch vụ
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vetRes, ownerRes, petRes, serviceRes] = await Promise.all([
          axios.get("/auth/veterinarians"),
          axios.get("/auth/pet-owners"),
          axios.get("/auth/pets"),
          axios.get("/auth/services"),
        ]);
        setVeterinarian(vetRes.data.Result || vetRes.data.Veterinarians || []);
        setOwner(ownerRes.data.Result || ownerRes.data.Owners || []);
        setPet(petRes.data.Result || petRes.data.Pets || []);
        setService(serviceRes.data.Result || serviceRes.data.Services || []);
      } catch (err) {
        setError("Không thể tải dữ liệu! " + (err.message || ""));
      }
    };
    fetchData();
  }, []);

  // Lọc pet thuộc owner đang chọn
  const filteredPets = appointment.owner_id
    ? pet.filter((p) => String(p.owner_id) === String(appointment.owner_id))
    : [];

  // Validate và gửi lên server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (
      !appointment.appointments_starts_at ||
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
    try {
      const res = await axios.post("/auth/add-appointment", {
        ...appointment,
        // appointments_created_at: new Date().toISOString(), // Nếu BE cần truyền, nhưng thường BE tự động sinh
      });
      if (res.data.Status) {
        navigate("/dashboard/preview-appointment");
      } else {
        setError(res.data.Error || "Thêm lịch hẹn không thành công.");
      }
    } catch (err) {
      setError("Lỗi khi thêm lịch hẹn: " + (err.response?.data?.Error || err.message));
    }
    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border bg-white shadow-sm">
        <h2 className="mb-4 text-primary">Thêm lịch hẹn (Bác sĩ)</h2>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form className="row g-2" onSubmit={handleSubmit}>
          <div className="col-12">
            <label className="form-label fw-bold">Chủ sở hữu</label>
            <select
              className="form-select"
              value={appointment.owner_id}
              onChange={(e) => setAppointment({ ...appointment, owner_id: e.target.value, pet_id: "" })}
              disabled={loading}
              required
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
            <label className="form-label fw-bold">Thú cưng</label>
            <select
              className="form-select"
              value={appointment.pet_id}
              onChange={(e) => setAppointment({ ...appointment, pet_id: e.target.value })}
              disabled={loading || !appointment.owner_id}
              required
            >
              <option value="">Chọn thú cưng</option>
              {filteredPets.map((p) => (
                <option key={p.pet_id} value={p.pet_id}>
                  {p.pet_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label fw-bold">Dịch vụ</label>
            <select
              className="form-select"
              value={appointment.service_id}
              onChange={(e) => setAppointment({ ...appointment, service_id: e.target.value })}
              disabled={loading}
              required
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
            <label className="form-label fw-bold">Bác sĩ thú y</label>
            <select
              className="form-select"
              value={appointment.veterinarian_id}
              onChange={(e) => setAppointment({ ...appointment, veterinarian_id: e.target.value })}
              disabled={loading}
              required
            >
              <option value="">Chọn bác sĩ</option>
              {veterinarian.map((vet) => (
                <option key={vet.veterinarian_id} value={vet.veterinarian_id}>
                  {vet.veterinarian_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <label className="form-label fw-bold">Thời gian bắt đầu</label>
            <input
              type="datetime-local"
              className="form-control"
              value={appointment.appointments_starts_at}
              onChange={(e) => setAppointment({ ...appointment, appointments_starts_at: e.target.value })}
              disabled={loading}
              required
            />
          </div>
          <div className="col-6">
            <label className="form-label fw-bold">Thời gian kết thúc</label>
            <input
              type="datetime-local"
              className="form-control"
              value={appointment.appointments_ends_at}
              onChange={(e) => setAppointment({ ...appointment, appointments_ends_at: e.target.value })}
              disabled={loading}
              required
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-success w-100 mt-2" disabled={loading}>
              {loading ? "Đang thêm..." : "Thêm lịch hẹn"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BasicBookAppointmentCalendar;
