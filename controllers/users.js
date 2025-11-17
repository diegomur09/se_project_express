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
      message: "Path `password` is shorter than the minimum allowed length (8).",
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

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(STATUS_OK).send({ token });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(STATUS_UNAUTHORIZED)
        .send({ message: "Incorrect email or password" });
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

const createTestUser = (req, res) => {
  const { name, avatar } = req.body;

  const testEmail = `test_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}@example.com`;
  const testPassword = "dummypassword123";

  bcrypt
    .hash(testPassword, 10)
    .then((hashedPassword) =>
      User.create({
        name,
        avatar,
        email: testEmail,
        password: hashedPassword,
      })
    )
    .then((user) => {
      res.status(STATUS_CREATED).send({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      console.error("User creation error:", err);

      if (err.name === "ValidationError") {
        return res.status(STATUS_BAD_REQUEST).send({ message: err.message });
      }

      return res
        .status(STATUS_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_OK).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(STATUS_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const getUser = (req, res) => {
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
  createUser,
  login,
  getCurrentUser,
  updateProfile,
  createTestUser,
  getUsers,
  getUser,
};
