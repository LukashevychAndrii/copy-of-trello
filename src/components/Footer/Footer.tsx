import React from "react";
import styles from "./Footer.module.scss";
import { useAppSelector } from "../../hooks/redux";
import { ReactComponent as InstagramIcon } from "../../img/SVG/instagram.svg";
import { ReactComponent as FacebookIcon } from "../../img/SVG/facebook.svg";
import { ReactComponent as LinkedinIcon } from "../../img/SVG/linkedin2.svg";
import { ReactComponent as TwitterIcon } from "../../img/SVG/twitter.svg";

const Footer = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <footer
      data-theme={theme}
      footer-theme={theme}
      className={styles["footer"]}
    >
      <h1 className={styles["footer__company-name"]}>Dumb Copy of Trello</h1>
      <ul className={styles["footer__links-1"]}>
        <li className={styles["footer__links-1__item"]}>About</li>
        <li className={styles["footer__links-1__item"]}>Services</li>
        <li className={styles["footer__links-1__item"]}>Press</li>
        <li className={styles["footer__links-1__item"]}>Careers</li>
        <li className={styles["footer__links-1__item"]}>FAQ</li>
        <li className={styles["footer__links-1__item"]}>Legal</li>
        <li className={styles["footer__links-1__item"]}>Contact</li>
      </ul>
      <div className={styles["footer__text"]}>Stay in touch</div>
      <ul className={styles["footer__links-2"]}>
        <li className={styles["footer__links-2__item"]}>
          <a href="#">
            <InstagramIcon icon-theme={theme} />
          </a>
        </li>
        <li className={styles["footer__links-2__item"]}>
          <a href="#">
            <FacebookIcon icon-theme={theme} />
          </a>
        </li>
        <li className={styles["footer__links-2__item"]}>
          <a href="#">
            <LinkedinIcon icon-theme={theme} />
          </a>
        </li>
        <li className={styles["footer__links-2__item"]}>
          <a href="#">
            <TwitterIcon icon-theme={theme} />
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
