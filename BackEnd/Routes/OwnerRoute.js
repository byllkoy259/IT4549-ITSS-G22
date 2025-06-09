import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { ownerAuth } from "../middlewares/ownerAuth.js";

const router = express.Router()


//LOGIN ROUTES

router.post("/owner-login", (req, res) => {
    const sql = "SELECT * from owners Where owner_email = ? and owner_password = ?"
    con.query(sql, [req.body.owner_email, req.body.owner_password], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "Query error" })
        if (result.length > 0) {
            const email = result[0].owner_email;
            const token = jwt.sign({ role: "owner", email: email }, "jwt_secret_key", { expiresIn: "1d" })
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "lax",
                secure: false // khi dev local
                });

            return res.json({ loginStatus: true, id:result[0].owner_id })
        } else return res.json({ loginStatus: false, Error: "Wrong email or password" })
    })
})



// REGISTER ROUTE
router.post("/register", (req, res) => {
  const {
    owner_name,
    owner_birthdate,
    owner_email,
    owner_password,
    owner_phone,
    owner_address,
  } = req.body;

  // Kiểm tra các trường bắt buộc
  if (
    !owner_name ||
    !owner_birthdate ||
    !owner_email ||
    !owner_password ||
    !owner_phone ||
    !owner_address
  ) {
    return res.json({
      Status: false,
      Error: "Vui lòng nhập đầy đủ tất cả thông tin bắt buộc!",
    });
  }

  // Kiểm tra email đã tồn tại chưa
  const checkEmailSql = "SELECT * FROM owners WHERE owner_email = ?";
  con.query(checkEmailSql, [owner_email], (err, result) => {
    if (err) {
      console.error("Database error during email check:", err);
      return res.json({ Status: false, Error: "Lỗi cơ sở dữ liệu khi kiểm tra email" });
    }
    if (result.length > 0) {
      return res.json({ Status: false, Error: "Email đã được sử dụng!" });
    }

    // Lấy giá trị owner_emso lớn nhất hiện có và tăng 1
    const getMaxEmsoSql = "SELECT COALESCE(MAX(owner_emso), '0') as max_emso FROM owners";
    con.query(getMaxEmsoSql, (err, result) => {
      if (err) {
        console.error("Database error during emso check:", err);
        return res.json({ Status: false, Error: "Lỗi cơ sở dữ liệu khi lấy mã khách hàng" });
      }
      let maxEmso = result[0].max_emso;
      let newEmso;

      // Nếu maxEmso là chuỗi 13 ký tự (dữ liệu mẫu), tăng từ giá trị số cuối
      if (maxEmso.length === 13 && !isNaN(maxEmso)) {
        newEmso = (parseInt(maxEmso) + 1).toString();
      } else {
        // Chuyển maxEmso thành số và tăng 1, đảm bảo ít nhất 7 chữ số
        newEmso = (parseInt(maxEmso) + 1).toString().padStart(7, "0");
      }

      // Thêm người dùng mới vào cơ sở dữ liệu
      const insertSql =
        "INSERT INTO owners (owner_name, owner_emso, owner_birthdate, owner_email, owner_password, owner_phone, owner_address, category_id, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      con.query(
        insertSql,
        [owner_name, newEmso, owner_birthdate, owner_email, owner_password, owner_phone, owner_address, null, null],
        (err, result) => {
          if (err) {
            console.error("Database error during registration:", err);
            return res.json({ Status: false, Error: "Lỗi cơ sở dữ liệu khi đăng ký: " + err.message });
          }
          return res.json({ Status: true, Result: result, Message: "Đăng ký thành công! Vui lòng đăng nhập." });
        }
      );
    });
  });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////




//ownerPets


// Lấy owner_id từ email (dùng lại ở các API)
function getOwnerIdByEmail(ownerEmail, cb) {
  con.query("SELECT owner_id FROM owners WHERE owner_email = ?", [ownerEmail], (err, rows) => {
    if (err || rows.length === 0) cb(null);
    else cb(rows[0].owner_id);
  });
}

// GET tất cả thú cưng của chủ nuôi (đầy đủ field)
router.get("/pets", ownerAuth, (req, res) => {
  getOwnerIdByEmail(req.ownerEmail, (ownerId) => {
    if (!ownerId) return res.status(401).json({ Error: "Không tìm thấy tài khoản" });
    con.query("SELECT * FROM Pets WHERE owner_id = ?", [ownerId], (err, data) => {
      if (err) return res.json({ Status: false, Error: err });
      return res.json({ Status: true, Pets: data });
    });
  });
});

// THÊM thú cưng mới (đầy đủ trường)
router.post("/pets", ownerAuth, (req, res) => {
  const {
    pet_name, pet_chip_number, pet_type, pet_breed, pet_gender, pet_birthdate,
    pet_height, pet_weight, vaccination_id, pet_vaccination_date, veterinarian_id
  } = req.body;
  getOwnerIdByEmail(req.ownerEmail, (ownerId) => {
    if (!ownerId) return res.status(401).json({ Error: "Không tìm thấy tài khoản" });
    const insertSql = `INSERT INTO Pets 
      (pet_name, pet_chip_number, pet_type, pet_breed, pet_gender, pet_birthdate, pet_height, pet_weight, owner_id, vaccination_id, pet_vaccination_date, veterinarian_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    con.query(
      insertSql,
      [
        pet_name, pet_chip_number, pet_type, pet_breed, pet_gender, pet_birthdate,
        pet_height, pet_weight, ownerId, vaccination_id, pet_vaccination_date, veterinarian_id
      ],
      (err, result) => {
        if (err) return res.json({ Status: false, Error: err });
        return res.json({ Status: true, InsertId: result.insertId });
      }
    );
  });
});

// SỬA thú cưng (chỉ owner thao tác, đầy đủ field)
router.put("/pets/:petId", ownerAuth, (req, res) => {
  const {
    pet_name, pet_chip_number, pet_type, pet_breed, pet_gender, pet_birthdate,
    pet_height, pet_weight, vaccination_id, pet_vaccination_date, veterinarian_id
  } = req.body;
  getOwnerIdByEmail(req.ownerEmail, (ownerId) => {
    if (!ownerId) return res.status(401).json({ Error: "Không tìm thấy tài khoản" });
    const updateSql = `
      UPDATE Pets SET pet_name=?, pet_chip_number=?, pet_type=?, pet_breed=?, pet_gender=?, pet_birthdate=?, pet_height=?, pet_weight=?, vaccination_id=?, pet_vaccination_date=?, veterinarian_id=?
      WHERE pet_id=? AND owner_id=?`;
    con.query(
      updateSql,
      [
        pet_name, pet_chip_number, pet_type, pet_breed, pet_gender, pet_birthdate,
        pet_height, pet_weight, vaccination_id, pet_vaccination_date, veterinarian_id,
        req.params.petId, ownerId
      ],
      (err, result) => {
        if (err) return res.json({ Status: false, Error: err });
        return res.json({ Status: true });
      }
    );
  });
});

// XOÁ thú cưng
router.delete("/pets/:petId", ownerAuth, (req, res) => {
  getOwnerIdByEmail(req.ownerEmail, (ownerId) => {
    if (!ownerId) return res.status(401).json({ Error: "Không tìm thấy tài khoản" });
    con.query(
      "DELETE FROM Pets WHERE pet_id = ? AND owner_id = ?",
      [req.params.petId, ownerId],
      (err, result) => {
        if (err) return res.json({ Status: false, Error: err });
        return res.json({ Status: true });
      }
    );
  });
});
//////////////////////////////////////////////////////////////////////////
// Các API lấy danh sách, nên có ownerAuth nếu muốn bảo mật
router.get("/veterinarians", ownerAuth, (req, res) => {
  const sql = "SELECT veterinarian_id, veterinarian_name FROM Veterinarians";
  con.query(sql, (err, data) => {
    console.log("[API] /veterinarians được gọi, trả về:", data);
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Veterinarians: data });
  });
});

router.get("/services", ownerAuth, (req, res) => {
  const sql = "SELECT service_id, service_name FROM Services";
  con.query(sql, (err, data) => {
    console.log("[API] /services được gọi, trả về:", data);
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Services: data });
  });
});

// Lấy tất cả lịch hẹn của chủ nuôi đã đăng nhập
router.get("/appointments", ownerAuth, (req, res) => {
  getOwnerIdByEmail(req.ownerEmail, (ownerId) => {
    if (!ownerId) return res.status(401).json({ Error: "Không tìm thấy tài khoản" });
    const sql = `
      SELECT 
        a.appointments_id, a.appointments_starts_at, a.appointments_ends_at,
        s.service_name, p.pet_name, v.veterinarian_name,
        a.veterinarian_id, a.pet_id, a.service_id
      FROM Appointments a
      JOIN Services s ON a.service_id = s.service_id
      JOIN Pets p ON a.pet_id = p.pet_id
      LEFT JOIN Veterinarians v ON a.veterinarian_id = v.veterinarian_id
      WHERE a.owner_id = ?
      ORDER BY a.appointments_starts_at DESC
    `;
    con.query(sql, [ownerId], (err, data) => {
      if (err) return res.json({ Status: false, Error: err });
      return res.json({ Status: true, Appointments: data });
    });
  });
});

// Đặt lịch hẹn mới
router.post("/appointments", ownerAuth, (req, res) => {
  console.log("[POST] /appointments - Nhận data:", req.body);
  getOwnerIdByEmail(req.ownerEmail, (ownerId) => {
    if (!ownerId) return res.status(401).json({ Error: "Không tìm thấy tài khoản" });
    const { pet_id, veterinarian_id, service_id, appointments_starts_at, appointments_ends_at } = req.body;
    if (!pet_id || !veterinarian_id || !service_id || !appointments_starts_at || !appointments_ends_at) {
      return res.json({ Status: false, Error: "Vui lòng nhập đầy đủ thông tin lịch hẹn!" });
    }
    const sql = `
      INSERT INTO Appointments (appointments_starts_at, appointments_ends_at, owner_id, veterinarian_id, pet_id, service_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    con.query(
      sql,
      [appointments_starts_at, appointments_ends_at, ownerId, veterinarian_id, pet_id, service_id],
      (err, result) => {
        if (err) return res.json({ Status: false, Error: err });
        return res.json({ Status: true, InsertId: result.insertId });
      }
    );
  });
});

// Xoá lịch hẹn
router.delete("/appointments/:id", ownerAuth, (req, res) => {
  getOwnerIdByEmail(req.ownerEmail, (ownerId) => {
    if (!ownerId) return res.status(401).json({ Error: "Không tìm thấy tài khoản" });
    const sql = "DELETE FROM Appointments WHERE appointments_id = ? AND owner_id = ?";
    con.query(sql, [req.params.id, ownerId], (err, result) => {
      if (err) return res.json({ Status: false, Error: err });
      return res.json({ Status: true });
    });
  });
});

export {router as OwnerRouter}
