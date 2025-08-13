const { success } = require("zod");
const agentesRepository = require("../repositories/agentesRepository");
const casosRepository = require("../repositories/casosRepository");
const tratadorErro = require("../utils/errorHandler");

function toDateType(stringData){
    let arrayData = stringData.split('-');
    return new Date(arrayData[0], parseInt(arrayData[1])-1, arrayData[2])
}

function toBigInt(valor){
    try{
        return BigInt(valor);
    }catch(err){
        return valor;
    }
}

function validarRepository(validar, res, statusCode){
    let resultado = null;
    if(validar){
        if(validar.success === false){
            return res.status(404).json(validar)
        }
        if(Array.isArray(validar)){
            validar.forEach((item)=>{
                item.dataDeIncorporacao = item.dataDeIncorporacao.toLocaleDateString('en-CA');
            });
            resultado = validar;
        } else {
            validar.dataDeIncorporacao = validar.dataDeIncorporacao.toLocaleDateString('en-CA')
            resultado = {
                success: true,
                ...validar
            }
        }
        return res.status(statusCode).json(resultado);
    }else {
        return res.status(500).send()
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

    return agentesRepository.read(filtro, ordenar, direcao).then((agentes) => validarRepository(agentes, res, 200));
}

async function getAgente(req, res){
    let idAgente = toBigInt(req.params.id);

    return tratadorErro.validarSchemeAsync(tratadorErro.EsquemaIdAgente, idAgente).then((resultado) => validarRepository(resultado, res, 200));


}

async function postAgente(req, res){

    corpoAgente = req.body;
    let resultadoParametros = tratadorErro.validarScheme(tratadorErro.EsquemaBaseAgente.strict(), corpoAgente);
    if(!resultadoParametros.success){
        return res.status(400).json(resultadoParametros)
    } else {
        corpoAgente.dataDeIncorporacao = toDateType(corpoAgente.dataDeIncorporacao)
        
        return agentesRepository.create(corpoAgente).then((resultado)=>validarRepository(resultado, res, 201));
    }

}

function putAgente(req, res){
    let corpoAgente = req.body;
    let idAgente = toBigInt(req.params.id);
    let resultadoParametros = tratadorErro.validarScheme(tratadorErro.EsquemaBaseAgente.strict(), corpoAgente);
    if(!resultadoParametros.success){
        return res.status(400).json(resultadoParametros)
    }

    corpoAgente.dataDeIncorporacao = toDateType(corpoAgente.dataDeIncorporacao);

    return tratadorErro.validarSchemeAsync(tratadorErro.EsquemaIdAgente, idAgente).then( (agenteResultado) => {
        if(!agenteResultado.success){
            return res.status(404).json(agenteResultado)
        }else {
            return agentesRepository.update(idAgente, corpoAgente).then((resultado)=>validarRepository(resultado, res, 200));
        }
    });
}

async function patchAgente(req, res){
    let corpoAgente = req.body;
    let idAgente = toBigInt(req.params.id);
    
    let resultadoParametros = tratadorErro.validarScheme(tratadorErro.EsquemaBaseAgente.partial().strict(), corpoAgente);
    if(!resultadoParametros.success){
        return res.status(400).json(resultadoParametros)
    } else {
        if(corpoAgente.dataDeIncorporacao)
            corpoAgente.dataDeIncorporacao = toDateType(corpoAgente.dataDeIncorporacao);
    
        return tratadorErro.validarSchemeAsync(tratadorErro.EsquemaIdAgente, idAgente).then((agenteResultado) => {
            if(!agenteResultado.success){
                return res.status(404).json(agenteResultado)
            } else {
                return agentesRepository.update(idAgente, corpoAgente).then((resultado)=>validarRepository(resultado, res, 200))
            }
        });
    }
}

async function deleteAgente(req, res){
    let agenteId = toBigInt(req.params.id);
    return tratadorErro.validarSchemeAsync(tratadorErro.EsquemaIdAgente, agenteId).then((agenteResultado) => {
        if(!agenteResultado.success){
            return res.status(404).json(agenteResultado)
        } else {
            agentesRepository.remove(agenteId).then((resultado)=>{
                if(resultado){
                    return res.status(204).send();
                } else {
                    return res.status(500).send()
                }
            });     
        }
    });
}

async function getCasosAgente(req, res) {
    let agenteId = toBigInt(req.params.id);
    return tratadorErro.validarSchemeAsync(tratadorErro.EsquemaIdAgente, agenteId).then((agenteResultado) => {
        if(!agenteResultado.success){
            return res.status(404).json(agenteResultado)
        } else {
            return casosRepository.read({agente_id: agenteId}).then((resultado) => {
                if(resultado){
                    return res.status(200).json(resultado)
                }else{
                    return res.status(500).send()
                }

            })
        }
    });
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