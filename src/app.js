const express = require("express");

const app = express();



app.use("/test", (req, res) => {
    res.send("hiii this is shree")
})

app.use("/hello" , (req, res) => {
    res.send("helllllloooooooooooo")
})

app.use("/",(req, res) => {
    res.send("hello from server2")
})



app.listen(3000, ()=> {
    console.log('sever is listening on port 3000')
});