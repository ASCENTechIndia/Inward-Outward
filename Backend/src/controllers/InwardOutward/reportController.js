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

const getFileMovementTrackingList = async (req, res) => {
  let connection;
  try {
    const { ulbid, inwardNo } = req.body;

    if (!ulbid) {
      return res.json({ success: false, errorMessage: "UlbId is required" });
    }

    connection = await getConnection();

    let query = ``;
    let bind = {};
    if (inwardNo) {
      query = `SELECT * FROM VIEW_INWARD_REG r
            WHERE  1 = 1
            AND  inword_no = :inwardNo
            AND  ulbid = :ulbid`;
      bind = {
        ulbid: Number(ulbid),
        inwardNo: String(inwardNo).trim(),
      };
    } else {
      query = `
        SELECT * FROM view_tacker
        WHERE 1=1
        AND inwardno LIKE '%' || :inwardNo
        AND ulbid = :ulbid
        `;
      bind = {
        ulbid: Number(ulbid),
        inwardNo: "",
      };
    }

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

const getFileMovementTrackingPopupList = async (req, res) => {
  let connection;
  try {
    const { ulbid, fromdate, toDate } = req.body;

    if (!ulbid) {
      return res.json({ success: false, errorMessage: "UlbId is required" });
    }
    if (!fromdate) {
      return res.json({
        success: false,
        errorMessage: "From Date is required",
      });
    }
    if (!toDate) {
      return res.json({ success: false, errorMessage: "To Date is required" });
    }

    connection = await getConnection();

    const query = `SELECT DISTINCT r.inwardid,
            inword_no,
            sender_name,
            sender_subtype_name,
            mobile_no,
            subject,
            ref_no
        FROM   VIEW_INWARD_REG r
        WHERE  TRUNC(inwarddate) >= TO_DATE(:fromdate, 'DD-MM-YYYY')
        AND  TRUNC(inwarddate) <= TO_DATE(:toDate,   'DD-MM-YYYY')
        AND  ulbid = :ulbid
        ORDER  BY r.inwardid ASC`;

    const bind = {
      ulbid: Number(ulbid),
      fromdate: fromdate,
      toDate: toDate,
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

const getInwardNoClickList = async (req, res) => {
  let connection;
  try {
    const { ulbid, inwardNo } = req.body;
    if (!ulbid) {
      return res.json({ success: false, errorMessage: "UlbId is requried" });
    }
    if (!inwardNo) {
      return res.json({
        success: false,
        errormessage: "Inward Number is required",
      });
    }
    connection = await getConnection();
    const query1 = `SELECT * FROM view_tacker
        WHERE  1 = 1
        AND  inwardno LIKE '%' || :inwardNo
        AND  ulbid = :ulbid`;
    const bind = {
      ulbid: Number(ulbid),
      inwardNo: inwardNo,
    };
    const result1 = await connection.execute(query1, bind, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const query2 = `SELECT num_inwardcc_inwardno   AS inwardno,
                blockmas.wardname       AS wardname,
                dept.engmarname         AS engmarname,
                desig.desig_ename       AS desig_ename,
                var_user_username       AS username
            FROM   aoio_inwardcc_det
            INNER  JOIN prop.vw_blockmas blockmas
                    ON blockmas.wardid = num_inwardcc_prabhagid
                    AND blockmas.ulbid = num_inwardcc_ulbid
            INNER  JOIN prop.vw_deptconfig dept
                    ON dept.deptid = num_inwardcc_deptid
                    AND dept.ulbid = num_inwardcc_ulbid
            INNER  JOIN prop.vw_desigconfig desig
                    ON desig.desig_id = num_inwardcc_desgid
                    AND desig.ulbid = num_inwardcc_ulbid
            INNER  JOIN admins.aoma_user_def
                    ON num_user_userid = num_inwardcc_empid
                    AND num_user_ulbid = num_inwardcc_ulbid
            WHERE  num_inwardcc_inwardno = :inwardNo
            AND  num_inwardcc_ulbid = :ulbid`;

    const result2 = await connection.execute(query2, bind, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    res.json({
      success: true,
      data: result1.rows || [],
      ccData: result2.rows || [],
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

const getTransferDetailsReport = async (req, res) => {
  let connection;
  try {
    const { ulbid, inwardNo } = req.body;

    if (!ulbid) {
      return res.json({ success: false, errorMessage: "UlbId is required" });
    }

    if (!inwardNo || !inwardNo.trim()) {
      return res.json({
        success: false,
        errorMessage: "Inward No is required",
      });
    }

    connection = await getConnection();

    const query = `
      SELECT * FROM VIEW_TRANSFER_DET
      WHERE inward_no = :inwardNo
        AND ulbid = :ulbid
    `;

    const bind = {
      ulbid: Number(ulbid),
      inwardNo: String(inwardNo).trim(),
    };

    const result = await connection.execute(query, bind, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.json({
      success: true,
      data: result.rows || [],
    });
  } catch (error) {
    console.error("getTransferDetailsReport error:", error);
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

const getOutwardRegReport = async (req, res) => {
  let connection;
  try {
    const { ulbid, fromDate, toDate, userId } = req.body;

    if (!ulbid) {
      return res.json({ success: false, errorMessage: "UlbId is required" });
    }
    if (!fromDate) {
      return res.json({
        success: false,
        errorMessage: "From Date is required",
      });
    }
    if (!toDate) {
      return res.json({ success: false, errorMessage: "To Date is required" });
    }
    if(!userId){
        return res.json({success: false, errorMessage: "User Id is required"})
    }

    connection = await getConnection();

    const query = `select * from view_outward_reg
        where trunc(outdate) >= TO_DATE(:fromDate,'dd-MM-yyyy') 
        and trunc(outdate) <= TO_DATE(:toDate,'dd-MM-yyyy') and insby=:userId and ulbid=:ulbid`;

    const bind = {
      ulbid: Number(ulbid),
      fromDate,
      toDate,
      userId
    };

    const result = await connection.execute(query, bind, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.json({
      success: true,
      data: result.rows || [],
    });
  } catch (error) {
    console.error("getTransferDetailsReport error:", error);
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

module.exports = {
  getEmpDropdown,
  getInwardRegisterReport,
  getFileMovementTrackingList,
  getFileMovementTrackingPopupList,
  getInwardNoClickList,
  getTransferDetailsReport,
  getOutwardRegReport,
};
