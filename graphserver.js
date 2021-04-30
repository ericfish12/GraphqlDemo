const express = require("express");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");

const schema = buildSchema(`
type Account{
name:String
age:Int
gender:String
department:String
salary(city:String):Int
}
type Query {
    getClassMates(classNo:Int!):String
    hello:String
    accountName:String
    age:Int
    account(username:String):Account
}
`);

const root = {
  getClassMates({classNo}) {
    const obj = {
      1: "Alex",
      2: "Michaelle",
      3: "Jack",
      4: "Thanh",
      5: "Jason",
      6: "Siyi",
      7: "Sidney",
      8: "Laurance",
    };

    return obj[classNo];
  },

  hello: () => {
    return "hello world";
  },
  accountName: () => {
    return "One of these days";
  },

  age: () => {
    return 24;
  },
  account({ username }) {
    const name = username;
    const gender = "man";
    const age = 18;
    const department = "Antra";
    const salary = ({ city }) => {
      return 99999;
    };

    return {
      name,
      age,
      gender,
      department,
      salary,
    };
  },
};

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.use(express.static("public"));
app.listen(3000);
