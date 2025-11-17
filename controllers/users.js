// User controller functions for authentication and profile management
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

  // Hash the password before saving
  bcrypt.hash(password, 10)
    .then((hashedPassword) => User.create({ 
      name, 
      avatar, 
      email, 
      password: hashedPassword 
    }))
    .then((user) => {
      // Remove password from response (select: false doesn't apply to new documents)
      const userObject = user.toObject();
      delete userObject.password;
      res.status(STATUS_CREATED).send(userObject);
    })
    .catch((err) => {
      console.error(err);
      
      // Handle duplicate email error (MongoDB error code 11000)
      if (err.code === 11000) {
        return res.status(STATUS_CONFLICT).send({ 
          message: "User with this email already exists" 
        });
      }
      
      if (err.name === "ValidationError") {
        return res.status(STATUS_BAD_REQUEST).send({ message: err.message });
      }
      
      return res
        .status(STATUS_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // Create JWT token with user ID, expires in 7 days
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      // Send token in response body
      res.status(STATUS_OK).send({ token });
    })
    .catch((err) => {
      console.error(err);
      // Return 401 for incorrect email or password
      return res
        .status(STATUS_UNAUTHORIZED)
        .send({ message: "Incorrect email or password" });
    });
};

const getCurrentUser = (req, res) => {
  // Get user ID from authentication middleware (req.user._id)
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
  // Get user ID from authentication middleware (req.user._id)
  const userId = req.user._id;
  
  // Only allow modification of name and avatar fields
  const { name, avatar } = req.body;
  
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    {
      new: true,        // Return updated document
      runValidators: true,  // Run validation on update
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

// Test-only functions (for backwards compatibility)
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

module.exports = { createUser, login, getCurrentUser, updateProfile, getUsers, getUser };
