import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Login from './Components/Login';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './Components/Dashboard';
import Home from './Components/Home';
import Veterinarians from './Components/Veterinarians';
import PetOwners from "./Components/PetOwners";
import Profile from './Components/Profile';
import Category from './Components/Category';
import AddCategory from './Components/AddCategory';
import AddVeterinarian from './Components/AddVeterinarian';
import EditVeterinarian from './Components/EditVeterinarian';
import Pets from './Components/Pets';
import AddPet from './Components/AddPet';
import Pet from './Components/Pet';
import EditPet from './Components/EditPet';
import Appointments from "./Components/Appointments/Appointments";
import VaccinationAppointments from './Components/Appointments/VaccinationAppointments';
import AddAdmin from './Components/AddAdmin';
import EditAdmin from './Components/EditAdmin';
import AddPetOwners from './Components/AddPetOwners';
import EditPetOwner from './Components/EditPetOwner';
import AddVaccination from './Components/Vaccinations/AddVaccination';
import EditVaccination from './Components/Vaccinations/EditVaccination';
import Owner from './Components/Owner';
import OwnerPets from './Components/OwnerPets';
import BookAppointments from './Components/BookAppointments/BookAppointments';
import PrivateRoute from './Components/PrivateRoute';
import Start from './Components/Start';
import OwnerLogin from './Components/PetOwnersRoutes/OwnerLogin';
import OwnerDetails from './Components/PetOwnersRoutes/OwnerDetails';
import ViewPets from './Components/PetOwnersRoutes/ViewPets';
import VetLogin from './Components/VetRoutes/VetLogin';
import Signup from './Components/PetOwnersRoutes/Signup';
import HomePage from './Components/PetOwnersRoutes/HomePage';
import OwnerAppointments from './Components/PetOwnersRoutes/OwnerAppointments';
import OwnerHistory from './Components/PetOwnersRoutes/OwnerHistory';

import OwnerPetsVer2 from './Components/PetOwnersRoutes/OwnerPetsVer2';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Start/>} ></Route>
        <Route path="/admin-login" element={<Login/>}></Route>
        <Route path="/owner-login" element={<OwnerLogin/>}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/veterinarian-login" element={<VetLogin/>}></Route>
        <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>}>
          <Route path='' element={<Home/>}></Route>
          {/*Profile routes */}
          <Route path='/dashboard/profile' element={<Profile/>}></Route>
          {/*Appointments routes */}
          <Route path='/dashboard/preview-appointment' element={<Appointments/>}></Route>
          <Route path='/dashboard/add-appointment' element={<BookAppointments/>}></Route>
          <Route path='/dashboard/preview-vaccination-appointments' element={<VaccinationAppointments/>}></Route>
          {/*Veterinarian routes */}
          <Route path='/dashboard/veterinarians' element={<Veterinarians/>}></Route>
          <Route path='/dashboard/add-veterinarian' element={<AddVeterinarian/>}></Route>
          <Route path='/dashboard/edit-veterinarian/:id' element={<EditVeterinarian/>}></Route>
          {/*Pet Owners routes */}
          <Route path='/dashboard/pet-owners' element={<PetOwners/>}></Route>
          <Route path='/dashboard/pet-owner/:id' element={<Owner/>}></Route>
          <Route path='/dashboard/pet-owner-pets/:id' element={<OwnerPets/>}></Route>
          <Route path='/dashboard/add-pet-owners' element={<AddPetOwners/>}></Route>
          <Route path='/dashboard/edit-pet-owner/:id' element={<EditPetOwner/>}></Route>
          {/*Pets routes */}
          <Route path='/dashboard/pets' element={<Pets/>}></Route>
          <Route path='/dashboard/pet/:id' element={<Pet/>}></Route>
          <Route path='/dashboard/edit-pet/:id' element={<EditPet/>}></Route>
          <Route path='/dashboard/add-pet' element={<AddPet/>}></Route>
          {/*Categories routes */}
          <Route path='/dashboard/categories' element={<Category/>}></Route>
          <Route path='/dashboard/add-category' element={<AddCategory/>}></Route>
          {/*Admins routes */}
          <Route path='/dashboard/add-admin' element={<AddAdmin/>}></Route>
          <Route path='/dashboard/edit-admin/:id' element={<EditAdmin/>}></Route>
          {/*Vaccinations routes */}
          <Route path='/dashboard/add-vaccinations' element={<AddVaccination/>}></Route>
          <Route path='/dashboard/edit-vaccination/:id' element={<EditVaccination/>}></Route>
        </Route>
        {/*Owners routes for logged in owners*/}
        <Route path='/owner-profile/:id' element={<OwnerDetails/>}></Route> HomePage
        <Route path='/HomePage/:id' element={<HomePage/>}></Route>
        <Route path='/owner-profile-pets/:id' element={<ViewPets/>}></Route>
        <Route path="/Owner-pets" element={<OwnerPetsVer2 />} />
          <Route path="/Owner-appointments" element={<OwnerAppointments />} />
          <Route path="/Owner-history" element={<OwnerHistory />} />
          
      </Routes>
    </BrowserRouter>
  )
}

export default App
