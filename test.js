var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    handlebars = require('express3-handlebars').create({defaultLayout: 'main'}),
    transcation = require('./routes/transcation');

app.set('port', process.env.PORT || 3000);
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));


app.get('/list', transcation.getList);
app.post('/add', transcation.add);
app.get('/', function(req, res){
    res.render('index');
});

app.use(function(err, req, res, next){
    console.log(err.stack);
    res.status(500).render('500');
});

app.use(function(req, res){
    res.status(404).render('404');
});

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:'+app.get('port')+'; press Ctrl-C to terminate.');
});

