import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios"
import { BiSolidCategory } from "react-icons/bi";

const Category = () => {
  const [category, setCategory] = useState([]);
  useEffect(()=>{
    axios.get("http://localhost:3000/auth/categories")
    .then(result => {
      if(result.data.Status) {
        setCategory(result.data.Result);
    } else {
        alert(result.data.Error)
    }
    }).catch(err => console.log(err))
  },[])
  return (
    <div className='px-5 my-4 mx-2'>
      <div className='d-flex justify-content-between align-items-center'>
        <h3>Danh sách chức vụ </h3>
        <Link to="/dashboard/add-category" className='btn btn-success'>Thêm chức vụ </Link>
      </div>
      <div className="mt-3">
        {category.length === 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><BiSolidCategory /> No Category Found</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {category.map((categ) => (
                <tr key={categ.category_id}>
                  <td>{categ.category_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Category