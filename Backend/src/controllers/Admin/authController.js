const oracledb = require("oracledb");
const { getConnection } = require("../../../src/config/database");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken"); // Import JWT
const encrypt = require("../../middleware/authMiddleware");
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const logDir = path.join(__dirname, '../../../logs');
const jwksRsa = require("jwks-rsa");
const { expressjwt: jwtMiddleware } = require("express-jwt");

const JWT_SECRET = process.env.JWT_SECRET;
const {
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_AUDIENCE, AUTH0_REALM
} = process.env;
// const getAuth0Token = async (username, password) => {
//   try {
//     const response = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
//       grant_type: 'password',
//       username : username,
//       password : password ,
//       audience: process.env.AUTH0_AUDIENCE,
//       client_id: process.env.AUTH0_CLIENT_ID,
//       client_secret: process.env.AUTH0_CLIENT_SECRET,
//       scope: 'openid profile email'
//     });
//     return response.data;
//   } catch (err) {
//     console.error("Auth0 token error:", err.response?.data || err.message);
//     return null;
//   }
// };

const getWardID = async (zoneID) => {
  let connection;
  try {
    connection = await getConnection();
    const query =
      "SELECT num_zone_wardid FROM PROP.aoms_zone_mas WHERE num_zone_id = :zoneID";
    const result = await connection.execute(query, [zoneID], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    if (result.rows.length > 0) {
      return result.rows[0].NUM_ZONE_WARDID;
    }
    return null;
  } catch (error) {
    console.error("Error fetching Ward ID:", error);
    return null;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

// Login Function
const login = async (req, res) => {
  const { in_UserId, in_password } = req.body;
  console.log(req.body);
  try {
    const connection = await getConnection();
    const password_final = encrypt.encryptPassword(in_password);
    console.log("Sending Parameters to Oracle:", { in_UserId, password_final });

    const bindParams = {
      IN_USERID: in_UserId,
      IN_PASSWORD: password_final,
      IN_MACADDR: "00-14-22-01-23-45",
      IN_IPADDR: "192.168.1.100",
      IN_HOSTNAME: "localhost",
      IN_SOURCE: "WEB",
      IN_DEPTID: "1261",

      OUT_USERNAME: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_USERID: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_LASTLOGIN: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_LASTLOGOUT: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_CORPORATION: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_CORPORATIONADDRESS: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_RECEIPTOFFICENAME: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_CHALANOFFICENAME: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_PRABHAGNAME: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_PRABHAGID: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_DESIGID: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_USERTYPE: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_COLLECTIONCENTER: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      OUT_MOBILENO: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_OTPVALIDATE: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_ERRORCODE: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      OUT_ERRORMSG: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_ORGID: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      OUT_FORCEFULLPASSCHAGE: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
    };

    console.log("Calling Oracle Stored Procedure...");
    const result = await connection.execute(
      `BEGIN admins.aoma_login_fetch(
        :IN_USERID, :IN_PASSWORD, :IN_MACADDR, :IN_IPADDR, :IN_HOSTNAME, :IN_SOURCE, :IN_DEPTID,
        :OUT_USERNAME, :OUT_USERID, :OUT_LASTLOGIN, :OUT_LASTLOGOUT, :OUT_CORPORATION, :OUT_CORPORATIONADDRESS,
        :OUT_RECEIPTOFFICENAME, :OUT_CHALANOFFICENAME, :OUT_PRABHAGNAME, :OUT_PRABHAGID, :OUT_DESIGID, :OUT_USERTYPE,
        :OUT_COLLECTIONCENTER, :OUT_MOBILENO, :OUT_OTPVALIDATE, :OUT_ERRORCODE, :OUT_ERRORMSG, :OUT_ORGID, :OUT_FORCEFULLPASSCHAGE
      ); END;`,
      bindParams
    );

    await connection.close();
    console.log("Oracle Response:", result.outBinds);

    if (result.outBinds.OUT_ERRORCODE !== 9999) {
      return res.status(401).json({ message: result.outBinds.OUT_ERRORMSG });
    }

    // Fetch the Ward ID
    const wardID = await getWardID(result.outBinds.OUT_PRABHAGID);

    const userData = {
      Out_UserName: result.outBinds.OUT_USERNAME,
      userId: result.outBinds.OUT_USERID,
      desigId: result.outBinds.OUT_DESIGID,
      Out_LastLogin: result.outBinds.OUT_LASTLOGIN,
      Out_LastLogOut: result.outBinds.OUT_LASTLOGOUT,
      corporation: result.outBinds.OUT_CORPORATION,
      corporationAddress: result.outBinds.OUT_CORPORATIONADDRESS,
      receiptOfficeName: result.outBinds.OUT_RECEIPTOFFICENAME,
      chalanOfficeName: result.outBinds.OUT_CHALANOFFICENAME,
      prabhagName: result.outBinds.OUT_PRABHAGNAME,
      prabhagID: wardID,//result.outBinds.OUT_PRABHAGID,
      acccounttype: 1261,
      userType: result.outBinds.OUT_USERTYPE,
      Out_Collectioncenter: result.outBinds.OUT_COLLECTIONCENTER, // Assign Ward ID to Collection Center
      mobileNo: result.outBinds.OUT_MOBILENO,
      otpValidate: result.outBinds.OUT_OTPVALIDATE,
      errorCode: result.outBinds.OUT_ERRORCODE,
      errorMsg: result.outBinds.OUT_ERRORMSG,
      out_OrgId: result.outBinds.OUT_ORGID,
      forceFullPassChange: result.outBinds.OUT_FORCEFULLPASSCHAGE,
    };

    console.log("Storing Data in LocalStorage:", {
      ulbId: userData.out_OrgId,
      deptId: bindParams.IN_DEPTID,
      userId: userData.userId,
      prabhagName: userData.prabhagName,
      callcenterId: userData.Out_Collectioncenter, // Corrected callcenter ID
    });

    // Local storage data
    const localStorageData = {
      ulbId: userData.out_OrgId,
      deptId: bindParams.IN_DEPTID,
      userId: userData.userId,
      prabhagName: userData.prabhagName,
      callcenterId: userData.Out_Collectioncenter,
      desigId:userData.desigId // Ensure callcenterId is stored
    };

    // Generate JWT Token
    //  const auth0Token = await getAuth0Token(in_UserId, in_password);

    //   if (!auth0Token) {
    //     return res.status(500).json({ message: "Oracle login succeeded, but Auth0 SSO token failed" });
    //   }

    //   console.log("✅ Auth0 Access Token:", auth0Token.access_token);
    //             if (!fs.existsSync(logDir)) {
    //         fs.mkdirSync(logDir, { recursive: true });
    //       }

    //   const logPath = path.join(logDir, 'auth0_tokens.log');

    //   const logContent = `
    //   [${new Date().toISOString()}]
    //   User: ${in_UserId}
    //   Access Token: ${auth0Token.access_token}
    //   ID Token: ${auth0Token.id_token}
    //   Expires In: ${auth0Token.expires_in} seconds
    //   -----------------------------------------------------
    //   `;

    //   fs.appendFile(logPath, logContent, (err) => {
    //     if (err) {
    //       console.error("❌ Failed to write token log:", err);
    //     } else {
    //       console.log("✅ Token written to file:", logPath);
    //     }
    //   });
        const token = jwt.sign(
      {
        userId: userData.userId,
        userName: userData.Out_UserName,
        userType: userData.userType,
        orgId: userData.out_OrgId,
      },
      JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );
      return res.status(200).json({
        // token: auth0Token.access_token,
        // idToken: auth0Token.id_token,
        // expiresIn: auth0Token.expires_in,
        token,
        user: userData,
        localStorageData
      });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const authLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ error: "Username and password required" });

  try {
    const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
      grant_type: "http://auth0.com/oauth/grant-type/password-realm",
      username,
      password,
      realm: AUTH0_REALM,
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      audience: AUTH0_AUDIENCE,
      scope: "openid profile email offline_access"
    });

    const { access_token, refresh_token } = response.data;

    const connection = await getConnection();
    const password_final = encrypt.encryptPassword(password);
    console.log("Sending Parameters to Oracle:", { username, password });

    const bindParams = {
      IN_USERID: username,
      IN_PASSWORD: password_final,
      IN_MACADDR: "00-14-22-01-23-45",
      IN_IPADDR: "192.168.1.100",
      IN_HOSTNAME: "localhost",
      IN_SOURCE: "WEB",
      IN_DEPTID: "",

      OUT_USERNAME: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_USERID: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_LASTLOGIN: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_LASTLOGOUT: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_CORPORATION: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_CORPORATIONADDRESS: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_RECEIPTOFFICENAME: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_CHALANOFFICENAME: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_PRABHAGNAME: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_PRABHAGID: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_DESIGID: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_USERTYPE: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_COLLECTIONCENTER: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      OUT_MOBILENO: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_OTPVALIDATE: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_ERRORCODE: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      OUT_ERRORMSG: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
      OUT_ORGID: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      OUT_FORCEFULLPASSCHAGE: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 255,
      },
    };

    console.log("Calling Oracle Stored Procedure...");
    const result = await connection.execute(
      `BEGIN admins.aoma_login_fetch(
        :IN_USERID, :IN_PASSWORD, :IN_MACADDR, :IN_IPADDR, :IN_HOSTNAME, :IN_SOURCE, :IN_DEPTID,
        :OUT_USERNAME, :OUT_USERID, :OUT_LASTLOGIN, :OUT_LASTLOGOUT, :OUT_CORPORATION, :OUT_CORPORATIONADDRESS,
        :OUT_RECEIPTOFFICENAME, :OUT_CHALANOFFICENAME, :OUT_PRABHAGNAME, :OUT_PRABHAGID, :OUT_DESIGID, :OUT_USERTYPE,
        :OUT_COLLECTIONCENTER, :OUT_MOBILENO, :OUT_OTPVALIDATE, :OUT_ERRORCODE, :OUT_ERRORMSG, :OUT_ORGID, :OUT_FORCEFULLPASSCHAGE
      ); END;`,
      bindParams
    );

    await connection.close();
    console.log("Oracle Response:", result.outBinds);

    if (result.outBinds.OUT_ERRORCODE !== 9999) {
      return res.status(401).json({ message: result.outBinds.OUT_ERRORMSG });
    }

    // Fetch the Ward ID
    const wardID = await getWardID(result.outBinds.OUT_PRABHAGID);

    const userData = {
      Out_UserName: result.outBinds.OUT_USERNAME,
      userId: result.outBinds.OUT_USERID,
      desigId: result.outBinds.OUT_DESIGID,
      Out_LastLogin: result.outBinds.OUT_LASTLOGIN,
      Out_LastLogOut: result.outBinds.OUT_LASTLOGOUT,
      corporation: result.outBinds.OUT_CORPORATION,
      corporationAddress: result.outBinds.OUT_CORPORATIONADDRESS,
      receiptOfficeName: result.outBinds.OUT_RECEIPTOFFICENAME,
      chalanOfficeName: result.outBinds.OUT_CHALANOFFICENAME,
      prabhagName: result.outBinds.OUT_PRABHAGNAME,
      prabhagID: wardID,//result.outBinds.OUT_PRABHAGID,
      acccounttype: 1261,
      userType: result.outBinds.OUT_USERTYPE,
      Out_Collectioncenter: result.outBinds.OUT_COLLECTIONCENTER, // Assign Ward ID to Collection Center
      mobileNo: result.outBinds.OUT_MOBILENO,
      otpValidate: result.outBinds.OUT_OTPVALIDATE,
      errorCode: result.outBinds.OUT_ERRORCODE,
      errorMsg: result.outBinds.OUT_ERRORMSG,
      out_OrgId: result.outBinds.OUT_ORGID,
      forceFullPassChange: result.outBinds.OUT_FORCEFULLPASSCHAGE,
    };

    console.log("Storing Data in LocalStorage:", {
      ulbId: userData.out_OrgId,
      deptId: bindParams.IN_DEPTID,
      userId: userData.userId,
      prabhagName: userData.prabhagName,
      callcenterId: userData.Out_Collectioncenter, // Corrected callcenter ID
    });

    // Local storage data
    const localStorageData = {
      ulbId: userData.out_OrgId,
      deptId: bindParams.IN_DEPTID,
      userId: userData.userId,
      prabhagName: userData.prabhagName,
      callcenterId: userData.Out_Collectioncenter, // Ensure callcenterId is stored
      desigId: userData.desigId,
    };

    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      domain: ".nagarkaryavalinew.com",
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      domain: ".nagarkaryavalinew.com",
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
 const token = jwt.sign(
      {
        userId: userData.userId,
        userName: userData.Out_UserName,
        userType: userData.userType,
        orgId: userData.out_OrgId,
      },
      JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );
      return res.status(200).json({
      message: "Logged in successfully",
        token,
        user: userData,
        localStorageData
      });
   
  } catch (err) {
    console.error("Auth0 login error:", err.response?.data || err.message);
    res.status(401).json({
  error: "Login failed",
  details: err.response?.data || err.message || err
});

  }
};

