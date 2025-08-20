//Step 1 - Task 2: Import necessary packages
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const pino = require('pino'); // Pino logger
const connectToDatabase = require('../models/db');

const app = express();
const router = express.Router();


//Step 1 - Task 3: Create a Pino logger instance
const logger = pino();

//Step 1 - Task 4: Create JWT secret
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
//Step 2
    try {
        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
         // {{insert code here}}
        const db = await connectToDatabase();

        // Task 2: Access MongoDB collection
         // {{insert code here}}
        const collection = db.collection('users');

        //Task 3: Check for existing email
         // {{insert code here}}
        const { firstName, lastName, password, email } = req.body;
        
        const existingEmail = await collection.findOne({ email });

        if (existingEmail) {
            return res.status(400).json({ message: 'email already exists' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(password, salt);

        //Task 4: Save user details in database
        const newUser = await collection.insertOne({ email, firstName, lastName, password: hash, createdAt: new Date() });
        //Task 5: Create JWT authentication with user._id as payload
        const payload = {
            user: {
                id: newUser.insertedId
            }
        }
        const authToken = jwt.sign(payload, JWT_SECRET);

        logger.info('User registered successfully');
        res.json({ authToken, email });
    } catch (e) {
        logger.error(e);
        return res.status(500).send('Internal server error');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`.
        const db = await connectToDatabase();

        // Task 2: Access MongoDB `users` collection
        const collection = db.collection('users');

        // Task 3: Check for user credentials in database
        const user = await collection.findOne({ email });

        // Task 4: Task 4: Check if the password matches the encrypyted password and send appropriate message on mismatch
        if (user) {
            const compareResult = await bcryptjs.compare(password, user.password);
            if (!compareResult) {
                logger.error('Passwords not match');
                return res.status(400).json({ error: 'Wrong password' });
            }

            // Task 5: Fetch user details from database
            const userName = user.firstName;
            const userEmail = user.Email;

            // Task 6: Create JWT authentication if passwords match with user._id as payload
            const payload = {
                user: {
                    id: user._id.toString()
                }
            }
            const authToken = jwt.sign(payload, JWT_SECRET);
            logger.info('User logged in successfully');
            return res.status(200).json({ authToken, userName, userEmail });
        } else {
            // Task 7: Send appropriate message if user not found
            logger.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (e) {
        return res.status(500).json({ error: 'Internal server error', details: e.message });
    }
});

module.exports = router;