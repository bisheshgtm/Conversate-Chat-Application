const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        default: 'https://th.bing.com/th/id/R.87e76f0bdb3c5d28eb15cd66fe5c27c9?rik=HSqvrBBQ1Ys90A&riu=http%3a%2f%2f4.bp.blogspot.com%2f-Gs63thLilSE%2fT9UMpkqKvXI%2fAAAAAAAAEOs%2fh2sGmqQQnL4%2fs1600%2fdefault_user_icon-dc6cdc7f01bcc60a4d6c3523377a1098-770007.jpg&ehk=uWecusqm0jmubLTZd4oHRtFXJMei4vbiE3lVwZes9Ng%3d&risl=&pid=ImgRaw&r=0',
    },

}, {
    timestamps: true,
});

// compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}



// encrypting password
userSchema.pre('save', async function (next) {
    if (!this.isModified) {
        next(); // if password is not modified then move to next middleware
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

});

const User = mongoose.model('User', userSchema);

module.exports = User;

