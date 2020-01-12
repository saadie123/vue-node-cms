const express = require('express');

require('./config/db');
const errorMiddleware = require('./middlewares/error');
const AppError = require('./utils/app-error');

const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', authRoutes);

app.all('*', (req, res, next) => {
  const message = `Can't find ${req.originalUrl} on this server`;
  const err = new AppError(message, 404);
  next(err);
});

app.use(errorMiddleware);

module.exports = app;