// ⛩️ Middleware: verify access_token from cookies
const checkJwt = jwtMiddleware({
  secret: jwksRsa.expressJwtSecret({
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5
  }),
  audience: AUTH0_AUDIENCE,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
  getToken: req => req.cookies.access_token
});

// ✅ GET /api/me — return decoded Auth0 user info
const getMe = (req, res) => {
  res.json({ user: req.auth });
};

// 🔁 POST /api/refresh — refresh access_token using refresh_token
const refreshToken = async (req, res) => {
  const refresh_token = req.cookies.refresh_token;
  if (!refresh_token) return res.status(401).json({ error: "No refresh token" });

  try {
    const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
      grant_type: "refresh_token",
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      refresh_token
    });

    res.cookie("access_token", response.data.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      domain: ".nagarkaryavalinew.com",
      maxAge: 15 * 60 * 1000
    });

    res.json({ message: "Access token refreshed" });
  } catch (err) {
    console.error("Token refresh failed:", err.response?.data || err.message);
    res.status(401).json({ error: "Refresh token failed" });
  }
};

// 🚪 POST /api/logout — clear cookies
const logout = (req, res) => {
  res.clearCookie("access_token", { domain: ".nagarkaryavalinew.com" });
  res.clearCookie("refresh_token", { domain: ".nagarkaryavalinew.com" });
  res.status(200).json({ message: "Logged out" });
};

module.exports = { login, getWardID, authLogin, checkJwt, getMe, refreshToken, logout };
