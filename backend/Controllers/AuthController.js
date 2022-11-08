const UserModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 60 * 60;

//每当注册一个用户，根据其id为其申请一个token，有效期是三天
const createToken = (id) => {
  return jwt.sign({ id }, "junyan super secret key", {
    expiresIn: maxAge,
  });
};

//处理重复注册的错误
const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.create({ email, password });
    const token = createToken(user._id);

    //将token存入cookie
    res.cookie("jwt", token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });
    res.status(201).json({ user: user._id, created: true });
  } catch (err) {
    console.log(err);
  }
};

module.exports.login = async (req, res, next) => {};
