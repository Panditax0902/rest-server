const {request, response} = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const validateJWT = async (req = request, res = response, next) =>{
    
    const {token} = req.headers
    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {
        const {id} = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY)
        const user = await User.findById(id)
        
        //Validar que el usuario no sea identificado
        if(!user){
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en la BD'
            })
        }

        //verificar que el usuario no ha sido eliminado

        if(!user.status){
            return res.status(401).json({
                msg: 'Token no válido - usuario con status false'
            })
        }

        req.authenticatedUserId = id
        req.authenticatedUser = user
        next()

        
    } catch (error) {
        console.log(err)
        return res.status(500).json({
            msg: 'Token no válido',
        })
    }
}

module.exports = {validateJWT,}