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
    return userModel.addUser(req.body, (error) => {
          if(error) {
            return res.status(500).json({errors: error.message});
          }
          return res.status(200).send();
      });
  });

  router.put('/:userId', validateEdit(), function(req, res, next) {
    let errors = validation.validationResult(req).errors;
    if (errors.length !== 0) {
      return res.status(422).json({errors: errors});
    }
    return userModel.editUser(req.params.userId, req.body, (error) => {
      if (error) {
        return res.status(500).json({errors: error.message});
      }
      return res.status(200).send();
    });
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
    return [
      validation.param('userId', 'ID provided is not a valid user ID.')
      .isInt({min: 1}).escape()
    ];
  }

  function validateEdit() {
      return [
        validation.body('email', 'Email is in an invalid format.')
        .optional().isEmail().normalizeEmail(),
        
        validation.body('firstName', 'First name is too long.')
        .optional().isLength({max: 500}).trim().escape(),
        
        validation.body('lastName', 'Last name is too long.')
        .optional().isLength({max: 500}).trim().escape(),
        
        validation.body('organization', 'Organization is too long.')
        .optional().isLength({max: 500}).trim().escape()
      ];
  }

  return router;
}
