const oracledb = require("oracledb");
const { getConnection } = require("../../../src/config/database");

const getMenus = async (req, res) => {
  let connection;
  try {
    const { userId, ulbId, deptId } = req.body;

    console.log(
      "Received Query Params - User:",
      userId,
      "ULB:",
      ulbId,
      "Dept:",
      deptId,
    );

    if (!userId || !ulbId || !deptId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required query parameters" });
    }

    connection = await getConnection();

    const query = ``;

    const binds = { userId, ulbId, deptId };
    const result = await connection.execute(query, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching menu data:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching menu data" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing Oracle connection:", err);
      }
    }
  }
};

module.exports = { getMenus };
