import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardTitle,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
} from "mdb-react-ui-kit";
import { formatDate } from "../Formaters/FormatDate";
import UserImage from "../../assets/sampleImages/user.png";
import "./OwnerDetails.css";

const OwnerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [owner, setOwner] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/auth/pet-owner/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setOwner(result.data.Result[0]);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleLogout = () => {
    axios.get("http://localhost:3000/auth/logout").then((result) => {
      if (result.data.Status) {
        localStorage.removeItem("valid");
        navigate("/");
      }
    });
  };

  const handleDeleteOwner = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này không?")) {
      axios
        .delete(`http://localhost:3000/auth/delete-pet-owner/${id}`)
        .then((result) => {
          if (result.data.Status) {
            navigate("/");
          } else {
            alert(result.data.Error);
          }
        });
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancelEdit = () => setIsEditing(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3000/auth/edit-pet-owner/${id}`, owner)
      .then((result) => {
        if (result.data.Status) {
          setIsEditing(false);
          window.location.reload();
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="owner-details-container">
      <h2 className="section-header">Thông tin người dùng - {owner.owner_name}</h2>
      <MDBContainer>
        <MDBRow className="justify-content-center">
          <MDBCol md="9" lg="7" xl="5">
            <MDBCard className="owner-card">
              <MDBCardBody className="text-center p-4">
                <MDBCardImage src={UserImage} className="owner-image" alt="User" />
                {isEditing ? (
                  <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-12">
                      <label className="form-label">Tên</label>
                      <input type="text" className="form-control" value={owner.owner_name} onChange={(e) => setOwner({ ...owner, owner_name: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Mã khách hàng</label>
                      <input type="text" className="form-control" value={owner.owner_emso} onChange={(e) => setOwner({ ...owner, owner_emso: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Ngày sinh</label>
                      <input type="date" className="form-control" value={owner.owner_birthdate ? owner.owner_birthdate.split("T")[0] : ""} onChange={(e) => setOwner({ ...owner, owner_birthdate: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" value={owner.owner_email} onChange={(e) => setOwner({ ...owner, owner_email: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Mật khẩu</label>
                      <input type="password" className="form-control" value={owner.owner_password} onChange={(e) => setOwner({ ...owner, owner_password: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Số điện thoại</label>
                      <input type="text" className="form-control" value={owner.owner_phone} onChange={(e) => setOwner({ ...owner, owner_phone: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Địa chỉ</label>
                      <input type="text" className="form-control" value={owner.owner_address} onChange={(e) => setOwner({ ...owner, owner_address: e.target.value })} />
                    </div>
                    <button className="btn btn-success btn-custom">Lưu</button>
                    <button type="button" onClick={handleCancelEdit} className="btn btn-secondary btn-custom">Hủy</button>
                    <button type="button" onClick={handleLogout} className="btn btn-outline-danger btn-custom">Đăng xuất</button>
                    <button type="button" onClick={() => navigate(`/HomePage/${id}`)} className="btn btn-warning btn-custom">Quay lại HomePage</button>
                  </form>
                ) : (
                  <>
                    <MDBCardTitle>{owner.owner_name}</MDBCardTitle>
                    <MDBCardText><strong>Mã khách hàng:</strong> {owner.owner_emso}</MDBCardText>
                    <MDBCardText><strong>Ngày sinh:</strong> {formatDate(owner.owner_birthdate)}</MDBCardText>
                    <MDBCardText><strong>Email:</strong> {owner.owner_email}</MDBCardText>
                    <MDBCardText><strong>Số điện thoại:</strong> {owner.owner_phone}</MDBCardText>
                    <MDBCardText><strong>Địa chỉ:</strong> {owner.owner_address}</MDBCardText>

                    <button onClick={handleEdit} className="btn btn-primary btn-custom">Chỉnh sửa</button>
                    <button onClick={() => navigate(`/owner-profile-pets/${id}`)} className="btn btn-info btn-custom">Xem thú cưng</button>
                    <button onClick={() => handleDeleteOwner(owner.owner_id)} className="btn btn-danger btn-custom">Xóa khách hàng</button>
                    <button onClick={handleLogout} className="btn btn-outline-secondary btn-custom">Đăng xuất</button>
                    <button onClick={() => navigate(`/HomePage/${id}`)} className="btn btn-warning btn-custom">Quay lại HomePage</button>
                  </>
                )}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default OwnerDetails;