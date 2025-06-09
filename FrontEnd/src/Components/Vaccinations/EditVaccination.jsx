import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditVaccination = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vaccination, setVaccination] = useState({
    vaccination_name: "",
    vaccination_vendor: "",
    vaccination_price: "",
    vaccination_validity: "",
  });
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/vaccination/" + id)
      .then((result) => {
        setVaccination({
          ...vaccination,
          vaccination_name: result.data.Result[0].vaccination_name,
          vaccination_vendor: result.data.Result[0].vaccination_vendor,
          vaccination_price: result.data.Result[0].vaccination_price,
          vaccination_validity: result.data.Result[0].vaccination_validity,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:3000/auth/edit-vaccination/" + id, vaccination)
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
        <h2>Chỉnh sửa Vacxin </h2>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName4" className="form-label">
              Tên Vacxin 
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName4"
              placeholder="Enter Name"
              value={vaccination.vaccination_name}
              autoComplete="off"
              onChange={(e) =>
                setVaccination({ ...vaccination, vaccination_name: e.target.value })
              }
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
              value={vaccination.vaccination_vendor}
              autoComplete="off"
              onChange={(e) =>
                setVaccination({ ...vaccination, vaccination_vendor: e.target.value })
              }
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
              value={vaccination.vaccination_price}
              autoComplete="off"
              onChange={(e) =>
                setVaccination({ ...vaccination, vaccination_price: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputValidity4" className="form-label">
              Ngày hết hạn
            </label>
            <input
              type="date"
              className="form-control rounded-0"
              id="inputValidity4"
              placeholder="Enter Expiration Date"
              value={vaccination.vaccination_validity}
              autoComplete="off"
              onChange={(e) =>
                setVaccination({ ...vaccination, vaccination_validity: e.target.value })
              }
            />
          </div>
          <div className="col-12 mt-4">
            <button className="btn btn-success w-100 rounded-0 mb-2">
              Lưu 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVaccination;
