const mongoose = require("mongoose");


const UploadSchame = new mongoose.Schema({
    shortUrl:{
        type:String
    },
    longUrl: {
        type: String,

    },
    clickCount: { type: Number, default: 0 },
},
{timestamps: true}
)





module.exports = mongoose.model("Upload", UploadSchame);
