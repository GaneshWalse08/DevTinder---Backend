const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "accepted", "rejected", "interested"],
        message: "{VALUE} is not a valid status",
      },
    },
  },
  {
    timestamps: true,
  },
);

connectionRequestSchema.pre("save", function (){
  const connectionRequest = this;

  if(connectionRequest.toUserId.equals(connectionRequest.fromUserId)){
    throw new Error("You cant send request to yourself!!")
  }

})

connectionRequestSchema.index({fromUserId : 1, toUserId : 1})

const ConnectionRequest = new mongoose.model(
  "ConnectionRequestModel",
  connectionRequestSchema,
);

module.exports = ConnectionRequest;
