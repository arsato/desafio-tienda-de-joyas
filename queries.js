const pool = require("./config");
const format = require("pg-format");

const getInventario = async ({
  limits = 6,
  order_by = "stock_ASC",
  page = 1,
}) => {
  try {
    const [campo, direccion] = order_by.split("_");
    const offset = (page - 1) * limits;
    const query = format(
      "SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s",
      campo,
      direccion,
      limits,
      offset
    );
    const { rows: joyas } = await pool.query(query);
    return joyas;
  } catch (e) {
    console.log(e);
  }
};

const getJoya = async (id) => {
  try {
    const query = "SELECT * FROM inventario WHERE id = $1";
    const values = [id];
    const { rows: joyas } = await pool.query(query, values);
    return joyas;
  } catch (e) {
    console.log(e);
  }
};

const getFilteredInventario = async ({
  precio_max,
  precio_min,
  categoria,
  metal,
}) => {
  try {
    let filter = [];
    const values = [];

    const addFilter = (campo, comparador, valor) => {
      values.push(valor);
      const { length } = filter;
      filter.push(`${campo} ${comparador} $${length + 1}`);
    };

    if (precio_max) addFilter("precio", "<=", precio_max);
    if (precio_min) addFilter("precio", ">=", precio_min);
    if (categoria) addFilter("categoria", "=", categoria);
    if (metal) addFilter("metal", "=", metal);

    let query = "SELECT * FROM inventario";

    if (filter.length > 0) {
      filter = filter.join(" AND ");
      query += ` WHERE ${filter}`;
    }
    const { rows: joyas } = await pool.query(query, values);
    return joyas;
  } catch (e) {
    console.log(e);
  }
};

const prepareHATEOAS = (joyas) => {
  const results = joyas
    .map((m) => {
      return {
        name: m.nombre,
        href: `/joyas/joya/${m.id}`,
      };
    })
    .slice(0, 10);
  const totalJoyas = joyas.length;
  let stockTotal = 0;
  joyas.forEach((ele) => {
    stockTotal += ele.stock;
  });
  const HATEOAS = {
    totalJoyas,
    stockTotal,
    results,
  };
  return HATEOAS;
};

module.exports = {
  getInventario,
  getJoya,
  getFilteredInventario,
  prepareHATEOAS,
};
