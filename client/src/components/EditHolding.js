import React, {useRef, useState, useEffect} from "react";
import {Form, Card, Container} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './AddAccount.css';

export default function EditHolding() {

  // Use Ref
  const nameRef = useRef();
  const locationRef = useRef();

  // Use State
  const [titleType, setTitleType] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [holding, setHolding] = useState({});
  const [transition, setTransition] = useState(false);

  const entityRef = useRef();
  const netAcresRef = useRef();
  const royaltyRef = useRef();
  const sectionRef = useRef();
  const townshipRef = useRef();
  const rangeRef = useRef();


  // Params
  const params = useParams();

  var baseUrl = process.env.REACT_APP_ROUTE_URL;

  useEffect(() => {
    axios({
      method: 'get',
      url: baseUrl + `/api/land-holding/${params.id}`
    })
    .then(res => {
      setHolding(res.data.data);
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

function royaltyKeyUp() {
    //Get human input: 
    let percentage = document.getElementById('percent');
    //Separate the percent sign from the number:
    var int;
    if (percentage.value.length === 1) {
        int = percentage.value.slice(0, percentage.value.length);
    } else {
        int = percentage.value.slice(0, percentage.value.length - 1);
    }
    
    /* If there is no number (just the percent sign), rewrite
    it so it persists and move the cursor just before it.*/
    // if (int.includes('%')) {
    //     percentage.value = '%';
    // }
    /* If the whole has been written and we are starting the
    fraction rewrite to include the decimal point and percent 
    sign. The fraction is a sigle digit. Cursor is moved to 
    just ahead of this digit.*/
    if(int.length >= 3 && int.length <= 4 && !int.includes('.')){
        percentage.value = int.slice(0,2) + '.' + int.slice(2,3) + '%';
        percentage.setSelectionRange(4, 4);
    }
    /* If the we have a double digit fraction we split up, format it
    and print that. Cursor is already in the right place.*/
    else if(int.length >= 5 && int.length <= 6){
        let whole = int.slice(0, 2);
        let fraction = int.slice(3, 5);
        percentage.value = whole + '.' + fraction + '%';
    }
    /* If we're still just writing the whole (first 2 digits), just 
    print that with the percent sign. Also if the element has just
    been clicked on we want the cursor before the percent sign.*/
    else {
        percentage.value = int + '%';
        percentage.setSelectionRange(percentage.value.length-1, percentage.value.length-1);
    }
};

  async function handleSubmit(e) {
      e.preventDefault();

      var section_name = sectionRef.current.value + "-" + townshipRef.current.value + "-" + rangeRef.current.value;
      var name = section_name + " " + entityRef.current.value;
      var royalty = royaltyRef.current.value.substring(0, royaltyRef.current.value.length - 1);

      if (error === "") {
        axios({
          method: 'put',
          url: baseUrl + "/api/land-holding/" + holding._id,
          data: {
            name: name,
              account: params.id,
              legalEntity: entityRef.current.value,
              netMineralAcres: netAcresRef.current.value,
              mineralOwnerRoyalty: royalty,
              sectionName: section_name,
              section: sectionRef.current.value,
              township: townshipRef.current.value,
              range: rangeRef.current.value,
              titleSource: titleType
          }
        })
        .then(res => {
            setSuccess(res.data.message);
        })
        .catch(res => {
          console.log(res)
          setError("Error updating land holding.");
        });
        e.target.reset();
      }
      setError("");
    }

  const handleTitleChange = e => {
    setTitleType(e.target.value);
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
                    <h2 className="text-center mb-4">Edit Holding {holding.sectionName} {holding.legalEntity}</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="entity">
                            <Form.Label>Legal Entity</Form.Label>
                            <Form.Control ref={entityRef} placeholder={holding.legalEntity}  />
                        </Form.Group>
                        <div className="row">
                            <div className="col">
                                <Form.Group id="net-acres">
                                    <Form.Label>Net Mineral Acres</Form.Label>
                                    <Form.Control ref={netAcresRef} placeholder={holding.netMineralAcres} type="number"  />
                                </Form.Group>
                            </div>
                            <div className="col">
                                <Form.Group id="mineral-owner-royalty">
                                    <Form.Label>Mineral Owner Royalty</Form.Label>
                                    <Form.Control ref={royaltyRef} maxLength="6" id="percent" placeholder={holding.mineralOwnerRoyalty + "%"} onKeyUp={() => royaltyKeyUp()}  />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <Form.Group id="section">
                                    <Form.Label>Section</Form.Label>
                                    <Form.Control ref={sectionRef} placeholder={holding.section} maxLength="3" type="text"  />
                                </Form.Group>
                            </div>
                            <div className="col">
                                <Form.Group id="township">
                                    <Form.Label>Township</Form.Label>
                                    <Form.Control ref={townshipRef} placeholder={holding.township} maxLength="4" pattern=".*N|.*S" type="text"  />
                                </Form.Group>
                            </div>
                            <div className="col">
                                <Form.Group id="range">
                                    <Form.Label>Range</Form.Label>
                                    <Form.Control ref={rangeRef} placeholder={holding.range} maxLength="4" pattern=".*E|.*W" type="text"  />
                                </Form.Group>
                            </div>
                        </div>
                        <Form.Group id="entity-type">
                    <Form.Label>Title Source</Form.Label>
                    <Form.Check 
                        type={'radio'}
                        id={'Class A'}
                        value={'Class A'}
                        label={'Class A'}
                        name={'titleType'}
                        onChange={handleTitleChange}
                        
                    />
                    <Form.Check 
                        type={'radio'}
                        id={'Class B'}
                        value={'Class B'}
                        label={'Class B'}
                        name={'titleType'}
                        onChange={handleTitleChange}
                        
                    />
                    <Form.Check 
                        type={'radio'}
                        id={'Class C'}
                        value={'Class C'}
                        label={'Class C'}
                        name={'titleType'}
                        onChange={handleTitleChange}
                        
                    />
                    <Form.Check 
                        type={'radio'}
                        id={'Class D'}
                        value={'Class D'}
                        label={'Class D'}
                        name={'titleType'}
                        onChange={handleTitleChange}
                        
                    />
                </Form.Group>
                        <button className="w-100 button" type="submit">Update Holding</button>
                    </Form>
                </Card.Body>
            </div>
        </div>
    </Container>
    </>
  )
}