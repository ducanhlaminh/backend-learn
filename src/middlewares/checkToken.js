const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
require("dotenv").config();
const db = require("../config/userModels");
const redis = require("../untils/redis");
const forge = require("node-forge");

const checkToken = async (req, res, next) => {
      let accessToken = req?.headers?.authorization;
      if (!accessToken) {
            return res.status(400).json({
                  message: "Missing token from request",
                  status: 1,
            });
      }
      let tokenRegex =
            /^(Bearer)\s[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
      if (!tokenRegex.test(accessToken))
            return res.status(401).json({
                  stauts: 1,
                  message: "Token không hợp lệ",
            });
      let token = accessToken.split(" ")[1];
      jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
            if (err) {
                  return res.status(401).json({
                        status: -1,
                        message: "Verify Failed 1 !!!",
                  });
            }
            const blackId = await redis.get(`blacklist_id_${user.userId}`);
            const blackToken = await redis.get(
                  `blacklist_token_${accessToken}`
            );
            if (blackId === "1" || blackToken === "1") {
                  return res.status(401).json({
                        status: -1,
                        message: "Verify Failed 2 !!!",
                  });
            }
            req.user = user;
            next();
      });
};
const checkEditor = (req, res, next) => {
      if (req.user?.role !== "0") {
            return res.status(404).json({
                  status: 3,
                  message: "Require Editor Role !",
            });
      }
      next();
};
const checkUserManager = (req, res, next) => {
      if (req.user?.role !== 1) {
            return res.status(404).json({
                  status: 3,
                  message: "Require Manager Role !",
            });
      }
      next();
};
const checkNewManager = (req, res, next) => {
      if (req.user?.role !== 1) {
            return res.status(404).json({
                  status: 3,
                  message: "Require Manager Role !",
            });
      }
      next();
};
const checkSuperManager = (req, res, next) => {
      if (req.user?.role !== 1) {
            return res.status(404).json({
                  status: 3,
                  message: "Require Manager Role !",
            });
      }
      next();
};
const decryptRequest = (req, res, next) => {
      console.log(process.env.PRIVATEKEY);
      const { k: n, d: t } = req;
      const i = forge.pki.privateKeyFromPem(process.env.PRIVATEKEY);
      const r = forge.util.decodeUtf8(i.decrypt(forge.util.decode64(n)));
      const s = Buffer.from(t, "base64");
      const o = s.slice(0, 16);
      const u = s.slice(16);
      const c = forge.cipher.createDecipher(
            "AES-CTR",
            Buffer.from(r, "base64").toString("binary")
      );
      console.log(
            c.start({
                  iv: o.toString("binary"),
            }),
            c.update(forge.util.createBuffer(u)),
            c.finish(),
            forge.util.decodeUtf8(c.output.data)
      );
};
module.exports = {
      checkToken,
      checkUserManager,
      checkEditor,
      checkSuperManager,
      checkNewManager,
      decryptRequest,
};
