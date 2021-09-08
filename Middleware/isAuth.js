const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  // console.log(authHeader+" niro")
  if (!authHeader) {
    req.auth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];

  if (!token || token === "") {
    req.auth = false;
    return next()
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, "lmsuservalidation");
  } catch (err) {
    req.auth = false;
    return next();
  }
  if (!decodedToken) {
    req.auth = false;
    return next();
  }
  
  req.auth = true;
  req.userID = decodedToken.userID;
  next();
};
