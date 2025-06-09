import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddVaccination = () => {
  const navigate = useNavigate();
  const [vaccination, setVaccination] = useState({
    vaccination_name: "",
    vaccination_vendor: "",
    vaccination_price: "",
    vaccination_validity: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3000/auth/add-admin", vaccination)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard");
        } else {
          alert(result.data.Error);
          console.log(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div className="p-3 rounded w-50 border">
        <div className="text-warning"></div>
        <h2>Thêm Vacxin </h2>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName4" className="form-label">
              Tên loại Vacxin 
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName4"
              placeholder="Enter Vaccination Name"
              autoComplete="off"
              onChange={(e) => setVaccination({ ...vaccination, vaccination_name: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputVendor4" className="form-label">
              Nguồn cung 
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputVendor4"
              placeholder="Enter Vendor"
              onChange={(e) => setVaccination({ ...vaccination, vaccination_vendor: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputPrice4" className="form-label">
              Giá 
            </label>
            <input
              type="number"
              className="form-control rounded-0"
              id="inputPrice4"
              placeholder="Enter Price"
              autoComplete="off"
              onChange={(e) => setVaccination({ ...vaccination, vaccination_price: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputValidity4" className="form-label">
              Hiệu lực thuốc:
            </label>
            <input
              type="date"
              className="form-control rounded-0"
              id="inputValidity4"
              placeholder="Enter Vaccination Validity"
              autoComplete="off"
              onChange={(e) => setVaccination({ ...vaccination, vaccination_validity: e.target.value })}
            />
          </div>
          <div className="col-12">
            <button className="btn btn-success w-100 rounded-0 mb-2">
              Thêm vacxin 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVaccination;
