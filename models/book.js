import mongoose from 'mongoose'

const Schema = mongoose.Schema

const BookSchema = new Schema({
    title: {type: String, required: true, maxlength: 200},
    author: {type: Schema.Types.ObjectId, ref:"Author", required: true},
    summary: {type: String, required: true},
    isbn: {type: String, required: true},
    genre: [{type: Schema.Types.ObjectId, ref: "Genre"}],
    cover:{type: String},
})

BookSchema.virtual("url").get(function(){
    return `/catalog/book/${this._id}`
})

export default mongoose.model("Book", BookSchema)