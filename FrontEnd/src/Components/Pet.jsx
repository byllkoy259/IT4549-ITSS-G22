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
import CatImage from "../assets/sampleImages/cat.jpg";
import DogImage from "../assets/sampleImages/dog.jpg";
import RabbitImage from "../assets/sampleImages/rabbit.png";
import HorseImage from "../assets/sampleImages/hotse.jpg";
import DefaultImage from "../assets/sampleImages/default.jpg";

const Pet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/auth/pets-combined/` + id)
      .then((result) => {
        console.log(result.data.Result); // Log the result here
        if (result.data.Status) {
          setPet(result.data.Result[0]); // Access the first element of the array
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3000/auth/delete-pet/" + id)
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
        } else {
          alert(result.data.Error);
        }
      });
  };

  if (!pet) {
    return <div>Loading...</div>;
  }

  // Dynamically selecting image based on pet_type
  let imageSrc;
  switch (pet.pet_type) {
    case "Cat":
      imageSrc = CatImage;
      break;
    case "Dog":
      imageSrc = DogImage;
      break;
    case "Rabbit":
      imageSrc = RabbitImage;
      break;
    case "Horse":
      imageSrc = HorseImage;
      break;
    default:
      // Default image if pet_type is not recognized
      imageSrc = DefaultImage; // You can set any default image here
      break;
  }

  // Calculate expiration date
  const vaccinationDate = new Date(pet.pet_vaccination_date);
  const expirationDate = new Date(
    vaccinationDate.getFullYear() + pet.vaccination_validity,
    vaccinationDate.getMonth(),
    vaccinationDate.getDate()
  );

  // Calculate the difference in days between expiration date and today
  const today = new Date();
  const differenceInTime = expirationDate.getTime() - today.getTime();
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

  // Calculate years and remaining days
  const years = Math.floor(differenceInDays / 365);
  const remainingDays = differenceInDays % 365;

  return (
    <div>
      <h2>
        Thông tin Pets - {pet.pet_type} {pet.pet_name}
      </h2>
      <MDBContainer>
        <MDBRow className="justify-content-center">
          <MDBCol md="9" lg="7" xl="5" className="mt-5 mb-5">
            <MDBCard style={{ borderRadius: "15px" }}>
              <MDBCardBody className="p-4 justify-content-center align-content-center">
                <div className="d-col text-black justify-content-center align-content-center">
                  <div className="justify-content-center align-content-center m-2">
                    <div className="col-12 d-flex justify-content-between align-items-center">
                      <label htmlFor="category" className="form-label">
                        <strong> Là Pet của: {pet.owner_name}</strong>
                      </label>
                    </div>
                  </div>
                  <MDBCardImage src={imageSrc} fluid alt="..." />
                  <div className="flex-grow-1 m-4">
                    <div className="col-12 d-flex justify-content-between align-items-center">
                      <MDBCardTitle>{pet.pet_name}</MDBCardTitle>
                      <MDBCardText>{pet.pet_type}</MDBCardText>
                    </div>
                    <MDBCardText>
                      <strong>Mã số chip :</strong> {pet.pet_chip_number}
                    </MDBCardText>
                    <MDBCardText>
                      <strong>Giống (loài):</strong> {pet.pet_breed}
                    </MDBCardText>

                    <div
                      className="d-flex justify-content-around rounded-3 p-2 mb-2"
                      style={{ backgroundColor: "#efefef" }}
                    >
                      <div>
                        <p className="small text-muted mb-1">Chiều cao </p>
                        <p className="mb-0">{pet.pet_height} cm</p>
                      </div>
                      <div className="px-3">
                        <p className="small text-muted mb-1">Cân nặng</p>
                        <p className="mb-0">{pet.pet_weight} kg</p>
                      </div>
                      <div>
                        <p className="small text-muted mb-1">Giới tính </p>
                        <p className="mb-0">{pet.pet_gender}</p>
                      </div>
                    </div>
                    <MDBCardText>
                      <strong>Ngày sinh :</strong>{" "}
                      {formatDate(pet.pet_birthdate)}
                    </MDBCardText>
                    <MDBCardText>
                      <strong>Bác sĩ phụ trách:</strong> {pet.veterinarian_name}
                    </MDBCardText>
                    <MDBCardText>
                      <strong>Đã tiêm vaxcin:</strong> {pet.vaccination_name}
                    </MDBCardText>
                    <MDBCardText>
                      <strong>Ngày tiêm vacxin :</strong>{" "}
                      {formatDate(pet.pet_vaccination_date)}
                    </MDBCardText>
                    <MDBCardText>
                      <strong>Vacxin hết hạn sau:</strong>{" "}
                      {years > 0 ? `${years} years` : ""}
                      {remainingDays > 0 ? ` ${remainingDays} days` : ""}
                    </MDBCardText>
                    <div className="d-flex justify-content-center pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/edit-pet/` + id);
                        }}
                        className="btn btn-success btn-sm me-4"
                      >
                        sửa thông tin 
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(pet.id);
                          navigate(`/dashboard/pets`);
                        }}
                        className="btn btn-danger btn-sm"
                      >
                       xóa pet khỏi trung tâm 
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

export default Pet;
