const logger = require('./logger.helper');

const statuses = {
  200: "All's Good :)",
  400: 'You sent a bad request mistakenly :{',
  401: 'Opps! seems you are not authorised for this operation :p',
  404: "We didn't found what you were searching for",
  500: 'Sorry :( there is something wrong at our end',
};

exports.getResponse = (status, message, result, res) => {
  if (status != 200) {
    logger.error({
      level: 'error',
      message: message,
      data: result,
    });
    // to handel mongo duplicate error
    if (result && result.code && result.code == 11000) {
      return res.status(status).json({
        status: statuses[status] || status,
        message: message,
        result: {
          message:
            'Mongo Error:  data with the following details already exist',
        },
      });
    }
  } else {
    logger.info({
      level: 'info',
      message: message,
      data: result,
    });
  }
  return res.status(status).json({
    status: statuses[status] || status,
    message: message || '',
    result: result || '',
  });
};
