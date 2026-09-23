const oracledb = require("oracledb");
const { getConnection } = require("../../config/database");

const senderMasterList = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `select num_sender_id,var_sender_name from aoio_sender_mas`;
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
    res.status(500);
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

const getSenderDetail = async (req, res) => {
  let connection;
  try {
    const { senderId } = req.body;
    if (!senderId) {
      return res.json({ success: false, message: "Sender Id is required" });
    }
    const bind = {
      senderId: Number(senderId),
    };
    connection = await getConnection();
    const query = `select num_sender_id,var_sender_name from aoio_sender_mas where num_sender_id = :senderId`;
    const result = await connection.execute(query, bind, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    res.json({
      success: true,
      data: result.rows || [],
    });
  } catch (error) {
    res.status(500);
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

const aoio_sender_ins = async (req, res) => {
  let connection;
  try {
    const payload = req.body;
    connection = await getConnection();

    const query = `BEGIN 
      aoio_sender_ins(
        :in_UserId,
        :in_Mode,
        :in_SenderId,
        :in_SenderName,
        :in_UlbId,
        :in_ipaddress,
        :in_source,
        :Out_ErrorCode,
        :Out_ErrorMsg
      );
      END;`;

    const bind = {
      in_UserId: payload.in_UserId,
      in_Mode: Number(payload.in_Mode),
      in_SenderId:
        payload.in_SenderId === null ? null : Number(payload.in_SenderId),
      in_SenderName: payload.in_SenderName,
      in_UlbId: Number(payload.in_UlbId),
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
    console.error("aoio_sender_ins error:", error);
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
    connection = await getConnection();
    const query = `select var_sender_name, num_sender_id from aoio_sender_mas`;
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

const getSenderSubTypeList = async (req, res) => {
  let connection;
  try {
    const { senderTypeId } = req.body;
    connection = await getConnection();
    const query = `select b.num_sendersubtype_id,a.num_sender_id ,a.var_sender_name ,  b.var_sendersubtype_name sendersubtypename, 
    case var_sendersubtype_flag when 'Y' then 'Active' when 'N' then 'InActive' end activeFlag 
    from aoio_sendersubtype_mas b 
    inner join aoio_sender_mas a on a.num_sender_id=b.num_sendersubtype_senderid 
    where num_sendersubtype_senderid=:senderTypeId
    order by a.num_sender_id `;
    const result = await connection.execute(
      query,
      { senderTypeId: Number(senderTypeId) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );
    res.json({
      success: true,
      data: result.rows || [],
    });
  } catch (error) {
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

const aoio_sendersubtype_ins = async (req, res) => {
  let connection;
  try {
    const payload = req.body;
    connection = await getConnection();
    const query = `BEGIN
      aoio_sendersubtype_ins(
        :in_UserId,
        :in_Mode,
        :in_SendersubtypeId,
        :in_Sstsenderid,
        :in_SendersubtypeName,
        :in_SendersubtypeFlag,
        :in_UlbId,
        :in_ipaddress,
        :in_source,
        :Out_ErrorCode,
        :Out_ErrorMsg
      );
      END;`;
    const bind = {
      in_UserId: payload.in_UserId,
      in_Mode: Number(payload.in_Mode),
      in_SendersubtypeId: payload.in_SendersubtypeId,
      in_Sstsenderid: payload.in_Sstsenderid,
      in_SendersubtypeName: payload.in_SendersubtypeName,
      in_SendersubtypeFlag: payload.in_SendersubtypeFlag,
      in_UlbId: Number(payload.in_UlbId),
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

const getReceiverCategoryList = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `select num_receivercategory_id,var_receivercategory_name from  aoio_receivercategory_mas`;
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

const gerPurposeMasterList = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `select num_purpose_id, var_purpose_name from aoio_purpose_mas`;
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

const gerPurposeMasterDetails = async (req, res) => {
  let connection;
  try {
    const { purposeId } = req.body;
    if (!purposeId) {
      return res.json({ success: false, message: "Purpose Id is required" });
    }
    connection = await getConnection();
    const query = `select num_purpose_id,var_purpose_name from  aoio_purpose_mas where num_purpose_id = :purposeId`;
    const result = await connection.execute(
      query,
      {
        purposeId: Number(purposeId),
      },
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

const aoio_purpose_ins = async (req, res) => {
  let connection;
  try {
    const payload = req.body;
    connection = await getConnection();
    const query = `BEGIN
      aoio_purpose_ins(
        :in_user_id,
        :in_mode,
        :in_purpose_id,
        :in_purpose_name,
        :in_ulbid,
        :in_ipaddress,
        :in_source,
        :Out_ErrorCode,
        :Out_ErrorMsg
      );
      END;`;
    const bind = {
      in_user_id: payload.in_user_id,
      in_mode: Number(payload.in_mode),
      in_purpose_id:
        payload.in_purpose_id === null ? null : Number(payload.in_purpose_id),
      in_purpose_name: payload.in_purpose_name,
      in_ulbid: Number(payload.in_ulbid),
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

const getDocTypeList = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `select num_doctype_id, var_doctype_name from  aoio_doctype_mas`;
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

const getDocTypeDetails = async (req, res) => {
  let connection;
  try {
    const { docTypeId } = req.body;
    if (!docTypeId) {
      return res.json({ success: false, message: "Doc type Id is required" });
    }
    connection = await getConnection();
    const query = `select num_doctype_id,var_doctype_name from  aoio_doctype_mas where num_doctype_id = :docTypeId`;
    const result = await connection.execute(
      query,
      {
        docTypeId: Number(docTypeId),
      },
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

const aoio_doctype_ins = async (req, res) => {
  let connection;
  try {
    const payload = req.body;
    connection = await getConnection();
    const query = `BEGIN
      aoio_doctype_ins(
        :in_UserId,
        :in_Mode,
        :in_DoctypeId,
        :in_DoctypeName,
        :in_UlbId,
        :in_ipaddress,
        :in_source,
        :Out_ErrorCode,
        :Out_ErrorMsg
      );
      END;`;
    const bind = {
      in_UserId: payload.in_UserId,
      in_Mode: Number(payload.in_Mode),
      in_DoctypeId:
        payload.in_DoctypeId === null ? null : Number(payload.in_DoctypeId),
      in_DoctypeName: payload.in_DoctypeName,
      in_UlbId: Number(payload.in_UlbId),
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

const getInwardModeList = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `select num_inwardmode_id,var_inwardmode_name from  aoio_inwardmode_mas`;
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

const getInwardDetails = async (req, res) => {
  let connection;
  try {
    const { inwardModeId } = req.body;
    if (!inwardModeId) {
      return res.json({
        success: false,
        message: "Inward mode Id is required",
      });
    }
    connection = await getConnection();
    const query = `select num_inwardmode_id,var_inwardmode_name from  aoio_inwardmode_mas where num_inwardmode_id = :inwardModeId`;
    const result = await connection.execute(
      query,
      {
        inwardModeId: Number(inwardModeId),
      },
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

const aoio_inwardmodemas_ins = async (req, res) => {
  let connection;
  try {
    const payload = req.body;
    connection = await getConnection();
    const query = `BEGIN 
      aoio_inwardmodemas_ins(
        :in_UserId,
        :in_Mode,
        :in_inwardmodeId,
        :in_inwardmodeName,
        :in_UlbId,
        :in_ipaddress,
        :in_source,
        :Out_ErrorCode,
        :Out_ErrorMsg
      );
      END;`;
    const bind = {
      in_UserId: payload.in_UserId,
      in_Mode: Number(payload.in_Mode),
      in_inwardmodeId:
        payload.in_inwardmodeId === null
          ? null
          : Number(payload.in_inwardmodeId),
      in_inwardmodeName: payload.in_inwardmodeName,
      in_UlbId: Number(payload.in_UlbId),
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

const getOurwardList = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `select num_outwardmode_id,var_outwardmode_name from  aoio_outwardmode_mas`;
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

const getOutwardDetails = async (req, res) => {
  let connection;
  try {
    const { outwardModeId } = req.body;
    if (!outwardModeId) {
      return res.json({
        success: false,
        message: "Outward mode Id is required",
      });
    }
    connection = await getConnection();
    const query = `select num_outwardmode_id,var_outwardmode_name from  aoio_outwardmode_mas where num_outwardmode_id = :outwardModeId`;
    const result = await connection.execute(
      query,
      {
        outwardModeId: Number(outwardModeId),
      },
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

const aoio_outwardmode_ins = async (req, res) => {
  let connection;
  try {
    const payload = req.body;
    connection = await getConnection();
    const query = `BEGIN 
      aoio_outwardmode_ins(
        :in_UserId,
        :in_Mode,
        :in_outwardmodeId,
        :in_outwardmodeName,
        :in_UlbId,
        :in_ipaddress,
        :in_source,
        :Out_ErrorCode,
        :Out_ErrorMsg
      );
      END;`;
    const bind = {
      in_UserId: payload.in_UserId,
      in_Mode: Number(payload.in_Mode),
      in_outwardmodeId:
        payload.in_outwardmodeId === null
          ? 0
          : Number(payload.in_outwardmodeId),
      in_outwardmodeName: payload.in_outwardmodeName,
      in_UlbId: Number(payload.in_UlbId),
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

const getReciverCategoryDropdown = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `select num_receivercategory_id, var_receivercategory_name from aoio_receivercategory_mas`;
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

const getReceiverSubCategoryList = async (req, res) => {
  let connection;
  try {
    const { receiverCategoryId } = req.body;
    if (!receiverCategoryId) {
      return res.json({
        success: false,
        message: "Receiver category Id is required",
      });
    }
    connection = await getConnection();
    const query = `select b.num_receiversubcat_id,a.num_receivercategory_id ,a.var_receivercategory_name ,  b. var_receiversubcat_name 
    from aoio_receiversubcategory_mas b 
    inner join aoio_receivercategory_mas a on a.num_receivercategory_id=b.num_receiversubcat_reccatid 
    where num_receiversubcat_reccatid = :receiverCategoryId 
    order by a.num_receivercategory_id `;
    const bind = {
      receiverCategoryId: Number(receiverCategoryId),
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

const aoio_receiversubcategory_ins = async (req, res) => {
  let connection;
  try {
    const payload = req.body;
    connection = await getConnection();
    const query = `BEGIN 
      aoio_receiversubcategory_ins(
        :in_user_id,
        :in_mode,
        :in_reccatid,
        :in_subreccatid,
        :in_subreccatname,
        :in_ipaddress,
        :in_source,
        :Out_ErrorCode,
        :Out_ErrorMsg
      );
      END;`;
    const bind = {
      in_user_id: payload.in_user_id,
      in_mode: payload.in_mode,
      in_reccatid: payload.in_reccatid,
      in_subreccatid: payload.in_subreccatid,
      in_subreccatname: payload.in_subreccatname,
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
    const query = `select var_doctype_name, num_doctype_id from aoio_doctype_mas`;
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

const getDocumentSubTypeList = async (req, res) => {
  let connection;
  try {
    const { docTypeId } = req.body;
    if (!docTypeId) {
      return res.json({
        success: false,
        message: "Document type Id is required",
      });
    }
    connection = await getConnection();
    const query = `select b.num_docsubtype_id,a.num_doctype_id ,a.var_doctype_name ,  b.var_docsubtype_name Docsubtypename 
      from aoio_docsubtype_mas b
      inner join aoio_doctype_mas a on a.num_doctype_id=b.num_docsubtype_docid 
      where num_docsubtype_docid = :docTypeId
      order by a.num_doctype_id `;
    const bind = {
      docTypeId: Number(docTypeId),
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

module.exports = {
  senderMasterList,
  getSenderTypeDropdown,
  getSenderSubTypeList,
  aoio_sender_ins,
  getSenderDetail,
  aoio_sendersubtype_ins,
  getReceiverCategoryList,
  gerPurposeMasterList,
  gerPurposeMasterDetails,
  aoio_purpose_ins,
  getDocTypeList,
  getDocTypeDetails,
  aoio_doctype_ins,
  getInwardModeList,
  getInwardDetails,
  aoio_inwardmodemas_ins,
  getOurwardList,
  getOutwardDetails,
  aoio_outwardmode_ins,
  getReciverCategoryDropdown,
  getReceiverSubCategoryList,
  aoio_receiversubcategory_ins,
  getDocumentTypeDropdown,
  getDocumentSubTypeList,
};
