import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardTitle,
  MDBCardText,
  MDBCardBody,
} from "mdb-react-ui-kit";

const ViewPets = () => {
    const { id } = useParams();
    const [owner, setOwner] = useState([]);
  
    // Inside useEffect, set the owner state to the data from the API response
    useEffect(() => {
      axios
        .get(`http://localhost:3000/auth/pets-and-owner/` + id)
        .then((result) => {
          console.log(result.data.Result); // Log the result here
          if (result.data.Status) {
            setOwner(result.data.Result); // Set owner to the array of pets
          } else {
            alert(result.data.Error);
          }
        })
        .catch((err) => console.log(err));
    }, [id]);
  
  
    if (!owner) {
      return <div>Loading...</div>;
    }
  
    return (
      <div>
        <h2>Thông Tin pet </h2>
        <div className="display-flex justify-content-center align-items-center">
          <MDBContainer className="display-flex justify-content-center align-items-center">
              <MDBRow className="justify-content-around">
                {owner.map((pet, index) => (
                  <MDBCol key={index} md="9" lg="7" xl="5" className="mt-5 mb-5">
                    <MDBCard style={{ borderRadius: "15px" }}>
                      <MDBCardBody className="p-4 justify-content-center align-content-center">
                        <div className="d-col text-black justify-content-center align-content-center">
                          <div className="flex-grow-1 m-4">
                            <div className="col-12 d-flex justify-content-between align-items-center">
                              <MDBCardTitle>{pet.pet_name}</MDBCardTitle>
                              <MDBCardText>{pet.pet_type}</MDBCardText>
                            </div>
                            <MDBCardText>
                              <strong>Mã số chip:</strong> {pet.pet_chip_number}
                            </MDBCardText>
                            <MDBCardText>
                              <strong>Giống(loài):</strong> {pet.pet_breed}
                            </MDBCardText>
                            <div
                              className="d-flex justify-content-around rounded-3 p-2 mb-2"
                              style={{ backgroundColor: "#efefef" }}
                            >
                              <div>
                                <p className="small text-muted mb-1">chiều cao </p>
                                <p className="mb-0">{pet.pet_height} cm</p>
                              </div>
                              <div className="px-3">
                                <p className="small text-muted mb-1">Cân nặng </p>
                                <p className="mb-0">{pet.pet_weight} kg</p>
                              </div>
                              <div>
                                <p className="small text-muted mb-1">giới tính </p>
                                <p className="mb-0">{pet.pet_gender}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                ))}
              </MDBRow>
          </MDBContainer>
        </div>
      </div>
    );
  };
export default ViewPets