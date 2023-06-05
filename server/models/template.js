import mongoose from "mongoose";

const templateSchema = mongoose.Schema({
    template_url: {type:String},
    s3_url: {type:String},


});

export default mongoose.model("Template", templateSchema);
