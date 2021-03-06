module.exports = function(logger) {
    function error(err, excludeTimestamp) {
        log('error', err.message + ' ' + err.stack, excludeTimestamp);
    }

    function info(message, excludeTimestamp) {
        log('info', message, excludeTimestamp);
    }

    function log(level, message, excludeTimestamp) {
        let info = {
            level: level,
            message: message,
        }
        if (!excludeTimestamp) {
            info.timestamp = new Date(Date.now()).toISOString();
        }
        
        logger.log(info);
    }

    return {
        error,
        info
    }
}