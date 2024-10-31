const express = require('express');
const cors = require("cors");
const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');
const {authenticationToken} = require('./utilities');

require('dotenv').config();

const app = express();

const User = require('./models/userModel');
const Note = require("./models/noteModel");

mongoose.connect(process.env.MONGO_DB, {});

app.use(express.json());
app.use(cors({
    origin: "*"
}));

app.get("/", (req, res) =>{
    res.json({data: "hello"});
});

// create account
app.post("/create-account", async(req, res)=>{
    const {fullName, email, password} = req.body;
    if(!fullName){
        return res.status(400).json({
            error: true,
            message: "Full name is required!"
        });
    }
    if (!email) {
      return res.status(400).json({
        error: true,
        message: "Email is required!",
      });
    }
    if (!password) {
      return res.status(400).json({
        error: true,
        message: "Password is required!",
      });
    }

    const isUser = await User.findOne({email: email});
    if(isUser){
        return res.json({
            error: true,
            message:"User already exists!"
        });
    }
    const user = await User({
        fullName, email, password
    });
    
    await user.save();
    const accessToken = jwt.sign({ user }, process.env.jwt_secret, {
        expiresIn: "36000m"
    });

    return res.status(200).json({
        error: false,
        user,
        accessToken,
        message:"Registration successful!"
    })

})

// login
app.post('/login', async(req, res)=>{
    const {email, password} = req.body;
    if(!email){
        res.status(400).json({
            error: true,
            message:"Please enter an email."
        });
    }
    if (!password) {
      res.status(400).json({
        error: true,
        message: "Please enter password.",
      });
    }

    const userInfo = await User.findOne({email: email});
    if(!userInfo){
        res.status(400).json({
            message: "User not found!"
        });
    }
    if(userInfo.email === email && userInfo.password === password){
        const user = {user: userInfo};
        const accessToken = jwt.sign(user , process.env.jwt_secret, {
          expiresIn: "36000m",
        });
        return res.status(200).json({
          error: false,
          message: "Login successful!",
          email,
          accessToken,
        });
    }
    else{
        return res.status(400).json({
            error: true,
            message: "Login unsuccessful"
        });
    }
})

// get user
app.get("/get-user", authenticationToken, async (req, res) => {
  const { user } = req.user;

  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    res.status(401).json({
      message: "User not found!",
    });
  }
    return res.status(200).json({
      user: {
        fullName: isUser.fullName,
        email: isUser.email,
        _id: isUser._id,
        createdOn: isUser.createdOn,
      },
      message:"User found!"
    });
});

// add note
app.post('/add-note', authenticationToken, async(req, res)=>{
    const {title, content, tags} = req.body;
    const {user} = req.user;

    if(!title){
        res.status(400).json({
          error: true,
          message: "Title is required",
        });
    }
    if (!content) {
      res.status(400).json({
        error: true,
        message: "Content is required",
      });
    }
    try {
        const note = new Note({
            title, content, tags: tags || [],
            userId: user._id
        });
        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added successfully."
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
})

// edit note
app.post("/edit-note/:noteId", authenticationToken, async (req, res) => {
  const noteId = req.params.noteId;
  const {title, content, tags, isPinned} = req.body;
  const {user} = req.user;

  if(!title && !content && !tags){
    return res.status(400).json({
        error: true,
        message: "No changes provided."
    });
  }
  try {
    const note = await Note.findOne({_id: noteId, userId: user._id});
    if(!note){
        return res.status(404).json({
            error: true,
            message:"Note not found."
        });
    }

    if(title) note.title = title;
    if(content) note.content = content;
    if(tags) note.tags = tags;
    if(isPinned) note.isPinned = isPinned;

    await note.save();
    return res.status(200).json({
        error: false,
        message: "Note Updated Successfully.",
        note
    });
  } catch (err) {
    return res.status(500).json({
        error: true,
        message: "Internal Server Error."
    });
  }
});

// get all notes
app.get('/get-all-notes', authenticationToken,async(req, res)=>{
    const {user} = req.user;

    try {
        const notes = await Note.find({
            userId: user._id
        }).sort({isPinned: -1});

        return res.json({
            error: false,
            notes,
            message: "All notes received successfully."
        });
    } catch (err) {
        return res.status(500).json({
          error: true,
          message: "Internal Server Error.",
        });
    }
});

// delete note
app.delete("/delete-note/:noteId", authenticationToken, async (req, res) => {
    const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const note = await Note.findOne({
        _id: noteId,
      userId: user._id,
    });

    if(!note){
        return res.status(404).json({
            error: true,
            message: "Note not found."
        });
    }
    await Note.deleteOne({_id: noteId, userId: user._id});

    res.json({
        error: false,
        message:"Note deleted successfully."
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error.",
    });
  }
});

// update isPinned value
app.put("/update-note-pinned/:noteId", authenticationToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;
  const {isPinned} = req.body;

  try {
    const note = await Note.findOne({
      _id: noteId,
      userId: user._id,
    });

    if (!note) {
      return res.status(404).json({
        error: true,
        message: "Note not found.",
      });
    }

    note.isPinned = isPinned;

    await note.save();

    res.json({
      error: false,
      message: "Note's pinned value updated successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error.",
    });
  }
});

// search notes
app.get(
  "/search-notes/",
  authenticationToken,
  async (req, res) => {
    const { user } = req.user;
    const { query } = req.query;

    if(!query){
      return res.status(400).json({
        error: true,
        message: "Search query is required."
      });
    }

    try{
      const matchingNotes = await Note.find({
        userId: user._id,
        $or:[
          {title:{$regex: new RegExp(query, 'i')}},
          {content: {$regex: new RegExp(query, "i")}},
        ]
      });
      return res.json({
        error: false,
        notes: matchingNotes,
        message: "Notes matching the search query retrieved successfully."
      });
    } catch (err) {
      return res.status(500).json({
        error: true,
        message: "Internal Server Error.",
      });
    }
  }
);

app.listen(process.env.Port, ()=>{
    console.log("Server running");
});
module.exports = app;

