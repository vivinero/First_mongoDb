const express = require('express')
const port = 3200;
const  mongoose = require('mongoose');
const app = express()
app.use(express.json());

const studentData = new mongoose.Schema({
    name: {
    type: String,
    require: [true, "Name is required, kindly fill in your name"]
    },

    userName: {
    type: String,
    unique: [true, "the username already exist"],
    require: [true, " kindly enter your username"]
    },

    age: {
    type: Number,
    require: [true, "enter your age"]
    },

    scores: {
    type: Object,
    require: [true, "fill in your score"]
    },

    ismarried: {
    type: Boolean
    },

    subject: {
    type: Array,
    require: [true, "kindly fill your subject"]
    }

}, {timeStamps: true})

    const studentModel = mongoose.model("student", studentData)

//create an endpoint

    app.get("/", (req, res)=>{
        console.log("Welcome")
    });
//create user

    app.post("/createStudent", async (req, res)=> {
        try {

            const newUser = await studentModel.create(req.body);
            if (!newUser) {
                res.status(400).json("unable to create user")
            }else{
                res.status(201).json({
                    message: `user ${newUser.name} has been created successfully`,
                    data: newUser,
                })
            }
        } catch (error) {
            res.status(400).json(error.message)
        }
    });
//get all student
app.get("/getall", async (req, res)=>{
    try {
        const allUser = await studentModel.find().select(["userName", "name", "age"])
        if (allUser.length === 0) {
            res.status(200).json({
                message: "no user created"
            })
        } else {
            res.status(200).json({
                message: `you have ${allUser.length} existing user`,
                allUser
            });
        }
    } catch (error) {
        res.status(404).json(error.message)
    }
});

//get one

    app.get("/getone/:id", async (req, res) => {
        const id = req.params.id
        try {
            const oneUser =  await studentModel.findById(id).select(["userName", "name", "age"]);
            if (!oneUser) {
                res.status(404).json({
                    message: `user not found`
                })
            }else{
                res.status(200).json({
                    message: `data found`,
                    oneUser
                })
            }
        } catch (error) {
            res.status(404).json(`${error.message}`)
        }
    });

    // get user by username
app.get("/getsingle/:username", async (req, res) =>{
    const userName = req.params.username
    try {
        const oneUser = await studentModel.findOne({userName})
        if (!oneUser) {
            res.status(404).json({
                message: `student not found`
            })
        }else{
            res.status(200).json({
                message: `user found`,
                oneUser,
                
            })
        }
    } catch (error) {
        res.status(404).json(`${error.message}`)
    }
})

//find user by user's age
app.get("/getage/:age", async (req, res)=> {
    const age = req.params.age
    try {
        const userAge = await studentModel.findOne({age})
        if (!userAge) {
            res.status(404).json({
                message: `User's age not found`
            })
        }else{
            res.status(200).json({
                message: `user's age is ${userAge}`,
                userAge,
            })
        }
    } catch (error) {
        res.status(500).json(`${error.message}`)
    }
})

//update user's list

app.put("/update/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const updateUser = await studentModel.findByIdAndUpdate(userId,req.body,{new:true})
        res.status(200).json({
            message: `updated successfully`,
            updateUser
        })
    } catch (error) {
        res.json(error.message)
    }
});

//delete user
app.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id
        const delUser = await studentModel.findOneAndDelete(id)
        const  allUser = await studentModel.find()
        if (!delUser) {
            res.status(404).json({
                message: `no user was found`
            })
        }
        res.status(200)
        res.json({
            message: `${delUser.userName} has been deleted successfully`,
            delUser,
            allUser,
        })
    } catch (error) {
        res.json(error.message)
    }
})



mongoose.connect("mongodb+srv://viviannzemeke:i10yCgMhrdGkvGAT@cluster0.hreycm6.mongodb.net/").then(()=>{
    console.log(`database is successful`)
}).catch((err)=> {
    console.log(`unable to connect ${err}`)
})


app.listen(port, ()=> {
    console.log(`server is listening on port :${port}`)
})