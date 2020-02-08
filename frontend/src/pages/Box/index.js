import React, { useState, useEffect } from "react";
import { formatDistance, parseISO } from "date-fns";
import pt from "date-fns/locale/pt-BR";
import api from "../../services/api";
import Dropzone from "react-dropzone";
import socket from "socket.io-client";

import { MdInsertDriveFile } from "react-icons/md";

import "./styles.css";
import logo from "../../assets/logo.svg";

export default function Box({ match }) {
  const { id } = match.params;
  const [boxContent, setBoxContent] = useState({});

  async function loadContent() {
    const response = await api.get(`/boxes/${id}`);

    setBoxContent(response.data);
  }

  loadContent();

  useEffect(() => {
    subscribeToNewFiles();
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function subscribeToNewFiles() {
    const io = socket("https://mybox-omnistack.herokuapp.com");

    io.on("file", data => {
      setBoxContent({ data, ...boxContent });
    });
  }

  function handleUpload(files) {
    files.forEach(file => {
      const data = new FormData(); // formData is the way to send files to the backend without using a form.

      data.append("file", file);

      api.post(`boxes/${id}/files`, data);
    });
  }

  return (
    <div id="box-container">
      <header>
        <img src={logo} alt="logo" />
        <h1>RocketSeat</h1>
      </header>

      <Dropzone onDropAccepted={handleUpload}>
        {({ getRootProps, getInputProps }) => (
          <div className="upload" {...getRootProps()}>
            <input {...getInputProps()} />

            <p>Arraste o(s) arquivo(s) ou clique aqui</p>
          </div>
        )}
      </Dropzone>

      <ul>
        {boxContent.files &&
          boxContent.files.map(file => (
            <li key={file._id}>
              <a className="fileInfo" href={file.url} target="blank">
                <MdInsertDriveFile size={24} color="#A5Cfff" />
                <strong>{file.title}</strong>
              </a>

              <span>
                {formatDistance(parseISO(file.createdAt), new Date(), {
                  locale: pt,
                  addSuffix: true
                })}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}
