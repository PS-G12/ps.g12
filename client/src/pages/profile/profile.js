import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave } from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/Header/header.js";
import "./profile.css";
import ProfileNavBar from "../../components/profileNavBar/profileNavBar.js";

const ProfilePrueba = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState();
  const [selectedImage, setSelectedImage] = useState("");
  const [editedGender, setEditedGender] = useState("Male");
  //const [editedSystem, setEditedSystem] = useState("Metric");
  const [tokenFetched, setTokenFetched] = useState(false);
  const [updateTookPlace, setUpdateTookPlace] = useState(false);

  const [username, setUsername] = useState(false);
  const [newToken, setNewToken] = useState(false);
  const [email, setEmail] = useState(false);
  const [weight, setWeight] = useState(false);
  const [height, setHeight] = useState(false);
  const [age, setAge] = useState(false);
  const [cal, setCal] = useState(false);
  const [gender, setGender] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    userData: {
      username: "",
      email: "",
      weight: "",
      height: "",
      kcalGoal: "",
      gender: "",
      age: "",
      pfp: "",
    },
  });

  const [formDataUpdate, setFormDataUpdate] = useState({
    userData: {
      username: "",
      email: "",
      weight: "",
      height: "",
      kcalGoal: "",
      gender: "",
      age: "",
      pfp: "",
    },
  });

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    try {
      const compressedFile = await compressImage(file, 800, 600, 0.8);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onload = function () {
        setSelectedImage(reader.result);
      };
      reader.onerror = function (error) {
        console.error(
          "Run into an error converting the image to base64: ",
          error
        );
      };
    } catch (error) {
      console.error("Error compressing the image:", error);
    }
  };

  const compressImage = (file, maxWidth, maxHeight, quality) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function () {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }

          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            "image/jpeg",
            quality
          );
        };
      };
      reader.onerror = function (error) {
        reject(error);
      };
    });
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setToken(token);
      fetch("/verify-token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            setTokenFetched(true);
            setIsLoggedIn(true);
          } else {
            console.error("Invalid token");
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error verifying token:", error);
        });
    } else {
      setLoading(false);
      console.error("Could not find the token, user not authenticated");
    }
  }, []);

  useEffect(() => {
    if (tokenFetched || updateTookPlace || newToken) {
      setTokenFetched(false);
      setUpdateTookPlace(false);
      setNewToken(false);
      const getUserkcalGoal = async () => {
        try {
          const response = await fetch("/user/data", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (response.ok && data) {
            setFormData((prevState) => ({
              ...prevState,
              userData: {
                ...prevState.userData,
                kcalGoal: data.objectiveData.kcalObjective,
              },
            }));
          } else {
            console.error("Could not fetch the users kcal goal");
          }
        } catch (error) {
          console.error(
            "Run into an error while getting the user kcal goal: ",
            error
          );
          throw error;
        }
      };

      const getUserData = async () => {
        try {
          setLoading(true);
          const response = await fetch("/user/data/info", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (response.ok && data) {
            setFormData((prevState) => ({
              ...prevState,
              userData: {
                ...prevState.userData,
                username: data.userData.username,
                email: data.userData.email,
                weight: data.userData.weight,
                height: data.userData.height,
                gender: data.userData.gender,
                age: data.userData.age,
                pfp: data.userData.pfp,
              },
            }));
            setLoading(false);
          } else {
            setLoading(false);
            console.error("Could not fetch the users data");
          }
        } catch (error) {
          setLoading(false);
          console.error(
            "Run into an error while getting the users data: ",
            error
          );
          throw error;
        }
      };

      getUserkcalGoal();
      getUserData();
    }
  }, [tokenFetched, updateTookPlace, newToken]);

  useEffect(() => {
    if (selectedImage) {
      setFormDataUpdate((prevState) => ({
        ...prevState,
        userData: {
          ...prevState.userData,
          pfp: selectedImage,
        },
      }));
    }
  }, [selectedImage]);

  useEffect(() => {
    if (formDataUpdate.userData.pfp) {
      console.log("si entra al if de pfp");
      changePfp();
    }
  }, [formDataUpdate.userData.pfp]);

  const changePfp = async () => {
    try {
      const response = await fetch("/user/data/pfp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ formDataUpdate }),
      });

      const data = await response.json();

      if (response.ok && data) {
        console.log("Users profile picture updated");
        setUpdateTookPlace(true);
      } else {
        console.error("Could not update the users profile picture");
      }
    } catch (error) {
      console.error(
        "Run into an error while changing the users profile picture",
        error
      );
      throw error;
    }
  };

  useEffect(() => {
    if (username) {
      setLoading(true);
      setUsername(false);
      const updateUsername = async () => {
        try {
          console.log(formDataUpdate.userData.username);
          const response = await fetch("/user/data/update/info/username", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ formDataUpdate }),
          });

          const data = await response.json();

          if (response.ok && data) {
            console.log("Users data updated");
            await updateToken();
          } else {
            console.error("Could not update the users data");
          }
        } catch (error) {
          console.error("Run into an error updating the data: ", error);
          throw error;
        }
      };
      updateUsername();
      setLoading(false);
    }
  }, [username]);

  const updateToken = async () => {
    try {
      sessionStorage.removeItem("token");
      const response = await fetch("/user/data/update/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formDataUpdate }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("New token generated: ", data);
        sessionStorage.setItem("token", data.token);
        setNewToken(true);
        setToken(data.token);
      } else {
        console.error("An error ocurred while sending the data: ", data);
      }
    } catch (error) {
      console.error("Run into an error updating the token: ", error);
    }
  };

  useEffect(() => {
    if (email) {
      setEmail(false);
      const updateEmail = async () => {
        try {
          console.log(formDataUpdate.userData.email);
          const response = await fetch("/user/data/update/info/email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ formDataUpdate }),
          });

          const data = await response.json();

          if (response.ok && data) {
            console.log("Users data updated");
          } else {
            console.error("Could not update the users data");
          }
        } catch (error) {
          console.error("Run into an error updating the data: ", error);
          throw error;
        }
      };
      updateEmail();
      setUpdateTookPlace(true);
    }
  }, [email]);

  useEffect(() => {
    if (weight) {
      setWeight(false);
      const updateWeight = async () => {
        try {
          console.log(formDataUpdate.userData.weight);
          const response = await fetch("/user/data/update/info/weight", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ formDataUpdate }),
          });

          const data = await response.json();

          if (response.ok && data) {
            console.log("Users data updated");
          } else {
            console.error("Could not update the users data");
          }
        } catch (error) {
          console.error("Run into an error updating the data: ", error);
          throw error;
        }
      };
      updateWeight();
      setUpdateTookPlace(true);
    }
  }, [weight]);

  useEffect(() => {
    if (height) {
      setHeight(false);
      const updateHeight = async () => {
        try {
          console.log(formDataUpdate.userData.height);
          const response = await fetch("/user/data/update/info/height", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ formDataUpdate }),
          });

          const data = await response.json();

          if (response.ok && data) {
            console.log("Users data updated");
          } else {
            console.error("Could not update the users data");
          }
        } catch (error) {
          console.error("Run into an error updating the data: ", error);
          throw error;
        }
      };
      updateHeight();
      setUpdateTookPlace(true);
    }
  }, [height]);

  useEffect(() => {
    if (age) {
      setAge(false);
      const updateAge = async () => {
        try {
          console.log(formDataUpdate.userData.age);
          const response = await fetch("/user/data/update/info/age", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ formDataUpdate }),
          });

          const data = await response.json();

          if (response.ok && data) {
            console.log("Users data updated");
          } else {
            console.error("Could not update the users data");
          }
        } catch (error) {
          console.error("Run into an error updating the data: ", error);
          throw error;
        }
      };
      updateAge();
      setUpdateTookPlace(true);
    }
  }, [age]);

  useEffect(() => {
    if (cal) {
      setCal(false);
      const updatekCalGoal = async () => {
        try {
          console.log(formDataUpdate.userData.kcalGoal);
          const response = await fetch("/user/data/update/info/cal", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ formDataUpdate }),
          });

          const data = await response.json();

          if (response.ok && data) {
            console.log("Users data updated");
          } else {
            console.error("Could not update the users data");
          }
        } catch (error) {
          console.error("Run into an error updating the data: ", error);
          throw error;
        }
      };
      updatekCalGoal();
      setUpdateTookPlace(true);
    }
  }, [cal]);

  useEffect(() => {
    if (gender) {
      setGender(false);
      const updateGender = async () => {
        try {
          console.log(formDataUpdate.userData.gender);
          const response = await fetch("/user/data/update/info/gender", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ formDataUpdate }),
          });

          const data = await response.json();

          if (response.ok && data) {
            console.log("Users data updated");
          } else {
            console.error("Could not update the users data");
          }
        } catch (error) {
          console.error("Run into an error updating the data: ", error);
          throw error;
        }
      };
      updateGender();
      setUpdateTookPlace(true);
    }
  }, [gender]);

  const TableRow = ({
    title,
    value,
    isSelector = false,
    options = [],
    onChange,
  }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedValue, setEditedValue] = useState(value);

    const showEditButton = title !== "x";

    const handleEditClick = () => {
      setEditMode(true);
    };

    const handleSaveClick = () => {
      setEditMode(false);
      switch (title) {
        case "UserName":
          setFormDataUpdate((prevState) => ({
            ...prevState,
            userData: {
              ...prevState.userData,
              username: editedValue,
            },
          }));
          setUsername(true);
          break;
        case "Mail":
          setFormDataUpdate((prevState) => ({
            ...prevState,
            userData: {
              ...prevState.userData,
              email: editedValue,
            },
          }));
          setEmail(true);
          break;
        case "Weight (Kg)":
          setFormDataUpdate((prevState) => ({
            ...prevState,
            userData: {
              ...prevState.userData,
              weight: editedValue,
            },
          }));
          setWeight(true);
          break;
        case "Height (cm)":
          setFormDataUpdate((prevState) => ({
            ...prevState,
            userData: {
              ...prevState.userData,
              height: editedValue,
            },
          }));
          setHeight(true);
          break;
        case "Age":
          setFormDataUpdate((prevState) => ({
            ...prevState,
            userData: {
              ...prevState.userData,
              age: editedValue,
            },
          }));
          setAge(true);
          break;
        case "Kcals Goal":
          setFormDataUpdate((prevState) => ({
            ...prevState,
            userData: {
              ...prevState.userData,
              kcalGoal: editedValue,
            },
          }));
          setCal(true);
          break;
        case "Gender":
          setFormDataUpdate((prevState) => ({
            ...prevState,
            userData: {
              ...prevState.userData,
              gender: editedValue,
            },
          }));
          setGender(true);
          break;
        default:
          break;
      }
    };

    return (
      <tr>
        <th>{title}</th>
        <td>
          {editMode ? (
            isSelector ? (
              <select
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                className="input-edit-mode-input"
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                className="input-edit-mode"
              />
            )
          ) : (
            <p className="value">{value}</p>
          )}

          {showEditButton &&
            (editMode ? (
              <button className="save" onClick={handleSaveClick}>
                <FontAwesomeIcon icon={faSave} />
              </button>
            ) : (
              <button className="edit" onClick={handleEditClick}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
            ))}
        </td>
      </tr>
    );
  };

  return (
    <div className="index-page">
      <Header isAuthenticated={isLoggedIn} />
      {loading ? (
        <div className="loader-container">
          <span className="loader"></span>
        </div>
      ) : (
        <div className="profile-box">
          <div className="photo-table">
            <div className="photo-username-section">
              <label htmlFor="upload-photo" className="upload-photo-section">
                <img
                  src={
                    formData.userData.pfp === ""
                      ? "https://previews.123rf.com/images/amitspro/amitspro1706/amitspro170600016/80099376-mandala-de-flor-abstracta-patr%C3%B3n-decorativo-fondo-azul-imagen-cuadrada-imagen-de-ilusi%C3%B3n-patr%C3%B3n.jpg"
                      : formData.userData.pfp
                  }
                  alt="Descripción de la imagen"
                  className="profile-picture"
                ></img>
                <img
                  src="edit.png"
                  alt="Editar"
                  className="edit-icon"
                />
              </label>

              <input
                type="file"
                id="upload-photo"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <ProfileNavBar />
            </div>
            <div className="table-info-section">
              <div className="username-section">
                <h1>
                  {formData.userData.username === null
                    ? "username"
                    : formData.userData.username}
                </h1>
                <h2>
                  {formData.userData.username === null
                    ? "@username"
                    : "@" + formData.userData.username}
                </h2>
              </div>
              <div className="tables-profile">
                <div className="basic-info information-box-profile">
                  <h1>Basic Info</h1>
                  <div className="table-container-profile">
                    <table>
                      <tbody>
                        <TableRow
                          title="UserName"
                          value={
                            formData.userData.username === null
                              ? "username"
                              : formData.userData.username
                          }
                        />
                        <TableRow
                          title="Mail"
                          value={
                            formData.userData.email === null
                              ? "mail@gmail.com"
                              : formData.userData.email
                          }
                        />
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="other-info information-box-profile">
                  <h1>Other Info</h1>
                  <div className="table-container-profile">
                    <table>
                      <tbody>
                        <TableRow
                          title="Weight (Kg)"
                          value={
                            formData.userData.weight === null
                              ? "XX"
                              : formData.userData.weight
                          }
                        />
                        <TableRow
                          title="Height (cm)"
                          value={
                            formData.userData.height === null
                              ? "XX"
                              : formData.userData.height
                          }
                        />
                        <TableRow
                          title="Age"
                          value={
                            formData.userData.age === null
                              ? "XX"
                              : formData.userData.age
                          }
                        />
                        <TableRow
                          title="Kcals Goal"
                          value={
                            formData.userData.kcalGoal === null
                              ? "xxxx"
                              : formData.userData.kcalGoal
                          }
                        />
                        <TableRow
                          title="Gender"
                          value={
                            formData.userData.gender === null
                              ? editedGender
                              : formData.userData.gender
                          }
                          isSelector={true}
                          options={["Male", "Female"]}
                          onChange={setEditedGender}
                        />
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePrueba;
