const { getConnection } = require("../../config/database");
const oracledb = require("oracledb");

const getEmpDropdown = async (req, res) => {
  let connection;
  try {
    const { ulbid, deptId, desigId } = req.body;
    if (!ulbid) {
      return res.json({ success: false, errorMessage: "UlbId is requried" });
    }
    if (!deptId) {
      return res.json({ success: false, errormessage: "Dept Id is required" });
    }
    if (!desigId) {
      return res.json({
        success: false,
        errorMessage: "Designation id is required",
      });
    }
    connection = await getConnection();
    const query = `SELECT var_user_username, num_user_userid FROM admins.aoma_user_def 
        WHERE num_user_deptid = :deptId
        AND num_user_ulbid = :ulbid
        AND num_user_desgid = :desigId
        ORDER BY var_user_username`;
    const bind = {
      ulbid: Number(ulbid),
      deptId: Number(deptId),
      desigId: Number(desigId),
    };
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

const getInwardRegisterReport = async (req, res) => {
  let connection;
  try {
    const {
      ulbid,
      reportType,
      includeDateFilter,
      fromDate,
      toDate,
      deptId,
      empId,
      senderId,
      senderSubTypeId,
      docTypeId,
      docSubTypeId,
    } = req.body;

    connection = await getConnection();

    let query = `SELECT * FROM view_inw_regdet WHERE 1=1 AND status <> 'C'`;
    const bind = { ulbid: Number(ulbid) };

    // Date filter
    if (includeDateFilter && fromDate && toDate) {
      query += ` AND TRUNC(inwdate) >= TO_DATE(:fromDate, 'DD-MM-YYYY')`;
      query += ` AND TRUNC(inwdate) <= TO_DATE(:toDate,   'DD-MM-YYYY')`;
      bind.fromDate = fromDate;
      bind.toDate = toDate;
    }

    // Report type 2: department
    if (reportType === 2 && deptId && Number(deptId) !== 0) {
      query += ` AND deptid = :deptId`;
      bind.deptId = Number(deptId);
    }

    // Report type 3: employee
    if (reportType === 3 && empId) {
      query += ` AND empid = :empId`;
      bind.empId = String(empId);
    }

    // Report type 4: sender/subtype/doctype/docsubtype
    if (reportType === 4) {
      if (senderId && Number(senderId) !== 0) {
        query += ` AND senderid = :senderId`;
        bind.senderId = Number(senderId);
      }
      if (senderSubTypeId && Number(senderSubTypeId) !== 0) {
        query += ` AND sendersubtypeid = :senderSubTypeId`;
        bind.senderSubTypeId = Number(senderSubTypeId);
      }
      if (docTypeId && Number(docTypeId) !== 0) {
        query += ` AND doctype = :docTypeId`;
        bind.docTypeId = Number(docTypeId);
      }
      if (docSubTypeId && Number(docSubTypeId) !== 0) {
        query += ` AND docsubtype = :docSubTypeId`;
        bind.docSubTypeId = Number(docSubTypeId);
      }
    }

    query += ` AND ulbid = :ulbid ORDER BY inwardno, inwdate`;

    const result = await connection.execute(query, bind, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.json({ success: true, data: result.rows || [] });
  } catch (error) {
    console.error("getInwardRegisterReport error:", error);
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

module.exports = { getEmpDropdown, getInwardRegisterReport };
