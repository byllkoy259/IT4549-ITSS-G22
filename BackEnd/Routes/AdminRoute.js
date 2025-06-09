import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import auth from '../middlewares/auth.js';


const router = express.Router()

//LOGIN ROUTES

//ADMIN LOGIN
// router.post("/admin-login", (req, res) => {
//     const sql = "SELECT * FROM admin WHERE admin_name = ?";
//     con.query(sql, [req.body.admin_name], (err, result) => {

//         if (err) {
//             console.error("Database error:", err);
//             return res.json({ loginStatus: false, Error: "Lỗi truy vấn cơ sở dữ liệu" });
//         }
//         if (result.length === 0) {
//             return res.json({ loginStatus: false, Error: "Tên quản trị hoặc mật khẩu không đúng" });
//         }

//         const user = result[0];
//         bcrypt.compare(req.body.admin_password, user.admin_password, (err, isMatch) => {
//             console.log("Password (from input):", req.body.admin_password);
//             console.log("Password (from DB):", user.admin_password);
//             if (!req.body.admin_password || !user.admin_password) {
//             console.error("Thiếu dữ liệu để so sánh bcrypt");
//             return res.json({ loginStatus: false, Error: "Thiếu thông tin đăng nhập" });}



//             if (err) {
//                 console.error("Bcrypt error:", err);
//                 return res.json({ loginStatus: false, Error: "Lỗi xác thực mật khẩu" });
//             }
//             if (!isMatch) {
//                 return res.json({ loginStatus: false, Error: "Tên quản trị hoặc mật khẩu không đúng" });
//             }

//             const token = jwt.sign(
//                 { role: "admin", name: user.admin_name }, // Thay email thành name
//                 "jwt_secret_key",
//                 { expiresIn: "1d" }
//             );
//             res.cookie("token", token);
//             return res.json({ loginStatus: true });
//         });
//     });
// });
// ADMIN LOGIN Ver0Ver0
router.post("/admin-login", (req, res) => {
    console.log("Request body:", req.body);
    const sql = "SELECT * FROM admin WHERE admin_name = ?";
    con.query(sql, [req.body.admin_name], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.json({ loginStatus: false, Error: "Lỗi truy vấn cơ sở dữ liệu" });
        }
        if (result.length === 0) {
            return res.json({ loginStatus: false, Error: "Tên quản trị hoặc mật khẩu không đúng" });
        }

        const user = result[0];
        console.log("Password (from input):", req.body.password);
        console.log("Password (from DB):", user.admin_password);
        if (!req.body.password || !user.admin_password) {
            console.error("Thiếu dữ liệu để so sánh");
            return res.json({ loginStatus: false, Error: "Thiếu thông tin đăng nhập" });
        }

        if (req.body.password !== user.admin_password) {
            return res.json({ loginStatus: false, Error: "Tên quản trị hoặc mật khẩu không đúng" });
        }

        const token = jwt.sign(
            { role: "admin", name: user.admin_name },
            "jwt_secret_key",
            { expiresIn: "1d" }
        );
        res.cookie("token", token);
        return res.json({ loginStatus: true });
    });
});






//VET LOGIN
router.post("/veterinarian-login", (req, res) => {
    const sql = "SELECT * from veterinarians Where veterinarian_email = ? and veterinarian_password = ?"
    con.query(sql, [req.body.veterinarian_email, req.body.veterinarian_password], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "Query error" })
        if (result.length > 0) {
            const email = result[0].veterinarian_email;
            const token = jwt.sign({ role: "veterinarian", email: email }, "jwt_secret_key", { expiresIn: "1d" })
            res.cookie("token", token)
            return res.json({ loginStatus: true, id:result[0].owner_id })
        } else return res.json({ loginStatus: false, Error: "Wrong email or password" })
    })
})

//CATEGORIES ROUTES

router.get('/categories', (req, res) => {
    const sql = "SELECT * FROM category";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.post('/add-category', (req, res) => {
    const sql = "INSERT INTO category (`category_name`) VALUES (?)"
    con.query(sql, [req.body.category], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true })
    })
})

