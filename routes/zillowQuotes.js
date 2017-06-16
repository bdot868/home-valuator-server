const
  express = require('express'),
  Zillow = require('../models/Zillow.js'),
  authorize = require('../config/serverAuth.js').authorize,
  zillowRouter = new express.Router()

  zillowRouter.use(authorize)

  zillowRouter.route('/')
    .get((req, res) => {
      Zillow.find({user: req.decoded._id}, (err, quotes) => {
        res.json(quotes)
      })
    })
    .post((req, res) => {
      const newQuote = new Zillow(req.body)
      newQuote.user = req.decoded._id
      newQuote.save((err, quote) => {
        res.json({success: true, message: 'Zillow Quote created', quote})
      })
    })

    zillowRouter.route('/:id')
      .delete((req,res) => {
        Zillow.findByIdAndRemove(req.params.id, (err, quote) => {
          res.json({success: true, message: 'zillow deleted.', quote})
        })
      })

module.exports = zillowRouter
