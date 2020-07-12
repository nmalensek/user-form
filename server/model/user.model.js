module.exports = function(userFile, fse, logger) {
    function UserOps() {};
    
    function User(id, firstName, lastName, organization, email) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.organization = organization;
        this.email = email;
    }

    UserOps.getLargestId = function() {
        return fse.readJSON(userFile)
        .then((data) => {
            return Math.max(...Object.values(data).map(u => u.id))
        })
        .catch(err => {
            logger.error(err);
        })
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
            logger.error(err);
        });
    }

    UserOps.addUser = function(newUser, cb) {
        return fse.readJSON(userFile)
        .then(data => {
            let userId = Math.max(...Object.values(data).map(u => u.id)) + 1;
            
            if (Number.isNaN(userId)) {
                throw new Error('Error calculating new user ID.');
            }
            
            data[userId] = new User(
                userId, newUser.firstName, newUser.lastName, newUser.organization, newUser.email);
            return fse.writeJson(userFile, data)
            .then(() => {
                cb(null);
            });
        })
        .catch(err => {
            logger.error(err);
            cb(err);
        });
    }
    
    UserOps.editUser = function(id, cb) {

    }

    UserOps.deleteUser = function(id, cb) {
        return fse.readJSON(userFile)
        .then(data => {
            if (data[id] == undefined) {
                throw new Error('Could not find specified user in database.');
            }
            delete data[id];
            return fse.writeJson(userFile, data)
            .then(() => {
                cb(null);
            });
        })
        .catch(err => {
            logger.error(err);
            cb(err);
        });
    }
    
    return UserOps;
}