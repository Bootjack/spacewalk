var app, connect;
connect = require('connect');
app = connect()
    .use(connect.logger('dev'))
    .use(connect.static('public'))
    .listen(3000);