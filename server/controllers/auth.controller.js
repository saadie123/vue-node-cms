const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const generateTokens = require('../utils/generate-tokens');
const AppError = require('../utils/app-error');
const catchAsync = require('../utils/catch-async');
const authValidator = require('../validation/auth.validator');

exports.signupUser = catchAsync(async (req, res, next) => {
  const { errors, isValid } = await authValidator.validateSignup(req.body);
  if (!isValid) {
    return next(new AppError('Validation Error', 400, errors));
  }
  const hash = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hash
  });
  const savedUser = await user.save();
  const payload = {
    id: savedUser._id,
    name: savedUser.name,
    email: savedUser.email
  };
  const { token, refresh_token } = generateTokens(payload);
  res.status(201).json({
    token,
    refresh_token,
    message: 'Account has been created successfully.'
  });
});

exports.signinUser = catchAsync(async (req, res, next) => {
  const { errors, isValid } = authValidator.validateSignin(req.body);
  if (!isValid) {
    return next(new AppError('Validation Error', 400, errors));
  }
  const user = await User.findOne({
    email: req.body.email
  });
  if (!user) {
    errors.email = 'User with this email does not exist';
    return next(new AppError('Not Found', 404, errors));
  }
  const matched = await bcrypt.compare(req.body.password, user.password);
  if (!matched) {
    errors.password = 'Invalid Password';
    return next(new AppError('Invalid data', 400, errors));
  }
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    created: user.created
  };
  const { token, refresh_token } = generateTokens(payload);
  res.json({
    token,
    refresh_token,
    message: 'Sign in successful'
  });
});

exports.refreshAuth = catchAsync(async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decoded.id);
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    created: user.created
  };
  const { token, refresh_token } = generateTokens(payload);
  res.json({
    token,
    refresh_token
  });
});

exports.getUser = (req, res, next) => {
  if (req.user) {
    return res.status(200).json(req.user);
  }
  return next(new AppError('Unauthorized', 401));
};
