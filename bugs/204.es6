"use strict"

import mongoose from 'mongoose'
import mockgoose from '../mockmongoose'

mockgoose(mongoose).then(function () {
  mongoose.connect('mongodb://example.com/TestingDB', function (err) {
    console.log("err:", err);
    console.log("done");
    mongoose.disconnect();
  })
}) 
