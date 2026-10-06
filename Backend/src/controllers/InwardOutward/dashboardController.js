const { getConnection } = require("../../config/database");
const oracledb = require("oracledb");

const getDashboardAllDepartmentList = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `SELECT deptid,
            deptname,
            NVL(SUM(inw_open), 0)    AS inw_open,
            NVL(SUM(inw_close), 0)   AS inw_close,
            NVL(SUM(inw_forward), 0) AS inw_forward,
            NVL(SUM(inw_open), 0)
                + NVL(SUM(inw_close), 0)
                + NVL(SUM(inw_forward), 0) AS total
        FROM (
            SELECT num_inwardto_deptid AS deptid,
                var_dept_mname      AS deptname,
                CASE WHEN var_inward_status = 'IL' THEN 1 ELSE 0 END AS inw_open,
                CASE WHEN var_inward_status = 'C'  THEN 1 ELSE 0 END AS inw_close,
                CASE WHEN var_inward_status = 'F'  THEN 1 ELSE 0 END AS inw_forward
            FROM aoio_inward_mas
            INNER JOIN aoio_inwardto_det
                ON num_inwardto_inwardid = num_inward_inwardid
            INNER JOIN admins.aoma_department_def
                ON num_dept_id = num_inwardto_deptid
            WHERE 1 = 1
        )
        GROUP BY deptname, deptid
        ORDER BY deptname`;
    const bind = {};
    const result = await connection.execute(query, bind, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    res.json({
      success: true,
      data: result.rows || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing DB connection:", err);
      }
    }
  }
};

const getDashboardSummaryCounts = async (req, res) => {
  let connection;
  try {
    const { fromMonth, toMonth, fromYear, toYear } = req.body;
    if (!fromMonth) {
      return res.json({
        success: false,
        errorMessage: "Starting date of current month is required",
      });
    }
    if (!toMonth) {
      return res.json({
        success: false,
        errorMessage: "Ending date of current month is required",
      });
    }
    if (!fromYear) {
      return res.json({
        success: false,
        errorMessage: "Statring date of current year is required",
      });
    }
    if (!toYear) {
      return res.json({
        success: false,
        errorMessage: "Ending date of current year is required",
      });
    }
    connection = await getConnection();

    const todayQuery = `
      SELECT NVL(SUM(Inward), 0)    AS Inward,
             NVL(SUM(Inw_close), 0) AS Inw_close
      FROM (
          SELECT CASE WHEN var_inward_status != 'C' THEN 1 ELSE 0 END AS Inward,
                 CASE WHEN var_inward_status  = 'C' THEN 1 ELSE 0 END AS Inw_close
          FROM aoio_inward_mas
          INNER JOIN aoio_inwardto_det
              ON num_inwardto_inwardid = num_inward_inwardid
          WHERE 1 = 1
            AND trunc(date_inward_insdate) = trunc(SYSDATE)
      )
    `;

    const weekQuery = `
      SELECT NVL(SUM(Inward), 0)    AS Inward,
             NVL(SUM(Inw_close), 0) AS Inw_close
      FROM (
          SELECT CASE WHEN var_inward_status != 'C' THEN 1 ELSE 0 END AS Inward,
                 CASE WHEN var_inward_status  = 'C' THEN 1 ELSE 0 END AS Inw_close
          FROM aoio_inward_mas
          INNER JOIN aoio_inwardto_det
              ON num_inwardto_inwardid = num_inward_inwardid
          WHERE 1 = 1
            AND trunc(date_inward_insdate) >= trunc(SYSDATE - 7)
      )
    `;

    const monthQuery = `
      SELECT NVL(SUM(Inward), 0)    AS Inward,
             NVL(SUM(Inw_close), 0) AS Inw_close
      FROM (
          SELECT CASE WHEN var_inward_status != 'C' THEN 1 ELSE 0 END AS Inward,
                 CASE WHEN var_inward_status  = 'C' THEN 1 ELSE 0 END AS Inw_close
          FROM aoio_inward_mas
          INNER JOIN aoio_inwardto_det
              ON num_inwardto_inwardid = num_inward_inwardid
          WHERE 1 = 1
            AND trunc(date_inward_insdate) >= :fromMonth
            AND trunc(date_inward_insdate) <= :toMonth
      )
    `;
    const monthBinds = { fromMonth, toMonth };

    const yearQuery = `
      SELECT NVL(SUM(Inward), 0)    AS Inward,
             NVL(SUM(Inw_close), 0) AS Inw_close
      FROM (
          SELECT CASE WHEN var_inward_status != 'C' THEN 1 ELSE 0 END AS Inward,
                 CASE WHEN var_inward_status  = 'C' THEN 1 ELSE 0 END AS Inw_close
          FROM aoio_inward_mas
          INNER JOIN aoio_inwardto_det
              ON num_inwardto_inwardid = num_inward_inwardid
          WHERE 1 = 1
            AND trunc(date_inward_insdate) >= :fromYear
            AND trunc(date_inward_insdate) <= :toYear
      )
    `;
    const yearBinds = { fromYear, toYear };

    const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };

    const [todayResult, weekResult, monthResult, yearResult] =
      await Promise.all([
        connection.execute(todayQuery, {}, options),
        connection.execute(weekQuery, {}, options),
        connection.execute(monthQuery, monthBinds, options),
        connection.execute(yearQuery, yearBinds, options),
      ]);

    const todayRow = todayResult.rows?.[0] || {};
    const weekRow = weekResult.rows?.[0] || {};
    const monthRow = monthResult.rows?.[0] || {};
    const yearRow = yearResult.rows?.[0] || {};

    res.json({
      success: true,
      data: {
        today: {
          inward: todayRow.INWARD || 0,
          close: todayRow.INW_CLOSE || 0,
        },
        week: {
          inward: weekRow.INWARD || 0,
          close: weekRow.INW_CLOSE || 0,
        },
        month: {
          inward: monthRow.INWARD || 0,
          close: monthRow.INW_CLOSE || 0,
        },
        year: {
          inward: yearRow.INWARD || 0,
          close: yearRow.INW_CLOSE || 0,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing DB connection:", err);
      }
    }
  }
};

module.exports = { getDashboardAllDepartmentList, getDashboardSummaryCounts };
