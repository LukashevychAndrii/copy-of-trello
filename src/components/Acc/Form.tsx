import React from "react";
import styles from "./Form.module.scss";

import { ReactComponent as PasswordIcon } from "../../img/SVG/lock.svg";
import { ReactComponent as EmailIcon } from "../../img/SVG/mail.svg";

interface props {
  getUserData(email: string, password: string): void;
}

const Form: React.FC<props> = ({ getUserData }) => {
  const [email, setEmail] = React.useState("");
  const [emailTouched, setEmailTouched] = React.useState(false);
  const [emailError, setEmailError] = React.useState(
    "Please, enter a valid email!"
  );

  const [password, setPassword] = React.useState("");
  const [passwordTouched, setPasswordTouched] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(
    "Password is too short!"
  );

  const [valid, setValid] = React.useState(false);

  React.useEffect(() => {
    if (!emailError && !passwordError) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [setValid, emailError, getUserData, email, password, passwordError]);

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(e.target.value)) {
      setEmailError("Please, enter a valid  email!");
    } else {
      setEmailError("");
    }
  }
  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    if (e.target.value.trim().length < 6) {
      setPasswordError("Password is too short!");
    } else {
      setPasswordError("");
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const target = e.target;
    switch (target.name) {
      case "email":
        setEmailTouched(true);
        break;
      case "password":
        setPasswordTouched(true);
        break;
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    getUserData(email, password);
  }

  return (
    <form className={styles["form"]} onSubmit={handleSubmit}>
      <div className={styles["form__element"]}>
        {emailTouched && emailError && (
          <p className={styles["form__error"]}>{emailError}</p>
        )}
        <input
          value={email}
          onChange={handleEmailChange}
          onBlur={handleBlur}
          className={`${styles["form__input"]} ${
            emailTouched && emailError && styles["form__input--error"]
          }`}
          type="email"
          id="email"
          name="email"
          required
          placeholder="Email"
        />
        <span className={styles["form__input--focus"]}></span>
        <label className={styles["form__label"]} htmlFor="email">
          <EmailIcon />
        </label>
      </div>
      <div className={styles["form__element"]}>
        {passwordTouched && passwordError && (
          <p className={styles["form__error"]}>{passwordError}</p>
        )}
        <input
          value={password}
          onChange={handlePasswordChange}
          onBlur={handleBlur}
          className={`${styles["form__input"]} ${
            passwordTouched && passwordError && styles["form__input--error"]
          }`}
          type="password"
          id="password"
          name="password"
          required
          placeholder="Password"
        />
        <span className={styles["form__input--focus"]}></span>

        <label className={styles["form__label"]} htmlFor="password">
          <PasswordIcon />
        </label>
      </div>
      <button
        disabled={!valid}
        type="submit"
        className={styles["form__submit-btn"]}
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
