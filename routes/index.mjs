import express from 'express'
var router = express.Router()

/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'Express' });
//   // res.status(err.status || 500);
//   // res.json({
//   //   message: err.message,
//   //   error: err
//   // });
// });
router.get('/', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
});

export default router
