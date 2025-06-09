import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
import { formatDate } from "./Formaters/FormatDate";
import UserImage from "../assets/sampleImages/user.png";

const Owner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [owner, setOwner] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/auth/pet-owner/` + id)
      .then((result) => {
        console.log(result.data.Result); // Log the result here
        if (result.data.Status) {
          setOwner(result.data.Result[0]); // Access the first element of the array
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3000/auth/delete-pet-owner/" + id)
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
        } else {
          alert(result.data.Error);
        }
      });
  };
  return (
    <div>
      <h2>Thông tin người dùng - {owner.owner_name}</h2>
      <MDBContainer>
        <MDBRow className="justify-content-center">
          <MDBCol md="9" lg="7" xl="5" className="mt-5 mb-5">
            <MDBCard style={{ borderRadius: "15px" }}>
              <MDBCardBody className="p-4 justify-content-center align-content-center">
                <div className="d-col text-black justify-content-center align-content-center">
                  <div className="justify-content-center align-content-center m-2">
                    <div className="col-12 d-flex justify-content-between align-items-center">
                      <label htmlFor="category" className="form-label">
                        <strong>Thông tin của : {owner.owner_name}</strong>
                      </label>
                    </div>
                  </div>
                  <MDBCardImage src={UserImage} fluid alt="..." />
                  <div className="flex-grow-1 m-4">
                    <MDBCardTitle>{owner.owner_name}</MDBCardTitle>
                    <MDBCardText>
                      <strong>Mã khách hàng  </strong> {owner.owner_emso}
                    </MDBCardText>
                    <MDBCardText>
                      <strong>Ngày sinh: </strong> {formatDate(owner.owner_birthdate)}
                    </MDBCardText>
                    <MDBCardText>
                      <strong>Email: </strong> {owner.owner_email}
                    </MDBCardText>
                    <MDBCardText>
                      <strong>Phone: </strong> {owner.owner_phone}
                    </MDBCardText>
                    <MDBCardText>
                      <strong>Địa chỉ: </strong> {owner.owner_address}
                    </MDBCardText>
                    <div className="d-flex justify-content-center pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/edit-pet-owner/` + id);
                        }}
                        className="btn btn-success btn-sm me-4"
                      >
                        Chỉnh sửa thông tin
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/pet-owner-pets/` + id);
                        }}
                        className="btn btn-primary btn-sm me-4"
                      >
                        Thông tin thú 
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(owner.owner_id);
                          navigate(`/dashboard/pet-owners`);
                        }}
                        className="btn btn-danger btn-sm"
                      >
                       Xóa người dùng 
                      </button>
                    </div>
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default Owner;
