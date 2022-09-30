const { QueryCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
const express = require("express");
const { dbClient } = require("../dynamodb/client");
const router = express.Router();
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const rootHandler = async (req, res) => {
    try {
      const users = await queryUsers();
      res.send(users);
      console.log("users are: ", JSON.stringify(users));
    } catch (error) {
      res.send(error);
      console.log("error occured!!: ", error);
    }
  };
  router.get("/", rootHandler);
const queryUsers = async () => {
const TableName = "UserTable";
  const command = new ScanCommand({
    TableName,
    Limit: 10,
  });
  try {
    const response = await dbClient.send(command);
    return JSON.stringify((response.Items));
  } catch (error) {
    console.error(
      `Failed to fetch data from DynamoDB. Error: ${error}`
    );
    return null;
  }
};

exports.rootRouter = router;