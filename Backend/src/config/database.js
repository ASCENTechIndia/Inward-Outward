require("dotenv").config();
const oracledb = require("oracledb");

// DB1_NAME=ancldb
// DB1_USER=inward   
// DB1_PASSWORD=inward
// DB1_HOST=203.193.184.82
// DB1_PORT=1523
// DB1_SERVICE_NAME=ancldb
// DB1_CONNECT_STRING=203.193.184.82:1523/ancldb
// JWT_SECRET=your-secret-key
const dbConfig = {
  user: process.env.DB1_USER,
  password: process.env.DB1_PASSWORD,
  connectString: process.env.DB1_CONNECT_STRING,
  poolAlias: "dbPool",
};

async function initialize() {
  try {
    await oracledb.createPool(dbConfig);

    console.log("Oracle DB1 & DB2 Connection Pools Initialized");
  } catch (err) {
    console.error("Oracle DB Connection Error:", err);
    process.exit(1);
  }
}

async function getConnection() {
  return await oracledb.getConnection("dbPool");
}

module.exports = {
  initialize,
  getConnection,
};
