const agentesRepository = require("../repositories/agentesRepository");
const casosRepository = require("../repositories/casosRepository");
const error404Body = {
    status: 404,
    message: "Agente inexistente",
    errors: [
        {id: "Não existe agente com esse id"}
    ]
}

function toDateType(stringData){
    let arrayData = stringData.split('-');
    return new Date(arrayData[0], parseInt(arrayData[1])-1, arrayData[2])
}

function toBigInt(valor, res){
    try{
        return BigInt(valor);
    }catch(err){
        return false;
    }
}

function validarRepository(validar, res, statusCode){
    let resultado = null;
    if(validar === false){
        return res.status(500).send();
    } else if(validar === null){
        return res.status(404).json(error404Body);
    } else {
        if(Array.isArray(validar)){
            validar.forEach((item)=>{
                item.dataDeIncorporacao = item.dataDeIncorporacao.toLocaleDateString('en-CA');
            });
            resultado = validar;
        } else {
            validar.dataDeIncorporacao = validar.dataDeIncorporacao.toLocaleDateString('en-CA')
            resultado = validar;
        }
        return res.status(statusCode).json(resultado);
    }
}

async function getAllAgentes(req, res) {
    let ordenar = req.query.sort;
    const {id, nome, dataDeIncorporacao, cargo} = req.query;
    let direcao = null;
    let filtro = {}

    if(ordenar){
        if(ordenar[0] == '-'){
            ordenar = ordenar.slice(1)
            direcao = 'DESC';
        }else{
            direcao = 'ASC';
        }
    }
    if(id)
        filtro.id = id;
    if(nome)
        filtro.nome = nome;
    if(dataDeIncorporacao)
        filtro.dataDeIncorporacao = dataDeIncorporacao;
    if(cargo)
        filtro.cargo = cargo;
    let agentes = await agentesRepository.read(filtro, ordenar, direcao);
    
    return validarRepository(agentes, res, 200);
}

async function getAgente(req, res){
    let idAgente = toBigInt(req.params.id);

    if(!idAgente){
        return res.status(404).json(error404Body)
    } else {
        let resultado = await agentesRepository.findId(idAgente);
        
        return validarRepository(resultado, res, 200);
    }
}

async function postAgente(req, res){
    corpoAgente = req.body;

    corpoAgente.dataDeIncorporacao = toDateType(corpoAgente.dataDeIncorporacao)
    
    let resultado = await agentesRepository.create(corpoAgente);
    return validarRepository(resultado, res, 201);
}

async function putAgente(req, res){
    let corpoAgente = req.body;
    let idAgente = toBigInt(req.params.id);
    if(!idAgente){
        return res.status(404).json(error404Body)
    } else {
        corpoAgente.dataDeIncorporacao = toDateType(corpoAgente.dataDeIncorporacao);
    
        let resultado = await agentesRepository.update(idAgente, corpoAgente);
        return validarRepository(resultado, res, 200);
    }
}

async function patchAgente(req, res){
    let corpoAgente = req.body;
    let idAgente = toBigInt(req.params.id);
    if(!idAgente){
        return res.status(404).json(error404Body)
    } else {
        if(corpoAgente.dataDeIncorporacao)
            corpoAgente.dataDeIncorporacao = toDateType(corpoAgente.dataDeIncorporacao);
    
        let resultado = await agentesRepository.update(idAgente, corpoAgente);
    
        return validarRepository(resultado, res, 200);
    }
}

async function deleteAgente(req, res){
    let agenteId = toBigInt(req.params.id);
    if(!agenteId){
        return res.status(404).json(error404Body);
    } else {
        let resultado = await agentesRepository.remove(agenteId)
        if(resultado == 0){
            return res.status(404).json(error404Body);
        } else if(resultado === false){
            return res.status(500).send()
        } else {
            return res.status(204).send();
        }
    }
}

async function getCasosAgente(req, res) {
    let agenteId = toBigInt(req.params.id);

    if(!agenteId){
        return res.status(404).json(error404Body);
    }

    let agenteResultado = await agentesRepository.findId(agenteId)
    if(agenteResultado === null){
        return res.status(404).json(error404Body);
    } else if(agenteResultado === false){
        return res.status(500).send();
    } else {
        let resultado = await casosRepository.read({agente_id: agenteId});
        if(resultado === false){
            return res.status(500).send()
        } else {
            return res.status(200).json(resultado)
        }
    }
}

module.exports = {
   getAllAgentes,
   getAgente,
   postAgente,
   putAgente,
   patchAgente,
   deleteAgente,
   getCasosAgente
}