import mongoose from "mongoose";

const qc_credentials = mongoose.Schema({
    store_id:{type:String},
    qwikcilver_account: {
        //Qwikcilver Account Credentials
        UserName: String,
        Password: String,
        TerminalId: String,
        DateAtClient: String,
        ForwardingEntityId: String,
        apiBaseUrl: String,
        ForwardingEntityPassword: String,
        CardProgramGroupName: String,
      },
      qwikcilver_web_properties: {
        //QC Initialization response
        MerchantOutletName: String,
        AcquirerId: String,
        OrganizationName: String,
        POSEntryMode: Number,
        POSTypeId: Number,
        POSName: String,
        TermAppVersion: String,
        CurrentBatchNumber: Number,
        TerminalId: String,
        MID: String,
        UserName: String,
        Password: String,
        ForwardingEntityId: String,
        ForwardingEntityPassword: String,
        DateAtClient: String,
        IsForwardingEntityExists: Boolean,
      }
});

export default mongoose.model("Qc_credentials", storeSchema);
