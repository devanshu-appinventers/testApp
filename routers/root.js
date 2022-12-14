const { QueryCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
const express = require("express");
const { dbClient } = require("../dynamodb/client");
const router = express.Router();
// const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const rootDocs = `
user following routes to work with api\n

  type	  route	      description	                    format \n
			
\nget	    /users	    get all the users in dynamodb	
\nput	    /signUp	    login request	                  {'username':string, 'password':string}
\npost	  /login	    sign up request	                {'username':string, 'password':string, 'name':string}
\npatch	  /updateUser	update user request	            {'username':string, 'password':string, 'name':string}
\ndelete	/deleteUser	delete user	                    {'username':string}
`;
const rootHandler = (req, res) => {
  res.send(rootDocs);
};
const usersHandler = async (req, res) => {
  try {
    const users = await queryUsers();
    users ? res.send(users) : res.status(500).send("server failed to response");
    console.log("fetched users are: ", JSON.stringify(users));
  } catch (error) {
    res.status(500).send(JSON.stringify(error));
    console.log("error occured!!: ", error);
  }
};

router.get("/", rootHandler);
router.get("/users", usersHandler);

const queryUsers = async () => {
  const TableName = "userdb";
  const command = new ScanCommand({
    TableName,
    Limit: 10,
  });
  try {
    const response = await dbClient.send(command);
    return JSON.stringify(response.Items);
  } catch (error) {
    console.error(`Failed to fetch data from DynamoDB. Error: ${error}`);
    return null;
  }
};

exports.rootRouter = router;
