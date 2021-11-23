import React, {useRef, useState, useEffect} from "react";
import {Form, Card, Container} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import PlacesAutocomplete from "react-places-autocomplete";
import axios from 'axios';
import './AddAccount.css';

export default function EditAccount() {

  // Use Ref
  const nameRef = useRef();
  const locationRef = useRef();

  // Use State
  const [address, setAddress] = useState("");
  const [entityType, setEntityType] = useState("");
  const [ownerType, setOwnerType] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [account, setAccount] = useState({});
  const [transition, setTransition] = useState(false);


  // Params
  const params = useParams();

  var baseUrl = process.env.REACT_APP_ROUTE_URL;

  useEffect(() => {
    axios({
      method: 'get',
      url: baseUrl + `/api/account/${params.id}`
    })
    .then(res => {
      setAccount(res.data.data);
    });
}, []); // eslint-disable-line react-hooks/exhaustive-deps

useEffect(() => {
    if (success !== "") {
        setTransition(true);
        setTimeout(() => {
            setTransition(false);
            setSuccess("");
        }, 3000);
    }
}, [success]);

useEffect(() => {
    if (error !== "") {
        setTransition(true);
        setTimeout(() => {
            setTransition(false);
            setError("");
        }, 3000);
    }
}, [error]);

  async function handleSubmit(e) {
      e.preventDefault();

      if (error === "") {
        axios({
          method: 'put',
          url: baseUrl + "/api/account/" + account._id,
          data: {
            accountName: nameRef.current.value,
            entityType: entityType,
            ownerType: ownerType,
            address: address
          }
        })
        .then(res => {
            setSuccess(res.data.message);
        })
        .catch(res => {
          setError("Error updating account. Name and address must be unique.");
        });
        e.target.reset();
        setAddress("");
      }
      setError("");
    }

  const handleSelect = async (value) => {
    setAddress(value);
  } 

  const handleEntityChange = e => {
    setEntityType(e.target.value);
  }

  const handleOwnerChange = e => {
    setOwnerType(e.target.value);
  }

  const borderStyles = {
    borderRadius: "10px",
    boxShadow: "0 2px 20px rgba(0, 0, 0, 0.2)"
  }

  return (
    <>
    <Container
            className="d-flex justify-content-center"
            style={{ minHeight: "100vh", paddingTop: "30px"}}
        >
        <div variant="success" className = {`success ${transition ? 'show' : 'hide'}`}>{success}</div>
        <div variant="danger" className = {`error ${transition ? 'show' : 'hide'}`}>{error}</div>
        <div className="w-100" style={{ maxWidth: "75%" }}>
            <div style={ borderStyles }>
                <Card.Body>
                    <h2 className="text-center mb-4">Edit Account</h2>
                    {account && <h4 className="text-center mb-4">{account.accountName}</h4>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="name">
                            <Form.Label>Account Name</Form.Label>
                            <Form.Control ref={nameRef} placeholder={account.accountName} />
                        </Form.Group>
                        <div className="row">
                          <div className="col">
                            <Form.Group id="entity-type">
                              <Form.Label>Entity Type</Form.Label>
                                <Form.Check 
                                  type={'radio'}
                                  id={'Company'}
                                  value={'Company'}
                                  label={'Company'}
                                  name={'entityType'}
                                  onChange={handleEntityChange}
                                />
                                <Form.Check 
                                  type={'radio'}
                                  id={'Individual'}
                                  value={'Individual'}
                                  label={'Individual'}
                                  name={'entityType'}
                                  onChange={handleEntityChange}
                                />
                                <Form.Check 
                                  type={'radio'}
                                  id={'entityInvestor'}
                                  value={'Investor'}
                                  label={'Investor'}
                                  name={'entityType'}
                                  onChange={handleEntityChange}
                                />
                                <Form.Check 
                                  type={'radio'}
                                  id={'Trust'}
                                  value={'Trust'}
                                  label={'Trust'}
                                  name={'entityType'}
                                  onChange={handleEntityChange}
                                />
                            </Form.Group>
                          </div>
                          <div className="col">
                          <Form.Group id="owner-type">
                            <Form.Label>Owner Type</Form.Label>
                              <Form.Check 
                                type={'radio'}
                                id={'Competitor'}
                                value={'Competitor'}
                                label={'Competitor'}
                                name={'ownerType'}
                                onChange={handleOwnerChange}
                              />
                              <Form.Check 
                                type={'radio'}
                                id={'Seller'}
                                value={'Seller'}
                                label={'Seller'}
                                name={'ownerType'}
                                onChange={handleOwnerChange}
                              />
                              <Form.Check 
                                type={'radio'}
                                id={'ownerInvestor'}
                                value={'Investor'}
                                label={'Investor'}
                                name={'ownerType'}
                                onChange={handleOwnerChange}
                              />
                              <Form.Check 
                                type={'radio'}
                                id={'Professional'}
                                value={'Professional'}
                                label={'Professional'}
                                name={'ownerType'}
                                onChange={handleOwnerChange}
                              />
                          </Form.Group>
                          </div>
                        </div>
                        <Form.Group id="address">
                            <Form.Label>Address</Form.Label>
                            <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
                              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) =>
                                <div>
                                  <Form.Control ref={locationRef} placeholder={account.address} {...getInputProps()} />
                                  <div>
                                    {suggestions.map(suggestion => {
                                      const style = suggestion.active
                                      ? { backgroundColor: '#0070ff', cursor: 'pointer', color: "white" }
                                      : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                      return (
                                      <div key={suggestion.placeId} {...getSuggestionItemProps(suggestion, { style })}>
                                        {suggestion.description}
                                      </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              }
                            </PlacesAutocomplete>
                        </Form.Group>
                        <button className="w-100 button" type="submit">Update Account</button>
                    </Form>
                </Card.Body>
            </div>
        </div>
    </Container>
    </>
  )
}