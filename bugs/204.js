import mongoose from 'mongoose'
import mockgoose from 'mockmongoose'

mockgoose(mongoose).then(function () {
  mongoose.connect('mongodb://example.com/TestingDB', function (err) {
    console.error(err)
  })
}) 
