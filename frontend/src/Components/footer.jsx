export default function Footer() {
return (
    <footer style={{ backgroundColor: '#7FA9A3' }} className="text-white py-5">
      <div className="container">
        {/* Top Section */}
        <div className="row mb-5">
          <div className="col-lg-6">
            <h2 className="fw-bold mb-3">
              Eat Your Favorite Food In<br />
              Different And Delicious Taste
            </h2>
          </div>
        </div>

        {/* Links Section */}
        <div className="row">
          {/* YumYard Column */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">YumYard</h5>
            <p className="small opacity-75">
              Optix Seamlessly Connects Your<br />
              Members With The Community.<br />
              Resources.
            </p>
            {/* Social Icons */}
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-white"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-white"><i className="bi bi-twitter"></i></a>
              <a href="#" className="text-white"><i className="bi bi-linkedin"></i></a>
              <a href="#" className="text-white"><i className="bi bi-pinterest"></i></a>
            </div>
          </div>

          {/* Entity types */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold mb-3">Entity types</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="#" className="text-white text-decoration-none opacity-75">Privacy Policy</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none opacity-75">Partners</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none opacity-75">About Us</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold mb-3">Services</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="#" className="text-white text-decoration-none opacity-75">Menu</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none opacity-75">Payroll</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none opacity-75">Help Center</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold mb-3">Resources</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="#" className="text-white text-decoration-none opacity-75">Contact Support</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none opacity-75">Privacy Policy</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none opacity-75">Terms</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold mb-3">Support</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="#" className="text-white text-decoration-none opacity-75">Contact Us</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none opacity-75">Cancelation Policy</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none opacity-75">Pricing</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>)
}