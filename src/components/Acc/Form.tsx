import React from "react";
import styles from "./Form.module.scss";

import { ReactComponent as PasswordIcon } from "../../img/SVG/lock.svg";
import { ReactComponent as EmailIcon } from "../../img/SVG/mail.svg";
import { ReactComponent as UserIcon } from "../../img/SVG//user-o.svg";
import { useAppSelector } from "../../hooks/redux";

interface props {
  getUserData(email: string, password: string, uName: string): void;
}

const Form: React.FC<props> = ({ getUserData }) => {
  const [uName, setUName] = React.useState("");
  const [uNameTouched, setUNameTouched] = React.useState(false);
  const [uNameError, setUNameError] = React.useState("Username is too short!");

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
    if (!emailError && !passwordError && !uNameError) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [setValid, emailError, passwordError, uNameError]);

  function handleUNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUName(e.target.value);
    if (e.target.value.trim().length < 5) {
      setUNameError("Username is too short! (5-10 letters)");
    } else if (e.target.value.trim().length > 10) {
      setUNameError("Username is too short!");
    } else {
      setUNameError("");
    }
  }

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
      case "uname":
        setUNameTouched(true);
        break;
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    getUserData(email, password, uName);
  }
  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <form
      data-theme={`${theme}`}
      className={styles["form"]}
      onSubmit={handleSubmit}
    >
      <div className={styles["form__element"]}>
        {uNameTouched && uNameError && (
          <p className={styles["form__error"]}>{uNameError}</p>
        )}
        <input
          value={uName}
          onChange={handleUNameChange}
          onBlur={handleBlur}
          className={`${styles["form__input"]} ${
            uNameTouched && uNameError && styles["form__input--error"]
          }`}
          type="text"
          id="uname"
          name="uname"
          required
          placeholder="Username"
        />
        <span className={styles["form__input--focus"]}></span>
        <label
          theme-form-icon={theme}
          className={styles["form__label"]}
          htmlFor="email"
        >
          <UserIcon />
        </label>
      </div>
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
        <label
          theme-form-icon={theme}
          className={styles["form__label"]}
          htmlFor="email"
        >
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

        <label
          theme-form-icon={theme}
          className={styles["form__label"]}
          htmlFor="password"
        >
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
