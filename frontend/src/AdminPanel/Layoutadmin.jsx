import { Outlet, Link } from "react-router-dom";
import NavbarAdmin from "./navbaradmin";

export default function LayoutAdmin() {
    return (
        <>
   <div style={{background: "linear-gradient(180deg , #E1FDFF, #87A5A6)",
    
   }}>
        <NavbarAdmin  />
 <div className="d-flex flex-column justify-content-between min-vh-100 ">
    <Outlet />
  </div>        
        </div>
        </>

    );}