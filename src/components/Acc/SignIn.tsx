import React from "react";
import styles from "./Form.module.scss";

import Form from "./Form";

import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setUser } from "../../store/slices/user-slice";
import { get, getDatabase, ref } from "@firebase/database";
import { app } from "../../firebase";
import { createAlert } from "../../store/slices/alert-slice";
import getErrorDetails from "../../utils/getErrorDetails";

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
        const userRef = ref(db, `users/${user.uid}/userdata`);
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
                  uPhoto: reternedData.uPhoto,
                })
              );
              dispatch(
                createAlert({
                  alertTitle: "Success!",
                  alertText: "You successfully sign in",
                  alertError: false,
                })
              );
              navigate("/");
            } else {
              dispatch(
                createAlert({
                  alertTitle: "Wrong username!",
                  alertText: "Make sure you have entered correct username",
                  alertError: true,
                })
              );
            }
          } else {
            dispatch(
              createAlert({
                alertTitle: "Error!",
                alertText: "Database error",
                alertError: true,
              })
            );
          }
        });
      })
      .catch((error) => {
        dispatch(createAlert(getErrorDetails(error.code)));
      });
  };
  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <div data-theme={`${theme}`}>
      <span className={styles["form__title"]}>Sign In</span>
      <Form getUserData={getUserData} />
      <p className={styles["form__text"]}>
        Or, if you don't have an account <Link to="/sign-up">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignIn;
