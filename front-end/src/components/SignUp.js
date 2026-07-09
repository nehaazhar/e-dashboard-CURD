import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { API_BASE_URL } from "../config";

const SignUp = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  });

  const collectData = async () => {
    console.warn(name, email, password);
    // Encrypt the password
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      "A4&k$29@3zD1#qL",
    ).toString();

    let result = await fetch(`${API_BASE_URL}/register`, {
      method: "post",
      body: JSON.stringify({ name, email, encryptedPassword }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    result = await result.json();
    console.warn(result);
    localStorage.setItem("user", JSON.stringify(result.result));
    localStorage.setItem("token", JSON.stringify(result.auth));

    if (result) {
      navigate("/");
    }
  };

  return (
    <div className="register register-container">
      <h1 className="register-title">Register</h1>
      <input
        className="inputBox"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Name"
      />

      <input
        className="inputBox"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter Email"
      />

      <input
        className="inputBox"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter Password"
      />

      <button onClick={collectData} className="register-button" type="button">
        Sign Up
      </button>
    </div>
  );
};

export default SignUp;
