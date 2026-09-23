const oracledb = require("oracledb");
const { getConnection } = require("../../../src/config/database");

const getMenus = async (req, res) => {
  let connection;
  try {
    const { userId, ulbId, deptId } = req.body;

    console.log("Received Query Params - User:", userId, "ULB:", ulbId, "Dept:", deptId);

    if (!userId || !ulbId || !deptId) {
      return res.status(400).json({ success: false, message: "Missing required query parameters" });
    }

    connection = await getConnection();

    const query = `
      select num_menumaster_menuid menuid,
       var_menumaster_pagetitle menutitle,
       num_menumaster_parentmenuid parentid,
       var_menumaster_pagepath pagepath,
       num_menumaster_orderby orderby
  from admins.aoma_menumaster_mas
 where num_menumaster_parentmenuid = 0
   and num_menumaster_deptid = :deptId
    AND var_menumaster_pagetitle <> 'Logout' -- Exclude Logout

union
select num_menumaster_menuid menuid,
       var_menumaster_pagetitle menutitle,
       num_menumaster_parentmenuid parentid,
       var_menumaster_pagepath pagepath,
       num_menumaster_orderby orderby
  from admins.aoma_menumaster_mas
       inner join admins.aoma_MenuULB_Config
               on num_menucorporation_menuid = num_menumaster_menuid
       inner join admins.aoma_MenuUser_Config
               on num_menuuser_menuid = num_menumaster_menuid
 where var_menuuser_activeflag = 'Y'
   and var_menuuser_userid = :userId
   and var_menumaster_pagepath is not null
   and num_menumaster_deptid = :deptId
   and num_menucorporation_ulbid = :ulbId
    AND var_menumaster_pagetitle <> 'Logout' -- Exclude Logout
order by orderby

    `;

    const binds = { userId, ulbId, deptId };
    const result = await connection.execute(query, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching menu data:", error);
    res.status(500).json({ success: false, message: "Error fetching menu data" });
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
