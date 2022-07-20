const express = require("express");
const app = express();
const path=require("path");
const hbs= require("hbs");
require("./db/conn")
const Register= require("./models/registers")
const port= process.env.port || 3000;
const static_path = path.join(__dirname,"../public")
const template_path = path.join(__dirname,"../templates/views")
const partial_path = path.join(__dirname,"../templates/partials")
//console.log(path.join(__dirname,"../public"))
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path))
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path)

app.get("/",(req,res)=>{
    res.render("index")
});
app.get("/register",(req,res)=>{
    res.render("register")
});


app.post("/register",async (req,res)=>{
    try {
       const registerUser= new Register({
        Name: req.body.Name,
        Email: req.body.Email,
        Password: req.body.Password
       })
       const registered = await registerUser.save();
       res.status(201).render("index");
        
    } catch (error) {
        res.status(400).send(error);
    }
});
app.get("/login",(req,res)=>{
    res.render("login")
});

app.post("/login",async (req,res)=>{

    try {
        const Email=req.body.Email;
        const Password=req.body.Password;
        //console.log(`${Email} and passwod is ${Password}`)
        const useremail=await Register.findOne({Email:Email});
        if(useremail.Password === Password){
            res.status(201).render("index");
        }
        else
        res.send("Invalid Login Details");
        


        
    } catch (error) {
        res.status(400).send("Invalid Login Details");
    }
});



app.listen(port, () =>{
    console.log(`server is running at port no ${port}`);
})