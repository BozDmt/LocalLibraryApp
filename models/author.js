import mongoose from 'mongoose'
import {DateTime} from 'luxon'

const Schema = mongoose.Schema

const AuthorSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 100},
    last_name: {type: String, required: false, maxlength: 150},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
    photo: {type: String, default: '/authorPic/default_profile_photo'},
})

AuthorSchema.virtual("name").get(function(){
    let fullname = ""
    if(this.first_name && this.last_name){
        fullname = `${this.last_name}, ${this.first_name}`
    }

    return fullname
})

AuthorSchema.virtual("url").get(function(){
    return `/catalog/author/${this._id}`
})

AuthorSchema.virtual('dob_formatted').get(function(){
    return this.date_of_birth? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
    : ''
})

AuthorSchema.virtual('dod_formatted').get(function(){
    return this.date_of_death? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) 
    : ''
})

AuthorSchema.virtual('dob_iso').get(function(){
    return this.date_of_death? DateTime.fromJSDate(this.date_of_birth).toISODate()
    : ''
})

AuthorSchema.virtual('dod_iso').get(function(){
    return this.date_of_death? DateTime.fromJSDate(this.date_of_death).toISODate()
    : ''
})

export default mongoose.model("Author",AuthorSchema)