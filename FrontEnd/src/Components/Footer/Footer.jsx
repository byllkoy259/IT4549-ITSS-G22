import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="dashboard-footer">
      <div className="footer-content">
        <span>
          <b>Design by Group 22</b> &middot; Hanoi
        </span>
        <span className="footer-contact">
          Liên hệ: <a href="tel:0986xxxxxx">0986xxxxxx</a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
