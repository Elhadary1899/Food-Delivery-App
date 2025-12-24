export default function DeliverySection(){
    return(
         <section className="py-5 bg-white" >
              <div className="container">
                <div className="row align-items-center">
                  {/* Left Content */}
                  <div className="col-lg-6">
                    <h2 className="fw-bold mb-4">Only 30 Minutes Delivery!</h2>
                    <p className="text-muted mb-3">
                      Start Discovering A Lot Of Food Categories,<br />
                      Enjoy With Good Quality, High Rating.<br />
                      Loreum Undjajqgjcb Hghsbhdbshbchsbcs
                    </p>
                    
                    {/* Call Section */}
                    <div className="d-flex align-items-center mt-4">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-truck fs-2 me-3"></i>
                        <div className="vr mx-3" style={{height: '40px'}}></div>
                        <div>
                          <p className="mb-0 text-muted">Call Us On :</p>
                          <h5 className="text-warning fw-bold mb-0">+20123454678</h5>
                        </div>
                      </div>
                    </div>
                  </div>
        
                  {/* Right Image */}
                  <div className="col-lg-6 text-center">
                    <div className="position-relative">
                      <img 
                        src="/delivery.png" 
                        alt="Delivery" 
                        className="img-fluid"
                        style={{maxWidth: '400px'}}
                      />
                      
                      {/* Decorative Icons - positioned absolutely */}
                      <div className="position-absolute top-0 start-0 w-100 h-100">
                        <i className="bi bi-clock text-danger position-absolute" 
                           style={{top: '10%', left: '20%', fontSize: '2rem'}}></i>
                        <i className="bi bi-wifi text-warning position-absolute" 
                           style={{top: '40%', left: '5%', fontSize: '1.5rem'}}></i>
                        <i className="bi bi-chat-dots text-danger position-absolute" 
                           style={{bottom: '20%', left: '10%', fontSize: '1.5rem'}}></i>
                        <i className="bi bi-geo-alt-fill text-danger position-absolute" 
                           style={{top: '5%', right: '10%', fontSize: '2.5rem'}}></i>
                        <i className="bi bi-geo-alt text-warning position-absolute" 
                           style={{bottom: '10%', right: '5%', fontSize: '1.5rem'}}></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
        
    )
}