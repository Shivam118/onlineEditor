import React, { useEffect } from "react";
import { v4 as uuidV4 } from "uuid";
import { signInWithGooglePopup } from "../utils/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";

const Home = () => {
  const { loginUser } = useUser();
  const navigate = useNavigate();

  const logGoogleUser = async () => {
    signInWithGooglePopup()
      .then((user) => user.user)
      .then((user) => {
        if (user.accessToken) {
          localStorage.setItem("AuthToken", user.accessToken);
          localStorage.setItem(
            "AuthUser",
            JSON.stringify({
              name: user.displayName,
              email: user.email,
              photo: user.photoURL,
            })
          );
        }
        loginUser(user);
        navigate(`/doc/${uuidV4()}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("AuthToken");
    if (token) {
      navigate(`/doc/${uuidV4()}`);
    }
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button
        onClick={logGoogleUser}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "230px",
          padding: "10px 20px",
          borderRadius: "10px",
          border: "1px solid gray",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        <span>
          <img
            src={
              "https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-google-icon-logo-png-transparent-svg-vector-bie-supply-14.png"
            }
            alt="Google Logo"
            style={{ width: "30px", height: "30px" }}
          />
        </span>
        Sign In With Google
      </button>
    </div>
  );
};

export default Home;
