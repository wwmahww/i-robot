const express = require('express');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const userRouter = require('./routs/userRouter');
const botRouter = require('./routs/botRouter');
const billRouter = require('./routs/billRouter');
const discountRouter = require('./routs/discountRouter');
const serviceRouter = require('./routs/serviceRouter');
const messageRouter = require('./routs/messageRouter');
const viewRouter = require('./routs/viewRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

const app = express();

// GLOBAL MIDDLEWARES

// Set security http headers
app.use(helmet());

// Development login
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// request limit
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'you reach your limit from this IP to requist to this route. Please try in a hour.',
});
app.use('/api', limiter);

// Body parser, reading data from body to req.body
app.use(express.json({ limit: '50kb' }));
app.use(cookieParser());

// Data sanitizing against noSQl qurey injection
app.use(mongoSanitize());

// Data sanitizing against xss
app.use(xss());

// Prevent parameter pullution
app.use(
  hpp({
    whitelist: [''],
  })
);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, '/public')));

// ROUTES
app.use('/api/v1/user', userRouter);
app.use('/api/v1/bot', botRouter);
app.use('/api/v1/bill', billRouter);
app.use('/api/v1/discount', discountRouter);
app.use('/api/v1/service', serviceRouter);
app.use('/api/v1/message', messageRouter);
app.use('/', viewRouter);

// Takeing care of unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`can't find '${req.originalUrl}' on this server.`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
