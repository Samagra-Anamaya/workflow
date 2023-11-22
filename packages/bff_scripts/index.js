const axios = require("axios");
const csv = require("csv-parser");
const fs = require("fs");
const { find } = require("lodash");

const FUSION_AUTH_BASE_URL = "";
const FUSION_AUTH_ENDPOINT = "/api/signup";
const users = [];
const _users = {};
const HEADERS = {
  "x-application-id": "",
  "Content-Type": "application/json",
};

async function create_user_in_fusionauth(user) {
  console.log({ user });
  try {
    const response = await axios.post(
      `${FUSION_AUTH_BASE_URL}${FUSION_AUTH_ENDPOINT}`,
      user,
      { headers: HEADERS }
    );
    console.log({ response });
    console.log(`User ${user.user.email} created successfully!`);
  } catch (error) {
    console.error(
      `Error creating user ${user.user.email}: ${
        error.response ? error.response.data : error.message
      }`
    );
  }
}

function csv_to_users(filename) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filename)
      .pipe(csv())
      .on("data", (row) => {
        // Assuming the CSV has columns 'email', 'password', and 'username'
        const prev = find(users, (prevU) => {
          return prevU.data.gpCode == `${row["gpCode"]}`;
        });
        _users[row["gpCode"]] = {
          ..._users[row["gpCode"]],
          user: {
            password: `pass_${row["gpCode"]}`,
            username: `gp_${row["gpCode"]}`,
            data: {
              ..._users[row["gpCode"]]?.user?.data,
              gpCode: row["gpCode"],
              villages: _users[row["gpCode"]]?.user?.data?.villages
                ? [
                    ..._users[row["gpCode"]]?.user?.data?.villages,
                    {
                      villageCode: row["villageCode"],
                      villageName: row["villageName"],
                    },
                  ]
                : [
                    {
                      villageCode: row["villageCode"],
                      villageName: row["villageName"],
                    },
                  ],
            }
          },
         
          registration: {
            applicationId: "",
            preferredLanguages: ["en"],
            roles: ["enumerator"],
            usernameStatus: "ACTIVE",
          },
        };
      })
      .on("end", () => {
        resolve(users);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

async function main() {
  try {
    const users = await csv_to_users("data2.csv");
    fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error(err);
      }

      console.log("User data saved successfully");
    });
    fs.writeFile("_users.json", JSON.stringify(_users, null, 2), (err) => {
      if (err) {
        console.error(err);
      }

      console.log("_User data saved successfully");
    });

    //console.log({ users });
    // for (const user of users) {
    //   await create_user_in_fusionauth(user);
    // }
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
}

main();
