const ApiError = require('./ApiError');
const Logger = require('../config/winston-logger');
const logger = new Logger('app')

function apiErrorHandler(err, req, res, next) {
    if (err instanceof ApiError) {
        res.status(err.code).json(err.message); 
        if(req.params.company_id){
            logger.error("Return error response", {
                "type": "api", "sessionId": req.headers.cookie, "username": req.session.passport.user.name, "company_id": req.params.company_id, "company_name": req.session.passport.user.company, "action": "","url":req.url, "input": req.body, "outputCode": res.statusCode,"outputMessage":req.statusMessage, "changeInDB": false, "isError": true
            })
        }else{
            logger.error("Return error response", {
                "type": "api", "sessionId": req.headers.cookie, "username": req.session.passport.user.name, "company_id": req.body.company_id, "company_name": req.session.passport.user.company, "action": "","url":req.url, "input": req.body, "outputCode": res.statusCode,"outputMessage":req.statusMessage, "changeInDB": false, "isError": true
            })
        }
        return;
    }
    res.status(500).json('something went wrong');
}
module.exports = apiErrorHandler;