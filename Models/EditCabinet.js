const { Schema, model } = require("mongoose");

const EditCabinet = new Schema({
    _id: { type: Schema.Types.ObjectId},
    value: [{type: String}]
})

module.exports = model('EditCabinet', EditCabinet);