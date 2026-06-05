const clothingItem = require("../models/clothingItems");
const BadRequestError = require("../errors/bad-request-error");
const ForbiddenError = require("../errors/forbidden-error");
const NotFoundError = require("../errors/not-found-error");

const {
  STATUS_OK,
} = require("../utils/errors");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => res.send({ data: item }))
    .catch((e) => {
      if (e.name === "ValidationError") {
        return next(new BadRequestError("Invalid item data"));
      }
      return next(e);
    });
};

const getItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => res.status(STATUS_OK).send(items))
    .catch(next);
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  clothingItem
    .findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => res.status(STATUS_OK).send({ data: item }))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (e.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(e);
    });
};

const unlikeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  clothingItem
    .findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => res.status(STATUS_OK).send({ data: item }))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (e.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(e);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  // First find the item to check ownership
  clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      // Check if current user is the owner of the item
      if (item.owner.toString() !== userId) {
        throw new ForbiddenError("You can only delete your own items");
      }

      // If user is the owner, delete the item
      return clothingItem
        .findByIdAndDelete(itemId)
        .then(() => res.status(STATUS_OK).send({}));
    })
    .catch((e) => {
      if (e.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      if (e.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      return next(e);
    });
};

module.exports = { createItem, getItems, likeItem, unlikeItem, deleteItem };
