const UserModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 60 * 60;

//每当注册一个用户，根据其id为其申请一个token，有效期是三天
const createToken = (id) => {
  return jwt.sign({ id }, "junyan super secret key", {
    expiresIn: maxAge,
  });
};

//处理各种错误错误
const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  //邮箱不存在
  if (err.message === "incorrect email")
    errors.email = "That email is not registered";

  //密码不匹配
  if (err.message === "incorrect password")
    errors.password = "That password is incorrect";

  //邮箱已注册
  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
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
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);
    //将token存入cookie
    res.cookie("jwt", token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });
    res.status(200).json({ user: user._id, created: true });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};
