const router = require('express').Router();

router("/accounts", require("../routes/account.routes"));
router("/users", require("../routes/user.routes"));



module.exports = router;