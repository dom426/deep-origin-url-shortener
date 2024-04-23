# URLittle - The best in URL shortening!

**This web application has the primary objective of simplifying any URL down to a six-character alias appended to the end of its domain for better shareability of those more complicated URLs out there. On top of this, users may create their own account to view a dashboard where they can see how many times any of their previously shortened URLs have been visited, adjust the alias of their shortened URLs, navigate to them, or simply copy them to share around.**

# User Interface

There are several pages that may be navigated, and the website is rather simple. You may use just the index page to shorten URLs, copy them, and navigate to them without ever leaving it. You can also create an account, login, and navigate to the dashboard to view all previously shortened URLs while logged in. These may be adjusted by double-clicking within the Alias cell of any row and editing the text within.

# Installation & Run

1. Ensure that you have <a href="https://nodejs.org/en/download">NodeJS (lts)</a>, <a href="https://www.docker.com/get-started/">Docker</a>, and <a href="https://code.visualstudio.com/download">VS Code</a> installed as these are the tools used during development.
2. Grab the PostgreSQL docker image <a href="https://hub.docker.com/_/postgres">here</a> and follow the instructions to stand it up. To run it with the settings this project uses, run the following command:
   `docker run -d --name deep-origin -p 5432:5432 -e POSTGRES_PASSWORD=deepOrigin123 postgres`
3. Once the database container is set up, make sure to run the container itself before proceeding.
4. Clone the repository down to local, and run within VS Code. Within the workspace root, run the following command to install all required packages: `npm install`
5. To run both the server and client in tandem: `npx nx run-many -t dev serve -p url-shortener-app url-shortener-api`. This will start the server on port 3000, and the client on port 5000. Instead, to run separately, the server may be run with the command `npm run server` and the client with `npm run client`.
6. Either press F5 on keyboard or manually navigate within a web browser of your choice to http://localhost:5000 to start using the application!

# Credits

<a alt="TypeScript logo" href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"><img alt="TypeScript" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/2048px-Typescript_logo_2020.svg.png" width="45"></a>
**TypeScript:** _JavaScript with syntax for types._ https://www.typescriptlang.org
<br>
TypeScript is the primary language of the web application on both server and client.

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img alt="NX" src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>
**Nx:** _A build system with built-in tooling and advanced CI capabilities._ https://nx.dev
<br>
Nx retains the organization and structure of the workspace as a whole.

<a alt="NextJS logo" href="https://nextjs.org/" target="_blank" rel="noreferrer"><img alt="NextJS" src="https://camo.githubusercontent.com/9771a2d4a7366d3c6d4793e17104eba9e88f0aec82f7165bfe6871455c26cb2c/68747470733a2f2f6173736574732e76657263656c2e636f6d2f696d6167652f75706c6f61642f76313636323133303535392f6e6578746a732f49636f6e5f6461726b5f6261636b67726f756e642e706e67" width="45"></a>
**NextJS:** _The React Framework for the Web_ https://nextjs.org
<br>
NextJS leveraged as the front-end application to build out all pages within the website.

<a alt="NestJS logo" href="https://nestjs.com/" target="_blank" rel="noreferrer"><img alt="NestJS" src="https://nestjs.com/logo-small-gradient.76616405.svg" width="45"></a>
**NestJS:** _A progressive Node.js framework for building efficient, reliable and scalable server-side applications._ https://nestjs.com
<br>
The API backend, its controllers, and routes are written with NestJS.

<a alt="Prisma logo" href="https://www.prisma.io/" target="_blank" rel="noreferrer"><img alt="Prisma" src="https://prismalens.vercel.app/header/logo-white.svg" width="45"></a>
**Prisma:** _Provides the best experience for your team to work and interact with databases._ https://www.prisma.io
<br>
An Object Relational Mapper (ORM) that allows for out-of-the-box migration automation and connection to the database.

<a alt="Postgresql logo" href="https://www.postgresql.org/" target="_blank" rel="noreferrer"><img alt="Postgresql" src="https://www.postgresql.org/media/img/about/press/elephant.png" width="45"></a>
**Postgresql:** _Provides the best experience for your team to work and interact with databases._ https://www.postgresql.org
<br>
This is the relational database used in connection with Prisma for all data storage.

**Bcrypt:** https://github.com/kelektiv/node.bcrypt.js
<br>
Allows for simple and fast hashing of account passwords within the application.

<a alt="js-cookie logo" href="https://github.com/js-cookie" target="_blank" rel="noreferrer"><img alt="js-cookie" src="https://avatars.githubusercontent.com/u/11557446?s=200&v=4" width="45"></a>
**js-cookie:** https://github.com/js-cookie
<br>
Allow for storage of cookies in the browser which assists with retaining user data upon logging in.

<a alt="zod logo" href="https://zod.dev/" target="_blank" rel="noreferrer"><img alt="zod" src="https://zod.dev/logo.svg" width="45"></a>
**zod:** _TypeScript-first schema validation with static type inference._ https://zod.dev
<br>
Utilized to keep to the json:api specification when building request and response types for the API.

<a alt="mui logo" href="https://mui.com/x/react-data-grid/" target="_blank" rel="noreferrer"><img alt="mui" src="https://camo.githubusercontent.com/f1711f466b9bbd685dafb7e109ee186ff126bb8b100eee77c600cdef7f522640/68747470733a2f2f6d75692e636f6d2f7374617469632f6c6f676f2e737667" width="45"></a>
**mui:** _Move faster with intuitive React UI tools._ https://mui.com/x/react-data-grid
<br>
The MUI Data Grid is utilized on the Dashboard screen of the website for displaying and editing shortened URLs associated with the user's account.

<a alt="nodeJS logo" href="https://nodejs.org/en" target="_blank" rel="noreferrer"><img alt="nodeJS" src="https://avatars.githubusercontent.com/u/9950313?s=48&v=4" width="45"></a>
**nodeJS:** _Run JavaScript Everywhere._ https://nodejs.org/en
<br>
Utilized as the backbone of the web application.

<a alt="Docker logo" href="https://www.docker.com/" target="_blank" rel="noreferrer"><img alt="Docker" src="https://avatars.githubusercontent.com/u/5429470?s=200&v=4" width="45"></a>
**Docker:** _Docker helps developers build, share, run, and verify applications anywhere — without tedious environment configuration or management._ https://www.docker.com
<br>
Docker container used for the database for easy management.

<a alt="json:api specification logo" href="https://jsonapi.org/" target="_blank" rel="noreferrer"><img alt="json:api" src="https://img.stackshare.io/service/8578/UdFPGKd5_400x400.jpg" width="45"></a>
**json:api specification:** _A specification for building APIs in JSON._ https://jsonapi.org
<br>
The specification followed for all requests and responses to and from the API.

<a alt="eslint logo" href="https://eslint.org/" target="_blank" rel="noreferrer"><img alt="eslint" src="https://eslint.org/icon-512.png" width="45"></a>
**eslint:** _Find and fix problems in your JavaScript code._ https://eslint.org
<br>
Linter that allows for discovering code issues while developing.

<a alt="prettier logo" href="https://prettier.io/" target="_blank" rel="noreferrer"><img alt="prettier" src="data:image/png;base64,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" width="45"></a>
**prettier:** _An opinionated code formatter._ https://prettier.io/
<br>
Properly tabs and spaces code upon saving a file automatically to keep things looking clean.
