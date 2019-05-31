var fs = require("fs");
var path = require("path");
var express = require("express");
var app = express();
require('dotenv').config();

app.all(/.*/, function(req, res, next) {
    if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_FRONTEND_ENV !== 'debug') {
        var host = req.header("host");
        if (host.match(/^www\..*/i)) {
            next();
        } else {
            res.redirect(301, "https://www." + host);
        }
    }
    next();
});

app.use(express.static("build"));

app.use(function(req, res, next) {
    if (!fs.existsSync(req.originalUrl)) res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
    else next();
});

app.listen(process.env.PORT || 8080, function() {
    console.log('App ready on port 8080');
});