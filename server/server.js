const express = require("express");
const exerciseData = require("./api/exercise_data_en.json");
const { registerUser, registerUserData, getUserData } = require("./api/db.mongo");
const { getUser } = require("./api/db.mongo");
const jsonData = require("./api/foodData.json");
const path = require("path");
const NodeCache = require("node-cache");
const bcrypt = require("bcrypt");
const cache = new NodeCache();
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const generateAccessToken = (userId) => {
  console.log("Generating access token for user " + userId);
  const accessToken = jwt.sign({ userId }, "_N0C0mpaRt1r", { expiresIn: "1h" });
  return accessToken;
};

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
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "_N0C0mpaRt1r");
    req.user = decoded.userId;
    next();
  } catch (error) {
    console.error("Error validating token:", error.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};


app.use("/gifs", express.static(path.join(__dirname, "gifs")));

app.get("/api/exercises", verifyToken, (req, res) => {
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
      samples[bodyPart] = exercisesForBodyPart.slice(0, 5);
    });

    const data = { samples };
    cache.set(cacheKey, data, 5 * 60);
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

app.get("/api/food/", verifyToken, (req, res) => {
  const { search } = req.query;

  fetchFood(search)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.error("Error al buscar alimentos:", error.message);
      res.status(500).json({ error: "Error al buscar alimentos" });
    });
});

app.post("/auth/login/", async (req, res) => {
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
  const { signUpUsername, signUpEmail, signUpPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(signUpPassword, 10);
    const result = await registerUser(
      signUpUsername,
      signUpEmail,
      hashedPassword
    );

    const token = generateAccessToken(userquery._id);
    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Error occurred while registering user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

app.get("/user/register", verifyToken, async (req, res) => {
  try {
    const { userId, objectiveData, macrosData } = req.body;
    const insertedId = await registerUserData(
      userId,
      objectiveData,
      macrosData
    );

    res
      .status(200)
      .json({ message: "User data registered successfully", insertedId });
  } catch (error) {
    console.error("Error registering user data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while registering user data" });
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
  const { userId, objectiveData, macrosData } = req.body;
  try {
    const insertedId = await registerUserData(userId, objectiveData, macrosData);
    res.status(200).json({ message: "User data registered successfully", insertedId });
  } catch (error) {
    console.error("Error al registrar los datos del usuario:", error);
    res.status(500).json({ error: "Error al registrar los datos del usuario" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