//SPECIALIZATIONS ROUTES

router.get('/vet-types', (req, res) => {
    const sql = "SELECT * FROM specialization";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

//ROLES ROUTES

router.get('/role-types', (req, res) => {
    const sql = "SELECT * FROM roles";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

//VACCINATIONS ROUTES

router.get('/vaccinations', (req, res) => {
    const sql = "SELECT * FROM vaccinations";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.post('/add-vaccinations', (req, res) => {
    const sql = `INSERT INTO vaccinations (vaccination_name, vaccination_vendor, vaccination_price, vaccination_validity) VALUES (?, ?, ?, ?) `;
    const values = [
        req.body.vaccination_name,
        req.body.vaccination_vendor,
        req.body.vaccination_price,
        req.body.vaccination_validity,
    ]
    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err })
        return res.json({ Status: true })
    })
})

router.get("/vaccination/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM vaccinations WHERE vaccination_id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.delete("/delete-vaccination/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM vaccinations where vaccination_id = ?"
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.put("/edit-vaccination/:id", (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE vaccinations SET vaccination_name = ?, vaccination_vendor = ?, vaccination_price = ?, vaccination_validity = ? WHERE vaccination_id = ?`;
    const values = [req.body.vaccination_name, req.body.vaccination_vendor, req.body.vaccination_price, req.body.vaccination_validity, id];
    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err })
        return res.json({ Status: true, Result: result })
    })
})

//image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "Public/images")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})
//end image upload

//VETERINARIANS ROUTES

// router.post("/add-veterinarian", (req, res) => {
//     const sql = `INSERT INTO veterinarians (veterinarian_name, veterinarian_email, veterinarian_password, veterinarian_address, specialization_id, category_id, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
//     bcrypt.hash(req.body.veterinarian_password, 10, (err, hash) => {
//         if (err) return res.json({ Status: false, Error: "Query Error" })
//         const values = [
//             req.body.veterinarian_name,
//             req.body.veterinarian_email,
//             hash,
//             req.body.veterinarian_address,
//             req.body.specialization_id,
//             req.body.category_id,
//             req.body.role_id,
//         ]
//         con.query(sql, values, (err, result) => {
//             if (err) return res.json({ Status: false, Error: err })
//             return res.json({ Status: true })
//         })
//     })
// })
///add-veterinarian
router.post("/add-veterinarian", (req, res) => {
    const sql = `INSERT INTO veterinarians (veterinarian_name, veterinarian_email, veterinarian_password, veterinarian_address, specialization_id, category_id, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        req.body.veterinarian_name,
        req.body.veterinarian_email,
        req.body.veterinarian_password, // Lưu mật khẩu dạng văn bản thô
        req.body.veterinarian_address,
        req.body.specialization_id,
        req.body.category_id,
        req.body.role_id,
    ];
    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err });
        return res.json({ Status: true });
    });
});




router.get('/veterinarians', (req, res) => {
    const sql = "SELECT * FROM veterinarians";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get("/veterinarian/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM veterinarians WHERE veterinarian_id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})
///edit-veterinarian
// router.put("/edit-veterinarian/:id", (req, res) => {
//     const id = req.params.id;
//     const sql = `UPDATE veterinarians set veterinarian_name = ?, veterinarian_email = ?, veterinarian_password = ?, veterinarian_address = ?, specialization_id = ? Where veterinarian_id = ?`
//     const values = [
//         req.body.veterinarian_name,
//         req.body.veterinarian_email,
//         req.body.veterinarian_password,
//         req.body.veterinarian_address,
//         req.body.specialization_id,
//         id,
//     ]
//     con.query(sql, values, (err, result) => {
//         if (err) return res.json({ Status: false, Error: err })
//         return res.json({ Status: true })
//     })
// })
////edit-veterinarian
router.put("/edit-veterinarian/:id", (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE veterinarians SET veterinarian_name = ?, veterinarian_email = ?, veterinarian_password = ?, veterinarian_address = ?, specialization_id = ? WHERE veterinarian_id = ?`;
    const values = [
        req.body.veterinarian_name,
        req.body.veterinarian_email,
        req.body.veterinarian_password,
        req.body.veterinarian_address,
        req.body.specialization_id,
        id,
    ];
    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err });
        return res.json({ Status: true });
    });
});

router.delete("/delete-veterinarian/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM veterinarians where veterinarian_id = ?"
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

//PETS ROUTES

router.post("/add-pet", (req, res) => {
    const sql = "INSERT INTO pets (pet_name, pet_chip_number, pet_type, pet_breed, pet_gender, pet_birthdate, pet_height, pet_weight, owner_id, vaccination_id, pet_vaccination_date, veterinarian_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
        req.body.pet_name,
        req.body.pet_chip_number,
        req.body.pet_type,
        req.body.pet_breed,
        req.body.pet_gender,
        req.body.pet_birthdate,
        req.body.pet_height,
        req.body.pet_weight,
        req.body.owner_id,
        req.body.vaccination_id,
        req.body.pet_vaccination_date,
        req.body.veterinarian_id,
    ];
    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err })
        return res.json({ Status: true })
    })
});

