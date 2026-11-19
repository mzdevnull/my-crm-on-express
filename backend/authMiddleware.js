import jwt from 'jsonwebtoken'

import { secretKey } from './config.js';

export  function authMiddleware(req,res,next){
    const authHeader = req.headers.authorization
    if(!authHeader){
        return res.status(401).json({err:'no token'})
    }
    // режь там где пробел
    const token = authHeader.split(' ')[1]
    try{
        // проверка токена по секретному ключу
        const decoded = jwt.verify(token, secretKey)
        // подменяем в запрос
        req.user = decoded
        next()
    }catch(err){
        console.log("JWT ERROR:", err.message);

    return res.status(401).json({
        err: err.message
    });
    }

}