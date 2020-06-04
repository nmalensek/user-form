module.exports = function(userFile, fse, logger) {
    function User(name, org, email) {
        this.name = name;
        this.organization = org;
        this.email = email;
    }
    
    User.getUsers = function(cb) {
        //open file and load all users.
        //just use single file containing all users 'til everything's working, then convert to mongo.
        fse.readJSON(userFile)
        .then((data) => {
          cb(null, data)  
        })
        .catch((err) => {
            cb(err, null);
        })
    }

    User.addUser = function(cb) {
        
    }
    
    User.editUser = function(cb) {

    }

    User.deleteUser = function(cb) {

    }
    
    return User;
}