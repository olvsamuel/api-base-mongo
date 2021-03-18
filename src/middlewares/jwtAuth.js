const jwt = require("jsonwebtoken");
const secrets = require("./../core/secrets");
const MongoUser = require('../schemas/UserSchema');

const checkJwt = async (req, res, next) => {
  if(req.originalUrl.match(/produtos\/imagem\/\d+/g)){
    next();
    return
  }
  const token_raw = req.headers.authorization;

  if (!token_raw || !token_raw.startsWith("Bearer")) {
    res.status(401).json({ message: "Token inválido!" });
    return;
  }

  const [type, token] = token_raw.split(" ");

  try {
    const jwtPayload = jwt.verify(token, secrets.JWT_SECRET);
    
    res.locals.jwtPayload = jwtPayload;

    const user = await MongoUser.find({"_id":jwtPayload.id})

    if (!user) {
      throw new Error("Usuário não encontrado ou inativo");
    }
    
    res.locals.user = user

    return next();

  } catch (error) {
    res.status(401).json({ message: "Invalid token!" });
    return;
  }
};

module.exports = checkJwt;
