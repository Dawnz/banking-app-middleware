const router = require('express').Router();

router("/accounts", require("../routes/account.routes"));
router("/users", require("../routes/user.routes"));
router("/authenticate", require("../routes/auth.routes"));


module.exports = router;