const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
app.use(cors());
app.use(bodyParser.json());
const port = 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@notspecified.c6v9m.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const testimonialCollection = client.db(`${process.env.DB_NAME}`).collection("testimonials");
    const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("services");
    const bookingCollection = client.db(`${process.env.DB_NAME}`).collection("booking");
    const adminCollection = client.db(`${process.env.DB_NAME}`).collection("admin");
      
      app.post('/adTestimonials', (req, res) => {
        const testimonials = req.body;
        console.log('adding new testimonials: ', testimonials)
        testimonialCollection.insertOne(testimonials)
        .then(result => {
            console.log('inserted count', result.insertedCount);
            res.send(result.insertedCount > 0)
        })
      })
  
    app.get('/testimonials', (req, res) => {
        testimonialCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
    })
    app.post('/adServices', (req, res) => {
        const services = req.body;
        console.log('adding new service: ', services)
        serviceCollection.insertOne(services)
        .then(result => {
            console.log('inserted count', result.insertedCount);
            res.send(result.insertedCount > 0)
        })
      })
      app.post('/addBooking', (req, res) => {
        const booking = req.body;
        console.log('adding new booking: ', booking)
        bookingCollection.insertOne(booking)
        .then(result => {
            console.log('inserted count', result.insertedCount);
            res.send(result.insertedCount > 0)
        })
      })
      app.get('/services', (req, res) => {
        serviceCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
      })
      app.get('/bookings', (req, res) => {
        bookingCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
      })
      app.get('/admin', (req, res) => {
        adminCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
    })
    app.post('/addAdmin', (req, res) => {
        const booking = req.body;
        console.log('adding new Admin: ', booking)
        adminCollection.insertOne(booking)
        .then(result => {
            console.log('inserted count', result.insertedCount);
            res.send(result.insertedCount > 0)
        })
      })
  
    app.delete('/deleteService/:id', (req, res) => {
      const id = ObjectID(req.params.id);
          console.log('delete this', id);
          serviceCollection.findOneAndDelete({_id: id})
          .then(documents => res.send(!!documents.value))
    })
  app.post('/isAdmin', (req, res) => {
    const email = req.body.email
    adminCollection.find({ email: email })
      .toArray((error, admin) => {
      res.send(admin.length>0)
    })
  })
  app.post('/bookingByEmail', (req, res) => {
    const email = req.body.email
    bookingCollection.find({ bookedByEmail: email })
      .toArray((error, booking) => {
        console.log(booking)
      res.send(booking)
    })
  })
  
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)