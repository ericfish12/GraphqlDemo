const express = require ('express');
const {buildSchema} = require ('graphql');
const {graphqlHTTP} = require('express-graphql');

const schema = buildSchema(`
type Account{
name:String
age:Int
sex:String
department:String
}
type Query {
    hello:String
    accountName:String
    age:Int
    account:Account
}
`)

const root = {
    hello:()=>{
return 'hello world';

    },
    accountName:()=>{
        return "One of these days";
    },

    age: ()=>{

        return 24;
    },
    account:()=>{
        return {
            name: "Fish",
            age:"18",
            gender:"male",
            department:"Antra"
            
        }
    }
}

const app = express();
app.use('/graphql', graphqlHTTP({
    schema:schema,
    rootValue:root,
    graphiql:true
}))
app.listen(3000);