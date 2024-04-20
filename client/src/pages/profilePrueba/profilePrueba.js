import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import Header from "../../components/Header/header.js";
import "./profilePrueba.css";
import ProfileNavBar from "../../components/profileNavBar/profileNavBar.js";

const ProfilePrueba = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState();
    const [selectedImage, setSelectedImage] = useState("");

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const imageURL = URL.createObjectURL(file); 
        setSelectedImage(imageURL); 
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            setToken(token);
            fetch('/verify-token', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                    console.error('Invalid token');
                }
            })
            .catch(error => {
                console.error('Error verifying token:', error);
            });
        }
        else {
            console.error('Could not find the token, user not authenticated');
        }
    }, []);

    const TableRow = ({ title, value }) => {
        const [editMode, setEditMode] = useState(false);
        const [editedValue, setEditedValue] = useState(value);

        const showEditButton = title !== "UserName" && title !== "mail";

        const handleEditClick = () => {
            setEditMode(true);
        };

        const handleSaveClick = () => {
            setEditMode(false);
            // Aquí puedes agregar la lógica para guardar el valor editado, por ejemplo, enviar una solicitud al servidor.
        };

        return (
            <tr>
                <th>{title}</th>
                <td>
                    {showEditButton ? (
                        <input 
                            type="text"
                            value={value}
                            readOnly
                            className="input-edit-mode"
                        />
                    ) : (
                        <p className="value">{value}</p>
                    )}
                    {/* No mostramos los botones si no es necesario */}
                    {showEditButton && (
                        <button className="edit" onClick={handleEditClick}>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                    )}
                </td>
            </tr>
        );
    };

    return (
        <div className="profile-box">
            <Header isAuthenticated={isLoggedIn}/>

            <div className="photo-table">
                <div className="photo-username-section">
                    <label htmlFor="upload-photo">
                        <img src={selectedImage ? selectedImage : "https://previews.123rf.com/images/amitspro/amitspro1706/amitspro170600016/80099376-mandala-de-flor-abstracta-patr%C3%B3n-decorativo-fondo-azul-imagen-cuadrada-imagen-de-ilusi%C3%B3n-patr%C3%B3n.jpg"} alt="Descripción de la imagen"></img>
                    </label>
                    <input type="file" id="upload-photo" style={{display: "none"}} onChange={handleImageChange} />

                    <ProfileNavBar/>
                
                </div>

                <div className="table-info-section">

                    <div className="username-section">
                        <h1>username</h1>
                        <h2>@username</h2>
                    </div>

                    <div className="tables-profile">
                        <div className="basic-info information-box-profile">
                            <h1>Basic Info</h1>
                            <div className="table-container-profile">
                                <table>
                                    <tbody>
                                        <TableRow title="UserName" value="TuNombreAquí" />
                                        <TableRow title="mail" value="mail@gmail.com" />
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="other-info information-box-profile">
                            <h1>Other Info</h1>
                            <div className="table-container-profile">
                                <table>
                                    <tbody>
                                        <TableRow title="Weight" value="XX" />
                                        <TableRow title="Height" value="XX" />
                                        <TableRow title="Gender" value="Male" />
                                        <TableRow title="Age" value="20" />
                                        <TableRow title="System" value="Metric" />
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                </div>

            </div>


        </div>

    );
}

export default ProfilePrueba;
