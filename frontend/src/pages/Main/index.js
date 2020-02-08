import React, { useState } from "react";

import "./styles.css";
import api from "../../services/api";

import logo from "../../assets/logo.svg";

export default function Main({ history }) {
  const [newBox, setNewBox] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await api.post("/boxes", {
      title: newBox
    });

    history.push(`/box/${response.data._id}`);
  }
  return (
    <div id="main-container">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="logo" />
        <input
          placeholder="Criar uma box"
          value={newBox}
          onChange={e => setNewBox(e.target.value)}
        />
        <button type="submit">Criar</button>
      </form>
    </div>
  );
}
