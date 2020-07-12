module.exports = function(userModel, express, validation, logger) {
  const router = express.Router();

  let maxId = userModel.getLargestId();

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
    return userModel.addUser(req.body, (error) => {
          if(error) {
            return res.status(500).json({errors: error.message});
          }
          return res.status(200).send();
      });
  });

  router.put('/:userid', function(req, res, next) {

  });

  router.delete('/:userId', validateId(), function(req, res, next) {
    let errors = validation.validationResult(req).errors;
    if (errors.length !== 0) {
      return res.status(422).json({errors: errors});
    }
    
    return userModel.deleteUser(req.params.userId, (error) => {
      if (error) {
        return res.status(500).json({errors: error.message});
      }
      return res.status(200).send();
    });
  });

  function validateNewUser() {
    return [
      validation.body('email', 'Email is missing or has an invalid format.')
      .exists().isEmail().normalizeEmail(),
      
      validation.body('firstName', 'First name is missing or contains invalid characters.')
      .exists().isLength({min: 1, max: 500}).trim().escape(),
      
      validation.body('lastName', 'Last name is missing or contains invalid characters.')
      .exists().isLength({min: 1, max: 500}).trim().escape(),
      
      validation.body('organization', 'Organization is missing or contains invalid characters.')
      .exists().isLength({min: 1, max: 500}).trim().escape()
    ];
  }

  function validateId() {
    //TODO?: set max value to max saved ID so those get rejected here instead of at the model where it has to incur disk I/O to check.
    return [
      validation.param('userId', 'ID provided is not a valid user ID.')
      .isInt({min: 1}).escape()
    ];
  }

  return router;
}
