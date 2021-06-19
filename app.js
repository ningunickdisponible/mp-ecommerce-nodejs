var express = require('express');
var exphbs  = require('express-handlebars');
const mercadopago = require ('mercadopago');
const URL_PROD = "https://ningunickdi-mp-commerce-nodejs.herokuapp.com/"
var port = process.env.PORT || 3000


mercadopago.configure({
  access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398',
  integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'
});
var app = express();
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    let preference = {
        items: [
          {
            id: 1234,
            title: req.query.title,
            unit_price: parseInt(req.query.price),
            quantity: parseInt(req.query.unit),
            picture_url: req.query.img
          }
        ],
        payer: {
            name: "Lalo",
            surname: "Landa",
            email: "test_user_63274575@testuser.com",
            phone: {
              area_code: "11",
              number: 22223333
            },        
            address: {
              street_name: "Falsa",
              street_number: 123,
              zip_code: "111"
            }
        },
        payment_methods:{
            excluded_payment_methods: [ {
                id : "amex"
            }],
            excluded_payment_types: [ {
                id : "atm"
            }],
            installments: 6
        },
        back_urls: {
            success : `${URL_PROD}success`,
            pending : `${URL_PROD}pending`,
            failure : `${URL_PROD}failure`,
        },
        auto_return: "approved",
        external_reference: "albruni309@hotmail.com",
        notification_url: "http://c3c65320495d.ngrok.io/notifications"
      };
      
      mercadopago.preferences.create(preference)
      .then(function(response){
        var objeto = {
            id_preference: response.body.id,
            articulo: req.query,
            init_point: response.body.init_point
        }
        res.render('detail', objeto);
      }).catch(function(error){
        console.log(error);
      });
});

app.get('/success', function (req, res) {
    res.render('success',req.query);
});
app.get('/pending', function (req, res) {
    res.render('pending',req.query);
});
app.get('/failure', function (req, res) {
    res.render('failure',req.query);
});
app.post('/notifications', function(req,res){
    console.log(req.body);
    console.log(req.query);
    res.sendStatus(200);
});

app.listen(port);