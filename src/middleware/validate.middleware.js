const { validationResult } = require("express-validator");

function handleValidationErrors(viewName, extraLocals = {}) {
  return (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const errors = result.array().map((e) => e.msg);
      return res.status(400).render(viewName, { ...extraLocals, errors, error: null });
    }

    next();
  };
}

module.exports = { handleValidationErrors };