import { useState, useEffect } from "react";
import moment from "moment";
import Calendar from "./Calendar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

const BasicCalendar = () => {
  const [show, setShow] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
const [editForm, setEditForm] = useState({
  start: "",
  end: "",
  owner_id: "",
  veterinarian_id: "",
  pet_id: "",
  service_id: "",
});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/auth/appointments-combined")
      .then((result) => {
        if (result.data.status) {
          setEvents(result.data.result || []);
        } else {
          setError(result.data.error || "Không thể tải danh sách lịch hẹn.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(
          "Đã xảy ra lỗi khi tải danh sách lịch hẹn: " + (err.message || "Không xác định")
        );
        setLoading(false);
      });
  }, []);

  // Chuyển đổi dữ liệu trả về thành events cho calendar
  const mappedEvents = events.map((event) => ({
  id: event.appointments_id,
  start: event.appointments_starts_at
    ? moment(event.appointments_starts_at).toDate()
    : null,
  end: event.appointments_ends_at
    ? moment(event.appointments_ends_at).toDate()
    : null,
  title: event.service_name || "Không tên dịch vụ",
  pet: event.pet_name,
  owner: event.owner_name,
  vet: event.veterinarian_name,
  // Thêm các trường id để sửa:
  owner_id: event.owner_id,
  veterinarian_id: event.veterinarian_id,
  pet_id: event.pet_id,
  service_id: event.service_id,
}));


  // Khi bấm vào event trên calendar
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShow(true);
    setEditMode(false);
    setEditForm({
      start: event.start ? moment(event.start).format('YYYY-MM-DDTHH:mm') : "",
      end: event.end ? moment(event.end).format('YYYY-MM-DDTHH:mm') : "",
    });
  };

  // Đóng modal, reset edit mode
  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setSelectedEvent(null);
  };

  // Khi nhấn "Sửa"
  const handleEdit = () => {
    setEditMode(true);
  };

  // Hàm gửi update lên server (chỉ sửa thời gian, muốn sửa trường khác bổ sung thêm)
  const handleUpdate = (e) => {
  e.preventDefault();
  setSaving(true);

axios.put(`http://localhost:3000/auth/edit-appointment/${selectedEvent.id}`, {
  appointments_starts_at: moment(editForm.start).toISOString(),
  appointments_ends_at: moment(editForm.end).toISOString(),
  owner_id: selectedEvent.owner_id,
  veterinarian_id: selectedEvent.veterinarian_id,
  pet_id: selectedEvent.pet_id,
  service_id: selectedEvent.service_id,
})


    .then((res) => {
      if (res.data.Status) {
        // Reload lại danh sách lịch
        axios
          .get("http://localhost:3000/auth/appointments-combined")
          .then((result) => {
            setEvents(result.data.result || []);
            setShow(false);
            setEditMode(false);
            setSelectedEvent(null);
          });
      } else {
        alert(res.data.Error || "Sửa lịch không thành công!");
      }
      setSaving(false);
    })
    .catch((err) => {
      alert("Có lỗi khi sửa lịch: " + (err.message || "Không xác định"));
      setSaving(false);
    });
};


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mt-3">{error}</div>;
  }

  return (
    <>
      <Calendar
        events={mappedEvents}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleEventClick}
      />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedEvent?.title || "Chi tiết lịch hẹn"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && editMode ? (
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label">Thời gian bắt đầu</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={editForm.start}
                  onChange={e =>
                    setEditForm((f) => ({ ...f, start: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Thời gian kết thúc</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={editForm.end}
                  onChange={e =>
                    setEditForm((f) => ({ ...f, end: e.target.value }))
                  }
                  required
                />
              </div>
              <Button type="submit" variant="success" disabled={saving}>
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
              <Button variant="secondary" onClick={() => setEditMode(false)} className="ms-2">
                Huỷ
              </Button>
            </form>
          ) : selectedEvent ? (
            <>
              <p>
                <b>Thời gian: </b>
                {selectedEvent.start && selectedEvent.end
                  ? `${moment(selectedEvent.start).format("LLL")} - ${moment(selectedEvent.end).format("LT")}`
                  : "Không xác định"}
              </p>
              <p>
                <b>Thú cưng: </b>
                {selectedEvent.pet}
              </p>
              <p>
                <b>Chủ sở hữu: </b>
                {selectedEvent.owner}
              </p>
              <p>
                <b>Thú y: </b>
                {selectedEvent.vet}
              </p>
            </>
          ) : (
            <p>Không có thông tin lịch hẹn.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedEvent && !editMode && (
            <Button variant="primary" onClick={handleEdit}>
              Sửa
            </Button>
          )}
          <Button variant="light" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BasicCalendar;
