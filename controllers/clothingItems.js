const clothingItem = require("../models/clothingItems");

const {
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_SERVER_ERROR,
  STATUS_OK,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => res.send({ data: item }))
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Invalid item data" });
      }
      return res.status(STATUS_SERVER_ERROR).send({ message: "Server error" });
    });
};

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(STATUS_OK).send(items))
    .catch(() =>
      res
        .status(STATUS_SERVER_ERROR)
        .send({ message: "error on getting items" })
    );
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  clothingItem
    .findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => res.status(STATUS_OK).send({ data: item }))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        return res.status(STATUS_NOT_FOUND).send({ message: "Item not found" });
      }
      if (e.name === "CastError") {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Invalid like data" });
      }
      return res.status(STATUS_SERVER_ERROR).send({ message: "Server error" });
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  clothingItem
    .findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => res.status(STATUS_OK).send({ data: item }))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        return res.status(STATUS_NOT_FOUND).send({ message: "Item not found" });
      }
      if (e.name === "CastError") {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Invalid unlike data" });
      }
      return res.status(STATUS_SERVER_ERROR).send({ message: "Server error" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(STATUS_OK).send({}))
    .catch((e) => {
      if (e.name === "CastError") {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Invalid item ID" });
      }
      if (e.name === "DocumentNotFoundError") {
        return res.status(STATUS_NOT_FOUND).send({ message: "Item not found" });
      }
      return res.status(STATUS_SERVER_ERROR).send({ message: "Server error" });
    });
};

module.exports = { createItem, getItems, likeItem, unlikeItem, deleteItem };
