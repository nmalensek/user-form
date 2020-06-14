module.exports = function(userFile, fse, logger) {
    function UserOps() {
        
    };
    
    function User(firstName, lastName, org, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.organization = org;
        this.email = email;
    }
    
    UserOps.getUsers = function(cb) {
        //open file and load all users.
        //just use single file containing all users 'til everything's working, then convert to mongo.
        return fse.readJSON(userFile)
        .then(data => {
            cb(null, Object.values(data));  
        })
        .catch(err => {
            cb(err, null);
            logger.error(err);
        });
    }

    UserOps.addUser = function(userFile, cb) {
        
    }
    
    UserOps.editUser = function(userFile, id, cb) {

    }

    UserOps.deleteUser = function(id, cb) {

    }
    
    return UserOps;
}