const Account = require('../models/account-model');

createAccount = (req, res) => {

    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a account',
        })
    }

    const account = new Account(body);

    if (!account) {
        return res.status(400).json({ success: false, error: err });
    }

    account
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: account._id,
                message: 'Account successfully added!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Unable to add account!',
            });
        });
};

updateAccount = async (req, res) => {
    const body = req.body;

    console.log(body);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        });
    }

    Account.findOne({ _id: req.params.id }, (err, account) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Account not found!',
            })
        }
        if (body.accountName) {
            account.accountName = body.accountName;
        }
        if (body.address) {
            account.address = body.address;
        }
        if (body.entityType) {
            account.entityType = body.entityType;
        }
        if (body.ownerType) {
            account.ownerType = body.ownerType;
        }
        if (body.numHoldings) {
            if (body.operation === "increment") {
                account.numHoldings = body.numHoldings + 1;
            } else if (body.operation === "decrement") {
                account.numHoldings = body.numHoldings - 1;
            }
        }
        account
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: account._id,
                    message: 'Account updated!',
                });
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Account not updated!',
                });
            });
    });
};

deleteAccount = async (req, res) => {
    await Account.findOneAndDelete({ _id: req.params.id }, (err, account) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!account) {
            return res
                .status(404)
                .json({ success: false, error: `Account not found` })
        }

        return res.status(200).json({ success: true, data: account });
    }).catch(err => console.log(err));
};

getAccountById = async (req, res) => {
    await Account.findOne({ _id: req.params.id }, (err, account) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!account) {
            return res
                .status(404)
                .json({ success: false, error: `Account not found` });
        }
        return res.status(200).json({ success: true, data: account });
    }).catch(err => console.log(err));
};

getAccounts = async (req, res) => {
    await Account.find({}, (err, accounts) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!accounts.length) {
            return res
                .status(404)
                .json({ success: false, error: `Account not found` });
        }
        return res.status(200).json({ success: true, data: accounts });
    }).catch(err => console.log(err));
};

module.exports = {
    createAccount,
    updateAccount,
    deleteAccount,
    getAccounts,
    getAccountById,
};