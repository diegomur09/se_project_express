const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  STATUS_BAD_REQUEST,
  STATUS_UNAUTHORIZED,
  STATUS_NOT_FOUND,
  STATUS_CONFLICT,
  STATUS_SERVER_ERROR,
  STATUS_OK,
  STATUS_CREATED,
} = require("../utils/errors");

const createUserLegacy = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.status(STATUS_CREATED).send(user);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        return res.status(STATUS_BAD_REQUEST).send({ message: err.message });
      }

      return res
        .status(STATUS_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  // Validate email and password before hashing
  if (!email) {
    return res.status(STATUS_BAD_REQUEST).send({
      message: "Path `email` is required.",
    });
  }

  if (!password) {
    return res.status(STATUS_BAD_REQUEST).send({
      message: "Path `password` is required.",
    });
  }

  if (password.length < 8) {
    return res.status(STATUS_BAD_REQUEST).send({
      message:
        "Path `password` is shorter than the minimum allowed length (8).",
    });
  }

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({
        name,
        avatar,
        email,
        password: hashedPassword,
      })
    )
    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password;
      res.status(STATUS_CREATED).send(userObject);
    })
    .catch((err) => {
      console.error(err);

      if (err.code === 11000) {
        return res.status(STATUS_CONFLICT).send({
          message: "User with this email already exists",
        });
      }

      if (err.name === "ValidationError") {
        return res.status(STATUS_BAD_REQUEST).send({ message: err.message });
      }

      return res
        .status(STATUS_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });

  return undefined; // ESLint consistent-return requirement
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_OK).send(users))
    .catch((err) => {
      console.error(err);
      res
        .status(STATUS_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        return res.status(STATUS_NOT_FOUND).send({ message: "User not found" });
      }

      if (err.name === "CastError") {
        return res.status(STATUS_BAD_REQUEST).send({ message: "Invalid user ID" });
      }

      return res
        .status(STATUS_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(STATUS_BAD_REQUEST).send({
      message: "Email and password are required",
    });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(STATUS_OK).send({ token });
    })
    .catch((err) => {
      console.error(err);

      if (err.message === "Incorrect email or password") {
        return res
          .status(STATUS_UNAUTHORIZED)
          .send({ message: "Incorrect email or password" });
      }

      return res
        .status(STATUS_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(STATUS_NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Invalid user ID" });
      }
      return res
        .status(STATUS_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail()
    .then((user) => {
      res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        return res.status(STATUS_NOT_FOUND).send({ message: "User not found" });
      }

      if (err.name === "ValidationError") {
        return res.status(STATUS_BAD_REQUEST).send({ message: err.message });
      }

      if (err.name === "CastError") {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Invalid user ID" });
      }

      return res
        .status(STATUS_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

module.exports = {
  createUserLegacy,
  createUser,
  login,
  getUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
};
