import mongoose from 'mongoose'
// import bcrypt from 'bcrypt'
const Schema = mongoose.Schema

const tokenSchema = new Schema({
    token: {type: String, required: true,},
    uid: {type: String, required: true,},
    role: {type: String, required: true,},
})

export default mongoose.model('tokens',tokenSchema)