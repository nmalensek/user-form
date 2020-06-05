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
        fse.readJSON(userFile)
        .then((data) => {
          console.log(data);
            cb(null, data);  
        })
        .catch((err) => {
            cb(err, null);
            logger.error(err);
            console.error(err);
        })
    }

    UserOps.addUser = function(userData, cb) {
        
    }
    
    UserOps.editUser = function(userData, id, cb) {

    }

    UserOps.deleteUser = function(id, cb) {

    }
    
    return UserOps;
}