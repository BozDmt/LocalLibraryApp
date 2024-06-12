const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {type: String, required: true,maxlength: 150},
    books_loaned: [{type: Schema.Types.ObjectId, ref:"BookInstance",required: false}],
    date_of_birth: {type: Date, required: false},
    password: {type: String, required: true},
    role: {type: String, required: true}
})

userSchema.virtual("url").get(function(){
    return `user/${this._id}`
})

module.exports = mongoose.model("User", userSchema)