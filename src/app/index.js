const app = require('./server')

app.listen(8080, function () {
    console.log('Server listening at %s', app.name, 8080)
})