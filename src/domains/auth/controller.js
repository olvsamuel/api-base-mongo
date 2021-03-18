const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secrets = require("./../../core/secrets");
const UserSchema = require('../../schemas/UserSchema');


async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await UserSchema.findOne({ 'email': email, active: true });
  
    if (!user) {
      throw new Error("invalid e-mail or password");
    }

    const validPassword = await bcrypt.compare(password, user.password)


    if (!validPassword) {
      throw new Error("invalid e-mail or password");
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      secrets.JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    return res.status(200).json({
      type: "Bearer",
      token,
    });
  } catch (error) {
    return res.status(401).json({ error: true, message: error.message });
  }
}

module.exports = {
  login
};
