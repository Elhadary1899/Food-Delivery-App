export default function SpecialOffersSection(){
    return( <section className="py-5 mb-5" > {/* Added mb-5 here */}
  <div className="container">
    <div className="text-center mb-5">
      <h2 className="fw-bold">Special Offers</h2>
      <p className="text-muted">Start Discovering A Lot Of Food Categories</p>
    </div>

    <div className="row g-1" style={{ height: '700px' }}>
      {/* Left Side */}
      <div className="col-md-8">
        <div className="d-flex flex-column h-100 "> {/* Added gap-3 here */}
          {/* Top Left */}
          <div className="rounded-4 flex-fill">
            <img
              src="/photo1.png"
              alt="header icon"
              className="img-fluid"
            />
          </div>
          {/* Bottom Left */}
          <div className="rounded-4 flex-fill">
            <img
              src="/photo3.png"
              alt="header icon"
              className="img-fluid"
            />
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="col">
        <img
          src="/photo2.png"
          alt="header icon"
          className="img-fluid" /* Added img-fluid here */
        />
      </div>
    </div>
  </div>
</section>)
}