import React from "react";
import styles from "./Form.module.scss";

import { Link } from "react-router-dom";
import Form from "./Form";
import { getDatabase, ref, update } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app } from "../../firebase";

interface anyKey {
  [key: string]: any;
}
const SignUp = () => {
  const navigate = useNavigate();
  const getUserData = async (
    email: string,
    password: string,
    uName: string
  ) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async ({ user }) => {
        const db = getDatabase(app);
        const data = {
          email: email,
          password: password,
          uName: uName,
        };

        const updates: anyKey = {};
        updates["/users/" + user.uid] = data;
        await update(ref(db), updates);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
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
