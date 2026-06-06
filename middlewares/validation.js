const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }

  return helpers.error("string.uri");
};

const objectId = Joi.string().hex().length(24).required().messages({
  "string.empty": "The ID field must be filled in",
  "string.hex": "The ID must be a hexadecimal value",
  "string.length": "The ID must be 24 characters long",
});

const userProfileSchema = {
  name: Joi.string().required().min(2).max(30).messages({
    "string.min": 'The minimum length of the "name" field is 2',
    "string.max": 'The maximum length of the "name" field is 30',
    "string.empty": 'The "name" field must be filled in',
  }),
  avatar: Joi.string().required().custom(validateURL).messages({
    "string.empty": 'The "avatar" field must be filled in',
    "string.uri": 'The "avatar" field must be a valid url',
  }),
};

module.exports.validateItemBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    weather: Joi.string().required().valid("hot", "warm", "cold").messages({
      "any.only": 'The "weather" field must be hot, warm, or cold',
      "string.empty": 'The "weather" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid url',
    }),
  }),
});

module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    ...userProfileSchema,
    email: Joi.string().required().email().messages({
      "string.email": 'The "email" field must be a valid email',
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateUserProfileBody = celebrate({
  body: Joi.object().keys(userProfileSchema),
});

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": 'The "email" field must be a valid email',
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    userId: objectId,
  }),
});

module.exports.validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: objectId,
  }),
});
