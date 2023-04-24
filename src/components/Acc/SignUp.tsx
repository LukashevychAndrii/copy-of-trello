import React from "react";
import styles from "./Form.module.scss";

import { Link } from "react-router-dom";
import Form from "./Form";

const SignUp = () => {
  const getUserData = async (
    email: string,
    password: string,
    uName: string
  ) => {};
  return (
    <>
      <p className={styles["form__title"]}>Sign Up</p>

      <Form getUserData={getUserData} />
      <p className={styles["form__text"]}>
        Or, if you already have an account <Link to="/sign-in">Sign In</Link>
      </p>
    </>
  );
};

export default SignUp;
