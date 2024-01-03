// //api folder is a requirement of next js and this is why we are using this folder structure
// const app = require('express')();
// const router = require("../routes/router")
// const apiRouter = require("express").Router();
const students = require("../routes/students")

// apiRouter.get("/students",students)
// app.use("/api",apiRouter);



// app.get("/test",(req,res)=>{
//     var apiRoutes = apiRouter.stack.map(function(r){
//         if (r.route && r.route.path){
//           return r.route.path
//         }
//       })

//     var appRoutes = app._router.stack.map(function(r){
//         if (r.route && r.route.path){
//           return r.route.path
//         }
//       })
    
//     res.json([...apiRoutes , ...appRoutes])
    
// })

// module.exports = app;

const app = require('express')();


app.get('/api', students);

// app.get('/api/item/:slug', (req, res) => {
//   const { slug } = req.params;
//   res.end(`Item: ${slug}`);
// });

module.exports = app;