const { Schema, model } = require("mongoose");

const ImgCabinet = new Schema({
    _id: { type: Schema.Types.ObjectId},
    value: [{type: String}]
})

module.exports = model('ImgCabinet', ImgCabinet);