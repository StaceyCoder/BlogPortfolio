const ejs = require('ejs')
const express = require('express')
const bodyParser = require('body-parser')
const {Client} = require('pg')

const PORT = process.env.PORT || 3000

const app = express()

const connectionString = 'postgresql://xxxxxxx'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  const client = new Client({
  	connectionString: connectionString,
  })
  client.connect()
  .then(() => {
  	return client.query (`SELECT * FROM myblog`)
  })
    .then((result) => {
    return res.render('posts', {result})
  })
})


app.get('/add', (req, res) => {
  const client = new Client({
    connectionString: connectionString,
  })
  client.connect()
  .then(() => {
    return res.render('add')
  })
})


app.post('/add', (req, res) => {
  const client = new Client({
    connectionString: connectionString,
  })
  client.connect()
  .then(() => {
    return client.query(`INSERT INTO myblog (topic, note) VALUES ($1, $2)`, [req.body.topic, req.body.note])
  })
    .then((result) => {
    return res.redirect('/')
  })
})


app.post('/update', (req, res) => {
  const client = new Client({
    connectionString: connectionString,
  })
  client.connect()
  .then(() => {
    return client.query(`UPDATE myblog SET topic=$1, =$2 WHERE id=$3`, [req.body.topic, req.body.note, req.body.id])
  })
    .then((result) => {
    return res.redirect('/')
  })
})


app.get('/edit/myblog/:id', (req, res) => {
  const client = new Client({
    connectionString: connectionString,
  })
  client.connect()
  .then(() => {
    return client.query(`SELECT * FROM myblog WHERE id=$1`, [req.params.id])
  })
    .then((result) => {
    return res.render('edit-blog', {result})
  })
})


app.post('/delete/myblog/:id', (req, res) => {
  const client = new Client({
  	connectionString: connectionString,
  })
  client.connect()
  .then(() => {
  	return client.query (`DELETE FROM myblog WHERE id=$1`, [req.params.id])
  })
    .then((result) => {
    return res.redirect('/')
  })
})

app.listen(PORT, ()=>{
	console.log('Blog running...')
})
