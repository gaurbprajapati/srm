import express from 'express';
import cors from 'cors';
import path from 'path';
import { fstat } from 'fs';
import { config } from 'dotenv';
import userRoute from './routes/userRoute.js';
import clubRoute from './routes/clubRoute.js';
import { connectDB } from './data/dbConnect.js';
import multer from 'multer';
import { ClubModel } from './models/ClubModel.js';
const uploadMiddleware = multer({ dest: "/backend/uploads" });
import { JobModel } from './models/JobSchema.js';
const app = express();

const port = process.env.PORT || 5000;
// Load environment variables
config({
    path: "./data/config.env",
});


app.use(express.json())


// app.use('/api/club', clubRoute)

// app.use(
//     cors({
//         origin: "http://localhost:3000/",
//         // origin: [process.env.FRONTEND_URL],
//         methods: ["GET", "POST", "PUT", "DELETE"],
//         credentials: true,
//     })
// );

app.use(cors());

app.use('/api/user', userRoute)

// Call the function to connect to the database
connectDB();


// console.log(process.env.FRONTEND_URL, "hello");

// if (process.env.NODE_ENV === 'production') {
//     app.use('/', express.static('client/build'))
//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client/build/index.html'));
//     });
// }


//================================================================================================Club ENDPOINTS================================================================================================



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

app.post("/create-club", upload.single("image"), async (req, res) => {
    try {

        if (req.file === undefined) return res.status(422).json("No file uploaded");

        const imageName = req.file.filename;

        const { title, category, discription, observation, achievement, president, vicePresident, memberName, facultyName, announcment, whatup, instagram, linkedin, discord } = req.body;

        const formattedAnnouncements = announcment.map(item => ({
            announcmentName: item.announcmentName,
            announcmentdate: item.announcmentdate
        }));

        const postDoc = await ClubModel.create({
            title,
            category,
            discription,
            achievement,
            observation,
            president,
            vicePresident,
            memberName,
            facultyName,
            announcment: formattedAnnouncements,
            whatup,
            instagram,
            linkedin,
            discord,
            cover: imageName,
        });
        res.json(postDoc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/update-club/:id", upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, discription, observation, achievement, president, vicePresident, memberName, facultyName, announcment, whatup, instagram, linkedin, discord } = req.body;

        const postDoc = await ClubModel.findById(id);

        if (!postDoc) {
            return res.status(404).json({ error: "Club not found" });
        }

        let imageName = "";
        if (!req.file) {
            imageName = postDoc.cover;
        } else {
            imageName = req.file.filename;
        }

        const updatedFields = {
            title,
            category,
            discription,
            achievement,
            observation,
            president,
            vicePresident,
            memberName,
            facultyName,
            whatup,
            instagram,
            linkedin,
            discord,
            cover: imageName,
        };

        if (announcment && announcment.length > 0) {
            updatedFields.announcment = postDoc.announcment.concat(announcment.map(item => ({
                announcmentName: item.announcmentName,
                announcmentdate: new Date(item.announcmentdate)
            })));
        }

        const updatedPostDoc = await postDoc.updateOne(updatedFields, { new: true });

        res.json(updatedPostDoc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/club/:id", async (req, res) => {
    const { id } = req.params;
    const postDoc = await ClubModel.findById(id);
    res.json(postDoc);
});

app.get("/clubs", async (req, res) => {
    const { id } = req.params;
    const postDoc = await ClubModel.find({});
    res.json(postDoc);
});

app.delete("/club/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await ClubModel.findByIdAndRemove(id);
        res.json("post deleted");
    } catch (err) {
        res.json(err);
    }
});

//================================================================================================Job ENDPOINTS================================================================================================

// Create a job
app.post('/create-jobs', async (req, res) => {
    try {
        const job = new JobModel(req.body);
        await job.save();
        const alljobs = await JobModel.find();
        res.status(201).send(alljobs);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Get all jobs
app.get('/jobs', async (req, res) => {
    try {
        const jobs = await JobModel.find();
        res.send(jobs);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get a job by ID
app.get('/jobs/:id', async (req, res) => {
    try {
        const job = await JobModel.findById(req.params.id);
        if (!job) {
            return res.status(404).send();
        }
        res.send(jobs);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update a job by ID
app.patch('/jobs/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'company', 'location', 'salary', 'description', 'requirements', 'eligibility', 'linkedin', 'companyWebsite', 'type', 'campus'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const job = await JobModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!job) {
            return res.status(404).send();
        }
        res.send(job);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete a job by ID
app.delete('/jobs/:id', async (req, res) => {
    try {
        const job = await JobModel.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).send();
        }
        // const alljobs = await JobModel.find();
        res.send(job);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
