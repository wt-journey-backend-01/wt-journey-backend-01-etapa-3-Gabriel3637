const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require("../repositories/agentesRepository");

const error404Body = {
    status: 404,
    message: "Caso inexistente",
    errors: [
        {id: "Não existe caso com esse id"}
    ]
}

function toBigInt(valor){
    try{
        if(valor === null || valor === undefined){
            return null;
        }else {
            return BigInt(valor);
        }
    }catch(err){
        return false;
    }
}

function validarRepository(validar, res, statusCode){
    let resultado = null;
    if(validar === false){
        return res.status(500).send()
    } else if(validar === null){
        return res.status(404).json(error404Body);
    }else if(validar.code == "23503"){
        return res.status(404).json({
            status: 404,
            message: "Agente inexistente",
            errors: [
                {id: "Não existe agente com esse id"}
            ]
        })
    }else {
        resultado = validar;
        return res.status(statusCode).json(resultado);   
    }
}

async function getAllCasos(req, res) {
    let ordenar = req.query.sort;
    const {id, titulo, descricao, status, agente_id} = req.query;
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
    if(titulo)
        filtro.titulo = titulo;
    if(descricao)
        filtro.descricao = descricao;
    if(status)
        filtro.status = status;
    if(agente_id)
        filtro.agente_id = agente_id;

    let resultado = await casosRepository.read(filtro, ordenar, direcao);
    return validarRepository(resultado, res, 200);
}

async function getCaso(req, res){
    let idCaso = toBigInt(req.params.id);

    let resultado = await casosRepository.findId(idCaso);
    return validarRepository(resultado, res, 200);
}

async function postCaso(req, res){
    let corpoCaso = req.body;

    corpoCaso.agente_id = toBigInt(corpoCaso.agente_id);

    let resultado = await casosRepository.create(corpoCaso)
    return validarRepository(resultado, res, 201);
}

async function putCaso(req, res){
    let corpoCaso = req.body;
    let idCaso = toBigInt(req.params.id);
    if(idCaso === false){
        return res.status(404).json(error404Body)
    } else {
        corpoCaso.agente_id = toBigInt(corpoCaso.agente_id);
        
        let resultado = await casosRepository.update(idCaso, corpoCaso);
        return validarRepository(resultado, res, 200); 
    } 
}

async function patchCaso(req, res){
    let corpoCaso = req.body;
    let idCaso = toBigInt(req.params.id);
    if(idCaso === false){
        return res.status(404).json(error404Body)
    } else {
        if(corpoCaso.agente_id !== undefined)
            corpoCaso.agente_id = toBigInt(corpoCaso.agente_id);

        let resultado = await casosRepository.update(idCaso, corpoCaso);
        return validarRepository(resultado, res, 200);
    }
}

async function deleteCaso(req, res){
    let casoId = toBigInt(req.params.id);
    let idCaso = toBigInt(req.params.id);
    if(idCaso === false){
        return res.status(404).json(error404Body);
    } else {
        let resultado = await casosRepository.remove(casoId);
        if(resultado == 0){
            return res.status(404).json(error404Body)
        }else if(resultado === false){
            return res.status(500).send()
        }else{
            return res.status(204).send();
        }
    };
}

async function getAgenteCaso(req, res){
    let idCaso = toBigInt(req.params.caso_id);

    if(idCaso === false){
        return res.status(404).json(error404Body);
    } else {
        let casoResultado = await casosRepository.findId(idCaso);
        if(casoResultado === null){
            return res.status(404).json(error404Body);
        } else if(casoResultado === false){
            return res.status(500).send();
        } else if(!casoResultado.agente_id){
            console.log(casoResultado);
            return res.status(404).json({
                status: 404,
                message: "Agente responsável inexistente",
                errors: [
                    {agente_id: "O caso não possui agente reponsável"}
                ]
            })
        } else {
            let resultado = await agentesRepository.findId(casoResultado.agente_id);
            if(resultado === false){
                return res.status(500).send();
            }else{
                resultado.dataDeIncorporacao = resultado.dataDeIncorporacao.toLocaleDateString('en-CA');
                return res.status(200).json(resultado);
            }
        }
    }
}

async function pesquisarCasos(req, res){
    const pesquisa = req.query.q;
    if (!pesquisa){
        return res.status(400).json({
            status: 400,
            message: "Querry inexistente",
            errors: [{
                querry: "O parâmetro 'q' é obrigatório para pesquisa"
            }]
        })
    } else {
        let resultado = await casosRepository.read({}, null, null, pesquisa);
        return validarRepository(resultado, res, 200);
    }

}

module.exports = {
   getAllCasos,
   getCaso,
   postCaso,
   putCaso,
   patchCaso,
   deleteCaso,
   getAgenteCaso,
   pesquisarCasos
}

