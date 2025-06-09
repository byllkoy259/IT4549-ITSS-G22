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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/auth/appointments-combined")
      .then((result) => {
        console.log("Dữ liệu lịch hẹn:", result.data);
        if (result.data.status) {
          setEvents(result.data.result);
        } else {
          setError(result.data.error || "Không thể tải danh sách lịch hẹn.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải lịch hẹn:", err);
        setError("Đã xảy ra lỗi khi tải danh sách lịch hẹn: " + (err.message || "Không xác định"));
        setLoading(false);
      });
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    handleShow();
  };

  return (
    <>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center mt-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : (
        <Calendar
          events={events.map((event) => ({
            start: moment(event.appoitments_starts_at).toDate(),
            end: moment(event.appointments_ends_at).toDate(),
            title: event.service_name,
            pet: event.pet_name,
            owner: event.owner_name,
            vet: event.veterinarian_name,
          }))}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleEventClick}
        />
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent ? selectedEvent.title : "Chi tiết lịch hẹn"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent ? (
            <>
              <p>Thời gian: {moment(selectedEvent.start).format("LLL")} - {moment(selectedEvent.end).format("LT")}</p>
              <p>Thú cưng: {selectedEvent.pet}</p>
              <p>Chủ sở hữu: {selectedEvent.owner}</p>
              <p>Thú y: {selectedEvent.vet}</p>
            </>
          ) : (
            <p>Không có thông tin lịch hẹn.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Sửa
          </Button>
          <Button variant="light" onClick={handleClose}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BasicCalendar;