import  { useEffect, useState } from 'react';
import {
  MDBContainer, MDBCard, MDBCardBody, MDBCardTitle, MDBRow, MDBCol, MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter
} from 'mdb-react-ui-kit';
import 'bootstrap-icons/font/bootstrap-icons.css'; // <== Đảm bảo đã cài npm install bootstrap-icons

const OwnerPetsVer2 = () => {
  const [pets, setPets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentPet, setCurrentPet] = useState({});
  const [form, setForm] = useState({
    pet_name: '', pet_chip_number: '', pet_type: '', pet_breed: '', pet_gender: '',
    pet_birthdate: '', pet_height: '', pet_weight: '', vaccination_id: '', pet_vaccination_date: '', veterinarian_id: ''
  });

  useEffect(() => {
    fetch('/owner/pets', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Mạng hoặc chưa đăng nhập');
        return res.json();
      })
      .then(data => { 
        if(data.Status) setPets(data.Pets); 
        else {
          alert(data.Error || "Bạn chưa đăng nhập, vui lòng đăng nhập lại!");
          window.location = '/owner-login';
        }
      })
      .catch(() => {
        alert("Không thể kết nối máy chủ hoặc chưa đăng nhập!");
        window.location = '/owner-login';
      });
  }, []);

  const handleInput = e => setForm({ ...form, [e.target.name]: e.target.value });

  const prepareForm = () => ({
    ...form,
    pet_height: form.pet_height ? form.pet_height : null,
    pet_weight: form.pet_weight ? form.pet_weight : null,
    vaccination_id: form.vaccination_id ? form.vaccination_id : null,
    veterinarian_id: form.veterinarian_id ? form.veterinarian_id : null
  });

  const handleSave = () => {
    const method = modalType === 'add' ? 'POST' : 'PUT';
    const url = modalType === 'add' 
      ? '/owner/pets' 
      : `/owner/pets/${currentPet.pet_id}`;
    fetch(url, {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prepareForm())
    })
      .then(res => res.json())
      .then(data => {
        if (data.Status) window.location.reload();
        else alert(data.Error || 'Lỗi thao tác');
      });
  };

  const handleDelete = (pet_id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thú cưng này?")) {
      fetch(`/owner/pets/${pet_id}`, { method: 'DELETE', credentials: 'include' })
        .then(res => res.json())
        .then(data => { 
          if (data.Status) window.location.reload();
          else alert(data.Error || "Lỗi xóa!");
        });
    }
  };

  const openModal = (type, pet = {}) => {
    setModalType(type);
    if (type === 'edit') {
      setCurrentPet(pet);
      setForm({
        pet_name: pet.pet_name || '',
        pet_chip_number: pet.pet_chip_number || '',
        pet_type: pet.pet_type || '',
        pet_breed: pet.pet_breed || '',
        pet_gender: pet.pet_gender || '',
        pet_birthdate: pet.pet_birthdate ? pet.pet_birthdate.split('T')[0] : '',
        pet_height: pet.pet_height || '',
        pet_weight: pet.pet_weight || '',
        vaccination_id: pet.vaccination_id || '',
        pet_vaccination_date: pet.pet_vaccination_date ? pet.pet_vaccination_date.split('T')[0] : '',
        veterinarian_id: pet.veterinarian_id || ''
      });
    } else {
      setForm({
        pet_name: '', pet_chip_number: '', pet_type: '', pet_breed: '', pet_gender: '',
        pet_birthdate: '', pet_height: '', pet_weight: '', vaccination_id: '', pet_vaccination_date: '', veterinarian_id: ''
      });
      setCurrentPet({});
    }
    setShowModal(true);
  };

  return (
    <MDBContainer className="py-4">
      <h2 className="fw-bold mb-4 text-primary text-center">Quản lý thú cưng</h2>
      <MDBBtn color="success" className="mb-4" onClick={() => openModal('add')}>Thêm thú cưng mới</MDBBtn>
      <MDBRow className="gy-4">
        {pets.map(pet => (
          <MDBCol md="6" lg="4" key={pet.pet_id}>
            <MDBCard>
              <MDBCardBody>
                <MDBCardTitle className="fw-bold">{pet.pet_name}</MDBCardTitle>
                <div><strong>Số chip:</strong> {pet.pet_chip_number}</div>
                <div><strong>Loài:</strong> {pet.pet_type}</div>
                <div><strong>Giống:</strong> {pet.pet_breed}</div>
                <div><strong>Giới tính:</strong> {pet.pet_gender === 'M' ? 'Đực' : pet.pet_gender === 'F' ? 'Cái' : 'Không rõ'}</div>
                <div><strong>Ngày sinh:</strong> {pet.pet_birthdate ? pet.pet_birthdate.split('T')[0] : ''}</div>
                <div><strong>Chiều cao:</strong> {pet.pet_height || ''} cm</div>
                <div><strong>Cân nặng:</strong> {pet.pet_weight || ''} kg</div>
                <div><strong>ID vaccine:</strong> {pet.vaccination_id || ''}</div>
                <div><strong>Ngày tiêm vaccine:</strong> {pet.pet_vaccination_date ? pet.pet_vaccination_date.split('T')[0] : ''}</div>
                <div><strong>ID bác sĩ:</strong> {pet.veterinarian_id || ''}</div>
                <div className="mt-3 d-flex gap-2">
                  <MDBBtn size="sm" color="warning" onClick={() => openModal('edit', pet)}>Sửa</MDBBtn>
                  <MDBBtn size="sm" color="danger" onClick={() => handleDelete(pet.pet_id)}>Xóa</MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        ))}
      </MDBRow>

      {/* Modal thêm/sửa */}
      <MDBModal open={showModal} setOpen={setShowModal} tabIndex="-1">
        <MDBModalHeader>
          {modalType === 'add' ? 'Thêm thú cưng mới' : 'Sửa thông tin thú cưng'}
        </MDBModalHeader>
        <MDBModalBody>
          {/* Thông tin cơ bản */}
          <div className="pet-form-section mb-4">
            <div className="section-title">
              <i className="bi bi-person-bounding-box me-2 text-primary"></i>
              <b>Thông tin cơ bản</b>
            </div>
            <label className="mb-1">Tên thú cưng</label>
            
          <MDBInput label="" name="pet_name" className="mb-3" value={form.pet_name} onChange={handleInput} required />
          <label className="mb-1">Mã số chip </label>
            <MDBInput label="" name="pet_chip_number" className="mb-3" value={form.pet_chip_number} onChange={handleInput} />
            <MDBRow className="mb-3">
              <MDBCol>
                 <label className="mb-1">Loại Pet</label>
                <MDBInput  placeholder="vd: chó, mèo, chim..."  name="pet_type" value={form.pet_type} onChange={handleInput} required />
              </MDBCol>
              <MDBCol>
                 <label className="mb-1">Thuộc giống </label>
                <MDBInput placeholder="vd: Chiwawa, mèo mun..."  name="pet_breed" value={form.pet_breed} onChange={handleInput} />
              </MDBCol>
            </MDBRow>
            <MDBRow className="mb-3 align-items-center">
              <MDBCol>
                <label className="mb-1">Giới tính</label>
                <select className="form-select" name="pet_gender" value={form.pet_gender} onChange={handleInput} required>
                  <option value="">Chọn giới tính</option>
                  <option value="M">Đực</option>
                  <option value="F">Cái</option>
                  <option value="U">Không rõ</option>
                </select>
              </MDBCol>
              <MDBCol>
                <label className="mb-1">Ngày sinh</label>
                <MDBInput name="pet_birthdate" type="date" value={form.pet_birthdate} onChange={handleInput} />
              </MDBCol>
            </MDBRow>
          </div>
          {/* Thông tin sức khỏe & vaccine */}
          <div className="pet-form-section mb-4">
            <div className="section-title">
              <i className="bi bi-heart-pulse me-2 text-danger"></i>
              <b>Sức khỏe & vaccine</b>
            </div>
            <MDBRow className="mb-3">
              <MDBCol>
                <MDBInput label="Chiều cao (cm)" name="pet_height" value={form.pet_height} onChange={handleInput} />
              </MDBCol>
              <MDBCol>
                <MDBInput label="Cân nặng (kg)" name="pet_weight" value={form.pet_weight} onChange={handleInput} />
              </MDBCol>
            </MDBRow>
            <MDBRow className="mb-3">
              <MDBCol>
                <MDBInput label="ID vaccine" name="vaccination_id" value={form.vaccination_id} onChange={handleInput} />
              </MDBCol>
              <MDBCol>
                <MDBInput label="Ngày tiêm vaccine" name="pet_vaccination_date" type="date" value={form.pet_vaccination_date} onChange={handleInput} />
              </MDBCol>
            </MDBRow>
            <MDBInput label="ID bác sĩ (nếu có)" name="veterinarian_id" value={form.veterinarian_id} onChange={handleInput} />
          </div>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={() => setShowModal(false)}>Hủy</MDBBtn>
          <MDBBtn color="success" onClick={handleSave}>Lưu</MDBBtn>
        </MDBModalFooter>
      </MDBModal>
      {/* Custom CSS để form thân thiện hơn */}
      <style>{`
        .pet-form-section {
          background: #f7fafd;
          border-radius: 10px;
          padding: 16px 14px 8px 14px;
          margin-bottom: 18px;
          box-shadow: 0 2px 8px #0001;
        }
        .section-title {
          font-size: 1.07rem;
          color: #228be6;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
        }
      `}</style>
    </MDBContainer>
  );
};

export default OwnerPetsVer2;
