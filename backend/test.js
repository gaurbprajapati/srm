const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { Schema } = mongoose;

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/yourdbname', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new Schema({
    username: String,
    password: String,
    isAdmin: Boolean
});

const postSchema = new Schema({
    title: String,
    content: String,
    image: String,
    createdBy: String
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../FrontEnd/src/images/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    },
});

const upload = multer({ storage: storage });

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) return res.sendStatus(403);
    next();
};

app.post('/register', async (req, res) => {
    const { username, password, isAdmin } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, isAdmin });
    await user.save();
    res.status(201).send('User registered');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('Cannot find user');

    if (await bcrypt.compare(password, user.password)) {
        const accessToken = jwt.sign({ username: user.username, isAdmin: user.isAdmin }, 'your_jwt_secret');
        res.json({ accessToken });
    } else {
        res.send('Not Allowed');
    }
});

app.post('/addPost', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;
    const post = new Post({ title, content, image, createdBy: req.user.username });
    await post.save();
    res.status(201).json(post);
});

app.put('/editPost/:id', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send('Post not found');

    post.title = title;
    post.content = content;
    if (image) post.image = image;
    await post.save();
    res.json(post);
});

app.get('/getPosts', authenticateToken, async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});