# Phát triển phần mềm theo chuẩn kỹ năng ITSS - IT4549 - Nhóm 22
# 🐾 Hệ Thống Quản Lý Thú Y (Veterinary Management System - VMS)

**Veterinary Management System (VMS)** là một hệ thống quản lý thú y được nâng cấp và tùy chỉnh nhằm phục vụ hiệu quả cho các phòng khám thú y hiện đại. Dự án tập trung vào việc ghi chép chính xác thông tin về thú cưng và chủ nuôi, đặc biệt là các dữ liệu liên quan đến tiêm phòng và lịch hẹn. VMS giúp quản lý, tra cứu và xử lý dữ liệu một cách thuận tiện và tin cậy.

---

## ⚙️ Chức năng chính

- Quản lý thông tin **thú cưng**, **chủ nuôi**, **bác sĩ thú y** và **quản trị viên** (thêm, sửa, xóa).
- Ghi nhận và xem lại **lịch sử tiêm phòng**.
- Tìm kiếm chủ nuôi thông qua **thanh tìm kiếm thông minh**.
- Gửi **nhắc nhở lịch hẹn** sắp tới.
- Thêm mới, chỉnh sửa hoặc hủy **lịch hẹn khám bệnh**.
- Hiển thị lịch theo **ngày / tuần / tháng**.
- Tạo **báo cáo tổng hợp** lịch hẹn và chi phí.

---

## 👤 Đối tượng sử dụng

- **Bác sĩ thú y**: Quản lý hồ sơ thú cưng, theo dõi tiêm phòng và lịch khám.
- **Chủ thú cưng**: Theo dõi lịch sử sức khỏe và tiêm phòng của thú cưng.
- **Quản trị viên**: Quản lý tài khoản, phân quyền và cấu hình hệ thống.

---

## 🛠️ Công nghệ sử dụng

- **Ngôn ngữ & Framework**: JavaScript, React, Node.js, Express
- **Cơ sở dữ liệu**: MySQL
- **Giao diện người dùng**: React, CSS, JavaScript, Bootstrap
- **Bảo mật**: Xác thực bằng JWT, phân quyền theo vai trò (admin, bác sĩ, chủ nuôi)

---

## 🚀 Hướng dẫn sử dụng hệ thống

### 1. Cài đặt phụ thuộc

Trước tiên, đảm bảo bạn đã cài đặt Node.js. Sau đó, tại thư mục gốc của dự án, chạy:

```bash
npm install
```

### 2. Khởi động ứng dụng

**Frontend:**
```bash
cd FrontEnd
npm run dev
```

**Backend:**
```bash
cd BackEnd
npm start
```

### 3. Cấu hình cơ sở dữ liệu (MySQL bằng Docker)

**Bước 1:** Chạy container MySQL:

```bash
docker run --name vms-mysql -e MYSQL_ROOT_PASSWORD=123456 -p 3306:3306 -d mysql
```

**Bước 2:** Đăng nhập vào MySQL và tạo database:

```sql
CREATE DATABASE veterina_vz;
```

**Bước 3:** Chạy file `ITSS data.sql` trong thư mục `Database/` để tạo bảng và dữ liệu mẫu.

---

## 📁 Cấu trúc thư mục dự án

```
IT4549-ITSS-G22/
├── BackEnd/                 # Mã nguồn backend (Node.js + Express)
├── FrontEnd/                # Giao diện frontend (React)
├── Database/
│   └── ITSS data.sql        # Tập tin SQL khởi tạo cơ sở dữ liệu
├── .gitignore
├── package-lock.json
├── projektna_naloga_SQL.txt
└── README.md
```
