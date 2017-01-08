var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var Sequelize = require("sequelize");

var sequelize = new Sequelize('products', 'alinatudorache', '', {
  dialect: 'mysql',
  host:'127.0.0.1',
  port: 3306
 });

var Prod = sequelize.define('items', {
   name: {
     type: Sequelize.STRING,
    field: 'name'
   },
  description: {
    type: Sequelize.STRING,
    field: 'description'
  },
  price: {
    type: Sequelize.INTEGER,
    field: 'price'
  },
}, {
  freezeTableName: false, // Model tableName will be the same as the model name
  timestamps: false
});

var app = express();
app.use(bodyParser.json());
app.use(cors());

var nodeadmin = require('nodeadmin');
app.use(nodeadmin(app));

//create a product
app.post('/items', function(request, response){
    Prod.create(request.body).then(function(item){
        Prod.findById(item.id).then(function(item){
            response.status(201).send(item);
        });
    });
});

//read all
app.get('/items', function(request, response){
    /*global Prod*/
    Prod.findAll().then(function(items){
        response.status(200).send(items);
    });
});

//read one
app.get('/items/:id', function(request, response){
    Prod.findById(request.params.id).then(function(item){
        if(item) {
            response.status(200).send(item);
        }else {
            response.status(404).send();
        }
    });
});

//update
app.put('/items/:id', function(request, response) {
    Prod
    .findById(request.params.id)
    .then(function(item){
        if(item) {
            item
            .updateAttributes(request.body)
            .then(function(){
                response.status(200).send('updated');
            })
            .catch(function(error){
                console.warn(error);
                response.status(500).send('server error');
            });
        } else {
            response.status(404).send();
        }
    });
});

//delete a product by id
app.delete('/items/:id', function(request, response){
    Prod
    .findById(request.params.id)
    .then(function(item) {
        if(item) {
            item
            .destroy()
            .then(function() {
                response.status(204).send();
            })
            .catch(function(error){
                console.warn(error);
                response.status(500).send('server error');
            });
        } else {
          response.status(404).send();  
        }
    });
});

// include static files in the admin folder
app.use('/admin', express.static('admin'));



app.listen(process.env.PORT);