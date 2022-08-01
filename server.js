const compression = require('compression');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

// start
const app = express();

app.use(cors());
/*

app.use((req, res, next) => {
	var oneof = false;
	if (req.headers.origin) {
		//req.headers.origin.match(/whateverDomainYouWantToWhitelist/g) ) {
		//'https://sandbox.pagseguro.uol.com.br'
		res.header('Access-Control-Allow-Origin', req.headers.origin);
		oneof = true;
	}
	if (req.headers['access-control-request-method']) {
		res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
		oneof = true;
	}
	if (req.headers['access-control-request-headers']) {
		res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
		oneof = true;
	}
	if (oneof) {
		res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
	}

	// * intercept OPTIONS method
	if (oneof && req.method == 'OPTIONS') {
		res.sendStatus(200);
	} else {
		next();
	}
});

*/


// ambiente
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

// Arquivos Estáticos

app.use('/public', express.static(__dirname + 'public'));
app.use('/public/images', express.static(__dirname + '/public/images'));

// Setup mongodb

const dbs = require('./config/database.json');
const dbURI = isProduction ? dbs.dbProduction : dbs.dbTest;
mongoose.connect(dbURI, { useNewUrlParser: true });

//Setup ESJ
app.set('view engine', 'ejs');

// Configurações de ajuda

if (!isProduction) app.use(morgan('dev'));
//app.use(cors());

app.disable('x-powered-by'); // para questões de segurança desativa a  propriedade que informa ao cliente que está utilizando express

app.use(compression());

//Setup body parser
app.use(bodyParser.urlencoded({ extended: false, limit: 1.5 * 1024 * 1024 }));
app.use(bodyParser.json({ limit: 1.5 * 1024 * 1024 }));

//models
require('./models');

// rotas
app.use('/', require('./routes'));

// Tratamento para caso não encontre nenhuma rota . ira retornar 404
app.use((req, res, next) => {
	const err = new Error('Not	Found');
	err.status = 404;
	next(err);
});

// Tratamento para as rotas 422 ,500,401

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	if (err.status !== 404) console.warn('Error:', err.message, new Date());
	//res.json({ erros: { message: err.message, status: err.status } }); //Modulo 6 - Api Validações   Preparando e fazendo Setup da validação.
	res.json(err);
});

// Escutar o servidor
app.listen(PORT, (err) => {
	if (err) throw err;
	console.log(`rondando na //localhost:${PORT}`);
});


