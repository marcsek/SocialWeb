const Joi = require("@hapi/joi");

const regSchema = Joi.object({
  name: Joi.string().min(3).max(32).required(),
  password: Joi.string().min(8).max(64).required(),
});

const logSchema = Joi.object({
  name: Joi.string().min(3).max(32).required(),
  password: Joi.string().min(8).max(64).required(),
});

const updateSchema = Joi.object({
  name: Joi.string().min(3).max(32),
});

const registrationVal = (data) => {
  return regSchema.validate(data);
};

const loginVal = (data) => {
  return logSchema.validate(data);
};

const updateVal = (data) => {
  return updateSchema.validate(data);
};

module.exports = { registrationVal, loginVal, updateVal };
