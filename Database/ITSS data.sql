-- Tạo database
CREATE DATABASE IF NOT EXISTS veterina_vz;
USE veterina_vz;

-- Tạo bảng với kiểu dữ liệu đồng nhất cho tất cả ID
CREATE TABLE Roles (
    role_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(40) NOT NULL UNIQUE
);

CREATE TABLE Category (
    category_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(40) NOT NULL UNIQUE
);

CREATE TABLE Specializations (
    specialization_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    specialization_name VARCHAR(40) NOT NULL UNIQUE
);

CREATE TABLE Vaccinations (
    vaccination_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vaccination_name VARCHAR(40) NOT NULL,
    vaccination_vendor VARCHAR(40) NOT NULL,
    vaccination_price DECIMAL(10,2) NOT NULL CHECK (vaccination_price >= 0),
    vaccination_validity BIGINT NOT NULL CHECK (vaccination_validity > 0)
);

CREATE TABLE Owners (
    owner_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    owner_name VARCHAR(40) NOT NULL,
    owner_emso VARCHAR(13) UNIQUE,
    owner_birthdate DATE NOT NULL,
    owner_email VARCHAR(40) NOT NULL UNIQUE,
    owner_password VARCHAR(140) NOT NULL,
    owner_phone VARCHAR(20) NOT NULL,
    owner_address VARCHAR(100) NOT NULL,
    category_id BIGINT UNSIGNED,
    role_id BIGINT UNSIGNED
);

CREATE TABLE Veterinarians (
    veterinarian_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    veterinarian_name VARCHAR(40) NOT NULL,
    veterinarian_email VARCHAR(40) NOT NULL UNIQUE,
    veterinarian_password VARCHAR(140) NOT NULL,
    veterinarian_address VARCHAR(100) NOT NULL,
    specialization_id BIGINT UNSIGNED,
    category_id BIGINT UNSIGNED,
    role_id BIGINT UNSIGNED
);

CREATE TABLE Services (
    service_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(40) NOT NULL UNIQUE,
    service_price DECIMAL(10,2) NOT NULL CHECK (service_price >= 0)
);

CREATE TABLE Pets (
    pet_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pet_name VARCHAR(40) NOT NULL,
    pet_chip_number VARCHAR(40) UNIQUE,
    pet_type VARCHAR(40) NOT NULL,
    pet_breed VARCHAR(40),
    pet_gender CHAR(1) CHECK (pet_gender IN ('M' , 'F', 'U')),
    pet_birthdate DATE,
    pet_height DECIMAL(5 , 2 ) CHECK (pet_height >= 0),
    pet_weight DECIMAL(5 , 2 ) CHECK (pet_weight >= 0),
    owner_id BIGINT UNSIGNED NOT NULL,
    vaccination_id BIGINT UNSIGNED,
    pet_vaccination_date DATE,
    veterinarian_id BIGINT UNSIGNED
);

CREATE TABLE Appointments (
    appointments_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    appointments_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    appointments_starts_at TIMESTAMP NOT NULL,
    appointments_ends_at TIMESTAMP NOT NULL,
    owner_id BIGINT UNSIGNED NOT NULL,
    veterinarian_id BIGINT UNSIGNED NOT NULL,
    pet_id BIGINT UNSIGNED NOT NULL,
    service_id BIGINT UNSIGNED NOT NULL,
    CHECK (appointments_ends_at > appointments_starts_at)
);

CREATE TABLE Admin (
    admin_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admin_name VARCHAR(40) NOT NULL,
    admin_password VARCHAR(140) NOT NULL,
    category_id BIGINT UNSIGNED,
    role_id BIGINT UNSIGNED
);

-- ------------------------------------------
USE veterina_vz;

CREATE TABLE MedicalRecords (
    record_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    appointment_id BIGINT UNSIGNED NOT NULL,
    pet_id BIGINT UNSIGNED NOT NULL,
    veterinarian_id BIGINT UNSIGNED, -- KHÔNG có NOT NULL
    diagnosis VARCHAR(255),
    symptoms VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES Appointments(appointments_id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id) ON DELETE CASCADE,
    FOREIGN KEY (veterinarian_id) REFERENCES Veterinarians(veterinarian_id) ON DELETE SET NULL
);

