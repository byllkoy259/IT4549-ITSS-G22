import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import { MdPets } from "react-icons/md";
import "./Pets.css";

const Pets = () => {
  const navigate = useNavigate();
  const [pet, setPet] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/pets")
      .then((result) => {
        if (result.data.Status) {
          setPet(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3000/auth/delete-pet/" + id)
      .then((result) => {
        if (result.data.Status) {
          setPet(pet.filter(p => p.pet_id !== id));
        } else {
          alert(result.data.Error);
        }
      });
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleAddPet = () => {
    setShow(false);
    navigate('/dashboard/add-pet');
  };
  const handleAddPetOwner = () => {
    setShow(false);
    navigate('/dashboard/add-pet-owners');
  };

  return (
    <div className="pets-container">
      <div className="pets-header-bar">
        <h3 className="pets-title">
          <MdPets className="pets-title-icon" /> Danh sách thú trong trung tâm
        </h3>
        <Button variant="success" className="pets-add-btn" onClick={handleShow}>
          + Thêm Pet
        </Button>

        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Thêm Pet</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex flex-column align-items-center gap-3">
            <Button variant="success" className="w-100" onClick={handleAddPet}>
              Khách hàng đã có tài khoản
            </Button>
            <Button variant="primary" className="w-100" onClick={handleAddPetOwner}>
              Khách hàng mới
            </Button>
          </Modal.Body>
        </Modal>
      </div>
      <div className="pets-table-wrap">
        {pet.length === 0 ? (
          <div className="pets-empty">
            <MdPets className="pets-empty-icon" />
            <span className="mt-3">Không có thú nào trong hệ thống.</span>
          </div>
        ) : (
          <table className="pets-table">
            <thead>
              <tr>
                <th>Tên Pet</th>
                <th>Mã Chip</th>
                <th>Loại Pet</th>
                <th>Giống (loại)</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pet.map((pets) => (
                <tr
                  key={pets.pet_id}
                  onClick={() => navigate(`/dashboard/pet/${pets.pet_id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{pets.pet_name}</td>
                  <td>{pets.pet_chip_number}</td>
                  <td>{pets.pet_type}</td>
                  <td>{pets.pet_breed}</td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/edit-pet/${pets.pet_id}`);
                      }}
                      className="pets-edit-btn"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(pets.pet_id);
                      }}
                      className="pets-delete-btn"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Pets;
