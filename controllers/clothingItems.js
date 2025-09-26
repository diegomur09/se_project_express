const clothingItem = require("../models/clothingItems");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res.status(400).send({ message: "Invalid item data" });
      }
      res.status(500).send({ message: "Server error" });
    });
};

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res.status(500).send({ message: "error on getting items", e });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  clothingItem
    .findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Item not found" });
      }
      if (e.name === "ValidationError") {
        return res.status(400).send({ message: "Invalid like data" });
      }
      res.status(500).send({ message: "Server error" });
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  clothingItem
    .findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Item not found" });
      }
      if (e.name === "ValidationError") {
        return res.status(400).send({ message: "Invalid unlike data" });
      }
      res.status(500).send({ message: "Server error" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(204).send({}))
    .catch((e) => {
      if (e.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }
      if (e.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(500).send({ message: "Server error" });
    });
};
module.exports = { createItem, getItems, likeItem, unlikeItem, deleteItem };
