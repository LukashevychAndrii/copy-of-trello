import React from "react";
import styles from "./Form.module.scss";

import Form from "./Form";

import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";
import { useAppDispatch } from "../../hooks/redux";
import { setUser } from "../../store/slices/user-slice";
import { get, getDatabase, ref } from "@firebase/database";
import { app } from "../../firebase";

const SignIn = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const getUserData = async (
    email: string,
    password: string,
    uName: string
  ) => {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const db = getDatabase(app);
        const userRef = ref(db, `users/${user.uid}`);
        get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            const reternedData = snapshot.val();
            if (reternedData.uName === uName) {
              dispatch(
                setUser({
                  email: email,
                  uName: uName,
                  password: password,
                  id: user.uid,
                })
              );
              navigate("/");
            } else {
              console.log("Incorrect username");
            }
          } else {
            console.log("no data");
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
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
