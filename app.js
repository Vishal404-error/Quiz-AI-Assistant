const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const user = require('./user')
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'hdta$*(^@$@fdfmhshutervsbsur@^$8#&JDHRFE(#&@hduw&#2h23r847kknfwy72LW@&#$'
const session = require('express-session')
const mongoDbSession = require('connect-mongodb-session')(session)

const TWO_HOURS = 1000 * 60 * 60 * 1
const SESS_NAME = 's_id'
const SESS_LIFETIME = TWO_HOURS
const SESS_SECRET = 'dont!!trytoChangeThis!!'

const mongoURI = 'mongodb://127.0.0.1:27017/logindb'
try {
    mongoose.connect(mongoURI, {
         useNewUrlParser: true, useUnifiedTopology: true 
        }).then((res)=>{
            console.log('connected to the database...')
        })

} catch (error) {
    console.log(error)
}

const sessionStore = new mongoDbSession({
    uri: mongoURI,
    collection: 'mySessions'
})


// --------- MIDDLEWARES ------ //

app.use(bodyParser.json());
app.use('/static', express.static('static'))
app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    store: sessionStore,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: false
    }
}))

const isAuth = (req, res, next) => {
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/login')
    }
}

// -------- TEMPLET ENGINE ------- //
app.set('view engine', 'ejs')  // setting templet engine
app.set('views', path.join(__dirname, 'views'))

// ---------------------------------//

// ------ END POINTS REQUESTS -------- //

app.get('/', (req, res) => {
    res.render('home')
})

app
    .route('/home')
    .get((req, res) => {
        res.render('home')
    })

app.get('/dashboard', isAuth, (req, res)=>{
    res.render('dashboard')
})

app
    .route('/register')
    .get((req, res) => { res.render('register') })

    .post(async (req, res) => {
        // console.log(req.body)
        const { username, email, password: plainTextPassword, cpassword } = req.body

        if (plainTextPassword != cpassword) {
            return res.json({ status: 'error', error: 'Password does not match' })
        }

        if (!username || !plainTextPassword) {
            return res.json({ status: 'error', error: 'Invalid Username or Password' })
        }
        if (plainTextPassword.length < 5) {
            return res.json({ status: 'error', error: 'Password is too small. should be more than 5 charecter' })
        }

        const password = await bcrypt.hash(plainTextPassword, 10)

        try {
            const newUser = await user.create({
                username,
                email,
                password
            })
            console.log("User created successfully...")
            // console.log(newUser)
        } catch (error) {
            // console.log(JSON.stringify(error))

            if (error.code === 11000) {
                // duplicate value
                return res.json({ status: 'error', error: 'Username or Email is already taken' })
            }
            throw error
        }
        res.json({ status: 'ok' })


    })

app
    .route('/login')
    .get((req, res) => { res.render('login') })

    .post(async (req, res) => {
            const { username, password } = req.body
            const find = await user.findOne({ username }).lean()
            if (!find) {
                return res.json({ status: 'error', error: 'User does not exist' })
            }
            if (await bcrypt.compare(password, find.password)) {
                // authentication success
                const token = jwt.sign({
                    id: find._id,
                    username: find.username
                }, JWT_SECRET
                )
                req.session.isAuth = true
                res.json({ redirectTo: '/dashboard' })
                // res.json({status: 'error', error: 'theres an error'})
            }else{
                res.json({ status: 'error', error: 'Invalid Password' })
            }

    })

app.post('/logout', (req, res) => {
    req.session.isAuth = false
    res.send('user has been loged out')
})

app
    .route('/science', isAuth)
    .get((req, res) => { res.render('./science/science') })

// ---------------------Instruction & Score Page -----------------//

app
    .route('/instructions', isAuth)
    .get((req,res)=>{res.render('instructions')})

app
    .route('/score', isAuth)
    .get((req,res)=>{res.render('score')})




app
    .route('/sports', isAuth)
    .get((req,res)=>{res.render('./sports/sports')})


// -------- Sports Instructions & Score Page -------- //

app
    .route('/spoinstruction', isAuth)
    .get((req, res) => { res.render('spoinstruction') })

app
    .route('/sportsscore', isAuth)
    .get((req, res) => { res.render('sportsscore') })



   

app
.route('/films', isAuth)
.get((req,res)=>{res.render('./films/films')})


// -------- films Instructions & Score Page -------- //

app
.route('/filInstruction', isAuth)
.get((req, res) => { res.render('filInstruction') })

app
.route('/filmsscore', isAuth)
.get((req, res) => { res.render('filmsscore') })
// ---------- SERVER -------- //
app.listen(3000, () => {
    console.log(`Server is listening at : http://localhost:3000`)
})
