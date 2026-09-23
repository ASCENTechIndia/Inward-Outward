const { getConnection } = require("../../config/database");
const oracledb = require("oracledb");

const getSendersDropdown = async (req, res) => {
  let connection;
  try {
    const { ulbid } = req.body;
    if (!ulbid) {
      return res.json({ success: false, errorMessage: "UlbId is requried" });
    }
    connection = await getConnection();
    const query = `select var_sender_name,num_sender_id from aoio_sender_mas inner join aoio_sendertype_config
            on num_sendertype_senderid=num_sender_id
            where num_sendertype_ulbid=:ulbid
            and var_sendertype_activeflag='Y'`;
    const bind = {
      ulbid: Number(ulbid),
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

const getSubTypesDropdown = async (req, res) => {
  let connection;
  try {
    const { ulbid, senderId } = req.body;
    if (!ulbid) {
      return res.json({ success: false, errorMessage: "UlbId is requried" });
    }
    if (!senderId) {
      return res.json({
        success: false,
        errorMessage: "Sender Id is requried",
      });
    }

    connection = await getConnection();
    const query = `SELECT var_sendersubtype_name, sm.num_sendersubtype_id FROM aoio_sendersubtype_mas sm INNER JOIN
        aoio_sendersubtype_config sc ON num_sendersubtype_sendersubid = sm.num_sendersubtype_id  
        where num_sendersubtype_senderid=:senderId  and sc.num_sendersubtype_ulbid=:ulbid
        and var_sendersubtype_activeflag='Y'`;
    const bind = {
      ulbid: Number(ulbid),
      senderId: Number(senderId),
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

const getLetterTypeDropdown = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `SELECT var_lettertype_type,     
        num_lettertype_id         
        FROM   aoio_lettertype_det`;

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

const getOutwardtypeDropdown = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `SELECT var_inwardmode_name,      
        num_inwardmode_id         
        FROM   aoio_inwardmode_mas`;

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

const getMarathiDepartmentDropdown = async (req, res) => {
  let connection;
  try {
    const { ulbid } = req.body;
    if (!ulbid) {
      return res.json({ success: false, errorMessage: "UlbId is required" });
    }
    connection = await getConnection();
    const query = `select dept_marname,deptid from prop.vw_deptconfig where  ulbid=:ulbid order by dept_marname`;

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

const aoio_inward_ins = async (req, res) => {
  let connection;
  try {
    const payload = req.body;
    connection = await getConnection();

    const query = `BEGIN 
      aoio_inward_ins(
        :IN_USERID,
        :in_inwarddate,
        :IN_senderid,
        :IN_sendersubtypeid,
        :IN_doctype,
        :IN_docsubtype,
        :IN_refno,
        :IN_refdate,
        :IN_from,
        :IN_address,
        :IN_mobile,
        :IN_subject,
        :IN_attachment,
        :IN_lettertype,
        :IN_strinwardto,
        :IN_strinwardimg,
        :IN_strinwordcc,
        :IN_inwmodeid,
        :in_ipaddress,
        :in_email,
        :in_OrgId,
        :in_AppliName,
        :in_sourceid,
        :in_Priority,
        :out_inwardimgid,
        :out_inwardid,
        :out_inwardno,
        :out_ErrorCode,
        :out_ErrorMsg
      );
      END;`;

    const bind = {
      IN_USERID: payload.IN_USERID,
      in_inwarddate: payload.in_inwarddate,
      IN_senderid: payload.IN_senderid,
      IN_sendersubtypeid: payload.IN_sendersubtypeid,
      IN_doctype: payload.IN_doctype,
      IN_docsubtype: payload.IN_docsubtype,
      IN_refno: payload.IN_refno,
      IN_refdate: payload.IN_refdate,
      IN_from: payload.IN_from,
      IN_address: payload.IN_address,
      IN_mobile: payload.IN_mobile,
      IN_subject: payload.IN_subject,
      IN_attachment: payload.IN_attachment,
      IN_lettertype: payload.IN_lettertype,
      IN_strinwardto: payload.IN_strinwardto,
      IN_strinwardimg: payload.IN_strinwardimg,
      IN_strinwordcc: payload.IN_strinwordcc,
      IN_inwmodeid: payload.IN_inwmodeid,
      in_ipaddress: payload.in_ipaddress,
      in_email: payload.in_email,
      in_OrgId: payload.in_OrgId,
      in_AppliName: payload.in_AppliName,
      in_sourceid: payload.in_sourceid,
      in_Priority: payload.in_Priority,
      out_inwardimgid: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      out_inwardid: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      out_inwardno: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 200,
      },
      out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      out_ErrorMsg: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 4000,
      },
    };

    const result = await connection.execute(query, bind, { autoCommit: true });

    res.json({
      success: true,
      errorCode: result.outBinds.out_ErrorCode,
      errorMessage: result.outBinds.out_ErrorMsg,
      inwardId: result.outBinds.out_inwardid,
      inwardImgId: result.outBinds.out_inwardimgid,
      inwardNo: result.outBinds.out_inwardno,
    });
  } catch (error) {
    console.error("failed to save inward data:", error);
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

const insertInwardDocuments = async (req, res) => {
  let connection;
  try {
    const { inwardId, inwardNo, ulbid, userId, date, documents } = req.body;

    connection = await getConnection();

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];

      if (!doc.documentName || doc.documentName.trim() === "") continue;
      if (!doc.fileBytes) continue;

      const fileBuffer = Buffer.from(doc.fileBytes, "base64");

      const query = `
        INSERT INTO aoio_inwardimg_det (
          num_inwardimg_inwardimgid, num_inwardimg_inwardid, num_inwardimg_inwardno,
          num_inwardimg_serialno, date_inwardimg_adddate, blob_inwardimg_document,
          var_inwardimg_docname, var_inwardimg_insby, date_inwardimg_indate,
          var_inwardimg_updby, date_inwardimg_upddate, num_inwardimg_ulbid
        ) VALUES (
          seq_inwardimgid.NEXTVAL, :inwardId, :inwardNo,
          :serialNo, :addDate, :fileBlob,
          :docName, :userId, SYSDATE,
          NULL, NULL, :ulbid
        )
      `;

      const bind = {
        inwardId: Number(inwardId),
        inwardNo: inwardNo,
        serialNo: i,
        addDate: date,
        fileBlob: fileBuffer,
        docName: doc.documentName,
        userId: userId,
        ulbid: Number(ulbid),
      };

      await connection.execute(query, bind, { autoCommit: true });
    }

    res.json({ success: true, message: "Documents uploaded successfully" });
  } catch (err) {
    console.error("insertInwardDocuments error:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

const getInwardDetailsList = async (req, res) => {
  let connection;
  try {
    const { userId, ulbid, fromDate, toDate } = req.body;
    if (!userId) {
      return res.json({ success: false, errorMessage: "UserId is required" });
    }
    if (!ulbid) {
      return res.json({ success: false, errorMessage: "UserId is required" });
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
    connection = await getConnection();
    const query = `select distinct aim.num_iinward_ulbid ulbid, aim.num_inward_inwardid inwardid, aim.num_inward_inwardno
        inword_no,AIM.date_inward_inwdate inwarddate,
        AIM.var_inward_refno ref_no,AIM.date_inward_refdate ref_date,AIM.num_inward_mobile mobile_no,AIM.var_inward_subject subject
        ,var_lettertype_type LetterType 
        from aoio_inward_mas aim 
        inner join aoio_tracker_det on num_tracker_inwardid= aim.num_inward_inwardid and var_tracker_inwardno=aim.num_inward_inwardno
        and var_tracker_status=var_inward_status  
        inner join aoio_lettertype_det ON num_lettertype_id = var_inward_lettertype    
        where   var_inward_status <>'C' and num_iinward_ulbid=:ulbid
        and num_tracker_touser=:userId
        and trunc(date_inward_inwdate) >= :fromDate and trunc(date_inward_inwdate) <= :toDate`;

    const bind = {
      fromDate,
      toDate,
      ulbid: Number(ulbid),
      userId,
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

const getInwarListTwo = async (req, res) => {
  let connection;
  try {
    const { userId, ulbid, fromDate, toDate } = req.body;
    if (!userId) {
      return res.json({ success: false, errorMessage: "UserId is required" });
    }
    if (!ulbid) {
      return res.json({ success: false, errorMessage: "UserId is required" });
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
    connection = await getConnection();
    const query = `SELECT DISTINCT
            aim.num_iinward_ulbid       AS ulbid,
            aim.num_inward_inwardid     AS inwardid,
            aim.num_inward_inwardno     AS inword_no,
            AIM.date_inward_inwdate     AS inwarddate,
            AIM.var_inward_refno        AS ref_no,
            AIM.date_inward_refdate     AS ref_date,
            AIM.num_inward_mobile       AS mobile_no,
            AIM.var_inward_subject      AS subject,
            var_lettertype_type         AS LetterType
      FROM   aoio_inward_mas aim
      INNER  JOIN aoio_lettertype_det 
              ON num_lettertype_id = var_inward_lettertype
      WHERE  num_iinward_ulbid       = :ulbid
        AND  var_inward_insby        = :userId
        AND  TRUNC(date_inward_inwdate) >= :fromDate
        AND  TRUNC(date_inward_inwdate) <= :toDate`;

    const bind = {
      fromDate,
      toDate,
      ulbid: Number(ulbid),
      userId,
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

const AOIO_INWARD_docUpdt = async (req, res) => {
  let connection;
  try {
    const payload = req.body;
    connection = await getConnection();

    const query = `BEGIN 
      AOIO_INWARD_docUpdt(
      :in_UserId,
      :in_inwardimgid,
      :in_inwardid,
      :in_inwardno,
      :in_DocStr,
      :in_orgId,
      :out_inwardimgid,
      :out_ErrorCode,
      :out_ErrorMsg
      );
      END;`;

    const bind = {
      in_UserId: payload.in_UserId,
      in_inwardimgid: payload.in_inwardimgid,
      in_inwardid: payload.in_inwardid,
      in_inwardno: payload.in_inwardno,
      in_DocStr: payload.in_DocStr,
      in_orgId: payload.in_orgId,
      out_inwardimgid: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      out_ErrorCode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      out_ErrorMsg: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 4000,
      },
    };

    const result = await connection.execute(query, bind, { autoCommit: true });

    res.json({
      success: true,
      errorCode: result.outBinds.out_ErrorCode,
      errorMessage: result.outBinds.out_ErrorMsg,
      inwardImgId: result.outBinds.out_inwardimgid,
    });
  } catch (error) {
    console.error("failed to save inward data:", error);
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

const updateInwardDocumentBlobs = async (req, res) => {
  let connection;
  try {
    const { inwardId, inwardNo, documents } = req.body;
    connection = await getConnection();

    const query = `
      UPDATE aoio_inwardimg_det
      SET    blob_inwardimg_document = :fileBuffer
      WHERE  num_inwardimg_inwardno  = :inwardNo
        AND  num_inwardimg_inwardid  = :inwardId
        AND  num_inwardimg_serialno  = :serialNo
        AND  var_inwardimg_docname   = :docName
    `;

    let totalUpdated = 0;
    const failedRows = [];

    for (const doc of documents) {
      try {
        // Decode Base64 to Buffer for Oracle BLOB
        const fileBuffer = Buffer.from(doc.fileBytes, "base64");

        const bind = {
          fileBuffer,
          inwardNo: inwardNo,
          inwardId: Number(inwardId),
          serialNo: Number(doc.serialNo),
          docName: doc.documentName,
        };

        const result = await connection.execute(query, bind, {
          autoCommit: true,
        });

        if (result.rowsAffected > 0) {
          totalUpdated += result.rowsAffected;
        } else {
          failedRows.push({
            serialNo: doc.serialNo,
            documentName: doc.documentName,
            reason: "No matching row found",
          });
        }
      } catch (docErr) {
        console.error(
          `Failed to update BLOB for serial ${doc.serialNo}:`,
          docErr,
        );
        failedRows.push({
          serialNo: doc.serialNo,
          documentName: doc.documentName,
          reason: docErr.message,
        });
      }
    }

    if (failedRows.length > 0) {
      return res.status(207).json({
        success: false,
        message: `Updated ${totalUpdated} of ${documents.length} documents`,
        totalUpdated,
        failedRows,
      });
    }

    res.json({
      success: true,
      message: `All ${totalUpdated} documents uploaded successfully`,
      totalUpdated,
    });
  } catch (error) {
    console.error("updateInwardDocumentBlobs error:", error);
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

const getInwarListThree = async (req, res) => {
  let connection;
  try {
    const { userId, ulbid, fromDate, toDate } = req.body;
    if (!userId) {
      return res.json({ success: false, errorMessage: "UserId is required" });
    }
    if (!ulbid) {
      return res.json({ success: false, errorMessage: "UserId is required" });
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
    connection = await getConnection();
    const query = `SELECT DISTINCT
       aim.num_iinward_ulbid        AS ulbid,
       aim.num_inward_inwardid      AS inwardid,
       aim.num_inward_inwardno      AS inword_no,
       AIM.date_inward_inwdate      AS inwarddate,
       AIM.var_inward_refno         AS ref_no,
       AIM.date_inward_refdate      AS ref_date,
       AIM.num_inward_mobile        AS mobile_no,
       AIM.var_inward_subject       AS subject,
       var_lettertype_type          AS LetterType
      FROM   aoio_inward_mas aim
      INNER  JOIN aoio_inwardto_det 
              ON num_inwardto_inwardid = num_inward_inwardid 
              AND num_inwardto_inwardno = num_inward_inwardno 
              AND num_inwardto_ulbid    = num_iinward_ulbid
      INNER  JOIN aoio_lettertype_det 
              ON num_lettertype_id = var_inward_lettertype
      WHERE  var_inward_status <> 'C'
        AND  num_inwardto_ulbid = :ulbid
        AND  var_inward_insby   = :userId
        AND  TRUNC(date_inward_inwdate) >= :fromDate
        AND  TRUNC(date_inward_inwdate) <= :toDate`;

    const bind = {
      fromDate,
      toDate,
      ulbid: Number(ulbid),
      userId,
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
  getSendersDropdown,
  getSubTypesDropdown,
  getLetterTypeDropdown,
  getOutwardtypeDropdown,
  getMarathiDepartmentDropdown,
  aoio_inward_ins,
  insertInwardDocuments,
  getInwardDetailsList,
  getInwarListTwo,
  AOIO_INWARD_docUpdt,
  updateInwardDocumentBlobs,
  getInwarListThree,
};
