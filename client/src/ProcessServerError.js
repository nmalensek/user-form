class ProcessServerError {
    static getServerErrorAsArray(err, staticMessages) {
        let errorMessage = [];
        errorMessage.push('An error occurred while processing your request, please check the following issues: ');
    
        if (err.response) {
          //if an error occurs with server-side validation, an array of those errors is returned. If a different kind of error occurs, it'll be a string.
          if (err.response.data && err.response.data.errors) {
            let errorData = err.response.data.errors;
            switch (typeof errorData) {
                case 'object':
                  if (Array.isArray(errorData)) {
                    errorData.forEach(err => {
                      errorMessage.push(err.msg);
                    });
                  }
                  break;
                case 'string':
                  errorMessage.push(errorData);
                  break;
                default:
                  errorMessage.push(staticMessages.unexpectedError);
            }
          } else {
            errorMessage.push(err.response);
          }
        } else {
          errorMessage.push(staticMessages.connectionError);
        }
    
        return errorMessage;
    }
}

module.exports = ProcessServerError;

