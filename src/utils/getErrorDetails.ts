function getErrorDetails(error: string) {
  let alertTitle = "An Error occured!";
  let alertText = "Something went wrong!";

  if (error === "auth/user-not-found") {
    alertTitle = "Could not find the user!";
    alertText = "Make sure you have entered correct data!";
  }

  if (error === "auth/missing-password") {
    alertTitle = "Missing password!";
    alertText = "Make sure you have entered password!";
  }
  if (error === "auth/wrong-password") {
    alertTitle = "Wrong password!";
    alertText = "Make sure you have entered correct password";
  }

  if (error === "auth/invalid-email") {
    alertTitle = "Invalid email!";
    alertText = "Make sure you have entered correct email!";
  }
  if (error === "auth/email-already-in-use") {
    alertTitle = "Email is already in use!";
    alertText = "Account with this email is already is use";
  }
  if (error === "auth/too-many-requests") {
    alertTitle = "Too many requests";
    alertText = "Try again later";
  }
  return { alertTitle: alertTitle, alertText: alertText, alertError: true };
}
export default getErrorDetails;