router.get('/pets', (req, res) => {
    const sql = "SELECT * FROM pets";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

// router.get("/pet/:id", (req, res) => {
//     const id = req.params.id;
//     const sql = "SELECT * FROM pets WHERE pet_id = ?";
//     con.query(sql, [id], (err, result) => {
//         if (err) return res.json({ Status: false, Error: "Query Error" })
//         return res.json({ Status: true, Result: result })
//     })
// })
router.get("/pet/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM pets WHERE pet_id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) {
            return res.json({ Status: false, Error: "Query Error" });
        }
        if (result.length === 0) {
            return res.json({ Status: false, Error: "Pet không tồn tại" });
        }
        return res.json({ Status: true, Result: result });
    });
});


router.put("/edit-pet/:id", (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE pets set pet_name = ?, pet_chip_number = ?, pet_type = ?, pet_breed = ?, pet_gender = ?, pet_birthdate = ?, pet_height = ?, pet_weight = ?, owner_id = ?, vaccination_id = ?, pet_vaccination_date = ?, veterinarian_id = ? Where pet_id = ?`
    const values = [
        req.body.pet_name,
        req.body.pet_chip_number,
        req.body.pet_type,
        req.body.pet_breed,
        req.body.pet_gender,
        req.body.pet_birthdate,
        req.body.pet_height,
        req.body.pet_weight,
        req.body.owner_id,
        req.body.vaccination_id,
        req.body.pet_vaccination_date,
        req.body.veterinarian_id,
        id,
    ]
    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err })
        return res.json({ Status: true })
    })
})

router.delete("/delete-pet/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM pets where pet_id = ?"
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

//PET OWNERS ROUTES

// router.post("/add-pet-owners", (req, res) => {
//     const sql = `INSERT INTO owners (owner_name, owner_emso, owner_birthdate, owner_email, owner_password, owner_phone, owner_address, category_id, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//     bcrypt.hash(req.body.owner_password, 10, (err, hash) => {
//         if (err) return res.json({ Status: false, Error: err })
//         const values = [
//             req.body.owner_name,
//             req.body.owner_emso,
//             req.body.owner_birthdate,
//             req.body.owner_email,
//             hash,
//             req.body.owner_phone,
//             req.body.owner_address,
//             req.body.category_id,
//             req.body.role_id,
//         ]
//         con.query(sql, values, (err, result) => {
//             if (err) return res.json({ Status: false, Error: err })
//             return res.json({ Status: true })
//         })
//     })
// })
/////add-pet-owners
router.post("/add-pet-owners", (req, res) => {
    const sql = `INSERT INTO owners (owner_name, owner_emso, owner_birthdate, owner_email, owner_password, owner_phone, owner_address, category_id, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        req.body.owner_name,
        req.body.owner_emso,
        req.body.owner_birthdate,
        req.body.owner_email,
        req.body.owner_password, // Lưu mật khẩu dạng văn bản thô
        req.body.owner_phone,
        req.body.owner_address,
        req.body.category_id,
        req.body.role_id,
    ];
    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err });
        return res.json({ Status: true });
    });
});
////

router.get('/pet-owners', (req, res) => {
    const sql = "SELECT * FROM owners";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get("/pet-owner/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM owners WHERE owner_id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.put("/edit-pet-owner/:id", (req, res) => {
    const id = req.params.id;
    console.log("ID:", id);
    const sql = `UPDATE owners SET owner_name = ?, owner_emso = ?, owner_email = ?, owner_password = ?, owner_phone = ?, owner_address = ? WHERE owner_id = ?`;
    const values = [
        req.body.owner_name,
        req.body.owner_emso,
        req.body.owner_email,
        req.body.owner_password,
        req.body.owner_phone,
        req.body.owner_address,
        id,
    ];
    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err });
        return res.json({ Status: true, Result: result });
    });
});

router.delete("/delete-pet-owner/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM owners where owner_id = ?"
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

//DASHBOARD COUNT ROUTES

router.get("/admin-count", (req, res) => {
    const sql = "SELECT count(admin_id) as admin from admin";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get("/veterinarians-count", (req, res) => {
    const sql = "SELECT count(veterinarian_id) as veterinarian from veterinarians";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get("/pets-count", (req, res) => {
    const sql = "SELECT count(pet_id) as pets from pets";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get("/pet-owners-count", (req, res) => {
    const sql = "SELECT count(owner_id) as petowners from owners";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

//ADMIN ROUTES

router.get("/admin-records", (req, res) => {
    const sql = "SELECT * from admin";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

// Route GET /admin/:id
router.get("/admin/:id", (req, res) => {
    const id = req.params.id;
    console.log("Fetching admin with id:", id);
    const sql = "SELECT * FROM admin WHERE admin_id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.json({ Status: false, Error: "Query Error" });
        }
        console.log("Query result:", result);
        return res.json({ Status: true, Result: result });
    });
});
///add-admin

// router.post("/add-admin", (req, res) => {
//     console.log("Request Body:", req.body);
//     if (!req.body.admin_name || !req.body.password) {
//         console.error("Admin name or password is missing in request body");
//         return res.json({ Status: false, Error: "Tên quản trị và mật khẩu là bắt buộc" });
//     }

//     bcrypt.hash(req.body.password, 10, (err, hash) => {
//         if (err) {
//             console.error("Error hashing password:", err);
//             return res.json({ Status: false, Error: "Lỗi mã hóa mật khẩu" });
//         }

//         const sql = `INSERT INTO admin (admin_name, admin_password, category_id, role_id) VALUES (?, ?, ?, ?)`;
//         const values = [
//             req.body.admin_name,
//             hash,
//             req.body.category_id,
//             req.body.role_id,
//         ];
//         con.query(sql, values, (err, result) => {
//             if (err) {
//                 console.error("Error executing SQL query:", err);
//                 return res.json({ Status: false, Error: "Lỗi thêm quản trị viên" });
//             }
//             console.log("Admin added successfully");
//             return res.json({ Status: true });
//         });
//     });
// });
///add-admin
router.post("/add-admin", (req, res) => {
    console.log("Request Body:", req.body);
    if (!req.body.admin_name || !req.body.password) {
        console.error("Admin name or password is missing in request body");
        return res.json({ Status: false, Error: "Tên quản trị và mật khẩu là bắt buộc" });
    }

    const sql = `INSERT INTO admin (admin_name, admin_password, category_id, role_id) VALUES (?, ?, ?, ?)`;
    const values = [
        req.body.admin_name,
        req.body.password, // Lưu mật khẩu dạng văn bản thô
        req.body.category_id,
        req.body.role_id,
    ];
    con.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.json({ Status: false, Error: "Lỗi thêm quản trị viên" });
        }
        console.log("Admin added successfully");
        return res.json({ Status: true });
    });
});


//edit-admin
// router.put("/edit-admin/:id", (req, res) => {
//     const id = req.params.id;
//     const sql = `UPDATE admin SET admin_name = ?, admin_password = ? WHERE admin_id = ?`;
//     bcrypt.hash(req.body.admin_password, 10, (err, hash) => {
//         const values = [req.body.admin_name, req.body.admin_password, id];
//         con.query(sql, values, (err, result) => {
//             if (err) return res.json({ Status: false, Error: err })
//             return res.json({ Status: true, Result: result })
//         })
//     })
// })
// Route PUT /edit-admin/:id
router.put("/edit-admin/:id", (req, res) => {
    const id = req.params.id;
    console.log("Updating admin with id:", id);
    console.log("Request body:", req.body);
    if (!id || isNaN(id)) {
        console.error("Invalid id:", id);
        return res.json({ Status: false, Error: "ID không hợp lệ." });
    }
    const sql = `UPDATE admin SET admin_name = ?, admin_password = ? WHERE admin_id = ?`;
    const values = [req.body.admin_name, req.body.password, id];
    con.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.json({ Status: false, Error: "Query Error: " + err.message });
        }
        if (result.affectedRows === 0) {
            return res.json({ Status: false, Error: "Không tìm thấy admin với ID này để cập nhật." });
        }
        console.log("Update result:", result);
        return res.json({ Status: true, Result: result });
    });
});

//APPOINTMENTS TABLE ROUTES
router.get("/appointments", (req, res) => {
    const sql = "SELECT * from appointments";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get("/appointment/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM appointments WHERE appointments_id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.post("/add-appointment", (req, res) => {
    const sql = "INSERT INTO appointments (appointments_created_at, appointments_starts_at, appointments_ends_at, owner_id, veterinarian_id, pet_id, service_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [
        req.body.appointments_created_at,
        req.body.appointments_starts_at,
        req.body.appointments_ends_at,
        req.body.owner_id,
        req.body.veterinarian_id,
        req.body.pet_id,
        req.body.service_id,
    ];
    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err })
        return res.json({ Status: true })
    })
});

router.put("/edit-appointment/:id", (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE appointments SET appointments_starts_at = ?, appointments_ends_at = ?, owner_id = ?, veterinarian_id = ?, pet_id = ?, service_id = ? WHERE appointments_id = ?`;
    const values = [
        req.body.appointments_starts_at,
        req.body.appointments_ends_at,
        req.body.owner_id,
        req.body.veterinarian_id,
        req.body.pet_id,
        req.body.service_id,
        id,
    ];
    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err });
        return res.json({ Status: true, Result: result });
    });
});

