import React from "react";
import "../about.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AboutUs = () => {
  const location = useLocation();

  useEffect(() => {
    // لو الهاش يساوي #contact نعمل scroll
    if (location.hash === "#contact") {
      // ننتظر رندر الـ DOM عشان العنصر يكون موجود
      // غالبًا scrollIntoView يشتغل فورًا، لكن timeout صغير يزيد الاعتمادية
      setTimeout(() => {
        const section = document.getElementById("about-contact-section");
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    }
  }, [location]);

  return (
    <div className="about-page">
      {/* HERO SECTION */}
      <section className="about-hero">
        <div className="hero-text">
          <h1>
            All You Want To <br /> Know About
          </h1>
          <h1 className="custom-logo">YumYard</h1>
        </div>

        <div className="hero-img">
          <img src="/public/about-hero.png" alt="About YumYard" />
        </div>
      </section>

      {/* MISSION */}
      <section className="section">
        <div className="text-box">
          <h2>Our Mession And History</h2>
          <p>
            Lorem Ipsum Dolor Sit Amet Consectetur. Urna Egestas Nunc Sed
            Fringilla Auctor. Lorem In In Nulla Risus Libero Nunc Dolor Turpis.
            Lobortis Nibh In Ultrices Senectus Donec Nam. Tortor Non Ullamcorper
            Eros Egestas. Elit Tellus Tellus Habitant Odio Lorem.
          </p>
        </div>

        <div className="img-box">
          <img
            src="/public/blob1.png"
            alt="Background Blob"
            className="blob-bg1"
          />
          <img src="/public/about-chef.png" alt="Chef" className="main-img" />
        </div>
      </section>

      {/* DELIVERY */}
      <section className="section">
        <div className="img-box">
          <img
            src="/public/blob1.png"
            alt="Background Blob"
            className="blob-bg2"
          />
          <img
            src="/public/about-delivery.png"
            alt="Delivery"
            className="main-img"
          />
        </div>

        <div className="text-box">
          <h2>Our Delivery Service</h2>
          <p>
            Lorem Ipsum Dolor Sit Amet Consectetur. Urna Egestas Nunc Sed
            Fringilla Auctor. Lorem In In Nulla Risus Libero Nunc Dolor Turpis.
            Lobortis Nibh In Ultrices Senectus Donec Nam.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section" id="about-contact-section">
        <div className="text-box">
          <h2>
            How To Contact With <span className="brand">YumYard</span>
          </h2>
          <p>
            Lorem Ipsum Dolor Sit Amet Consectetur. Urna Egestas Nunc Sed
            Fringilla Auctor. Lorem In In Nulla Risus Libero Nunc Dolor Turpis.
          </p>

          <div className="contact-icons">
            <p>📞 +2014768994</p>
            <p>📱 +2014768994</p>
            <p>📘 @YumYard</p>
          </div>
        </div>

        <div className="img-box">
          <img
            src="/public/blob1.png"
            alt="Background Blob"
            className="blob-bg"
          />
          <img
            src="/public/about-call.png"
            alt="Delivery"
            className="main-img"
          />
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
