import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {type: String, required: true,maxlength: 150},
    books_loaned: [{type: Schema.Types.ObjectId, ref:"BookInstance",required: false}],
    date_of_birth: {type: Date, required: false},
    password: {type: String, required: true},
    role: {type: String, required: true}
})

userSchema.pre('save',function (next){
    const salt = bcrypt.genSalt(10)
    salt.then((salty)=>{
        const hashedPass = bcrypt.hash(this.password,salty)
        return hashedPass
    }).then((hashed)=>{
        this.password = hashed
        return next()
    })
})

// userSchema.post('save',function(next){
    // console.log(`user saved:${this}`)
    // next()
    // return bcrypt.hash(data.password,10)
    //     .then(()=>next())
// })

userSchema.virtual("url").get(function(){
    return `user/${this._id}`
})

userSchema.method('comparePasswd',function(plaintext){
    return new Promise((resolve, reject)=>{
        bcrypt.compare(plaintext,this.password)
            .then((matches)=>{
                if(matches)
                    resolve(true)
                else
                    resolve(false)
            })
    })
})

export default mongoose.model("User", userSchema)