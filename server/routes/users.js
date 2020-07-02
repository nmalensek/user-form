module.exports = function(userModel, express, validation, logger) {
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

  router.post('/', validateNewUser(), function(req, res, next) {
    let errors = validation.validationResult(req).errors;
    if (errors.length !== 0) {
        return res.status(422).json({errors: errors});
    }
    return res.status(200).send();
  });

  router.put('/:userid', function(req, res, next) {

  });

  router.delete('/:userid', function(req, res, next) {
    //return req;
  });

  function validateNewUser() {
    return [
      validation.body('email', 'Email is missing or has an invalid format.').exists().isEmail().normalizeEmail(),
      validation.body('firstName', 'First name is missing or contains invalid characters.').exists().trim().escape(),
      validation.body('lastName', 'Last name is missing or contains invalid characters.').exists().trim().escape(),
      validation.body('organization', 'Organization is missing or contains invalid characters.').exists().trim().escape()
    ] 
  }

  return router;
}
