const z = require('zod');
const errorHandler = require('./errorHandler');

function validateAgenteFullBody(req, res, next){
    const validateObj = req.body;
    let result = errorHandler.schemeBaseAgente.strict().safeParse(validateObj);
    let errors = [];
    if(!result.success){
        result = z.treeifyError(result.error);
        if(result.properties){
            Object.entries(result.properties).forEach(([chave, valor]) => {
                errors.push(Object.fromEntries([[chave, valor.errors[0]]])); 
            });
        } else {
            errors = [{chave_invalida: result.errors[0]}]
        }
        return res.status(400).json({
            status: 400,
            message: "Parâmetros inválidos",
            errors: errors
        })
    }else{
        return next();
    }
}

function validateAgentePartialBody(req, res, next){
    const validateObj = req.body;
    let result = errorHandler.schemeBaseAgente.partial().strict().safeParse(validateObj);
    let errors = [];
    if(!result.success){
        result = z.treeifyError(result.error);
        if(result.properties){
            Object.entries(result.properties).forEach(([chave, valor]) => {
                errors.push(Object.fromEntries([[chave, valor.errors[0]]])); 
            });
        } else {
            errors = [{chave_invalida: result.errors[0]}]
        }
        return res.status(400).json({
            status: 400,
            message: "Parâmetros inválidos",
            errors: errors
        })
    }else{
        return next();
    }
}

function validateCasoFullBody(req, res, next){
    const validateObj = req.body;
    let result = errorHandler.schemeBaseCaso.strict().safeParse(validateObj);
    let errors = [];
    if(!result.success){
        result = z.treeifyError(result.error);
        if(result.properties){
            Object.entries(result.properties).forEach(([chave, valor]) => {
                errors.push(Object.fromEntries([[chave, valor.errors[0]]])); 
            });
        } else {
            errors = [{chave_invalida: result.errors[0]}]
        }
        return res.status(400).json({
            status: 400,
            message: "Parâmetros inválidos",
            errors: errors
        })
    }else{
        return next();
    }
}

function validateCasoPartialBody(req, res, next){
    const validateObj = req.body;
    let result = errorHandler.schemeBaseCaso.partial().strict().safeParse(validateObj);
    let errors = [];
    if(!result.success){
        result = z.treeifyError(result.error);
        if(result.properties){
            Object.entries(result.properties).forEach(([chave, valor]) => {
                errors.push(Object.fromEntries([[chave, valor.errors[0]]])); 
            });
        } else {
            errors = [{chave_invalida: result.errors[0]}]
        }
        return res.status(400).json({
            status: 400,
            message: "Parâmetros inválidos",
            errors: errors
        })
    }else{
        return next();
    }
}

module.exports={
    validateAgenteFullBody,
    validateAgentePartialBody,
    validateCasoFullBody,
    validateCasoPartialBody
}