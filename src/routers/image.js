/**
 * @description This is the main router to handle the image hosting and retreiving
 * @requires express
 */

const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { errors, nonerror } = require("../data/errors.json");
const path = require("path");

//? Express stuff
router.use(express.json());

//? Config stuff
const { pvk, pubKeys } = require("../data/secrets.json");

function checkForKey(req, res, next) {
    // Assuming pvk is a string and pubKeys is an object loaded from your secrets.json
    if (pvk.includes(req.headers["auth-key"])) {
      next();
    } else if (Object.keys(pubKeys).includes(req.headers["auth-key"])) {
      // Correctly access the key's properties for logging
      const keyDetails = pubKeys[req.headers["auth-key"]];
      fs.appendFileSync(
        path.join(__dirname, "../data/logs/pubKeys.log"),
        `${req.headers["auth-key"]}: ${keyDetails.ip}, ${keyDetails.user} - ${req.method} - ${req.url} - ${new Date().toLocaleString()}\n`
      );
      next();
    } else {
      // Handle unauthorized or forbidden responses
      if (!req.headers["auth-key"]) {
        // If the key is not present
        res.status(401).send(errors["401"]);
      } else {
        // If the key is invalid
        res.status(403).send(errors["403"]);
      }
      return; // Ensure the function exits here to prevent further execution
    }
  }

function generateID(input) {
  // Get the input and use that as the seed
  let seed = input;
  let id = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let limit = 5;

  // Generate the ID
  for (let i = 0; i < limit; i++) {
    id += seed.charAt(Math.floor(Math.random() * seed.length));
  }

  // Just incase the ID is already in use
  if (fs.existsSync(`../data/uploads/${id}`)) {
    for (let i = 0; i < limit; i++) {
      id += seed.charAt(Math.floor(Math.random() * seed.length));
    }
  }

  // If it is somehow below 5 characters
  if (id.length < limit) {
    ogID = id;
    // Just add characters until it is X characters long
    for (let i = 0; i < limit - id.length; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  }

  // Remove any spaces or special chars
  id = id.replace(/[^a-zA-Z0-9]/g, "");

  return id;
}

//? Multer stuff
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    let error =
      '{ title: "Unsupported File Type", message: "The server does not support the media type transmitted in the request." }';
    return cb(error, false);
  } else {
    return cb(null, true);
  }
};

var storage = multer.diskStorage({
  // Set the destination
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../data/uploads"));
  },

  // Set the filename with the random ID
  filename: function (req, file, cb) {
    cb(null, generateID(file.originalname) + "." + file.mimetype.split("/")[1]); // "randid.ext"
  },
});

const upload = multer({ storage: storage, fileFilter: fileFilter });

//? Routes

router.get("/get/:id", (req, res) => {
  // Will get the image with the ID given if it exists //? WILL NOT REQUIRE AUTHENTICATION

  // Correctly resolve the path to the file
  const filePath = path.join(__dirname, "../data/uploads", req.params.id);

  // Send the file
  res.sendFile(filePath, function (err) {
    if (err) {
      // Handle error, but don't show internal details to the client
      console.error(err); // Log error details for debugging
      res.status(500).send("An error occurred"); // Send a generic error message
    }
  });
});

router.post("/upload", checkForKey, upload.single("image"), (req, res) => {
  // Will upload an image to the server //? WILL REQUIRE AUTHENTICATION

  // Check if the file exists
  if (req.file) {
    // Send 200 and then append the ID to the response
    res.status(200).send({ code: nonerror["200"], id: req.file.filename });
  } else {
    res.status(404).send(errors["404"]);
  }
});

module.exports = router;
