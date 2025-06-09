// import express from "express";
// import con from "../utils/db.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import multer from "multer";
// import path from "path";

// const router = express.Router()

// //LOGIN ROUTES

// router.post("/veterinarian-login", (req, res) => {
//     const sql = "SELECT * from veterinarians Where veterinarian_email = ? and veterinarian_password = ?"
//     con.query(sql, [req.body.veterinarian_email, req.body.veterinarian_password], (err, result) => {
//         if (err) return res.json({ loginStatus: false, Error: "Query error"})
//         if (result.length > 0) {
//             const email = result[0].veterinarian_email;
//             const token = jwt.sign({ role: "veterinarian", email: email }, "jwt_secret_key", { expiresIn: "1d" })
//             res.cookie("token", token)
//             return res.json({ loginStatus: true, id:result[0].owner_id })
//         } else return res.json({ loginStatus: false, Error: "Wrong email or password" })
//     })
// })

// export {router as VetRouter}



// import express from "express";
// import con from "../utils/db.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

// const router = express.Router();

// // LOGIN ROUTE
// router.post("/veterinarian-login", (req, res) => {
//   const { veterinarian_email, veterinarian_password } = req.body;

//   if (!veterinarian_email || !veterinarian_password) {
//     return res.status(400).json({ loginStatus: false, Error: "Email and password are required" });
//   }

//   const sql = "SELECT * FROM veterinarians WHERE veterinarian_email = ?";
//   con.query(sql, [veterinarian_email], (err, result) => {
//     if (err) {
//       console.error("Database query error:", err);
//       return res.status(500).json({ loginStatus: false, Error: "Server error" });
//     }

//     if (result.length === 0) {
//       // Không tìm thấy email
//       return res.status(401).json({ loginStatus: false, Error: "Wrong email or password" });
//     }

//     const user = result[0];
//     // So sánh mật khẩu
//     bcrypt.compare(veterinarian_password, user.veterinarian_password, (bcryptErr, isMatch) => {
//       if (bcryptErr) {
//         console.error("Bcrypt error:", bcryptErr);
//         return res.status(500).json({ loginStatus: false, Error: "Server error" });
//       }

//       if (!isMatch) {
//         return res.status(401).json({ loginStatus: false, Error: "Wrong email or password" });
//       }

//       // Tạo token JWT
//       const token = jwt.sign(
//         { role: "veterinarian", email: user.veterinarian_email },
//         "jwt_secret_key",
//         { expiresIn: "1d" }
//       );

//       // Gửi cookie token (httpOnly để client JS không đọc được)
//       res.cookie("token", token, { httpOnly: true, sameSite: "lax" });

//       return res.json({ loginStatus: true, id: user.owner_id });
//     });
//   });
// });

// export { router as VetRouter };



import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();
router.post("/veterinarian-login", (req, res) => {
  const { veterinarian_email, veterinarian_password } = req.body;
  console.log("Login attempt for:", veterinarian_email); // Thêm log

  if (!veterinarian_email || !veterinarian_password) {
    console.log("Missing credentials");
    return res.status(400).json({ loginStatus: false, error: "Email and password are required" });
  }

  const sql = "SELECT * FROM veterinarians WHERE veterinarian_email = ?";
  console.log("SQL:", sql, [veterinarian_email]);
  
  con.query(sql, [veterinarian_email], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ loginStatus: false, error: "Server error" });
    }

    console.log("Query result:", result);
    
    if (result.length === 0) {
      console.log("Email not found");
      return res.status(401).json({ loginStatus: false, error: "Invalid credentials" });
    }

    const user = result[0];
    console.log("User found:", user.veterinarian_id);
    
    // Tạm thời bỏ qua bcrypt để test
    if (veterinarian_password !== user.veterinarian_password) {
      console.log("Password mismatch");
      return res.status(401).json({ loginStatus: false, error: "Invalid credentials" });
    }

    // Tạo token
    const token = jwt.sign(
      { role: "veterinarian", id: user.veterinarian_id },
      "jwt_secret_key",
      { expiresIn: "1d" }
    );

    console.log("Token generated:", token);
    
    res.cookie("token", token, { 
      httpOnly: true,
      secure: false, // Để false khi dev
      sameSite: "Lax"
    });

    return res.json({ 
      loginStatus: true, 
      id: user.veterinarian_id 
    });
  });
});

export { router as VetRouter }