const express = require('express') //imports express
const fs = require('fs') //imports file system functions
const path =require('path') //imports path utils
const hbs=require('hbs') //imports handlebars
//add other imports here
const mongoose = require('mongoose')
const ItemEntry = require('./models/item');
const { request } = require('http')
const { response } = require('express')
const { features } = require('process')
const geoPre = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
const geoKey = 'pk.eyJ1IjoiODNhdGhvbSIsImEiOiJja2RiMWZ2OGEwaWNrMndvYjdlMWFldnFyIn0.DTo4G2-yKSJoxaIodhBuDA'
require('dotenv').config()


mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology: true,
    useFindAndModify: false
})


const app = express(); //creates express application and returns an object
const port = process.env.PORT; //selects the port to be used
app.listen(port) // starts listening for client requests on specified port
app.use(express.json());

const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')
app.use(express.static('./public')) //points to static resources like css, client side js etc.
app.set('view engine','hbs') //tells express top use handlebars templating engine
app.set('views',viewsPath) //sets the apps view directory to the viewsPath defined above
hbs.registerPartials(partialsPath)//registers the partials for the app

let entries=[]

app.get('/', (req, res)=> {
    res.render('index',{title :'Items for sale!'})
});

app.get('/items', (req, res)=> {
    ItemEntry.find({},(error,result)=>{
        if (error)
            console.log(error)
        else{
            entries=result
            console.log(entries)
            res.send(entries)
        }
    })
});
app.get('/items/:id', (req, res)=> {
    ItemEntry.findById({_id: req.params.id},(error,result)=>{
        if (error)
            console.log(error)
        else{
            entries=result
            console.log(entries)
            res.send(entries)
        }
    })
});
app.post('items/', (req, res)=> {
    const place = req.address
    const geoURL = geoPre + place + '.json?access_token=' + geoKey
    request({'url': geoURL},(error,response)=>{
        const data = JSON.parse(response.body)
        const lat = data.features[0].center[1]
        const long = data.features[0].center[0]
        if(req.email !== "") {
            var item = {
                title: req.title,
                description: req.description,
                name: req.name,
                category: req.category,
                price: req.price,
                latitude: lat,
                longitude: long,
                contact: req.email
            }
        }
        else if(req.phone !== "") {
            var item = {
                title: req.title,
                description: req.description,
                name: req.name,
                category: req.category,
                price: req.price,
                latitude: lat,
                longitude: long,
                contact: req.phone
            }
        }
        else {
            res.send("Error: invalid contact data")
        }
        ItemEntry.create(item,(error,result)=>{
            if (error)
                console.log(error)
            else{
                console.log(result)
                res.send({_id: result._id, title: result.title, description: result.description, category: result.category})
            }
        })
    })
});
app.delete('items/:id', (req, res)=> {
    ItemEntry.findById({_id: req.param.id},(error,result)=>{
        if (error)
            console.log(error)
        else{
            ItemEntry.deleteOne({name: result.name},(error,result)=>{
                if (error)
                    console.log(error)
                else{
                    console.log(result)
                    res.send(result)
                }
            })
        }
    })
});

app.get('*', (req, res)=> {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Page does not exist')
        res.end()
});