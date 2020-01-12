const router = require('express').Router();

const authenticate = require('../middlewares/auth');
const authController = require('../controllers/auth.controller');

router.post('/signup', authController.signupUser);

router.post('/signin', authController.signinUser);

router.post('/refresh-auth', authenticate, authController.refreshAuth);

router.get('/get-user', authenticate, authController.getUser);

module.exports = router;
