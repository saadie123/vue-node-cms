const app = require('./app');

process.on('uncaughtException', () => {
  console.log('-------------------------------------------');
  console.log('UNCAUGHT EXCEPTION! SHUTTING DOWN SERVER...');
  console.log('-------------------------------------------');
  console.log(err.name, err.message);
  process.exit(1);
});

const port = process.env.PORT;
const server = app.listen(port, () =>
  console.log(`server running on port ${port}`)
);

process.on('unhandledRejection', err => {
  console.log('--------------------------------------------');
  console.log('UNHANDLED REJECTION! SHUTTING DOWN SERVER...');
  console.log('--------------------------------------------');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
