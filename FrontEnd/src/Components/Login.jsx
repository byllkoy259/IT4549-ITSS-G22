import { useState } from 'react';
import "./style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [value, setValue] = useState({
        admin_name: "",
        password: "",
    });

    const [error, setError] = useState(null);

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();
        if (value.admin_name.trim() === '' || value.password.trim() === '') {
            setError("Vui lòng nhập đầy đủ tên quản trị và mật khẩu!");
            return;
        }
        axios.post("http://localhost:3000/auth/admin-login", value)
            .then(result => {
                if (result.data.loginStatus) {
                    localStorage.setItem("valid", true);
                    navigate("/dashboard");
                } else {
                    setError(result.data.Error);
                }
            })
            .catch(err => {
                setError("Đã có lỗi xảy ra: " + (err.message || "Không xác định"));
                console.error(err);
            });
    };

    return (
        <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
            <div className='p-3 rounded w-25 border loginForm'>
                <div className='text-warning'>
                    {error && error}
                </div>
                <h2>Đăng Nhập Quản Trị</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='admin_name'><strong>Tên Quản Trị:</strong></label>
                        <input
                            type='text'
                            name='admin_name'
                            autoComplete='off'
                            placeholder='Nhập tên quản trị'
                            className='form-control rounded-0'
                            value={value.admin_name}
                            onChange={(e) => setValue({ ...value, admin_name: e.target.value })}
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'><strong>Mật Khẩu:</strong></label>
                        <input
                            type='password'
                            name='password'
                            placeholder='Nhập mật khẩu'
                            className='form-control rounded-0'
                            value={value.password}
                            onChange={(e) => setValue({ ...value, password: e.target.value })}
                        />
                    </div>
                    <button className='btn btn-success w-100 rounded-0 mb-2'>Đăng Nhập</button>
                    <div className='mb-1'>
                        <input type="checkbox" name="tick" id='tick' className="me-2" />
                        <label className='mx-1' htmlFor='tick'>Ghi nhớ tôi</label>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;