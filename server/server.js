const express = require("express");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
require('dotenv').config();
const exerciseData = require("./api/exercise_data_en.json");
const { registerUser, registerUserData, getUserData, registerUserGoogle, checkUser, getUserWeightHeight, getUserMacros, getPrevUserData, updateUser, setUserData } = require("./api/db.mongo");
const { getUser } = require("./api/db.mongo");
const jsonData = require("./api/foodData.json");
const path = require("path");
const NodeCache = require("node-cache");
const bcrypt = require("bcrypt");
const cache = new NodeCache();
const jwt = require("jsonwebtoken");
const { error } = require("console");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      let user = getUser(profile.id);

      if (!user) {
        user = await registerUserGoogle(
          profile.id,
          profile.displayName,
          profile.emails[0].value
        );
      }

      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }
));


const generateAccessToken = (userId) => {
  console.log("Generating access token for user " + userId);
  const accessToken = jwt.sign({ userId }, "_N0C0mpaRt1r", { expiresIn: "1h" });
  return accessToken;
};

function getRandomExercises(exercises, count) {
  const shuffledExercises = exercises.sort(() => Math.random() - 0.5);
  return shuffledExercises.slice(0, count);
}

async function fetchFood(query) {
  try {
    const searchQueryNormalized = query.trim().toLowerCase();
    const searchWords = searchQueryNormalized.split(/\s+/);

    const foundItems = [];

    for (const category of jsonData) {
      for (const item of category.items) {
        if (
          searchWords.some(
            (searchWord) =>
              item.name.toLowerCase().startsWith(searchWord) &&
              !foundItems.some((foundItem) => foundItem.name === item.name)
          )
        ) {
          foundItems.push(item);
        }
      }
    }

    return Promise.resolve({ items: foundItems });
  } catch (error) {
    console.error("Error al buscar alimentos:", error.message);
    return Promise.reject(error);
  }
}

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return passport.authenticate('google', { session: false })(req, res, next);
    // return res
    //   .status(401)
    //   .json({ success: false, message: "No token provided" });
  }
  
  const token = authHeader.split(" ")[1];
  if (token === null || authHeader === ""){
    console.error("Error validating token:", error.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

  try {
    const decoded = jwt.verify(token, "_N0C0mpaRt1r");
    req.user = decoded.userId;
    next();
  } catch (error) {
    console.log(token)
    console.error("Error validating token:", error.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};


app.use("/gifs", express.static(path.join(__dirname, "gifs")));

app.get("/api/exercises", (req, res) => {
  const { search, bodyPart, perPage, page, filter } = req.query;
  const cacheKey = JSON.stringify(req.query);

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  let filteredExercises = exerciseData;

  if (search) {
    filteredExercises = filteredExercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (bodyPart) {
    filteredExercises = filteredExercises.filter(
      (exercise) => exercise.bodyPart.toLowerCase() === bodyPart.toLowerCase()
    );
  }

  if (filter && filter.length > 0) {
    filteredExercises = filteredExercises.filter((exercise) =>
      filter.includes(exercise.bodyPart.toLowerCase())
    );
    filteredExercises.sort((a, b) => {
      if (a.bodyPart.toLowerCase() < b.bodyPart.toLowerCase()) {
        return -1;
      }
      if (a.bodyPart.toLowerCase() > b.bodyPart.toLowerCase()) {
        return 1;
      }
      return 0;
    });
  }
  
  if (!page) {
    let samples = {};
    const uniqueBodyParts = [
      ...new Set(filteredExercises.map((exercise) => exercise.bodyPart)),
    ];
    uniqueBodyParts.forEach((bodyPart) => {
      const exercisesForBodyPart = filteredExercises.filter(
        (exercise) => exercise.bodyPart === bodyPart
      );
      samples[bodyPart] = getRandomExercises(exercisesForBodyPart, 5);
    });
  
    const data = { samples };
    return res.json(data);
  }

  const perPage_fix =
    perPage && perPage > 0 && perPage < 100 ? parseInt(perPage) : 10;
  const currentPage = page && page > 0 ? parseInt(page) : 1;
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = currentPage * perPage;

  const results = filteredExercises.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredExercises.length / perPage_fix);
  const data = { results, totalPages };
  cache.set(cacheKey, data, 5 * 60);
  res.json(data);
});

app.get("/api/food/", (req, res) => {
  const { search } = req.query;

  fetchFood(search)
    .then((result) => {
      res.json(result);
      console.log(result);
    })
    .catch((error) => {
      console.error("Error al buscar alimentos:", error.message);
      res.status(500).json({ error: "Error al buscar alimentos" });
    });
});

app.post("/auth/login", async (req, res) => {
  const { signInUsername, signInPassword } = req.body;
  try {
    const findQuery = signInUsername;
    const userquery = await getUser(findQuery);
    if (!userquery) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(
      signInPassword,
      userquery.password
    );

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }
    const token = generateAccessToken(signInUsername);
    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Error occurred while authenticating user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

app.post("/auth/register", async (req, res) => {
  const { formData } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(formData.userData.password, 10);
    formData.userData.password = hashedPassword;
    delete formData.userData.password_dup;
    console.log(formData);
    const result = await registerUser(formData);
    const token = generateAccessToken(formData.userData.username);
    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Error occurred while registering user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

app.post("/auth/check", async (req, res) => {
  const { username, email } = req.body;
  try {
    const result = await checkUser(username, email);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error occurred while checking user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});



app.get("/user/data", verifyToken, async (req, res) => {
  const userId = req.user;
  try {
    console.log("userId", userId);
    const userData = await getUserData(userId);
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    res.status(500).json({ error: "Error al obtener los datos del usuario" });
  }
});


app.post("/user/data", verifyToken, async (req, res) => {
  const { userId, objectiveData } = req.body;
  try {
    const insertedId = await registerUserData(userId, objectiveData);
    res.status(200).json({ message: "User data registered successfully", insertedId });
  } catch (error) {
    console.error("Error registering user data:", error);
    res.status(500).json({ error: "Error registering user data" });
  }
});

app.get("/user/data/food", verifyToken, async (req, res) => {
  const userId = req.user;
  try {
    const userData = await getUserData(userId);
    res.status(200).json(userData.objectiveData.foodRecords);
  } catch (error) {
    console.error("Error al obtener los datos del user:", error);
    res.status(500).json({ error: "Error al obtener los datos del user" });
  }
});

app.post("/user/data/food", verifyToken, async (req, res) => {
  const userId = req.user;
  const { food } = req.body;
  console.log(userId, food);
  try {
    const userData = await setUserData(userId, food);
    res.status(200).json(userData.foodRecords);
  } catch (error) {
    console.error("Error al obtaining the users data:", error);
    res.status(500).json({ error: "Error al obtaining the users data" });
  }
});

app.post("/verify-token", verifyToken, async (req, res) => {
  try {
    res.status(200).json({ message: 'Token válido' });
  } catch (error) {
    console.error("Error al obtaining the users data:", error);
    res.status(500).json({ error: "Error al obtaining the users data" });
  }
});

app.get("/user/data/weightHeight", verifyToken, async (req, res) => {
  const username = req.user
  try {
    console.log("username", username);
    const userData = await getUserWeightHeight(username);
    if (!userData) {
      return res.status(404).json({ error: "No user records found" });
    }
    const { weight, height } = userData;
    res.status(200).json({ weight, height });
  }
  catch (error) {
    console.error("Error while getting the user data:", error);
    res.status(500).json({ error: "Error while getting the user weight or height" });
  }
});

app.get("/user/data/macros", verifyToken, async (req, res) => {
  const username = req.user;
  try{
    console.log("username: ", username);
    const userData = await getUserMacros(username);
    if (!userData){
      return res.status(404).json({ error: "No user records found" });
    }
    const { weight, height, age, gender, activityLevel, fitnessGoal } = userData
    res.status(200).json({ weight, height, age, gender, activityLevel, fitnessGoal });
  }
  catch (error){
    console.error("Error while getting the user data:", error);
    res.status(500).json({ error: "Error while getting the user macros" });
  }
});

//ARREGLAR CONDICIONES

app.post("/user/data/change", verifyToken, async (req, res) => {
  const user = req.user;
  const { formData } = req.body;
  try{
    const prevUserData = await getPrevUserData(user);
    if (prevUserData){
      const passCompare = await bcrypt.compare(
        formData.userData.password_old,
        prevUserData.password
      );

      console.log(passCompare);
      console.log(formData.userData.password_old !== "");
      console.log(formData.userData.password);
      console.log(formData.userData.password_dup);

      if (passCompare === false){
        return res.status(401).json({ success: false, message: "The old password desn't match" });
      }

      if ((prevUserData.password === formData.userData.password) && formData.userData.password_old !== "" && formData.userData.password !== "" && formData.userData.password_dup !== ""){
        return res.status(401).json({ success: false, message: "The new password can't be the same as the previous one!" });
      }

      if ((formData.userData.password !== formData.userData.password_dup) && formData.userData.password_old !== "" && formData.userData.password !== "" && formData.userData.password_dup !== ""){
        return res.status(401).json({ success: false, message: "The new passwords don't match" });
      }

      if ((prevUserData.email === formData.userData.email) && formData.userData.email !== ""){
        return res.status(401).json({ success: false, message: "New email must be different than the previous one" });
      }
  
      if ((formData.userData.email !== formData.userData.email_dup) && formData.userData.email !== "" && formData.userData.email_dup !== ""){
        return res.status(401).json({ success: false, message: "New emails don't match" });
      }
  
      if ((prevUserData.username === formData.userData.username) && formData.userData.username !== ""){
        return res.status(401).json({ success: false, message: "New username must be different than the previous one" });
      }

      if (formData.userData.password_old !== "" && formData.userData.password !== "" && formData.userData.password_dup !== ""){
        const hashedPassword = await bcrypt.hash(formData.userData.password, 10);
        formData.userData.password = hashedPassword;
      }
  
      const updateUserData = await updateUser(formData, user);
      if (!updateUserData){
        return res.status(401).json({ success: false, message: "Could not update the user", });
      }
      return res.status(200).json({success: true, message: "User updated successfully", usernameChanged: updateUserData});
    }
    else{
      return res.status(401).json({ success: false, message: "No user records found" });
    }
  }
  catch (error){
    console.error("Error updating the users data:", error);
    res.status(500).json({ error: "Error updating the users data" });
  }
});

app.get("/user/data/username", verifyToken, async (req, res) => {
  const user = req.user;
  try{
    const userData = await getUser(user);
    if (!userData){
      return res.status(401).json({ success: false, message: "No user found" });
    }
    console.log('Obtained the data from the user succesfully');
    return res.status(200).json(userData);
  }
  catch (error){
    console.error('Run into an error while looking for the user');
    res.status(500).json({ error: "Error geting the users data" });
  }
});

app.post("/user/data/update/token", async (req, res) => {
  const { formData } = req.body;
  try{
    const token = generateAccessToken(formData.userData.username);
    return res.status(200).json({ success: true, token });
  }
  catch (error){
    console.error('Could not update the users token');
    res.status(500).json({ error: "An error ocurred while updating the users token" });
  }
});


app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {  
    res.redirect('/');
  });
  
  app.route('/auth/google/callback')
  .get(passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/create');
});


app.route('create')
  .get(function(req, res){
  })
  .post(function(req, res){
  });

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
