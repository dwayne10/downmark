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


// https://downmark.herokuapp.com/?u=https%3A%2F%2Fwww.ilpost.it%2F2022%2F02%2F23%2Feuropa-debolezza-ucraina%2F&tags[]=foo&tags[]=

// javascript:(function()%7Bdocument.location.href%3D%22http%3A%2F%2Flocalhost%3A3000%2Fobsidian%3Fu%3D%22%2BencodeURIComponent(document.location)%3B%7D)()
