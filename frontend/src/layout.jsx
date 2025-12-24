import { Outlet, Link } from "react-router-dom";
import Navbar from "./Components/navbar.jsx";
import Footer from "./Components/footer";

export default function Layout() {
    return (
        <>
        <div className="d-flex flex-column justify-content-between min-vh-100">
        <Navbar />
 <div className="">
    <Outlet />
  </div>        <Footer/>
        </div>
        </>

    );}