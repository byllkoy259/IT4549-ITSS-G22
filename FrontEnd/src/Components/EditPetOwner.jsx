import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditPetOwner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [owner, setOwner] = useState({
    owner_name: "",
    owner_emso: "",
    owner_email: "",
    owner_password: "",
    owner_phone: "",
    owner_address: "",
  });
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/pet-owner/" + id)
      .then((result) => {
        setOwner({
          ...owner,
          owner_name: result.data.Result[0].owner_name,
          owner_emso: result.data.Result[0].owner_emso,
          owner_email: result.data.Result[0].owner_email,
          owner_password: result.data.Result[0].owner_password,
          owner_phone: result.data.Result[0].owner_phone,
          owner_address: result.data.Result[0].owner_address,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:3000/auth/edit-pet-owner/" + id, owner)
      .then((result) => {
        console.log("Result:", result); // Add this line
        if (result.data.Status) {
          navigate("/dashboard/pet-owners");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <div className="text-warning"></div>
        <h2>Thay đổi thông tin khách hàng </h2>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName4" className="form-label">
             Họ & Tên 
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName4"
              placeholder="Enter Name"
              value={owner.owner_name}
              autoComplete="off"
              onChange={(e) =>
                setOwner({ ...owner, owner_name: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputName4" className="form-label">
              Mã khách hàng 
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputEMSO4"
              placeholder="Enter EMSO"
              value={owner.owner_emso}
              autoComplete="off"
              onChange={(e) =>
                setOwner({ ...owner, owner_emso: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputEmail4" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail4"
              placeholder="Enter Email"
              value={owner.owner_email}
              autoComplete="off"
              onChange={(e) =>
                setOwner({ ...owner, owner_email: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputPassword4" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control rounded-0"
              id="inputPassword4"
              placeholder="Enter Password"
              value={owner.owner_password}
              autoComplete="off"
              onChange={(e) =>
                setOwner({ ...owner, owner_password: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputPhone4" className="form-label">
              Phone Number
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputPhone4"
              placeholder="Enter Phone Number"
              value={owner.owner_phone}
              autoComplete="off"
              onChange={(e) =>
                setOwner({ ...owner, owner_phone: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputAddress4" className="form-label">
              Địa chỉ 
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputAddress4"
              placeholder="Enter Your Address"
              value={owner.owner_address}
              autoComplete="off"
              onChange={(e) =>
                setOwner({ ...owner, owner_address: e.target.value })
              }
            />
          </div>
          <div className="col-12 mt-4">
            <button className="btn btn-success w-100 rounded-0 mb-2">
              Thay đổi thông tin 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPetOwner;
