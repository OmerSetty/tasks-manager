const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/indexRouter');
const authRouter = require('./routes/authRouter');
const mainRouter = require('./routes/mainRouter');


const uri = "mongodb+srv://dbSetty:c2zhrkt2kkkdb@cluster0.fayd1.mongodb.net/setty?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true })
.then(() => console.log("connected to db"))
.catch((err) => console.log(err)); 

// mongoose.connect('mongodb://localhost/setty')
// .then(() => console.log("connected to db"))
// .catch((err) => console.log(err));


app.use(bodyParser.json());

console.log("app");
// enabling the static files of the pages
app.use('/', express.static(__dirname + '/static'));
app.use('/main', express.static(__dirname + '/static'));

// using the routers for the application
app.use('/register', indexRouter);
app.use('/', authRouter);

app.use('/main', mainRouter);


app.all('*', function(req, res) {
  res.redirect("/");
  });

// handling errors
app.use((err, req, res, next) => {
  res.send("The error is: " + err.message);
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}/main`));