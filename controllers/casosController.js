const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require("../repositories/agentesRepository");
const tratadorErro = require("../utils/errorHandler");
const { success } = require("zod");

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
            resultado = validar
        } else {
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

    return casosRepository.read(filtro, ordenar, direcao).then((resultado)=> validarRepository(resultado, res, 200)); 
}

async function getCaso(req, res){
    let idCaso = toBigInt(req.params.id);

    return tratadorErro.validarSchemeAsync(tratadorErro.EsquemaIdCaso, idCaso).then((resultado)=> {
        validarRepository(resultado, res, 200)
    });


}

async function postCaso(req, res){
    let corpoCaso = req.body;

    corpoCaso.agente_id = toBigInt(corpoCaso.agente_id);

    let resultado = tratadorErro.validarScheme(tratadorErro.EsquemaBaseCaso.strict(), corpoCaso);
    if(!resultado.success){
        return res.status(400).json(resultado)
    } else {
        if(corpoCaso.agente_id){
            return tratadorErro.validarSchemeAsync(tratadorErro.EsquemaIdAgente, corpoCaso.agente_id).then((agenteResultado) => {
                if(!agenteResultado.success){
                    return res.status(404).json(agenteResultado)
                } else {
                    return casosRepository.create(corpoCaso).then((resultado)=> validarRepository(resultado, res, 201));
                }
            });
        }else{
            return casosRepository.create(corpoCaso).then((resultado)=> validarRepository(resultado, res, 201));
        }
    }
}

function putCaso(req, res){
    let corpoCaso = req.body;
    let idCaso = toBigInt(req.params.id);

    corpoCaso.agente_id = toBigInt(corpoCaso.agente_id);

    let resultadoParametros = tratadorErro.validarScheme(tratadorErro.EsquemaBaseCaso.strict(), corpoCaso);
    if(!resultadoParametros.success){
        return res.status(400).json(resultadoParametros)
    } else {
        return tratadorErro.validarSchemeAsync(tratadorErro.EsquemaIdCaso, idCaso).then((casoResultado)=>{
            if(!casoResultado.success){
                return res.status(404).json(casoResultado)
            } else {
                if(corpoCaso.agente_id){
                    return tratadorErro.validarSchemeAsync(tratadorErro.EsquemaIdAgente, corpoCaso.agente_id).then((agenteResultado)=>{
                        if(!agenteResultado.success){
                            return res.status(404).json(agenteResultado)
                        } else {
                            return casosRepository.update(idCaso, corpoCaso).then((resultado) => validarRepository(resultado, res, 200));
                        }
                    });
                }else{
                    return casosRepository.update(idCaso, corpoCaso).then((resultado) => validarRepository(resultado, res, 200)); 
                }
            }
    
        });
    }
    
}

async function patchCaso(req, res){
    let corpoCaso = req.body;
    let idCaso = toBigInt(req.params.id);
 
    corpoCaso.agente_id = toBigInt(corpoCaso.agente_id);

    let resultadoParametros = tratadorErro.validarScheme(tratadorErro.EsquemaBaseCaso.partial(), corpoCaso);
    if(!resultadoParametros.success){
        return res.status(400).json(resultadoParametros)
    } else {
        return tratadorErro.validarSchemeAsync(tratadorErro.EsquemaIdCaso, idCaso).then((casoResultado) => {
            if(!casoResultado.success){
                return res.status(404).json(casoResultado)
            }else {
                if(corpoCaso.agente_id){
                    return tratadorErro.validarSchemeAsync(tratadorErro.EsquemaIdAgente, corpoCaso.agente_id).then((agenteResultado) => {
                        if(!agenteResultado.success){
                            return res.status(404).json(resultado)
                        }else {
                            return casosRepository.update(idCaso, corpoCaso).then((resultado) => validarRepository(resultado, res, 200))
                        }
                    });
                }else{
                    return casosRepository.update(idCaso, corpoCaso).then((resultado) => validarRepository(resultado, res, 200))
                }
            }
        });
    }
}

async function deleteCaso(req, res){
    let casoId = toBigInt(req.params.id);
    return tratadorErro.validarSchemeAsync(tratadorErro.EsquemaIdCaso, casoId).then((casoResultado)=>{
        if(!casoResultado.success){
            return res.status(404).json(casoResultado)
        }else{
            return casosRepository.remove(casoId).then((resultado)=> {
                if(resultado){
                    return res.status(204).send();
                } else {
                    return res.status(500).send()
                }
            });
        }
    });
}

async function getAgenteCaso(req, res){
    let idCaso = toBigInt(req.params.caso_id);

    return tratadorErro.validarSchemeAsync(tratadorErro.EsquemaIdCaso, idCaso).then((resultadoCaso) => {
        if(!resultadoCaso.success){
            return res.status(404).json(resultadoCaso)
        } else {
            if(!resultadoCaso.agente_id){
                return res.status(404).json({
                    success: false,
                    errors: [{
                        path: ["agente_id"],
                        message: "O caso não possui agente reponsável"
                    }]
                })
            }else{
                return tratadorErro.validarSchemeAsync(tratadorErro.EsquemaIdAgente, toBigInt(resultadoCaso.agente_id)).then((resultado)=>{
                    if(resultado){
                        if(resultado.success === false){
                            return res.status(404).json(resultado)
                        } else {
                            resultado.dataDeIncorporacao = resultado.dataDeIncorporacao.toLocaleDateString('en-CA')
                            resultado = {
                                success: true,
                                ...resultado
                            }
                        }
                        return res.status(200).json(resultado);
                    }else {
                        return res.status(500).send()
                    }
                });
            };
        }
    });
}


async function pesquisarCasos(req, res){
    const pesquisa = req.query.q;
    if (!pesquisa){
        return res.status(400).json({
            success: false,
            errors: [{
                path: ["querry"],
                message: "O parâmetro 'q' é obrigatório para pesquisa"
            }]
        })
    } else {
        return casosRepository.read({}, null, null, pesquisa).then((resultado) => validarRepository(resultado, res, 200));
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

