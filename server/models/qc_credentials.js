import mongoose from "mongoose";

const qc_credentials = mongoose.Schema({
    store_id:{type:String},
    qc_cred:[{
        
    }]
});

export default mongoose.model("Qc_credentials", storeSchema);
