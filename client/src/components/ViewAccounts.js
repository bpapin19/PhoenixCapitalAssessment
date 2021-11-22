import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BsTrash } from 'react-icons/bs';
import { BsPencil } from 'react-icons/bs';
import './ViewAccounts.css';

export default function ViewAccounts() {

    const [accountsArray, setAccountsArray] = useState([]);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [transition, setTransition] = useState(false);

    var baseUrl = process.env.REACT_APP_ROUTE_URL;

    function deleteAccount(accountToDelete){
        axios({
            method: 'delete',
            url: `${baseUrl}/api/account/${accountToDelete._id}`,
          })
          .then(res => {
            axios({
                method: 'delete',
                url: `${baseUrl}/api/land-holdings/${accountToDelete._id}`,
              })
              .then(res => { console.log(res) });
            setTransition(true);
            setTimeout(() => {
                setTransition(false);
                setSuccess("");
            }, 3000);
              setSuccess(accountToDelete.accountName + " was successfully deleted");
              var newAccountsArray = accountsArray.filter(account => account._id !== accountToDelete._id);
              setAccountsArray(newAccountsArray);
          }).catch(res => {
            setTransition(true);
            setTimeout(() => {
                setTransition(false);
                setError("");
            }, 3000);
            setError("Error deleting account.");
          });;
    }

    function reverseArray(accountsArray) {
        var reversedAccountsArray = [];
        for (var i = accountsArray.length-1; i >= 0; i--) {
            reversedAccountsArray.push(accountsArray[i]);
        }
        return reversedAccountsArray;
    }

    useEffect(() => {
          axios({
            method: 'get',
            url: baseUrl + "/api/accounts"
          })
          .then(res => {
            setAccountsArray(res.data.data);
          });
      }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
    <div>
        <div variant="success" className = {`success ${transition ? 'show' : 'hide'}`}>{success}</div>
        <div variant="danger" className = {`error ${transition ? 'show' : 'hide'}`}>{error}</div>
    
        <h1 className="title">All Accounts</h1>
        {accountsArray.length === 0 &&
            <div>
                <div style={{paddingTop: "30px"}}className="container">
                   <div className="card">
                        <div className="card-header">
                           <img className="no-accounts-img" alt=""/>
                        </div>
                        <div className="no-accounts-card-body">
                            You haven't uploaded any accounts.
                            <br/><br/>
                            Click <b>Add an account</b> to get started.
                            <br/>
                            <br/>
                            <Link to="/add-account" className="button p-2">Add an account</Link>
                        </div>
                   </div>
                </div>
            </div>
        }
        <div className="accounts-body">
            <div className="account-cards">
            {reverseArray(accountsArray).map(account => {
                    return (
                    <div key={account._id}>
                        <div className="container">
                            <div className="card">
                                <div className="accounts-card-body">
                                    <div className="account-header">
                                        <div className="account-name">{account.accountName}</div>
                                    </div>
                                    <div className="account-info">
                                        <div className="account-types">
                                            <span className="type">Entity: {account.entityType}</span>
                                            <span className="type">Owner: {account.ownerType}</span>
                                        </div>
                                        <div style={{color: "gray"}}>{account.address}</div>
                                        <Link to= {"/land-holdings/" + account._id }>{account.numHoldings} Holdings</Link>
                                    </div>
                                    <div className="btn-container">
                                        <button className="accounts-btn delete" onClick={() => {deleteAccount(account) }}><BsTrash size={40}/></button>
                                        <Link to={"/edit-account/" + account._id} className="accounts-btn edit"><BsPencil size={40}/></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    )
                })
            }
            </div>
        </div>
    </div>)
}