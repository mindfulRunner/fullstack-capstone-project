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
        console.error(e);
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;