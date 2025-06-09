import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddPetOwners = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [role, setRole] = useState([]);
  const [owner, setOwner] = useState({
    owner_name: "",
    owner_emso: "",
    owner_birthdate: "",
    owner_email: "",
    owner_password: "",
    owner_phone: "",
    owner_address: "",
    category_id: "",
    role_id: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/role-types")
      .then((result) => {
        if (result.data.Status) {
          setRole(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/categories")
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3000/auth/add-pet-owners", owner)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/pet-owners");
        } else {
          alert(result.data.Error);
          console.log(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5 mb-5">
      <div className="p-3 rounded w-50 border">
        <div className="text-warning"></div>
        <h2>Thêm khách hàng </h2>
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
              autoComplete="off"
              onChange={(e) => setOwner({ ...owner, owner_name: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputEMSO4" className="form-label">
              mã khách hàng 
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputEMSO4"
              placeholder="Enter EMSO"
              autoComplete="off"
              onChange={(e) => setOwner({ ...owner, owner_emso: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputDate4" className="form-label">
              Ngày sinh 
            </label>
            <input
              type="date"
              className="form-control rounded-0"
              id="inputDate4"
              placeholder="Enter Birth Date"
              autoComplete="off"
              onChange={(e) => setOwner({ ...owner, owner_birthdate: e.target.value })}
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
              autoComplete="off"
              onChange={(e) => setOwner({ ...owner, owner_email: e.target.value })}
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
              onChange={(e) => setOwner({ ...owner, owner_password: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputPhone4" className="form-label">
              Phone
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputPhone4"
              placeholder="Enter Phone Number"
              autoComplete="off"
              onChange={(e) => setOwner({ ...owner, owner_phone: e.target.value })}
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
              autoComplete="off"
              onChange={(e) => setOwner({ ...owner, owner_address: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="category" className="form-label">
              Select Category
            </label>
            <select
              name="Category"
              id="category"
              className="form-select"
              onChange={(e) =>
                setOwner({
                  ...owner,
                  category_id: e.target.value,
                })
              }
            >
              {category.map((cat) => {
                return (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="category" className="form-label">
              Select Role
            </label>
            <select
              name="role"
              id="role"
              className="form-select"
              onChange={(e) =>
                setOwner({
                  ...owner,
                  role_id: e.target.value,
                })
              }
            >
              {role.map((rol) => {
                return (
                  <option key={rol.role_id} value={rol.role_id}>
                    {rol.role_name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-12">
            <button className="btn btn-success w-100 rounded-0 mb-2 my-3">
              Thêm khách hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPetOwners;