CREATE TABLE Prescriptions (
    prescription_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    record_id BIGINT UNSIGNED NOT NULL,
    medication_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(100),
    usage_instructions VARCHAR(255),
    FOREIGN KEY (record_id) REFERENCES MedicalRecords(record_id) ON DELETE CASCADE
);

CREATE TABLE Staff (
    staff_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    staff_name VARCHAR(40) NOT NULL,
    staff_email VARCHAR(40) UNIQUE,
    staff_password VARCHAR(140) NOT NULL,
    staff_role VARCHAR(40), -- lễ tân, chăm sóc, grooming, tạp vụ...
    phone VARCHAR(20),
    address VARCHAR(100)
);

CREATE TABLE BoardingBookings (
    boarding_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pet_id BIGINT UNSIGNED NOT NULL,
    owner_id BIGINT UNSIGNED NOT NULL,
    staff_id BIGINT UNSIGNED,                -- Nhân viên phụ trách
    veterinarian_id BIGINT UNSIGNED,         -- Bác sĩ phụ trách (nếu có)
    room_number VARCHAR(20),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    notes TEXT,
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES Owners(owner_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES Staff(staff_id) ON DELETE SET NULL,
    FOREIGN KEY (veterinarian_id) REFERENCES Veterinarians(veterinarian_id) ON DELETE SET NULL
);

CREATE TABLE DietPlans (
    diet_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pet_id BIGINT UNSIGNED NOT NULL,
    created_by_staff_id BIGINT UNSIGNED,        -- Nhân viên tạo/suggest
    created_by_veterinarian_id BIGINT UNSIGNED, -- Bác sĩ đề xuất
    date_start DATE,
    date_end DATE,
    diet_details TEXT,
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_staff_id) REFERENCES Staff(staff_id) ON DELETE SET NULL,
    FOREIGN KEY (created_by_veterinarian_id) REFERENCES Veterinarians(veterinarian_id) ON DELETE SET NULL
);

