class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message); //Here super keyword is used to invoke the constructor of super Class
        this.statusCode = statusCode
        Error.captureStackTrace(this,this.constructor);
    }
}

module.exports = ErrorHandler