const express = require("express");
const router = express.Router();
const {
  getInventario,
  getFilteredInventario,
  prepareHATEOAS,
  getJoya,
} = require("../queries");

router.use(express.json());

let requestTime = (req) => {
  console.log("\x1b[31m", Date().toString());
  console.log("Se ha realizado una consulta a la siguiente direccion:");
  console.log("%s\x1b[0m", req.originalUrl);
};

router.get("/joyas", async (req, res) => {
  const queryString = req.query;
  const joyas = await getInventario(queryString);
  const HATEOAS = await prepareHATEOAS(joyas);
  requestTime(req);
  res.json(HATEOAS);
});

router.get("/joyas/joya/:id", async (req, res) => {
  const { id } = req.params;
  const joyas = await getJoya(id);
  requestTime(req);
  res.json(joyas);
});

router.get("/joyas/filtros", async (req, res) => {
  const queryString = req.query;
  const joyas = await getFilteredInventario(queryString);
  requestTime(req);
  res.json(joyas);
});

router.get("*", (req, res) => {
  requestTime(req);
  res.status(404).send("Esta ruta no existe");
});

module.exports = router;