CREATE TABLE SpaRecords (
    spa_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pet_id BIGINT UNSIGNED NOT NULL,
    service_id BIGINT UNSIGNED,            -- KHÔNG có NOT NULL
    staff_id BIGINT UNSIGNED,
    veterinarian_id BIGINT UNSIGNED,
    appointment_date DATE,
    notes TEXT,
    FOREIGN KEY (pet_id) REFERENCES Pets(pet_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES Services(service_id) ON DELETE SET NULL,
    FOREIGN KEY (staff_id) REFERENCES Staff(staff_id) ON DELETE SET NULL,
    FOREIGN KEY (veterinarian_id) REFERENCES Veterinarians(veterinarian_id) ON DELETE SET NULL
);

-- ---------------------------------------------------

-- Thêm ràng buộc khóa ngoại
ALTER TABLE Admin
ADD CONSTRAINT fk_admin_category_id
FOREIGN KEY (category_id) REFERENCES Category(category_id)
ON DELETE SET NULL;

ALTER TABLE Admin
ADD CONSTRAINT fk_admin_role_id
FOREIGN KEY (role_id) REFERENCES Roles(role_id)
ON DELETE SET NULL;

ALTER TABLE Pets
ADD CONSTRAINT fk_pets_owner_id
FOREIGN KEY (owner_id) REFERENCES Owners(owner_id)
ON DELETE CASCADE;

ALTER TABLE Pets
ADD CONSTRAINT fk_pets_vaccination_id
FOREIGN KEY (vaccination_id) REFERENCES Vaccinations(vaccination_id)
ON DELETE SET NULL;

ALTER TABLE Pets
ADD CONSTRAINT fk_pets_veterinarian_id
FOREIGN KEY (veterinarian_id) REFERENCES Veterinarians(veterinarian_id)
ON DELETE SET NULL;

ALTER TABLE Owners
ADD CONSTRAINT fk_owners_category_id
FOREIGN KEY (category_id) REFERENCES Category(category_id)
ON DELETE SET NULL;

ALTER TABLE Owners
ADD CONSTRAINT fk_owners_role_id
FOREIGN KEY (role_id) REFERENCES Roles(role_id)
ON DELETE SET NULL;

ALTER TABLE Veterinarians
ADD CONSTRAINT fk_veterinarians_specialization_id
FOREIGN KEY (specialization_id) REFERENCES Specializations(specialization_id)
ON DELETE SET NULL;

ALTER TABLE Veterinarians
ADD CONSTRAINT fk_veterinarians_category_id
FOREIGN KEY (category_id) REFERENCES Category(category_id)
ON DELETE SET NULL;

ALTER TABLE Veterinarians
ADD CONSTRAINT fk_veterinarians_role_id
FOREIGN KEY (role_id) REFERENCES Roles(role_id)
ON DELETE SET NULL;

ALTER TABLE Appointments
ADD CONSTRAINT fk_appointments_owner_id
FOREIGN KEY (owner_id) REFERENCES Owners(owner_id)
ON DELETE CASCADE;

ALTER TABLE Appointments
ADD CONSTRAINT fk_appointments_veterinarian_id
FOREIGN KEY (veterinarian_id) REFERENCES Veterinarians(veterinarian_id)
ON DELETE CASCADE;

ALTER TABLE Appointments
ADD CONSTRAINT fk_appointments_pet_id
FOREIGN KEY (pet_id) REFERENCES Pets(pet_id)
ON DELETE CASCADE;

ALTER TABLE Appointments
ADD CONSTRAINT fk_appointments_service_id
FOREIGN KEY (service_id) REFERENCES Services(service_id)
ON DELETE CASCADE;

-- Thêm ràng buộc kiểm tra
ALTER TABLE Pets
ADD CONSTRAINT chk_pet_gender CHECK (pet_gender IN ('M', 'F', 'U'));

ALTER TABLE Pets
ADD CONSTRAINT chk_pet_weight_range CHECK (pet_weight >= 0 AND pet_weight <= 70);

-- Chèn dữ liệu mẫu
INSERT INTO Roles (role_name) VALUES
('Veterinarian'), ('Vet Technician'), ('Receptionist'), ('Animal Caretaker'),
('Groomer'), ('Accountant'), ('Marketing Manager'), ('Customer Service Representative'),
('Admin');



INSERT INTO Category (category_name) VALUES
('Veterinarians'), ('Vet Technicians'), ('Receptionists'), ('Animal Caretakers'),
('Owners'), ('Accounting and Finance'), ('Pets'), ('Customer Service'),
('Admins'), ('Cleaning and Maintenance');

INSERT INTO Specializations (specialization_name) VALUES
('Small Animal Medicine'), ('Equine Medicine'), ('Avian Medicine'), ('Exotic Animal Medicine'),
('Orthopedic Surgery'), ('Dental Surgery'), ('Oncology'), ('Cardiology'),
('Neurology'), ('Radiology');

INSERT INTO Vaccinations (vaccination_name, vaccination_vendor, vaccination_price, vaccination_validity) VALUES
('Rabies', 'ABC Pharmaceuticals', 25.00, 365),
('Canine Distemper', 'XYZ Vaccines Inc.', 30.00, 900),
('Feline Leukemia', 'Veterinary Solutions', 40.00, 365),
('Parvovirus', 'Animal Health Corp.', 35.00, 900),
('Bordetella', 'PetCare Vaccines', 20.00, 365),
('Lyme Disease', 'Global Animal Health', 45.00, 365),
('Canine Influenza', 'HealthGuard Vaccines', 30.00, 365),
('Feline Calicivirus', 'MediVet Pharmaceuticals', 25.00, 900),
('Canine Coronavirus', 'ProVet Laboratories', 20.00, 365),
('Feline Panleukopenia', 'PetVax Corporation', 35.00, 900);

-- Sử dụng biến để lưu ID cần thiết
SET @owner_category_id = (SELECT category_id FROM Category WHERE category_name = 'Owners');
SET @owner_role_id = (SELECT role_id FROM Roles WHERE role_name = 'Customer Service Representative');

INSERT INTO Owners (owner_name, owner_emso, owner_birthdate, owner_email, owner_password, owner_phone, owner_address, category_id, role_id)
VALUES 
('John Doe', '1234567890123', '1990-05-15', 'john.doe@example.com', 'password123', '+1234567890', '123 Main St, City, Country', @owner_category_id, @owner_role_id),
('Jane Smith', '9876543210987', '1985-08-22', 'jane.smith@example.com', 'password456', '+0987654321', '456 Elm St, City, Country', @owner_category_id, @owner_role_id),
('Michael Johnson', '4567890123456', '1978-11-10', 'michael.johnson@example.com', 'password789', '+1123456789', '789 Oak St, City, Country', @owner_category_id, @owner_role_id),
('Emily Brown', '7890123456789', '1995-03-25', 'emily.brown@example.com', 'passwordabc', '+1567890123', '321 Pine St, City, Country', @owner_category_id, @owner_role_id),
('David Wilson', '2345678901234', '1982-07-18', 'david.wilson@example.com', 'passworddef', '+1432567890', '654 Cedar St, City, Country', @owner_category_id, @owner_role_id),
('Emma Taylor', '8901234567890', '1998-09-30', 'emma.taylor@example.com', 'passwordghi', '+1657890123', '987 Maple St, City, Country', @owner_category_id, @owner_role_id),
('Christopher Lee', '5678901234567', '1973-12-05', 'christopher.lee@example.com', 'passwordjkl', '+1789012345', '147 Birch St, City, Country', @owner_category_id, @owner_role_id),
('Olivia Martinez', '0123456789012', '1989-04-12', 'olivia.martinez@example.com', 'passwordmno', '+1878901234', '369 Walnut St, City, Country', @owner_category_id, @owner_role_id),
('Daniel Garcia', '3456789012345', '1970-01-20', 'daniel.garcia@example.com', 'passwordpqr', '+1567890123', '753 Sycamore St, City, Country', @owner_category_id, @owner_role_id),
('Sophia Hernandez', '6789012345678', '1992-06-08', 'sophia.hernandez@example.com', 'passwordstu', '+1678901234', '852 Cherry St, City, Country', @owner_category_id, @owner_role_id);

SET @vet_category_id = (SELECT category_id FROM Category WHERE category_name = 'Veterinarians');
SET @vet_role_id = (SELECT role_id FROM Roles WHERE role_name = 'Veterinarian');

INSERT INTO Veterinarians (veterinarian_name, veterinarian_email, veterinarian_password, veterinarian_address, specialization_id, category_id, role_id)
VALUES 
('Dr. Michael Smith', 'michael.smith@example.com', 'password123owner_emso', '123 Main St, City, Country', 1, @vet_category_id, @vet_role_id),
('Dr. Jennifer Johnson', 'jennifer.johnson@example.com', 'password456', '456 Elm St, City, Country', 2, @vet_category_id, @vet_role_id),
('Dr. Emily Davis', 'emily.davis@example.com', 'password789', '789 Oak St, City, Country', 3, @vet_category_id, @vet_role_id),
('Dr. Daniel Wilson', 'daniel.wilson@example.com', 'passwordabc', '321 Pine St, City, Country', 4, @vet_category_id, @vet_role_id),
('Dr. Sarah Brown', 'sarah.brown@example.com', 'passworddef', '654 Cedar St, City, Country', 5, @vet_category_id, @vet_role_id),
('Dr. David Taylor', 'david.taylor@example.com', 'passwordghi', '987 Maple St, City, Country', 6, @vet_category_id, @vet_role_id),
('Dr. Jessica Martinez', 'jessica.martinez@example.com', 'passwordjkl', '147 Birch St, City, Country', 7, @vet_category_id, @vet_role_id),
('Dr. Christopher Garcia', 'christopher.garcia@example.com', 'passwordmno', '369 Walnut St, City, Country', 8, @vet_category_id, @vet_role_id),
('Dr. Olivia Hernandez', 'olivia.hernandez@example.com', 'passwordpqr', '753 Sycamore St, City, Country', 9, @vet_category_id, @vet_role_id),
('Dr. Benjamin Lee', 'benjamin.lee@example.com', 'passwordstu', '852 Cherry St, City, Country', 10, @vet_category_id, @vet_role_id);

INSERT INTO Services (service_name, service_price) VALUES
('Regular Exam', 50.00),
('Vaccination', 35.00),
('Dental Cleaning', 80.00),
('Spaying/Neutering', 150.00),
('Microchipping', 30.00),
('Grooming', 45.00),
('Boarding', 25.00),
('X-ray', 60.00),
('Ultrasound', 75.00),
('Emergency Consultation', 100.00);

INSERT INTO Pets (pet_name, pet_chip_number, pet_type, pet_breed, pet_gender, pet_birthdate, pet_height, pet_weight, owner_id, vaccination_id, pet_vaccination_date, veterinarian_id)
VALUES 
('Max', '12345', 'Dog', 'Labrador Retriever', 'M', '2019-01-15', 60.0, 25.0, 1, 1, '2020-02-01', 1),
('Bella', '98765', 'Dog', 'Golden Retriever', 'F', '2018-03-22', 55.0, 28.0, 2, 2, '2020-01-20', 2),
('Charlie', '45678', 'Cat', 'Siamese', 'M', '2020-05-10', 10.0, 5.0, 3, 3, '2021-03-15', 3),
('Luna', '78999', 'Cat', 'Maine Coon', 'F', '2017-07-25', 12.0, 8.0, 4, 4, '2020-12-10', 4),
('Buddy', '23456', 'Dog', 'Beagle', 'M', '2019-09-18', 30.0, 20.0, 5, 5, '2020-11-05', 5),
('Daisy', '89012', 'Dog', 'Dachshund', 'F', '2018-11-30', 25.0, 15.0, 6, 6, '2021-02-20', 6),
('Max', '56789', 'Rabbit', 'Holland Lop', 'M', '2020-04-05', 5.0, 3.0, 7, 7, '2021-05-15', 7),
('Lola', '01234', 'Rabbit', 'Netherland Dwarf', 'F', '2019-02-12', 4.0, 2.0, 8, 8, '2021-04-10', 8),
('Oreo', '34567', 'Bird', 'Cockatiel', 'M', '2019-06-20', NULL, NULL, 9, 9, '2020-09-30', 9),
('Kiwi', '67890', 'Bird', 'Parakeet', 'F', '2020-08-08', NULL, NULL, 10, 10, '2021-01-25', 10);

INSERT INTO Appointments (appointments_starts_at, appointments_ends_at, owner_id, veterinarian_id, pet_id, service_id)
VALUES 
('2024-03-27 09:00:00', '2024-03-27 09:30:00', 1, 1, 1, 1),
('2024-03-27 10:30:00', '2024-03-27 11:00:00', 2, 2, 2, 2),
('2024-03-27 11:00:00', '2024-03-27 11:30:00', 3, 3, 3, 3),
('2024-03-27 12:00:00', '2024-03-27 12:30:00', 4, 4, 4, 4),
('2024-03-27 13:00:00', '2024-03-27 13:30:00', 5, 5, 5, 5),
('2024-03-27 14:00:00', '2024-03-27 14:30:00', 6, 6, 6, 6),
('2024-03-27 15:00:00', '2024-03-27 15:30:00', 7, 7, 7, 7),
('2024-03-27 16:00:00', '2024-03-27 16:30:00', 8, 8, 8, 8),
('2024-03-27 17:00:00', '2024-03-27 17:30:00', 9, 9, 9, 9),
('2024-03-27 18:00:00', '2024-03-27 18:30:00', 10, 10, 10, 10);

SET @admin_category_id = (SELECT category_id FROM Category WHERE category_name = 'Admins');
SET @admin_role_id = (SELECT role_id FROM Roles WHERE role_name = 'Admin');

INSERT INTO Admin (admin_name, admin_password, category_id, role_id)
VALUES 
('Admin1', 'adminpassword1', @admin_category_id, @admin_role_id),
('Admin2', 'adminpassword2', @admin_category_id, @admin_role_id),
('Admin3', 'adminpassword3', @admin_category_id, @admin_role_id),
('Admin4', 'adminpassword4', @admin_category_id, @admin_role_id),
('Admin5', 'adminpassword5', @admin_category_id, @admin_role_id),
('Admin6', 'adminpassword6', @admin_category_id, @admin_role_id),
('Admin7', 'adminpassword7', @admin_category_id, @admin_role_id),
('Admin8', 'adminpassword8', @admin_category_id, @admin_role_id),
('Admin9', 'adminpassword9', @admin_category_id, @admin_role_id),
('Admin10', 'adminpassword10', @admin_category_id, @admin_role_id);


-- CẬP NHẬT GIÁ VACCINE
UPDATE Vaccinations 
SET vaccination_price = vaccination_price * 1.05 
WHERE vaccination_id > 0;  -- Điều kiện luôn đúng cho tất cả bản ghi




-- Thêm cột email
-- ALTER TABLE Admin
-- ADD COLUMN email VARCHAR(40) UNIQUE AFTER admin_name;

-- Cập nhật email cho các tài khoản admin hiện có
-- UPDATE Admin
-- SET email = CONCAT(admin_name, '@admin.com')
-- WHERE admin_id > 0;

-- Cập nhật email cho tài khoản vừa tạo
-- UPDATE Admin
-- SET email = 'admin11@admin.com'
-- WHERE admin_name = 'Admin11';
-- Lấy category_id và role_id cần thiết
-- SET @admin_category_id = (SELECT category_id FROM Category WHERE category_name = 'Admins');
-- SET @admin_role_id = (SELECT role_id FROM Roles WHERE role_name = 'Admin');

-- Thêm tài khoản admin mới
-- INSERT INTO Admin (admin_name, admin_password, category_id, role_id)
-- VALUES ('Admin11', 'adminpassword11', @admin_category_id, @admin_role_id);
-- DESCRIBE Admin;

-- Tạo vai trò và người dùng (SỬA LỖI TẠO ROLE)
-- Kiểm tra và xóa ROLE nếu đã tồn tại
DROP ROLE IF EXISTS admins;
DROP ROLE IF EXISTS veterinarians;
DROP ROLE IF EXISTS owners;

CREATE ROLE IF NOT EXISTS admins;
CREATE ROLE IF NOT EXISTS veterinarians;
CREATE ROLE IF NOT EXISTS owners;

-- Kiểm tra và xóa USER nếu đã tồn tại
DROP USER IF EXISTS Anja;
DROP USER IF EXISTS Boris;
DROP USER IF EXISTS Cene;

CREATE USER IF NOT EXISTS Anja IDENTIFIED BY 'password1';
CREATE USER IF NOT EXISTS Boris IDENTIFIED BY 'password2';
CREATE USER IF NOT EXISTS Cene IDENTIFIED BY 'password3';

-- Cấp quyền (SỬA LỖI CÚ PHÁP GRANT)
-- Sửa lỗi: Tách từng bảng thành lệnh GRANT riêng

-- Cấp quyền cho admins
GRANT ALL PRIVILEGES ON veterina_vz.* TO admins;

-- Cấp quyền cho veterinarians
GRANT SELECT, INSERT, UPDATE, DELETE ON veterina_vz.Pets TO veterinarians;
GRANT SELECT, INSERT, UPDATE, DELETE ON veterina_vz.Appointments TO veterinarians;
GRANT SELECT, INSERT, UPDATE, DELETE ON veterina_vz.Vaccinations TO veterinarians;
GRANT SELECT, INSERT, UPDATE, DELETE ON veterina_vz.Veterinarians TO veterinarians;

-- Cấp quyền cho owners
GRANT SELECT, INSERT, UPDATE, DELETE ON veterina_vz.Pets TO owners;
GRANT SELECT, INSERT, UPDATE, DELETE ON veterina_vz.Owners TO owners;

-- Gán ROLE cho USER
GRANT admins TO Anja;
GRANT veterinarians TO Boris;
GRANT owners TO Cene;

-- Thiết lập ROLE mặc định
SET DEFAULT ROLE ALL TO Anja;
SET DEFAULT ROLE ALL TO Boris;
SET DEFAULT ROLE ALL TO Cene;

-- Truy vấn mẫu
SELECT p.pet_id, p.pet_name, p.pet_chip_number, p.pet_type, p.pet_breed, p.pet_gender, p.pet_birthdate
FROM Owners o
JOIN Pets p ON o.owner_id = p.owner_id
WHERE o.owner_id = 1;

SELECT v.vaccination_name, SUM(v.vaccination_price) AS total_revenue
FROM Vaccinations v
JOIN Pets p ON v.vaccination_id = p.vaccination_id
WHERE p.pet_vaccination_date BETWEEN '2017-01-01' AND '2024-01-31'
GROUP BY v.vaccination_name;

-- Tối ưu hóa cơ sở dữ liệu
ANALYZE TABLE Roles, Category, Specializations, Vaccinations, Owners, Veterinarians, Services, Pets, Appointments, Admin;