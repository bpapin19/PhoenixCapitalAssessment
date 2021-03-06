import React, {useRef, useState} from "react";
import {Form, Button, Card, Container, Alert} from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom'

export default function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useAuth();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault();

        if(passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match");
        }

        try {
            setError("");
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
            history.push('/add-account');
        } catch {
            setError("Failed to create account");
        }
        setLoading(false);
    }

    const borderStyles = {
        borderRadius: "10px",
        boxShadow: "0 2px 20px rgba(0, 0, 0, 0.2)",
        width: "100%",
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
                        <h2 className="text-center mb-4">Sign Up</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form style={{width: "360px"}} onSubmit={handleSubmit}>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required />
                            </Form.Group>
                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef} required />
                            </Form.Group>
                            <Form.Group id="password-confirm">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" ref={passwordConfirmRef} required />
                            </Form.Group>
                            <button disabled={loading} className="button w-100" type="submit">Sign Up</button>
                        </Form>
                    </Card.Body>
                </div>
                <div className="w-100 text-center mt-2">
                    Already have an account? <Link to='/login'>Login</Link>
                </div>
            </div>
        </Container>
        </>
    )
}