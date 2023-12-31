const nacl = require("tweetnacl");
const AWS = require("aws-sdk");

exports.handler = async (event, context, callback) => {
  // Checking signature (requirement 1.)
  const PUBLIC_KEY = process.env.PUBLIC_KEY;
  const signature = event.headers["x-signature-ed25519"];
  const timestamp = event.headers["x-signature-timestamp"];
  const strBody = event.body; // should be string, for successful sign

  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + strBody),
    Buffer.from(signature, "hex"),
    Buffer.from(PUBLIC_KEY, "hex")
  );

  const instanceId = "i-046d8bd7a802e57e4";
  const ec2 = new AWS.EC2();

  if (!isVerified) {
    return {
      statusCode: 401,
      body: JSON.stringify("invalid request signature"),
    };
  }

  // Replying to ping (requirement 2.)
  const body = JSON.parse(strBody);
  if (body.type == 1) {
    return {
      statusCode: 200,
      body: JSON.stringify({ type: 1 }),
    };
  }

  // Handle /ip Command
  if (body.data.name == "ip") {
    return JSON.stringify({
      // Note the absence of statusCode
      type: 4, // This type stands for answer with invocation shown
      data: { content: "IP address: 18.217.135.117" },
    });
  }

  // Handle /start Command
  if (body.data.name == "start") {
    try {
      var result;
      var params = {
        InstanceIds: [instanceId],
      };
      console.log("Starting instace");
      var data = await ec2.startInstances(params).promise();
      console.log(data);
      result = "Instance started";

      return JSON.stringify({
        type: 4,
        data: { content: "Started minecraft server" },
      });
    } catch (error) {
      console.error(error);
      return JSON.stringify({
        type: 4,
        data: { content: "Error starting minecraft server" },
      });
    }
  }

  // Handle /stop Command
  if (body.data.name == "stop") {
    try {
      var result;
      var params = {
        InstanceIds: [instanceId],
      };
      console.log("Stopping instance");
      var data = await ec2.stopInstances(params).promise();
      console.log(data);
      result = "instance stopped ";

      return JSON.stringify({
        type: 4,
        data: { content: "Stopped minecraft server" },
      });
    } catch (error) {
      console.error(error);
      return JSON.stringify({
        type: 4,
        data: { content: "Error stopping minecraft server" },
      });
    }
  }

  return {
    statusCode: 404, // If no handler implemented for Discord's request
  };
};
