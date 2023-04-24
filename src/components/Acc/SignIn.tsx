import React from "react";
import styles from "./Form.module.scss";

import Form from "./Form";

import { Link } from "react-router-dom";

const SignIn = () => {
  const getUserData = async (email: string, password: string) => {};
  return (
    <div>
      <p className={styles["form__title"]}>Sign In</p>
      <Form getUserData={getUserData} />
      <p className={styles["form__text"]}>
        Or, if you don't have an account <Link to="/sign-up">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignIn;
