const { getConnection } = require("../../config/database");
const oracledb = require("oracledb");

const getUlbDropdown = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `select CORPORATIONNAME, CORPORATIONID from prop.vw_corporation`;
    const result = await connection.execute(
      query,
      {},
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

const getSenderTypeDropdown = async (req, res) => {
  let connection;
  try {
    const { ulbId } = req.body;
    if (!ulbId) {
      return res.json({ success: false, errorMessage: "UlbId is required" });
    }
    connection = await getConnection();
    const query = `select t.var_sender_name names, t.num_sender_id Senderid
        from aoio_sender_mas t
        inner join aoio_sendertype_config c on c.num_sendertype_senderid = t.num_sender_id
        where c.num_sendertype_ulbid=:ulbId`;
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

const getSenderSubTypeConfigTableData = async (req, res) => {
  let connection;
  try {
    const { ulbId, senderId } = req.body;
    if (!ulbId) {
      return res.json({ success: false, errorMessage: "UlbId is required" });
    }
    if (!senderId) {
      return res.json({ success: false, errorMessage: "SenderId is required" });
    }
    connection = await getConnection();
    const query = `select ct.num_sendersubtype_id SendSubid,ct.var_sendersubtype_name,
        'N' previousStatus,'N' currentStatus from aoio_sendersubtype_mas ct
        where 1=1 and num_sendersubtype_senderid=:senderId`;
    const result = await connection.execute(
      query,
      { senderId: Number(senderId) },
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

const getSenderSubTypeConfigSelectedIds = async (req, res) => {
  let connection;
  try {
    const { ulbId } = req.body;
    if (!ulbId) {
      return res.json({ success: false, errorMessage: "UlbId is required" });
    }
    connection = await getConnection();
    const query = `select num_sendersubtype_id, num_sendersubtype_sendersubid SendSubTypConfid,
        num_sendersubtype_ulbid from aoio_sendersubtype_config where 1 = 1 
        and var_sendersubtype_activeflag ='Y' and num_sendersubtype_ulbid=:ulbId`;
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

const aoio_sendersubtypeconfig_ins = async (req, res) => {
  let connection;
  try {
    const payload = req.body;
    connection = await getConnection();

    const query = `BEGIN 
      aoio_sendersubtypeconfig_ins(
        :In_UserId,
        :In_OrgId,
        :in_sendersubtypestr,
        :in_mode,
        :in_ipaddress,
        :in_source,
        :Out_ErrorCode,
        :Out_ErrorMsg
      );
      END;`;

    const bind = {
      In_UserId: payload.In_UserId,
      In_OrgId: Number(payload.ulbId),
      in_sendersubtypestr: payload.in_sendersubtypestr,
      in_mode: Number(payload.in_mode),
      in_ipaddress: payload.in_ipaddress,
      in_source: payload.in_source,
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
    });
  } catch (error) {
    console.error("failed to save sender sub type configuration:", error);
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

const getSenderTypeConfigTableData = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `select ct.num_sender_id Complainid,ct.var_sender_name,
        'N' previousStatus,'N' currentStatus from aoio_sender_mas ct  
        where 1=1`;
    const result = await connection.execute(
      query,
      {},
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

const getSenderTypeConfigSelectedIds = async (req, res) => {
  let connection;
  try {
    const { ulbId } = req.body;
    if (!ulbId) {
      return res.json({
        success: false,
        errorMessage: "UlbId is required",
      });
    }
    connection = await getConnection();
    const query = `select Num_sendertype_Id  ,Num_sendertype_SenderId CompTypeConfigid, 
        Num_sendertype_UlbID FROM aoio_sendertype_config where 1 = 1  
        and var_sendertype_ActiveFlag ='Y' and Num_sendertype_UlbID = :ulbId`;
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

const aoio_sendertypeconfig_ins = async (req, res) => {
  let connection;
  try {
    const payload = req.body;
    connection = await getConnection();

    const query = `BEGIN 
      aoio_sendertypeconfig_ins(
        :In_UserId,
        :In_OrgId,
        :in_sendertypestr,
        :in_mode,
        :in_ipaddress,
        :in_source,
        :Out_ErrorCode,
        :Out_ErrorMsg
      );
      END;`;

    const bind = {
      In_UserId: payload.In_UserId,
      In_OrgId: Number(payload.ulbId),
      in_sendertypestr: payload.in_sendertypestr,
      in_mode: Number(payload.in_mode),
      in_ipaddress: payload.in_ipaddress,
      in_source: payload.in_source,
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
    });
  } catch (error) {
    console.error("failed to save sender type configuration:", error);
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

const getUserDropdown = async (req, res) => {
  let connection;
  try {
    const { ulbId } = req.body;
    if (!ulbId) {
      return res.json({ success: false, errorMessage: "UlbId is required" });
    }
    connection = await getConnection();
    const query = `select var_user_username, num_user_userid from admins.aoma_user_def where num_user_ulbid=:ulbId`;
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

const getUserDeptConfigTableData = async (req, res) => {
  let connection;
  try {
    const { ulbId } = req.body;
    if (!ulbId) {
      return res.json({
        success: false,
        errorMessage: "Ulb Id is required",
      });
    }
    connection = await getConnection();
    const query = `SELECT deptid , deptname, 'N' previousstatus, 
        'N' currentstatus FROM prop.vw_deptconfig
        where 1=1 and ulbid =:ulbId`;
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

const getUserDeptConfigSelectedIds = async (req, res) => {
  let connection;
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.json({
        success: false,
        errorMessage: "UserId is required",
      });
    }
    connection = await getConnection();
    const query = `SELECT num_outwarduser_id, num_outwarduser_configid userconfigid,
        num_outwarduser_ulbid FROM aoio_outwarduser_config 
        WHERE 1 = 1 AND var_outwarduser_activeflag = 'Y' and  var_outwarduser_userid = :userId`;
    const result = await connection.execute(
      query,
      { userId: userId },
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

const aoio_OutwardUserConfig_ins = async (req, res) => {
  let connection;
  try {
    const payload = req.body;
    connection = await getConnection();

    const query = `BEGIN 
      aoio_OutwardUserConfig_ins(
        :In_UserId,
        :In_OrgId,
        :In_UserConfigId,
        :in_UserConfstr,
        :in_mode,
        :in_ipaddress,
        :in_source,
        :Out_ErrorCode,
        :Out_ErrorMsg
      );
      END;`;

    const bind = {
      In_UserId: payload.In_UserId,
      In_OrgId: Number(payload.ulbId),
      In_UserConfigId: payload.In_UserConfigId,
      in_UserConfstr: payload.in_UserConfstr,
      in_mode: Number(payload.in_mode),
      in_ipaddress: payload.in_ipaddress,
      in_source: payload.in_source,
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
    });
  } catch (error) {
    console.error("failed to save user department configuration:", error);
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
  getUlbDropdown,
  getSenderTypeDropdown,
  getSenderSubTypeConfigTableData,
  aoio_sendersubtypeconfig_ins,
  getSenderTypeConfigTableData,
  getSenderTypeConfigSelectedIds,
  aoio_sendertypeconfig_ins,
  getSenderSubTypeConfigSelectedIds,
  getUserDropdown,
  getUserDeptConfigTableData,
  getUserDeptConfigSelectedIds,
  aoio_OutwardUserConfig_ins,
};
