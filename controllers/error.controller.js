exports.handlePsqlError = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "not a valid id input" });
  } else {
    next(err);
  }
};

exports.handleCustomsError = (err, req, res, next) => {
  if (err.status && err.msg) {
    const { status, msg } = err;
    res.status(status).send({ msg });
  } else {
    next(err);
  }
};

exports.handle500ServerError = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error!!!!!" });
};