router.delete("/delete-appointment/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM appointments where appointments_id = ?"
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

//SERVICES ROUTES
router.get("/services", (req, res) => {
    const sql = "SELECT * from services";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

//COMBINED TABLE WITH THE PETS AND OWNERS

router.get('/pets-and-owner', (req, res) => {
    const sql = "SELECT pets.*, owners.* FROM pets INNER JOIN owners ON pets.owner_id = owners.owner_id";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})


// LẤY DANH SÁCH DỊCH VỤ (KHÔNG cần đăng nhập)
router.get("/services", (req, res) => {
  con.query("SELECT service_id, service_name FROM Services", (err, data) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Services: data });
  });
});

// LẤY DANH SÁCH BÁC SĨ (KHÔNG cần đăng nhập)
router.get("/veterinarians", (req, res) => {
  con.query("SELECT veterinarian_id, veterinarian_name FROM Veterinarians", (err, data) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Veterinarians: data });
  });
});


//COMBINED TABLE FOR PETS AND THEIR OWNER (1 OWNER - MULTIPLE PETS)

router.get('/pets-and-owner/:owner_id', (req, res) => {
    const owner_id = req.params.owner_id; // Retrieve the owner_id from the request parameters
    const sql = "SELECT pets.*, owners.* FROM pets INNER JOIN owners ON pets.owner_id = owners.owner_id WHERE pets.owner_id = ?";
    con.query(sql, [owner_id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

//COMBINED TABLE FOR PETS WITH THEIR ID
router.get('/pets-combined/:pet_id', (req, res) => {
    const pet_id = req.params.pet_id;
    const sql = `
        SELECT 
            p.*,
            o.owner_name,
            v.veterinarian_name,
            vac.*
        FROM 
            pets p
            INNER JOIN owners o ON p.owner_id = o.owner_id
            INNER JOIN veterinarians v ON p.veterinarian_id = v.veterinarian_id
            INNER JOIN vaccinations vac ON p.vaccination_id = vac.vaccination_id
        WHERE
            p.pet_id = ?`; // Filter by the provided pet_id
    con.query(sql, [pet_id], (err, result) => {
        if (err) {
            console.error("Query Error:", err); // Log the error for debugging
            return res.json({ Status: false, Error: "Query Error" });
        }
        return res.json({ Status: true, Result: result });
    });
});

//JOINED APPOINTMENTS TABLE
router.get('/appointments-combined', (req, res) => {
    const sql = `
                SELECT 
                a.*,
                s.*,
                p.pet_name,
                v.veterinarian_name,
                o.owner_name
            FROM 
                appointments a
            INNER JOIN 
                services s ON a.service_id = s.service_id
            INNER JOIN 
                pets p ON a.pet_id = p.pet_id
            INNER JOIN 
                veterinarians v ON a.veterinarian_id = v.veterinarian_id
            INNER JOIN 
                owners o ON a.owner_id = o.owner_id;`;
    con.query(sql, (err, result) => {
        if (err) {
            console.error("Query Error:", err); // Log the error for debugging
            return res.json({ status: false, error: "Query Error" });
        }
        return res.json({ status: true, result: result });
    });
});
// /routes/auth.js

router.get('/profile', auth, async (req, res) => {
  const { id, role } = req.user;
  try {
    let profile = null;
    if (role === 'Admin') {
      // KHÔNG có email, chỉ trả các trường cần thiết
      const [rows] = await db.query(
        `SELECT a.admin_id, a.admin_name, c.category_name, r.role_name
         FROM Admin a
         LEFT JOIN Category c ON a.category_id = c.category_id
         LEFT JOIN Roles r ON a.role_id = r.role_id
         WHERE a.admin_id = ?`, [id]
      );
      profile = rows[0];
    } else if (role === 'Veterinarian') {
      const [rows] = await db.query(
        `SELECT v.veterinarian_id, v.veterinarian_name, v.veterinarian_email, v.veterinarian_address,
                s.specialization_name, c.category_name, r.role_name
         FROM Veterinarians v
         LEFT JOIN Specializations s ON v.specialization_id = s.specialization_id
         LEFT JOIN Category c ON v.category_id = c.category_id
         LEFT JOIN Roles r ON v.role_id = r.role_id
         WHERE v.veterinarian_id = ?`, [id]
      );
      profile = rows[0];
    } else if (role === 'Owner') {
      const [rows] = await db.query(
        `SELECT owner_id, owner_name, owner_email, owner_phone, owner_emso
         FROM Owners WHERE owner_id = ?`, [id]
      );
      profile = rows[0];
    }
    if (!profile) return res.status(404).json({ error: 'User not found' });
    res.json({ result: profile });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Sửa thông tin cá nhân (ví dụ: chỉ cho phép Owner và Veterinarian sửa)
router.put('/profile', auth, async (req, res) => {
  const { id, role } = req.user;
  const data = req.body;
  try {
    if (role === 'Owner') {
      await db.query(
        `UPDATE Owners SET owner_name=?, owner_phone=?, owner_emso=?
         WHERE owner_id=?`,
        [data.owner_name, data.owner_phone, data.owner_emso, id]
      );
      return res.json({ result: { ...data, owner_id: id } });
    } else if (role === 'Veterinarian') {
      await db.query(
        `UPDATE Veterinarians SET veterinarian_name=?, veterinarian_address=?, specialization_id=?
         WHERE veterinarian_id=?`,
        [data.veterinarian_name, data.veterinarian_address, data.specialization_id, id]
      );
      return res.json({ result: { ...data, veterinarian_id: id } });
    }
    // Admin không được chỉnh sửa qua FE
    res.status(403).json({ error: 'Không thể chỉnh sửa profile admin từ frontend' });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});


router.get("/logout", (req, res) => {
    res.clearCookie("token")
    return res.json({ Status: true })
})

export { router as adminRouter }