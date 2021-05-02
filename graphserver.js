/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require("express");
const bodyParser = require("body-parser");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const Event = require("./models/event");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const schema = buildSchema(`
 

type Event {
_id:ID!
title:String!
description:String!
price:Float!
date:String!
creator:User!
}

type User{
    _id:ID!
    email:String!
    password:String
    createdEvents:[Event!]
}

input UserInput{
    email:String!
    password:String!
}


input EventInput{
    title:String!
    description:String!
    price:Float!
    date:String!

    
}

type RootQuery{
    events:[Event!]!
}

type RootMutation {
createEvent (eventInput:EventInput):Event
createUser(userInput:UserInput):User
}



schema{
    query:RootQuery
    mutation:RootMutation
}



`);

const root = {
    events: () => {
        return Event.find()
            .then((res) => {
                return res.map((event) => {
                    return { ...event._doc, _id: event._doc._id.toString() };
                });
            })
            .catch((err) => {
                throw err;
            });
    },
    createEvent: async (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "608dcb1a20e18dfb8421d070"
        });


        let user = await User.findById("608dcb1a20e18dfb8421d070")
        if (!user) throw new Error("User exists");
        else {
            await user.createdEvents.push(event)
            await user.save()
            return event
                .save()
                .then((res) => {
                    console.log(res);

                    return { ...res._doc, _id: res._doc._id.toString() };
                })
                .catch((err) => {
                    console.log(err);
                    throw err;
                });
        }
    },
    createUser: async (args) => {
        let user = await User.findOne({
            email: args.userInput.email,
        });
        if (user) {
            throw new Error("User exists");
        } else
            return bcrypt
                .hash(args.userInput.password, 12)
                .then((hashedPassword) => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword,
                    });
                    return user.save();
                })
                .then((res) => {
                    return { ...res._doc, password: null, _id: res.id };
                })

                .catch((err) => {
                    throw err;
                });
    },
 
};

const app = express();
// app.use(bodyParser.json())
app.get("/", (req, res, next) => {
    res.send("hello!");
});

app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    })
);

app.use(express.static("public"));
mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.pgt19.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err.message);
    });

// type Query {
//     getClassMates(classNo:Int!):String
//     hello:String
//     accountName:String
//     age:Int
//     account(username:String):Account
// }
