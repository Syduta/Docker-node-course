const User = require('../models/userModels');
const bcrypt = require('bcryptjs');

exports.signUp = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = await User.create({
            username,
            password: hashedPassword
        });
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            },
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: "fail"
        });
    }
};

exports.logIn = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'user not found'
            });
        };
        const correctPassword = await bcrypt.compare(password, user.password);
        if (correctPassword) {
            res.status(200).json({
                status: 'success'
            });
        } else {
            res.status(400).json({
                status: 'fail',
                message: 'incorrect username or password'
            });
        };
    } catch (err) {
        res.status(400).json({
            status: 'fail'
        })
    }
};