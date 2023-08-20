const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname, '/public')));
const port = 8000 || 3000;
const level=1;

// important for restAPI
const methodOverride = require('method-override');
const passport = require('passport');


const LocalStrategy = require('passport-local');
const User = require('./models/UserDB')
const Question = require('./models/QuestionDB');


const session = require('express-session');
// body parser
app.use(express.urlencoded({ extended: true })); //for form data
app.use(methodOverride('_method'))

let configSesion = {
    secret: 'user',
    resave: false,
    saveUninitialized: true,
}


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

app.use(session(configSesion));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
passport.use(new LocalStrategy(User.authenticate()));

//  mongo db port
mongoose.connect('mongodb+srv://dhruvsingh235443:52DfoS2u95kk4g8U@cluster0.9lcdykk.mongodb.net/?retryWrites=true&w=majority')
    .then(() => { console.log('db connected') })
    .catch(() => { console.log("error"); });
// db connected URL
/* 
user login DB
*/
app.get('/register', (req, res) => {
    res.render('auth/signup');
})

app.post('/register', async (req, res) => {
    let { email, username, password } = req.body;
    const user = new User({ email, username });
    const newUser = await User.register(user, password);
    res.redirect('/login');
})



app.get('/login', (req, res) => {
    res.render('auth/login');
})
app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login'
}),
    function (req, res) {
        res.redirect('/home');
    })
app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

// ques = {
//     problem_id: 1,
//     title: "Mystery Inscriptions",
//     description: "Amelia discovers inscriptions with reversed words. She must reverse the words to decipher the message.",
//     testcases: [
//       {
//         input: "sdrawkcab",
//         output: "backwards"
//       },
//       {
//         input: "emordnilap",
//         output: "palindrome"
//       },
//       {
//         input: "noitseuq",
//         output: "question"
//       },
//       {
//         input: "elbissopmi",
//         output: "impossible"
//       }
//     ],
//     isSolved : false
//   }
// Question.create(ques);





app.get('/map', isAuthenticated, async (req, res) => {
  let obj = await Question.find({}).sort({problem_id:1});
  res.render('puzzle', { obj });
});

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  // Redirect to login page if not authenticated
  res.redirect('/login');
}


app.get('/level/:id', async (req, res) => {
    

      let { id } = req.params;
      const Qobj = await Question.findById(id);
      if (Qobj) {
        if (Qobj.isSolved) {
          return   res.render('show', { Qobj });
        } else {
            
          console.log('This question has not been solved yet.');
          return res.send("you need to clear previos level")
        }
    }

      if (!Qobj) {
        return res.status(404).send("Question not found");
      }
      
    
});

app.get('/home',(req,res)=>{
    res.render('home');
})
app.get('/',(req,res)=>{
    res.render('home');
})

app.get('*', (req, res) => {
    res.render('404')
})



app.listen(port, (req, res) => {
    console.log(`console connected on ${port}`);
})