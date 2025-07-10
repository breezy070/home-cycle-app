import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import ProfileById from './pages/ProfileById'
import GestionInterventions from "./pages/GestionInterventions";
import GestionProduits from "./pages/GestionProduits";
import GestionUtilisateurs from "./pages/GestionUtilisateurs";
import PageNotFound from "./pages/PageNotFound";
import Interventions from "./pages/Interventions";
import ScheduleAppointment from "./pages/ScheduleAppointment";
import TechnicianZoneAssignment from "./pages/TechnicianZoneAssignment";
import Factures from "./pages/Factures";
import Header from "./components/Header";

import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    // <BrowserRouter>
    //   <Header />
    //     <Routes>
    //       <Route path="/" element={<HomePage />} />
    //       <Route path="/about" element={<About />} />
    //       <Route path="/sign-in" element={<SignIn />} />
    //       <Route path="/sign-up" element={<SignUp />} />
    //       <Route element={<PrivateRoute />}>
    //         <Route path="/profile" element={<Profile />} />
    //         <Route path="/interventions" element={<Interventions />} />
    //         <Route path="/factures" element={<Factures />} />
    //         <Route path="/technician-zone-assignment" element={<TechnicianZoneAssignment />} />
    //         <Route path="/schedule-appointment" element={<ScheduleAppointment />} />
    //       </Route>
          
    //     </Routes>
    // </BrowserRouter>
    <BrowserRouter>
    <Header />
    <Routes>
        {/* General Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/unauthorized" element={<PageNotFound />} />

        {/* Protected Routes */}
        {/* <Route element={<PrivateRoute allowedRoles={['user', 'admin', 'technician']} />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/interventions" element={<Interventions />} />
            <Route path="/schedule-appointment" element={<ScheduleAppointment />} />
        </Route> */}
        <Route element={<PrivateRoute allowedRoles={['user', 'admin', 'technician']}/>}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/interventions" element={<Interventions />} />
            <Route path="/factures" element={<Factures />} />
            <Route path="/schedule-appointment" element={<ScheduleAppointment />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path="/technician-zone-assignment" element={<TechnicianZoneAssignment />} />
          <Route path="/gestion-interventions" element={<GestionInterventions />} />
          <Route path="/gestion-produits" element={<GestionProduits />} />
          <Route path="/gestion-utilisateurs" element={<GestionUtilisateurs />} />
          <Route path="/profile-by-id/:userId" element={<ProfileById />} />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}
