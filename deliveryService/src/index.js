const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const http = require('http');
const socketIO = require('socket.io');
const session = require('express-session');

const User = require('./models/User');
const ChatModule = require('./controller/ChatModule');

function verify(email, password, done) {
  User.findOne({ email }, (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'Неверный логин или пароль' });
    }
    const result = !bcrypt.compareSync(password, user.passwordHash);
    if (result) {
      return done(null, false, { message: 'Неверный логин или пароль' });
    }
    return done(null, user);
  }).select('-__v');
}

const options = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: false,
};

passport.use('local', new LocalStrategy(options, verify));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    return cb(null, user);
  });
});

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const sessionMiddleware = session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// convert a connect middleware to a Socket.IO middleware
const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'));
  }
});

const authRouter = require('./routes/auth');
const advertisementsRouter = require('./routes/advertisement');

app.use('/api', authRouter);
app.use('/api/advertisements', advertisementsRouter);

io.on('connection', async (socket) => {
  const { id } = socket;
  console.log(`Socket connected: ${id}`);

  socket.on('getHistory', async (resiverId) => {
    const chat = await ChatModule.find([socket.request.user._id, resiverId]);
    const history = await ChatModule.getHistory(chat._id);
    socket.emit('chatHistory', history);
  });

  socket.on('sendMessage', async (receiver, text) => {
    const author = socket.request.user._id;
    const data = { author, receiver, text };
    const message = await ChatModule.sendMessage(data);
    socket.emit('newMessage', message.text);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${id}`);
  });
});

const PORT = process.env.PORT || 3000;
const UserDB = process.env.DB_USERNAME || 'root';
const PasswordDB = process.env.DB_PASSWORD || 'qwerty12345';
const NameDB = process.env.DB_NAME || 'delivery_service';
const HostDb = process.env.DB_HOST || 'mongodb://localhost:27017/';

async function start() {
  try {
    await mongoose.connect(HostDb, {
      user: UserDB,
      pass: PasswordDB,
      dbName: NameDB,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
