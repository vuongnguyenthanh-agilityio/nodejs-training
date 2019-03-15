# Node.js Training Plan  
Last updated: *May 10, 2018*  

## Table of contents  
- [Documentation](#documentation)
- [Targets](#targets)
- [Goals](#goals)
- [Timeline](#timeline)
- [Plan](#plan)
- [Big Practice](#big-practice)

## Documentation  
- Ebooks:
    - [ECMAScript 2015](https://leanpub.com/ecmascript2015es6guide/read)
    - [Building API with Node.js](https://drive.google.com/open?id=0B9uZM-BaKxWAcEY0ZThYTnRwMGc)
- References
    - [Setting up ES6](https://leanpub.com/setting-up-es6/read)
    - [Node.js flow control](http://book.mixu.net/node/ch7.html)
    - [Seven Awesome Things You Can Build with Node.js](http://blog.teamtreehouse.com/7-awesome-things-can-build-node-js)
    - [10 things you shouldn't do](https://hashnode.com/post/10-things-you-shouldnt-do-while-running-nodejs-in-production-cisab2fyu0s9oth5341faywcw)


## Targets
- Developer already knows:
    - Javascript
    - Has experience on working with frontend

## Goals
- Understand core modules of Node.js
- Understand the asynchronous & control flow with Node.js
- Be able to create Node.js app to server API using Express.js framework

## Timeline

- 15 days (extra 5-10 days for working on big practice)

## Plan
**Get to know ES**
- If you already learned ES6, you can take a day to review your knowledge about this
section.
- Ebooks: (3 days)
    - [ECMAScript 2015](https://leanpub.com/ecmascript2015es6guide/read)
    - [Node.js ES2015 Support](http://node.green/)

### Building APIs with Node.js
- Ebook
    - [Building API with Node.js](https://drive.google.com/open?id=0B9uZM-BaKxWAcEY0ZThYTnRwMGc)
- Timeline
    - 12 days
- Versioning
    - Node.js v8.x
    - Express.js v4.x

**Chapter 1: Introduction to Node.js**
- A brief intro of Node.js. There are 3 keywords you should consider while reading this chapter:
    - Single-thread
    - Event-loop
    - Asynchronous
        
**Chapter 2: Setting up the environment**
- The target of this chapter is not about install Node.js to your machine but using nvm to control
your Node.js versions.

**Chapter 3: Managing modules with NPM**
- After this chapter you will understand about NPM, know how to use its command. Create a
package json file and its properties.
- Practice: (1 day)
    - Setup ​ **nvm** ​ on your machine
    - Run example ES6 code with Node v0.10, v0.12, v4, v6, v8, v10
    - Try to use ​ **nvm** ​to switch between Node.js version and run your sample code.
    - Create a package.json file
        - Use command to add module to package.json
        - Add start script for package.json file

**Chapter 4: Building an API** ​ **[IMPORTANT]**
- Introduce you to Express.js, a framework of Node.js. After this chapter, you should be able to
create a small app with Express.js and serve an dummy API with it.
- Practice: (1 day)
    - Create your first Express.js app
    - Implement a static API which returns an array of objects
    - Start your app and verify your API
    
**Chapter 5: Working with SQL databases**
- This chapter is about connecting Express.js with SQL database and creating models.

**Chapter 6: CRUDify API resources** ​ **[IMPORTANT]**
- You will learn to create CRUD API with Express.js and database models. I suggest you to look
at how the book choose the methods and urls and compare them with RESTful.
- Practice: (2 days)
    - Setup SQL database and connect your app with the database
    - Create your model and connect your APIs with your model
    - Implement the CRUDify APIs for your model
        - GET /api/[model]
        - GET /api/[model]/:id
        - POST /api/[model]
        - PUT /api/[model]
        - DELETE /api/[model]
    - Run your app and verify your APIs

**Chapter 7: Authenticating users** ​ **[IMPORTANT]**
- Writing API is great but you need to secure your APIs as well. This chapter will help you to do it
with Node.js authentication module JWT.
 - Practice: (2 days)
    - Create user model for your app
    - Implement authentication with your user model
    - Secure your APIs with your authentication
    - Generate token for authenticated users

**Chapter 8+9: Testing the application** ​ **[IMPORTANT]**
- Testing is important and helpful for your API too. With these 2 chapters you will not only learn
how to setup testing for Node.js but also learn about testing theory too.

**Chapter 10: Documenting the API**
- Quote from the book: “In this chapter, we’ll learn how to write and generate a pretty API
documentation, after all, it is a good practice to provide documentation about how the client
applications can connect to consume the data from an API. The coolest thing is that we are
going to use a very simple tool and all the documentation of our application will be built using
code’s comment.”
- Practice: (2 days)
    - Setup testing environment for your APIs
    - Implement test cases for all of your APIs
    - Setup documentation for your APIs
        - Your api doc page should be: ​http://[your-host]:[port]/apidoc
        - Think about versioning your API docs

**Chapter 11: Preparing the production environment** ​ **[IMPORTANT]** (1 day)
- I can’t overstate how important this is, but running your app in production is very different from
your machine. So my advice is you should read this carefully and think about all the things and
effect to your app on production environment.
- After this chapter, I hope you can get the idea that we should be prepared for production from
the day one.

**Chapter 12 +13: Building the client-side app**
- This is the final chapter, you will learn how to connect to your APIs and use them in frontend
side. Don’t take this easy, this help you to think as a frontend dev and to do so, you will learn
what does a frontend dev need from the backend.
- Practice: (2 days)
    - Build your frontend app to connect to your APIs
    - Implement UI to use all of your APIs
    - Run your app & verify your APIs by frontend

**Wrapping up** (1 day)
- We will have knowledge summary and code review to evaluate your training and decide the
next step for you.
- I think this book will teach you more than Node.js language itself, but also about the Backend
knowledge. I hope you enjoy reading and practicing with it.

## Big Practice

- Supporter and Trainee will discuss and unified about big practice content. Timeline for this
practice should be around 1-2 weeks.

