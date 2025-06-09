import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditPet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [owner, setOwner] = useState([]); // Sửa chính tả setOWner thành setOwner
  const [veterinarian, setVeterinarian] = useState([]);
  const [vaccination, setVaccination] = useState([]);
  const [pet, setPet] = useState({
    pet_name: "",
    pet_chip_number: "",
    pet_type: "",
    pet_breed: "",
    pet_gender: "",
    pet_birthdate: "",
    pet_height: "",
    pet_weight: "",
    owner_id: "",
    vaccination_id: "",
    pet_vaccination_date: "",
    veterinarian_id: "",
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
        alert("Không thể tải danh sách chủ sở hữu: " + (err.message || "Lỗi không xác định"));
        console.error(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/auth/pet/${id}`)
      .then((result) => {
        if (result.data.Result && result.data.Result.length > 0) {
          const petData = result.data.Result[0];
          setPet({
            ...pet,
            pet_name: petData.pet_name || "",
            pet_chip_number: petData.pet_chip_number || "",
            pet_type: petData.pet_type || "",
            pet_breed: petData.pet_breed || "",
            pet_gender: petData.pet_gender || "",
            pet_birthdate: petData.pet_birthdate
              ? new Date(petData.pet_birthdate).toISOString().split("T")[0]
              : "",
            pet_height: petData.pet_height || "",
            pet_weight: petData.pet_weight || "",
            owner_id: petData.owner_id ? petData.owner_id.toString() : "",
            vaccination_id: petData.vaccination_id ? petData.vaccination_id.toString() : "",
            pet_vaccination_date: petData.pet_vaccination_date
              ? new Date(petData.pet_vaccination_date).toISOString().split("T")[0]
              : "",
            veterinarian_id: petData.veterinarian_id ? petData.veterinarian_id.toString() : "",
          });
        } else {
          alert("Pet không tồn tại hoặc dữ liệu không hợp lệ");
        }
      })
      .catch((err) => {
        alert("Không thể tải thông tin pet: " + (err.message || "Lỗi không xác định"));
        console.error(err);
      });
  }, [id]);

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
        alert("Không thể tải danh sách bác sĩ thú y: " + (err.message || "Lỗi không xác định"));
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
        alert("Không thể tải danh sách vắc-xin: " + (err.message || "Lỗi không xác định"));
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

    if (pet.pet_birthdate && pet.pet_birthdate > currentDate) {
      alert("Ngày sinh không được lớn hơn ngày hiện tại (03/06/2025)!");
      return;
    }

    if (pet.pet_vaccination_date && pet.pet_vaccination_date > currentDate) {
      alert("Ngày tiêm phòng không được lớn hơn ngày hiện tại (03/06/2025)!");
      return;
    }

    const petData = {
      ...pet,
      pet_height: height,
      pet_weight: weight,
      owner_id: parseInt(pet.owner_id),
      vaccination_id: pet.vaccination_id ? parseInt(pet.vaccination_id) : null,
      veterinarian_id: pet.veterinarian_id ? parseInt(pet.veterinarian_id) : null,
    };

    axios
      .put(`http://localhost:3000/auth/edit-pet/${id}`, petData)
      .then((result) => {
        if (result.data.Status) {
          alert("Cập nhật pet thành công!");
          navigate("/dashboard/pets");
        } else {
          alert("Lỗi cập nhật pet: " + (result.data.Error || "Không xác định"));
        }
      })
      .catch((err) => {
        alert("Không thể cập nhật pet: " + (err.message || "Lỗi không xác định"));
        console.error(err);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <div className="text-warning"></div>
        <h2>Chỉnh Sửa Thông Tin PET</h2>
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
              value={pet.pet_name || ""}
              onChange={(e) => setPet({ ...pet, pet_name: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputChipNumber4" className="form-label">Mã số Chip</label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputChipNumber4"
              placeholder="Nhập mã số chip"
              autoComplete="off"
              maxLength="40"
              value={pet.pet_chip_number || ""}
              onChange={(e) => setPet({ ...pet, pet_chip_number: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputType4" className="form-label">Pet là loại:</label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputType4"
              placeholder="Chó, Mèo, ..."
              required
              maxLength="40"
              value={pet.pet_type || ""}
              onChange={(e) => setPet({ ...pet, pet_type: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputBreed" className="form-label">Giống (loài)</label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputBreed"
              placeholder="Pet thuộc giống (vd: Mèo mun...)"
              autoComplete="off"
              maxLength="40"
              value={pet.pet_breed || ""}
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
              value={pet.pet_birthdate || ""}
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
              value={pet.pet_height || ""}
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
              value={pet.pet_weight || ""}
              onChange={(e) => setPet({ ...pet, pet_weight: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="owner" className="form-label">Là pet của:</label>
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
            <label htmlFor="vaccination" className="form-label">Loại vắc-xin đã tiêm</label>
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
              value={pet.pet_vaccination_date || ""}
              onChange={(e) => setPet({ ...pet, pet_vaccination_date: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="mainVet" className="form-label">Chọn Bác sĩ phụ trách</label>
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
            <button className="btn btn-success w-100 rounded-0 mb-2 mt-3">Cập nhật Pet</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPet;