const express = require("express");
const multer = require("multer");
const multerConfig = require("./config/multer");

const routes = express.Router();
const upload = multer(multerConfig);

const BoxController = require("./app/controllers/BoxController");
const FileController = require("./app/controllers/FileController");

routes.post("/boxes", BoxController.store);
routes.get("/boxes/:id", BoxController.show);

routes.post("/boxes/:id/files", upload.single("file"), FileController.store);

module.exports = routes;
