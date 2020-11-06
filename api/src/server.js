const mysqlDao = require('./mysqlDao')
const dbDao = new mysqlDao('localhost', 'secret', 'contactDb')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const api = express()
api.use(bodyParser.json())
api.use(bodyParser.urlencoded({entended: true}))
api.use(cors())
api.use(morgan('tiny'))

const serverId = Math.ceil(Math.random()*10000)

api.use((req, res, next) => {
    res.set('ServerId', serverId)
    next()
})

const URL = '/api/v1'
api.get(`${URL}/`, (req, res) => {
    res.json({status: 'success', payload: 'Contact API Microservice'})
})

//Get single Contact
api.get(`${URL}/contact/:id`, async (req, res) => {
    const id = parseInt(req.params.id)
    const contact = await dbDao.getContact(id)
    res.json({status: 'success', payload: contact})
})

//Get all contacts
api.get(`${URL}/contact`, async (req, res) => {
    const contacts = await dbDao.getContacts()
    res.json({status: 'success', payload: contacts})
})

//Add contact
api.get(`${URL}/contact`, async (req, res) => {
    const contacts = await dbDao.getContacts()
    res.json({status: 'success', payload: contacts})
})

api.listen(3000, () => {
    console.log('Contacts Microservice Listening on Port 3000')
})