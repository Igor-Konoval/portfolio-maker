const { Schema, model } = require("mongoose");

const BlocksCabinet = new Schema({
    _id: { type: Schema.Types.ObjectId},
    value: [{type: String}]
})

module.exports = model('BlocksCabinet', BlocksCabinet);