import React, { useEffect, useState } from "react";
import {
  MDBContainer, MDBCard, MDBCardBody, MDBCardTitle, MDBRow, MDBCol, MDBBtn, MDBModal,
  MDBModalHeader, MDBModalBody, MDBModalFooter, MDBInput, MDBSpinner
} from "mdb-react-ui-kit";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const OwnerAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    pet_id: "",
    veterinarian_id: "",
    service_id: "",
    appointments_starts_at: "",
    appointments_ends_at: ""
  });

  const [myPets, setMyPets] = useState([]);
  const [services, setServices] = useState([]);
  const [veterinarians, setVeterinarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // useEffect(() => {
  //   setLoading(true);
  //   Promise.all([
  //     fetch("/owner/appointments", { credentials: "include" }).then(res => res.json()),
  //     fetch("/owner/pets", { credentials: "include" }).then(res => res.json()),
  //     fetch("/auth/services", { credentials: "include" }).then(res => res.json()),
  //     fetch("/auth/veterinarians", { credentials: "include" }).then(res => res.json())
  //   ])
  //     .then(([appRes, petsRes, servicesRes, vetsRes]) => {
  //       console.log("Appointments Response:", appRes);
  //       console.log("Pets Response:", petsRes);
  //       console.log("Services Response:", servicesRes);
  //       console.log("Veterinarians Response:", vetsRes);
  //       setAppointments(appRes.Status && Array.isArray(appRes.Appointments) ? appRes.Appointments : []);
  //       setMyPets(petsRes.Status && Array.isArray(petsRes.Pets) ? petsRes.Pets : []);
  //       setServices(servicesRes.Status && Array.isArray(servicesRes.Services) ? servicesRes.Services : []);
  //       setVeterinarians(vetsRes.Status && Array.isArray(vetsRes.Veterinarians) ? vetsRes.Veterinarians : []);
  //       setLoading(false);
  //       if (appRes.Error || petsRes.Error || servicesRes.Error || vetsRes.Error) {
  //         alert("Lỗi khi tải dữ liệu: " + (appRes.Error || petsRes.Error || servicesRes.Error || vetsRes.Error));
  //         window.location = "/owner-login";
  //       }
  //     })
  //     .catch(err => {
  //       console.error("Fetch error:", err);
  //       setLoading(false);
  //       alert("Không thể kết nối máy chủ hoặc chưa đăng nhập!");
  //       window.location = "/owner-login";
  //     });
  // }, []);


useEffect(() => {
  setLoading(true);
  Promise.all([
    fetch("/owner/appointments", { credentials: "include" }).then(res => res.json()),
    fetch("/owner/pets", { credentials: "include" }).then(res => res.json()),
    fetch("/owner/services", { credentials: "include" }).then(res => res.json()),
    fetch("/owner/veterinarians", { credentials: "include" }).then(res => res.json())
  ])
    .then(([appRes, petsRes, servicesRes, vetsRes]) => {
      setAppointments(appRes.Status && Array.isArray(appRes.Appointments) ? appRes.Appointments : []);
      setMyPets(petsRes.Status && Array.isArray(petsRes.Pets) ? petsRes.Pets : []);
      setServices(servicesRes.Status && Array.isArray(servicesRes.Services) ? servicesRes.Services : []);
      setVeterinarians(vetsRes.Status && Array.isArray(vetsRes.Veterinarians) ? vetsRes.Veterinarians : []);
      setLoading(false);
      if (appRes.Error || petsRes.Error || servicesRes.Error || vetsRes.Error) {
        alert("Lỗi khi tải dữ liệu: " + (appRes.Error || petsRes.Error || servicesRes.Error || vetsRes.Error));
        window.location = "/owner-login";
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
      setLoading(false);
      alert("Không thể kết nối máy chủ hoặc chưa đăng nhập!");
      window.location = "/owner-login";
    });
}, []);




  const handleSave = () => {
    if (!form.pet_id || !form.veterinarian_id || !form.service_id || !form.appointments_starts_at || !form.appointments_ends_at) {
      alert("Vui lòng nhập đầy đủ thông tin lịch hẹn!");
      return;
    }
    fetch("/owner/appointments", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.Status) window.location.reload();
        else alert(data.Error || "Lỗi thao tác!");
      })
      .catch(err => console.error("Save error:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá lịch hẹn này?")) {
      fetch(`/owner/appointments/${id}`, { method: "DELETE", credentials: "include" })
        .then(res => res.json())
        .then(data => {
          if (data.Status) window.location.reload();
          else alert(data.Error || "Lỗi thao tác!");
        })
        .catch(err => console.error("Delete error:", err));
    }
  };

  const handleInput = e => setForm({ ...form, [e.target.name]: e.target.value });

  const closeModal = () => {
    setShowModal(false);
    setForm({
      pet_id: "",
      veterinarian_id: "",
      service_id: "",
      appointments_starts_at: "",
      appointments_ends_at: ""
    });
  };

  return (
    <MDBContainer className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0 text-primary" style={{ letterSpacing: 1 }}>🗓️ Lịch hẹn thú cưng</h2>
        <MDBBtn color="light" className="border" onClick={() => navigate("/HomePage/1")}>
          <i className="bi bi-house-door-fill me-2"></i>Về trang chủ
        </MDBBtn>
      </div>
      <MDBBtn color="info" className="mb-4 shadow-sm" style={{ fontWeight: 600 }} onClick={() => setShowModal(true)}>
        <i className="bi bi-plus-circle me-2"></i>Đặt lịch hẹn mới
      </MDBBtn>
      {loading ? (
        <div className="text-center py-5">
          <MDBSpinner role="status" />
          <div>Đang tải dữ liệu...</div>
        </div>
      ) : (
        <MDBRow className="gy-4">
          {(appointments || []).length === 0 ? (
            <div className="text-center text-muted pb-5 w-100">Chưa có lịch hẹn nào.</div>
          ) : (
            (appointments || []).map(app => (
              <MDBCol md="6" lg="4" key={app.appointments_id}>
                <MDBCard className="shadow appointment-card border-0 h-100">
                  <MDBCardBody>
                    <MDBCardTitle className="fw-bold mb-2 d-flex align-items-center">
                      <i className="bi bi-calendar2-week me-2 text-info fs-4"></i>
                      {app.pet_name}
                    </MDBCardTitle>
                    <div className="mb-2"><span className="badge rounded-pill bg-secondary me-2">Dịch vụ</span> <b>{app.service_name}</b></div>
                    <div className="mb-2"><span className="badge rounded-pill bg-warning text-dark me-2">Bác sĩ</span> <b>{app.veterinarian_name || "Chưa phân công"}</b></div>
                    <div className="mb-2"><span className="badge rounded-pill bg-success me-2">Thời gian</span> <b>
                      {moment(app.appointments_starts_at).format("HH:mm DD/MM/YYYY")} {"→"} {moment(app.appointments_ends_at).format("HH:mm DD/MM/YYYY")}
                    </b></div>
                    <div className="mt-3 d-flex gap-2">
                      <MDBBtn size="sm" color="danger" onClick={() => handleDelete(app.appointments_id)}>
                        <i className="bi bi-trash"></i> Xoá
                      </MDBBtn>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            ))
          )}
        </MDBRow>
      )}

      {/* Modal đặt lịch mới */}
      <MDBModal open={showModal} setOpen={setShowModal} tabIndex="-1">
        <MDBModalHeader style={{ background: "#e3f3ff" }}>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#1376db" }}>
            Đặt lịch hẹn mới cho thú cưng
          </span>
        </MDBModalHeader>
        <MDBModalBody style={{ background: "#f8fbfe" }}>
          <div className="mb-3">
            <label className="form-label fw-semibold" htmlFor="pet_id">Chọn thú cưng</label>
            <select name="pet_id" className="form-select" value={form.pet_id} onChange={handleInput} required>
              <option value="">-- Chọn thú cưng --</option>
              {(myPets || []).map(p => (
                <option key={p.pet_id} value={p.pet_id}>{p.pet_name}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold" htmlFor="service_id">Dịch vụ</label>
            <select name="service_id" className="form-select" value={form.service_id} onChange={handleInput} required>
              <option value="">-- Chọn dịch vụ --</option>
              {(services || []).map(s => (
                <option key={s.service_id} value={s.service_id}>{s.service_name}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold" htmlFor="veterinarian_id">Chọn bác sĩ</label>
            <select name="veterinarian_id" className="form-select" value={form.veterinarian_id} onChange={handleInput} required>
              <option value="">-- Chọn bác sĩ --</option>
              {(veterinarians || []).map(v => (
                <option key={v.veterinarian_id} value={v.veterinarian_id}>{v.veterinarian_name}</option>
              ))}
            </select>
          </div>
          <label className="form-label fw-semibold" htmlFor="appointments_starts_at">Thời gian bắt đầu</label>
          <MDBInput name="appointments_starts_at" type="datetime-local" className="mb-3" value={form.appointments_starts_at} onChange={handleInput} required />
          <label className="form-label fw-semibold" htmlFor="appointments_ends_at">Thời gian kết thúc</label>
          <MDBInput name="appointments_ends_at" type="datetime-local" className="mb-3" value={form.appointments_ends_at} onChange={handleInput} required />
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={closeModal}>Hủy</MDBBtn>
          <MDBBtn color="success" onClick={handleSave}><i className="bi bi-check-circle me-1"></i>Lưu</MDBBtn>
        </MDBModalFooter>
      </MDBModal>
      <style>
{`
  .modal-book-appointment .modal-content {
    border-radius: 18px;
    border: none;
    background: #f8fbfe;
    box-shadow: 0 8px 24px #c8d8ff44;
  }
  .modal-book-appointment .modal-header {
    background: #e3f3ff;
    border-top-left-radius: 18px;
    border-top-right-radius: 18px;
    border-bottom: none;
  }
  .modal-book-appointment .modal-title {
    font-size: 1.25rem;
    font-weight: bold;
    color: #1565c0;
    letter-spacing: 1px;
  }
  .modal-book-appointment label.form-label {
    color: #1976d2;
    font-weight: 600;
    margin-bottom: 4px;
  }
  .modal-book-appointment .form-select, 
  .modal-book-appointment .form-control,
  .modal-book-appointment input[type="datetime-local"] {
    border-radius: 8px;
    border: 1.5px solid #c4d2ea;
    font-size: 1rem;
    margin-bottom: 18px;
    padding: 8px 12px;
    box-shadow: none;
    background: #fff;
    transition: border 0.2s;
  }
  .modal-book-appointment .form-select:focus,
  .modal-book-appointment .form-control:focus,
  .modal-book-appointment input[type="datetime-local"]:focus {
    border: 1.5px solid #1976d2;
    box-shadow: 0 0 0 2px #c2e0ff;
  }
  .modal-book-appointment .modal-footer {
    border-top: none;
    padding-top: 8px;
    padding-bottom: 20px;
    background: #f8fbfe;
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
  }
  @media (max-width: 600px) {
    .modal-book-appointment .modal-content {
      border-radius: 10px;
      padding: 8px;
    }
  }
`}
</style>
    </MDBContainer>
  );
};

export default OwnerAppointments;