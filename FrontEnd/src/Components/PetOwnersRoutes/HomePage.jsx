// import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBFooter,
  MDBRow,
  MDBCol,
  MDBBtn
} from 'mdb-react-ui-kit';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const ownerId = localStorage.getItem("ownerId");

  const handleProfileClick = () => {
    if (ownerId) {
      navigate(`/owner-profile/${ownerId}`);
    } else {
      alert("Không tìm thấy thông tin người dùng, vui lòng đăng nhập lại.");
      navigate("/owner-login");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/owner-login");
  };

  return (
    <div className="homepage">
      {/* Thanh điều hướng */}
      <MDBNavbar expand="lg" dark style={{ backgroundColor: '#007BFF' }} className="shadow">
        <MDBContainer fluid>
          <MDBNavbarBrand href="/" style={{ fontWeight: 'bold' }}>PetCare Pro</MDBNavbarBrand>
          <MDBNavbarNav className="justify-content-center">
            <MDBNavbarItem>
              <MDBNavbarLink href="/dashboard" className="text-white">Bảng điều khiển</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href="/appointments" className="text-white">Lịch hẹn</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href="/pets" className="text-white">f cưng</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href="/services" className="text-white">Dịch vụ</MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>
          <MDBBtn
            color="transparent"
            className="text-white user-icon"
            onClick={handleProfileClick}
          >
            <span className="mdi-light--account"></span>
          </MDBBtn>
        </MDBContainer>
      </MDBNavbar>

      {/* Phần chào mừng */}
      <MDBContainer fluid className="bg-light py-5 text-center">
        <MDBContainer>
          <h1 className="display-4 fw-bold">Chào mừng đến với PetCare Pro!</h1>
          <p className="lead mb-4">Giải pháp quản lý thú cưng toàn diện, dễ dùng và hiệu quả cho bạn.</p>
          <MDBBtn color="primary" size="lg" href="/appointments">Đặt lịch hẹn ngay</MDBBtn>
        </MDBContainer>
      </MDBContainer>

      {/* Chức năng nhanh */}
      <MDBContainer className="mb-5">
        <h4 className="fw-bold mb-4 text-primary text-center">Chức năng nhanh cho bạn</h4>
        <MDBRow className="gy-4 justify-content-center">
          <MDBCol xs="12" sm="6" md="4" lg="3">
            <MDBBtn className="w-100" color="info" onClick={() => navigate(`/owner-profile/${ownerId}`)}>
              Hồ sơ cá nhân
            </MDBBtn>
          </MDBCol>
          <MDBCol xs="12" sm="6" md="4" lg="3">
            <MDBBtn className="w-100" color="success" onClick={() => navigate("/Owner-pets")}>
              Quản lý thú cưng
            </MDBBtn>
          </MDBCol>
          <MDBCol xs="12" sm="6" md="4" lg="3">
            <MDBBtn className="w-100" color="warning" onClick={() => navigate("/Owner-appointments")}>
              Quản lý lịch hẹn
            </MDBBtn>
          </MDBCol>
          
          <MDBCol xs="12" sm="6" md="4" lg="3">
            <MDBBtn className="w-100" color="primary" onClick={() => navigate("/Owner-history")}>
              Lịch sử khám & spa
            </MDBBtn>
          </MDBCol>
          <MDBCol xs="12" sm="6" md="4" lg="3">
            <MDBBtn className="w-100" color="danger" onClick={handleLogout}>
              Đăng xuất
            </MDBBtn>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      {/* Phần giới thiệu */}
      <MDBContainer className="my-5">
        <MDBRow className="text-center">
          <MDBCol md="4">
            <h5>Quản lý thú cưng dễ dàng</h5>
            <p>Dễ dàng quản lý thông tin, hồ sơ, sức khỏe và lịch sử tiêm phòng của thú cưng.</p>
          </MDBCol>
          <MDBCol md="4">
            <h5>Lịch hẹn linh hoạt</h5>
            <p>Đặt lịch hẹn, theo dõi và quản lý các lịch khám/chăm sóc thú cưng mọi lúc mọi nơi.</p>
          </MDBCol>
          <MDBCol md="4">
            <h5>Hỗ trợ tận tình</h5>
            <p>Đội ngũ chuyên gia luôn sẵn sàng tư vấn và hỗ trợ bạn chăm sóc thú cưng tốt nhất.</p>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      {/* Chân trang */}
      <MDBFooter bgColor="dark" className="text-white text-center py-3">
        <MDBContainer>
          <p className="mb-0">&copy; {new Date().getFullYear()} PetCare Pro. Đã đăng ký bản quyền.</p>
        </MDBContainer>
      </MDBFooter>
    </div>
  );
};

export default HomePage;
