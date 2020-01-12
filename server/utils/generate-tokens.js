const jwt = require("jsonwebtoken");
module.exports = (payload, expireTime = "1h") => {
  const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: expireTime
  });
  const refresh_token_payload = {
    id: payload.id,
    type: "refresh"
  };
  const refresh_token = jwt.sign(
    refresh_token_payload,
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: expireTime
    }
  );
  return {
    token,
    refresh_token
  };
};
