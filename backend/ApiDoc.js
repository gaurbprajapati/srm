// User APIs
// Endpoint for user login
router.post("/api/user/login", userLogin);

// Endpoint for user registration
router.post("/api/user/register", userRegister);

// Endpoint for updating user details
router.post("/api/user/update", userUpdate);

// Endpoint for testing
router.get("/api/user/test", check);


// Club APIs
// Endpoint for creating a new club
app.post("/create-club", createClub);

// Endpoint for updating club details by ID
app.put("/update-club/:id", updateClub);

// Endpoint for getting a club by ID
app.get("/club/:id", getClubById);

// Endpoint for getting all clubs
app.get("/clubs", getAllClubs);

// Endpoint for deleting a club by ID
app.delete("/club/:id", deleteClub);


// Job APIs
// Endpoint for creating a new job
app.post("/create-jobs", createJob);

// Endpoint for getting all jobs
app.get("/jobs", getAllJobs);

// Endpoint for getting a job by ID
app.get("/jobs/:id", getJobById);

// Endpoint for updating a job by ID
app.patch("/jobs/:id", updateJobById);

// Endpoint for deleting a job by ID
app.delete("/jobs/:id", deleteJobById);
