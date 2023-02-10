const express = require("express");
const Model = require("../models/model");
// const CreateNewListing = require("./UpdateHostListing");
const app = express();
const cors = require("cors");

var bodyParser = require("body-parser");
const SearchListing = require("../controllers/CommonControls/SearchListing");
const GetAll = require("../controllers/CommonControls/GetAll");
const jwtVerifyUser = require("../middlewares/jwtVerifyUser");
const TopPicked = require("../controllers/CommonControls/TopPicked");
const TopRated = require("../controllers/CommonControls/TopRated");
const Popular = require("../controllers/CommonControls/Popular");
const GetById = require("../controllers/CommonControls/GetById");
app.use(cors())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

const router = express.Router();

// router.get("/", jwtVerifyUser, (req, res) => {
//   res.send("first enpoint successful");
// });

router.post("/getAll", async (req, res) => {
  await GetAll(req)
    .then((data) => {
      
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});
router.get("/getById", async (req, res) => {
  await GetById(req)
    .then((data) => {
      
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});


router.post("/search", (req, res) => {
  SearchListing(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});
router.get("/Popular", (req, res) => {
  Popular(req)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});
router.get("/topPicks", (req, res) => {
  TopPicked(req)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});
router.get("/topRated", (req, res) => {
  TopRated(req)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});


module.exports = router;
