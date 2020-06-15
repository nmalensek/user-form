module.exports = function(userModel, express, logger) {
  const router = express.Router();

  /* GET users listing using the model. */
  router.get('/', function(req, res, next) {
      return userModel.getUsers(
        (error, users) => {
          if (error) {
            return res.status(500).send(new Error('could not load users.'));
          } else {
            return res.status(200).send(users);
          }
      });
  });

  router.post('/', function(req, res, next) {

  });

  router.put('/:userid', function(req, res, next) {

  });

  router.delete('/:userid', function(req, res, next) {
    return req;
  });

  return router;
}
