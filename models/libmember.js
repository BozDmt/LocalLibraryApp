// const mongoose = require('mongoose')

// const Schema = mongoose.Schema

// const userSchema = new Schema({
//     username: {type: String, required: true,maxlength: 150},
//     books_loaned: [{type: Schema.Types.ObjectId, ref:"Book"}],
//     date_of_birth: {type: Date/*, required: true*/},
//     password: {type: String, required: true,},
// })

// userSchema.virtual("url").get(function(){
//     return `/users/${this._id}`
// })

// module.exports = mongoose.model("Library Member", userSchema)