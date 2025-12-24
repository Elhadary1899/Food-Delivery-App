import { height } from "@fortawesome/free-solid-svg-icons/fa0";
import { useNavigate } from "react-router-dom";

export default function Header() {

    const navigate = useNavigate();
    

  const handleGoToRestaurants = () => {
    navigate("/restaurants");
  };

    return (<div className="sushi-banner container-fluid " style={{ backgroundColor: '#81A4A6', paddingTop: '8rem' }}>
        <div className="row align-items-center w-[8a0%] mx-auto container">
            {/* Text Column (Takes 6/12 columns on medium screens and up) */}
            <div className="col-md-6 text-black p-4">
                <h2 className="display-4 fw-bold mb-3">
                    Fresh And Varieant
                    <br />
                    <span style={{ color: '#F8CF93' }}>Sushi</span> Types With
                    <br />
                    Special Offer
                </h2>
                <p className="lead mb-4" style={{ color: '#696969', fontWeight: 'bold' }}>
                    Start Discovering A Lot Of Food Categories, Enjoy With Good Quality, High Rating.
                </p>
                {/* Custom Button with Bootstrap styling */}
                <button
                    className="btn btn-lg btn-success-custom text-white rounded-pill"
                    style={{ backgroundColor: '#5B8E91' }}
                    onClick={handleGoToRestaurants}
                >
                    Start Shopping <i className="bi bi-bag ms-2"></i>        <img
                        src="/Vector.png"
                        alt="cart icon"
                        className="img-fluid"
                        style={{ width: '1rem', height: '1rem', objectFit: 'contain' }}
                    />

                </button>
            </div>

            {/* Image Column (Takes 6/12 columns on medium screens and up) */}
            <div className="col-md-6 d-flex justify-content-center p-4">
                <img
                    src="/header.png"
                    alt="header icon"
                    className="img-fluid"
                />
                <div className="img-placeholder">
                    {/* The image is contained here */}
                </div>
            </div>
        </div>
    </div>)
}