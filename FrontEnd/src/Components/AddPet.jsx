


import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddPet = () => {
  const navigate = useNavigate();
  const [owner, setOwner] = useState([]);
  const [veterinarian, setVeterinarian] = useState([]);
  const [vaccination, setVaccination] = useState([]);
  const [pet, setPet] = useState({
    pet_name: "",
    pet_chip_number: "",
    pet_type: "",
    pet_breed: "",
    pet_gender: "",
    pet_birthdate: "",
    pet_height: 0,
    pet_weight: 0,
    owner_id: "",
    vaccination_id: null,
    pet_vaccination_date: "",
    veterinarian_id: null,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/pet-owners")
      .then((result) => {
        if (result.data.Status) {
          setOwner(result.data.Result);
        } else {
          alert("Lỗi tải danh sách chủ sở hữu: " + result.data.Error);
        }
      })
      .catch((err) => {
        alert("Không thể tải danh sách chủ sở hữu, kiểm tra kết nối!");
        console.error(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/veterinarians")
      .then((result) => {
        if (result.data.Status) {
          setVeterinarian(result.data.Result);
        } else {
          alert("Lỗi tải danh sách bác sĩ thú y: " + result.data.Error);
        }
      })
      .catch((err) => {
        alert("Không thể tải danh sách bác sĩ thú y, kiểm tra kết nối!");
        console.error(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/vaccinations")
      .then((result) => {
        if (result.data.Status) {
          setVaccination(result.data.Result);
        } else {
          alert("Lỗi tải danh sách vắc-xin: " + result.data.Error);
        }
      })
      .catch((err) => {
        alert("Không thể tải danh sách vắc-xin, kiểm tra kết nối!");
        console.error(err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentDate = new Date("2025-06-03").toISOString().split("T")[0]; // 03/06/2025

    // Kiểm tra dữ liệu trước khi gửi
    if (!pet.pet_name || !pet.pet_type || !pet.owner_id) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc: Tên, Loại thú, và Chủ sở hữu!");
      return;
    }

    // Kiểm tra độ dài tối đa của các trường VARCHAR(40)
    if (
      pet.pet_name.length > 40 ||
      pet.pet_type.length > 40 ||
      (pet.pet_breed && pet.pet_breed.length > 40) ||
      (pet.pet_chip_number && pet.pet_chip_number.length > 40)
    ) {
      alert("Tên, Loại thú, Giống, và Mã chip không được vượt quá 40 ký tự!");
      return;
    }

    if (pet.pet_gender && !["M", "F", "U"].includes(pet.pet_gender)) {
      alert("Giới tính phải là M, F hoặc U!");
      return;
    }

    const height = parseFloat(pet.pet_height) || 0;
    const weight = parseFloat(pet.pet_weight) || 0;
    if (height < 0 || weight < 0) {
      alert("Chiều cao và cân nặng không được âm!");
      return;
    }

    if (weight > 70) {
      alert("Cân nặng không được vượt quá 70kg!");
      return;
    }

    if (height > 999.99 || weight > 999.99) {
      alert("Chiều cao và cân nặng không được vượt quá 999.99!");
      return;
    }

    // Kiểm tra ngày sinh và ngày tiêm phòng
    if (pet.pet_birthdate && pet.pet_birthdate > currentDate) {
      alert("Ngày sinh không được lớn hơn ngày hiện tại (03/06/2025)!");
      return;
    }

    if (pet.pet_vaccination_date && pet.pet_vaccination_date > currentDate) {
      alert("Ngày tiêm phòng không được lớn hơn ngày hiện tại (03/06/2025)!");
      return;
    }

    // Chuẩn bị dữ liệu gửi đi
    const petData = {
      ...pet,
      pet_height: height,
      pet_weight: weight,
      owner_id: parseInt(pet.owner_id),
      vaccination_id: pet.vaccination_id ? parseInt(pet.vaccination_id) : null,
      veterinarian_id: pet.veterinarian_id ? parseInt(pet.veterinarian_id) : null,
      pet_chip_number: pet.pet_chip_number || null, // Gửi null nếu không nhập
    };

    // Gửi dữ liệu đến backend
    axios
      .post("http://localhost:3000/auth/add-pet", petData)
      .then((response) => {
        const result = response.data;
        if (result.Status) {
          alert("Thêm pet thành công!");
          navigate("/dashboard/pets");
        } else {
          alert("Lỗi: " + (result.Error || "Không xác định"));
          console.log(result.Error);
        }
      })
      .catch((error) => {
        alert("Lỗi khi gửi yêu cầu: " + (error.message || "Kiểm tra kết nối mạng"));
        console.error("Lỗi chi tiết:", error);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <div className="text-warning"></div>
        <h2>Thêm Pet</h2>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">Tên</label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Nhập tên thú"
              required
              maxLength="40"
              onChange={(e) => setPet({ ...pet, pet_name: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputChipNumber4" className="form-label">Mã số chip</label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputChipNumber4"
              placeholder="Mã số chip có thể nhập hoặc không"
              autoComplete="off"
              maxLength="40"
              onChange={(e) => setPet({ ...pet, pet_chip_number: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputType4" className="form-label">Pet thuộc loại thú:</label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputType4"
              placeholder="Chó, Mèo, ....."
              required
              maxLength="40"
              onChange={(e) => setPet({ ...pet, pet_type: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputBreed" className="form-label">Giống (Loài)</label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputBreed"
              placeholder="Pet thuộc giống (vd: Mèo mun...)"
              autoComplete="off"
              maxLength="40"
              onChange={(e) => setPet({ ...pet, pet_breed: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputGender" className="form-label">Giới tính</label>
            <select
              className="form-control rounded-0"
              id="inputGender"
              value={pet.pet_gender || ""}
              onChange={(e) => setPet({ ...pet, pet_gender: e.target.value })}
            >
              <option value="">Chọn giới tính</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="U">Unknown</option>
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="inputBirthDate" className="form-label">Ngày sinh</label>
            <input
              type="date"
              className="form-control rounded-0"
              id="inputBirthDate"
              max="2025-06-03"
              onChange={(e) => setPet({ ...pet, pet_birthdate: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputHeight" className="form-label">Chiều cao</label>
            <input
              type="number"
              className="form-control rounded-0"
              id="inputHeight"
              placeholder="Nhập chiều cao đơn vị cm"
              step="0.01"
              min="0"
              max="999.99"
              value={pet.pet_height}
              onChange={(e) => setPet({ ...pet, pet_height: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputWeight" className="form-label">Cân nặng</label>
            <input
              type="number"
              className="form-control rounded-0"
              id="inputWeight"
              placeholder="Nhập cân nặng đơn vị kg"
              step="0.01"
              min="0"
              max="70"
              value={pet.pet_weight}
              onChange={(e) => setPet({ ...pet, pet_weight: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="owner" className="form-label">Là pet của</label>
            <select
              name="Owner"
              id="owner"
              className="form-select"
              value={pet.owner_id || ""}
              onChange={(e) =>
                setPet({
                  ...pet,
                  owner_id: e.target.value,
                })
              }
              required
            >
              <option value="">Chọn chủ sở hữu</option>
              {owner && owner.length > 0 ? (
                owner.map((own) => (
                  <option key={own.owner_id} value={own.owner_id}>
                    {own.owner_name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Không có chủ sở hữu để chọn
                </option>
              )}
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="vaccination" className="form-label">Chọn loại vắc-xin tiêm</label>
            <select
              name="Vaccination"
              id="vaccination"
              className="form-select"
              value={pet.vaccination_id || ""}
              onChange={(e) =>
                setPet({
                  ...pet,
                  vaccination_id: e.target.value,
                })
              }
            >
              <option value="">Không chọn</option>
              {vaccination && vaccination.length > 0 ? (
                vaccination.map((vacc) => (
                  <option key={vacc.vaccination_id} value={vacc.vaccination_id}>
                    {vacc.vaccination_name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Không có vắc-xin để chọn
                </option>
              )}
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="inputDateVaccination" className="form-label">Ngày tiêm</label>
            <input
              type="date"
              className="form-control rounded-0"
              id="inputDateVaccination"
              max="2025-06-03"
              onChange={(e) => setPet({ ...pet, pet_vaccination_date: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="mainVet" className="form-label">Bác sĩ phụ trách</label>
            <select
              name="mainvet"
              id="mainVet"
              className="form-select"
              value={pet.veterinarian_id || ""}
              onChange={(e) =>
                setPet({
                  ...pet,
                  veterinarian_id: e.target.value,
                })
              }
            >
              <option value="">Không chọn</option>
              {veterinarian && veterinarian.length > 0 ? (
                veterinarian.map((vet) => (
                  <option key={vet.veterinarian_id} value={vet.veterinarian_id}>
                    {vet.veterinarian_name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Không có bác sĩ thú y để chọn
                </option>
              )}
            </select>
          </div>
          <div className="col-12">
            <button className="btn btn-success w-100 rounded-0 mb-2 mt-3">Thêm pet</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPet;