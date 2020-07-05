module.exports = function(userFile, fse, logger) {
    function UserOps() {
        
    };
    
    function User(id, firstName, lastName, organization, email) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.organization = organization;
        this.email = email;
    }
    
    /*
        just use single file containing all users 'til everything's working, then convert to mongo.
        TODO: get subset, make UI paginated.
    */
    UserOps.getUsers = function(cb) {
        return fse.readJSON(userFile)
        .then(data => {
            cb(null, Object.values(data));  
        })
        .catch(err => {
            cb(err, null);
            logger.error(err.message + ' ' + err.stack);
        });
    }

    UserOps.addUser = function(newUser, cb) {
        return fse.readJSON(userFile)
        .then(data => {
            let userId = Math.max(Object.keys(data)) + 1;
            data[userId] = new User(
                userId, newUser.firstName, newUser.lastName, newUser.organization, newUser.email);
            return fse.writeJson(userFile)
            .then(() => {
                cb(null);
            });
        })
        .catch(err => {
            logger.error(err.message + ' ' + err.stack);
            cb(err);
        });
    }
    
    UserOps.editUser = function(id, cb) {

    }

    UserOps.deleteUser = function(id, cb) {

    }
    
    return UserOps;
}