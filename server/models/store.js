import mongoose from "mongoose";

let storeSchema = mongoose.Schema(
  {
    store_url: { type: String },
    isInstalled: { type: Boolean },
    access_token: { type: String },
    status: { type: String },
    plan: {
      plan_name: String,
      created_at: Date,
      updated_at: Date,
    },
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
    },
  },
  { versionKey: false }
);

export default mongoose.model("Store", storeSchema);
