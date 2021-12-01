import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {Form, Card, Container} from 'react-bootstrap';
import axios from 'axios';
import { BsTrash } from 'react-icons/bs';
import { BsPencil } from 'react-icons/bs';
import { AiOutlinePlus } from 'react-icons/ai';
import { AiOutlineMinus } from 'react-icons/ai';
import Collapsible from 'react-collapsible';
import './ViewAccounts.css';

export default function LandHoldings() {

    const [holdingsArray, setHoldingsArray] = useState([]);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const [buttonText, setButtonText] = useState("Add Holding");
    const [titleType, setTitleType] = useState("Add Holding");
    const [account, setAccount] = useState({});
    const [transition, setTransition] = useState(false);

    const entityRef = useRef();
    const netAcresRef = useRef();
    const royaltyRef = useRef();
    const sectionRef = useRef();
    const townshipRef = useRef();
    const rangeRef = useRef();
    const params = useParams();

    var baseUrl = process.env.REACT_APP_ROUTE_URL;

    function deleteHolding(holdingToDelete){
        axios({
            method: 'delete',
            url: `${baseUrl}/api/land-holding/${holdingToDelete._id}`,
          })
          .then(res => {
              // Success Alert Transition
              setTransition(true);
                setTimeout(() => {
                    setTransition(false);
                    setSuccess("");
                }, 3000);
              setSuccess(holdingToDelete.name + " was successfully deleted");

              // Re-Render holdings array
              var newHoldingsArray = holdingsArray.filter(holding => holding._id !== holdingToDelete._id);
              setHoldingsArray(newHoldingsArray);

              // subtract a holding from the number of holdings of that account
              axios({
                method: 'put',
                url: baseUrl + "/api/account/" + params.id,
                data: {
                    numHoldings: holdingsArray.length,
                    operation: "decrement"
                }
              });
          }).catch(res => {
            // Error Alert Transition
            setTransition(true);
            setTimeout(() => {
                setTransition(false);
                setError("");
            }, 3000);
            setError("Error deleting land holding.");
          });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        var section_name = sectionRef.current.value + "-" + townshipRef.current.value + "-" + rangeRef.current.value;
        var name = section_name + " " + entityRef.current.value;
        var royalty = royaltyRef.current.value.substring(0, royaltyRef.current.value.length - 1);
  
        if (error === "") {
          axios({
            method: 'post',
            url: baseUrl + "/api/land-holding",
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
            setTransition(true);
            setTimeout(() => {
                setTransition(false);
                setSuccess("");
            }, 3000);
              setSuccess(res.data.message);
              e.target.reset();
          })
          .catch(res => {
            setTransition(true);
            setTimeout(() => {
                setTransition(false);
                setError("");
            }, 3000);
            setError("Error adding account, check form fields.");
          });

          // Add one to numHoldings for account ID
          axios({
            method: 'put',
            url: baseUrl + "/api/account/" + params.id,
            data: {
                numHoldings: holdingsArray.length,
                operation: "increment"
            }
          });
        }
        setError("");
      }

    // Inital get request on page load
    useEffect(() => {
          axios({
            method: 'get',
            url: baseUrl + `/api/land-holdings/${params.id}`
          })
          .then(res => {
            setHoldingsArray(res.data.data);
          });
      }, []); // eslint-disable-line react-hooks/exhaustive-deps

      useEffect(() => {
        axios({
          method: 'get',
          url: baseUrl + `/api/account/${params.id}`
        })
        .then(res => {
          setAccount(res.data.data);
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleTitleChange = e => {
        setTitleType(e.target.value);
    }

    // Toggle Collapse dropdown form
    function collapseAddHolding() {
        if (open) {
            setOpen(false);
            setButtonText("Add Holding");
        } else {
            setOpen(true);
            setButtonText("Cancel");
        }
    }

    // We do this to show the holdings in chronological order
    function reverseArray(holdingsArray) {
        var reversedHoldingsArray = [];
        for (var i = holdingsArray.length-1; i >= 0; i--) {
            reversedHoldingsArray.push(holdingsArray[i]);
        }
        return reversedHoldingsArray;
    }

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

    const borderStyles = {
        borderRadius: "10px",
        border: "2px solid black"
    };

    return (
    <div>
        <div variant="success" className = {`success ${transition ? 'show' : 'hide'}`}>{success}</div>
        <div variant="danger" className = {`error ${transition ? 'show' : 'hide'}`}>{error}</div>
        <h1 className="title">All Holdings for {account.accountName}</h1>
        {holdingsArray.length === 0 &&
            <div>
                <div style={{paddingTop: "30px"}} className="container">
                   <div className="card">
                        <div className="card-header">
                           <img className="no-accounts-img" alt=""/>
                        </div>
                        <div className="no-accounts-card-body">
                            No holdings found for {account.accountName}.
                            <br/><br/>
                            Click <b>Add a Holding</b> to get started.
                        </div>
                   </div>
                </div>
            </div>
        }
        <div className="accounts-body">
            <div className="account-cards">
            {reverseArray(holdingsArray).map(holding => {
                    return (
                    <div key={holding._id}>
                        <div className="container">
                            <div className="card">
                                <div className="accounts-card-body">
                                    <div className="holding-header">
                                        <div className="holding-name">{holding.sectionName} {holding.legalEntity}</div>
                                    </div>
                                    <div className="account-info">
                                        <div className="title-source">{holding.titleSource}</div>
                                        <div className="p-2">
                                            <div className="type">Net Mineral Acres: {holding.netMineralAcres}</div>
                                            <div className="type">Mineral Owner Royalty: {holding.mineralOwnerRoyalty}%</div>
                                        </div>
                                        <div className="account-types p-2">
                                            <div className="pr-3"><strong>Section:</strong> {holding.section}</div>
                                            <div className="pr-3"><strong>Township:</strong> {holding.township}</div>
                                            <div><strong>Range:</strong> {holding.range}</div>
                                        </div>
                                    </div>
                                    <div className="btn-container">
                                        <button className="accounts-btn delete" onClick={() => {deleteHolding(holding) }}><BsTrash size={40}/></button>
                                        <Link to={"/edit-holding/" + holding._id} className="accounts-btn edit"><BsPencil size={40}/></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    )
                })
            }
            <div>
            
        </div>
            </div>
        </div>
            <Container
                    className="d-flex justify-content-center"
                    style={{ minHeight: "100vh"}}
                >
                        <div className="w-100" style={{ maxWidth: "90%" }}>
                        <div style={ borderStyles }>
                        <span>
                            <button className="add-holding-button" onClick={() => collapseAddHolding()}>
                                {open && <AiOutlineMinus/>}{!open && <AiOutlinePlus/>}{buttonText}</button>
                        </span>
                        <Collapsible open={open}>
                            <Card.Body>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group id="entity">
                                        <Form.Label>Legal Entity</Form.Label>
                                        <Form.Control ref={entityRef} required />
                                    </Form.Group>
                                    <div className="row">
                                        <div className="col">
                                            <Form.Group id="net-acres">
                                                <Form.Label>Net Mineral Acres</Form.Label>
                                                <Form.Control ref={netAcresRef} type="number" required />
                                            </Form.Group>
                                        </div>
                                        <div className="col">
                                            <Form.Group id="mineral-owner-royalty">
                                                <Form.Label>Mineral Owner Royalty</Form.Label>
                                                <Form.Control ref={royaltyRef} maxLength="6" id="percent" onKeyUp={() => royaltyKeyUp()} placeholder="%" required />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <Form.Group id="section">
                                                <Form.Label>Section</Form.Label>
                                                <Form.Control ref={sectionRef} maxLength="3" type="text" required />
                                            </Form.Group>
                                        </div>
                                        <div className="col">
                                            <Form.Group id="township">
                                                <Form.Label>Township</Form.Label>
                                                <Form.Control ref={townshipRef} maxLength="4" pattern=".*N|.*S" type="text" required />
                                            </Form.Group>
                                        </div>
                                        <div className="col">
                                            <Form.Group id="range">
                                                <Form.Label>Range</Form.Label>
                                                <Form.Control ref={rangeRef} maxLength="4" pattern=".*E|.*W" type="text" required />
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
                                  required
                                />
                                <Form.Check 
                                  type={'radio'}
                                  id={'Class B'}
                                  value={'Class B'}
                                  label={'Class B'}
                                  name={'titleType'}
                                  onChange={handleTitleChange}
                                  required
                                />
                                <Form.Check 
                                  type={'radio'}
                                  id={'Class C'}
                                  value={'Class C'}
                                  label={'Class C'}
                                  name={'titleType'}
                                  onChange={handleTitleChange}
                                  required
                                />
                                <Form.Check 
                                  type={'radio'}
                                  id={'Class D'}
                                  value={'Class D'}
                                  label={'Class D'}
                                  name={'titleType'}
                                  onChange={handleTitleChange}
                                  required
                                />
                            </Form.Group>
                                    <button className="w-100 button" type="submit">Add Holding</button>
                                </Form>
                            </Card.Body>
                        </Collapsible>
                    </div>
                </div>
            </Container>
    </div>)
}