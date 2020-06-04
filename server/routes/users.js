module.exports = function(model, express, logger) {
  const router = express.Router();

  /* GET users listing using the model. */
  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

  router.post('/', function(req, res, next) {

  });

  router.put('/:userid', function(req, res, next) {

  });

  router.delete('/:userid', function(req, res, next) {

  });

  return router;
}
