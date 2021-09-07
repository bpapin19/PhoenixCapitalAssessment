import React, {useRef, useState, useEffect} from "react";
import {Form, Button, Card, Container, Alert} from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios';

export default function UpdateProfile() {
    const usernameRef = useRef();
    const emailRef = useRef();
    const { currentUser, updateEmail, updateUsername } = useAuth();
    const [error, setError] = useState("");
    const [file, setFile] = useState( null );
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const photoRef = useRef();

    useEffect(() => {
        if (file !== null){
          if (file.size > 4000000) {
            setError("File too large, uploads limited to 4MB");
          } else if ((file.type !== 'image/jpeg') && (file.type !== 'image/png')) {
            setError("Only jpeg and png formats are supported");
          } else {
            setError("");
          }
        }
      }, [file]);

    function handleSubmit(e) {
        e.preventDefault();

        // Handle profile photo file upload
        const formData = new FormData();

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'from': 'update-profile',
                'current-user-email': currentUser.email,
            }
          };

        if (error === "") {
            if (file != null) {
                formData.append('myfile', file);
                axios.post("/api/files", formData, config, currentUser.email);
            }

            const promises = [];
            setLoading(true);
            setError("");

            if (emailRef.current.value !== currentUser.email) {
                promises.push(updateEmail(emailRef.current.value));
            }

            if (usernameRef.current.value) {
                promises.push(updateUsername(usernameRef.current.value));
            }

            Promise.all(promises).then(() => {
                history.push('/profile');
            }).catch(() => {
                setError("Failed to update account. Make sure your email address is valid");
            }).finally(() => {
                setLoading(false);
            })
        }
    }

    const handleFileUpload = (e) => {
        setFile(e.target.files[0]);
    }

    const borderStyles = {
        borderRadius: "10px",
        boxShadow: "0 2px 20px rgba(0, 0, 0, 0.2)",
    }
    
    return (
        <>
        <Container
                className="d-flex justify-content-center"
                style={{ minHeight: "100vh", paddingTop: "30px"}}
            >
            <div className="w-100" style={{ maxWidth: "400px" }}>
                <div style={borderStyles}>
                    <Card.Body>
                        <h2 className="text-center mb-4">Update Profile</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form style={{width: "360px"}} onSubmit={handleSubmit}>
                            <Form.Group id="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="username" ref={usernameRef} defaultValue={currentUser.displayName} placeholder={currentUser.displayName}/>
                            </Form.Group>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} defaultValue={currentUser.email}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.File id="photo" label="Profile Picture" onChange={handleFileUpload} ref={photoRef}/>
                            </Form.Group>
                            <Button disabled={loading} className="w-100" type="submit">Update</Button>
                        </Form>
                    </Card.Body>
                </div>
                <div className="w-100 text-center mt-2">
                    <Link to='/profile'>Cancel</Link>
                </div>
            </div>
        </Container>
        </>
    )
}