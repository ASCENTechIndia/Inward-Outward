const { getConnection } = require("../../config/database");
const oracledb = require("oracledb");

const getMainReceiverCategoryDropdown = async (req, res) => {
  let connection;
  try {
    const { ulbId } = req.body;
    if (!ulbId) {
      return res.json({ success: false, errorMessage: "UlbId is required" });
    }
    connection = await getConnection();
    const query = `select var_sender_name,num_sender_id from aoio_sender_mas inner join aoio_sendertype_config on num_sendertype_senderid=num_sender_id 
    where num_sendertype_ulbid=:ulbId and var_sendertype_activeflag='Y'`;
    const result = await connection.execute(
      query,
      { ulbId: Number(ulbId) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );
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

const receiverSubCategoryDropdown = async (req, res) => {
  let connection;
  try {
    const { ulbId, senderId } = req.body;
    if (!ulbId) {
      return res.json({ success: false, errorMessage: "UlbId is required" });
    }
    if (!senderId) {
      return res.json({
        success: false,
        errorMessage: "Sender Id is required",
      });
    }
    connection = await getConnection();
    const query = `SELECT var_sendersubtype_name, sm.num_sendersubtype_id FROM aoio_sendersubtype_mas sm INNER JOIN 
    aoio_sendersubtype_config sc ON num_sendersubtype_sendersubid = sm.num_sendersubtype_id  
    where num_sendersubtype_senderid=:senderId
    and sc.num_sendersubtype_ulbid=:ulbId
    and var_sendersubtype_activeflag='Y'`;
    const bind = { ulbId: Number(ulbId), senderId: Number(senderId) };
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

const getDocumentTypeDropdown = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `select var_doctype_name,num_doctype_id from aoio_doctype_mas order by num_doctype_id asc`;
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

const getDocumentSubTypeDropdown = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `select var_docsubtype_name,num_docsubtype_id from aoio_docsubtype_mas`;
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

const getOutwardTypeDropdown = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `select var_outwardmode_name,num_outwardmode_id from aoio_outwardmode_mas order by num_outwardmode_id asc`;
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

const getDepartmentDropdown = async (req, res) => {
  let connection;
  try {
    const { ulbid } = req.body;
    if (!ulbid) {
      return res.json({ success: false, errorMessage: "UlbId is requried" });
    }
    connection = await getConnection();
    const query = `Select dept_marname,deptid from prop.vw_deptconfig where ulbid=:ulbid  order by dept_marname`;
    const bind = { ulbid: Number(ulbid) };
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

const getPrabhagDropdown = async (req, res) => {
  let connection;
  try {
    const { ulbid } = req.body;
    if (!ulbid) {
      return res.json({ success: false, errorMessage: "UlbId is requried" });
    }
    connection = await getConnection();
    const query = `select wardname, wardid from prop.vw_blockmas where ulbid=:ulbid`;
    const bind = { ulbid: Number(ulbid) };
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

const getCcDepartmentDropdown = async (req, res) => {
  let connection;
  try {
    const { ulbid } = req.body;
    if (!ulbid) {
      return res.json({ success: false, errorMessage: "UlbId is requried" });
    }
    connection = await getConnection();
    const query = `Select engmarname,deptid from prop.vw_deptconfig where ulbid=:ulbid order by engmarname`;
    const bind = { ulbid: Number(ulbid) };
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

const getCcPurposeDropdown = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `select var_purpose_name, num_purpose_id from aoio_purpose_mas`;
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

const getCcDesignationDropdown = async (req, res) => {
  let connection;
  try {
    const { ulbid } = req.body;
    if (!ulbid) {
      return res.json({ success: false, errorMessage: "UlbId is requried" });
    }
    connection = await getConnection();
    const query = `select desig_ename,desig_id from  prop.vw_desigconfig where  ulbid=:ulbid order by desig_ename`;
    const bind = { ulbid: Number(ulbid) };
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

const getEmployeeNameDropdown = async (req, res) => {
  let connection;
  try {
    const { ulbid, desigId, departmentId } = req.body;
    if (!ulbid) {
      return res.json({ success: false, errorMessage: "UlbId is requried" });
    }
    if (!desigId) {
      return res.json({
        success: false,
        errorMessage: "Designation Id is requried",
      });
    }
    if (!departmentId) {
      return res.json({
        success: false,
        errorMessage: "Department Id is requried",
      });
    }
    connection = await getConnection();
    const query = `select var_user_username,num_user_userid from admins.aoma_user_def where 
        num_user_desgid=:desigId
        and num_user_ulbid=:ulbid
        and num_user_deptid=:departmentId
        order by var_user_username`;
    const bind = {
      ulbid: Number(ulbid),
      desigId: Number(desigId),
      departmentId: Number(departmentId),
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

const getInwardDetailByRefNo = async (req, res) => {
  let connection;
  try {
    const { inwardNo, ulbid } = req.body;
    if (!ulbid) {
      return res.json({ success: false, errorMessage: "UlbId is requried" });
    }
    if (!inwardNo) {
      return res.json({
        success: false,
        errorMessage: "Inward No is requried",
      });
    }
    connection = await getConnection();
    const query = `SELECT var_inward_from,
    var_inward_subject,
    date_inward_refdate,
    var_inward_address
    FROM   aoio_inward_mas
    WHERE  num_inward_inwardno = :inwardNo
    AND  num_iinward_ulbid   = :ulbid`;
    const bind = {
      ulbid: Number(ulbid),
      inwardNo: String(inwardNo),
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

const aoio_outward_ins = async (req, res) => {
  let connection;
  try {
    const payload = req.body;
    connection = await getConnection();

    const query = `BEGIN 
      aoio_outward_ins(
        :in_UserId,
        :in_date,
        :in_receivercatid,
        :in_receiversubcatid,
        :in_doctype,
        :in_docsubtype,
        :in_inwrefno,
        :in_refdate,
        :in_receivername,
        :in_address,
        :in_subject,
        :in_outmodeid,
        :in_remark,
        :in_ipaddress,
        :in_OutwardNo,
        :in_Mode,
        :in_Deptid,
        :in_orgId,
        :IN_stroutwordcc,
        :in_mobile,
        :in_email,
        :in_sendingtype,
        :in_typeflag,
        :out_outwardid,
        :out_outwardno, 
        :Out_ErrorCode,
        :Out_ErrorMsg
      );
      END;`;

    const bind = {
      in_UserId: payload.in_UserId,
      in_date: payload.in_date,
      in_receivercatid: payload.in_receivercatid,
      in_receiversubcatid: payload.in_receiversubcatid,
      in_doctype: payload.in_doctype,
      in_docsubtype: payload.in_docsubtype,
      in_inwrefno: payload.in_inwrefno,
      in_refdate: payload.in_refdate,
      in_receivername: payload.in_receivername,
      in_address: payload.in_address,
      in_subject: payload.in_subject,
      in_outmodeid: payload.in_outmodeid,
      in_remark: payload.in_remark,
      in_ipaddress: payload.in_ipaddress,
      in_OutwardNo: payload.in_OutwardNo,
      in_Mode: payload.in_Mode,
      in_Deptid: payload.in_Deptid,
      in_orgId: payload.in_orgId,
      IN_stroutwordcc: payload.IN_stroutwordcc,
      in_mobile: payload.in_mobile,
      in_email: payload.in_email,
      in_sendingtype: payload.in_sendingtype,
      in_typeflag: payload.in_typeflag,
      out_outwardid: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      out_outwardno: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 200,
      },
      Out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      Out_ErrorMsg: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 4000,
      },
    };

    const result = await connection.execute(query, bind, { autoCommit: true });

    res.json({
      success: true,
      errorCode: result.outBinds.Out_ErrorCode,
      errorMessage: result.outBinds.Out_ErrorMsg,
      outwardId: result.outBinds.out_outwardid, 
      outwardNo: result.outBinds.out_outwardno,
    });
  } catch (error) {
    console.error("failed to save outward data:", error);
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
  getMainReceiverCategoryDropdown,
  receiverSubCategoryDropdown,
  getDocumentTypeDropdown,
  getDocumentSubTypeDropdown,
  getOutwardTypeDropdown,
  getDepartmentDropdown,
  getPrabhagDropdown,
  getCcDepartmentDropdown,
  getCcPurposeDropdown,
  getCcDesignationDropdown,
  getEmployeeNameDropdown,
  getInwardDetailByRefNo,
  aoio_outward_ins,
};
