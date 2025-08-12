const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require("../repositories/agentesRepository")

const {z} = require("zod");

const EsquemaBaseCaso = z.object({
    id: z.undefined({
        error: "Campo 'id' não pode ser alterado"
    }),
    titulo: z.string({
        error: (campo) => campo.input === undefined ?  "A requisição deve possuir o campo 'titulo'" : "A requisição deve possuir o campo 'titulo' válido (string)"
    }).min(1, "O campo 'titulo' não pode ser vazio"),
    descricao: z.string({
        error: (campo) => campo.input === undefined ?  "A requisição deve possuir o campo 'descricao'" : "A requisição deve possuir o campo 'descricao' válido (string)"
    }).min(1, "O campo 'descricao' não pode ser vazio"),
    status: z.intersection(z.string({
        error: (campo) => campo.input === undefined ?  "A requisição deve possuir o campo 'status'" : "A requisição deve possuir o campo 'status' válido (string)"
    }), z.enum(["aberto", "solucionado"], {error: "O campo 'status' pode ser somente 'aberto' ou 'solucionado'"})),
    agente_id: z.nullable(z.bigint({
        error: (campo) => campo.input === undefined ? "A requisição deve possuir o campo 'agente_id'" : "A requisição deve possuir o campo 'agente_id' válido (bigint ou null)" 
    }))
});

const EsquemaBaseAgente = z.object({
    id: z.undefined({
        error: "Campo 'id' não pode ser alterado"
    }),
    nome: z.string({
        error: (campo) => campo.input === undefined ? "A requisição deve possuir o campo 'nome'" : "A requisição deve possuir o campo 'nome' válido (string)"
    }).min(1, "O campo 'nome' não pode ser vazio"),
    dataDeIncorporacao: z.intersection(z.string({
        error: (campo) => campo.input === undefined ? "A requisição deve possuir o campo 'dataDeIncorporacao'" : "A requisição deve possuir o campo 'dataDeIncorporacao' válido (string)"
    }).regex(/^\d{4}-\d{2}-\d{2}$/, {
        error: "Campo dataDeIncorporacao deve seguir a formatação 'YYYY-MM-DD' "
    }), z.refine(
        (campo) =>{
            let objData = new Date();
            return (!isNaN(objData.getDate()) && objData >= new Date(campo))
        }, {
            error: "Campo dataDeIncorporacao não pode ser uma data futura"
        }
    )),
    cargo: z.string({
        error: (campo) => campo.input === undefined ? "A requisição deve possuir o campo 'cargo'" : "A requisição deve possuir o campo 'cargo' válido (string)"
    }).min(1, "O campo 'cargo' não pode ser vazio")
})

const EsquemaIdCaso = z.bigint({error: "Id deve ser de um tipo válido (bigint)"}).transform(async (val, ctx)=>{
    return casosRepository.read({id: val}).then(casoEncontrado => {
        if(casoEncontrado && !Array.isArray(casoEncontrado)){
            return casoEncontrado;
        } else if(!casoEncontrado || casoEncontrado.length == 0){
            ctx.issues.push({
            code: "custom",
            message: "Não existe caso com esse id",
            input: val,
            });
            return z.NEVER;
        }
    });
    
});

const EsquemaIdAgente = z.bigint({error: "Id deve ser de um tipo válido (bigint)"}).transform( async (val, ctx)=>{
    return agentesRepository.read({id: val}).then(agenteEncontrado => {
        if(agenteEncontrado && !Array.isArray(agenteEncontrado)){
            return agenteEncontrado;
        } else if(!agenteEncontrado || agenteEncontrado.length == 0){
            ctx.issues.push({
            code: "custom",
            message: "Não existe agente com esse id",
            input: val,
            });
            return z.NEVER;
        }
    });
});

function validarScheme(scheme, itemValidar){
    let resultado = scheme.safeParse(itemValidar);
    if(!resultado.success){
        return {
            success: resultado.success,
            errors: resultado.error.issues.map((item) => {
                return{
                    path: item.path,
                    message: item.message
                }
            })
        }
    }else{
        return resultado
    }
}

async function validarSchemeAsync(scheme, itemValidar){
    let resultado = await scheme.safeParseAsync(itemValidar);
    if(!resultado.success){
        return {
            success: resultado.success,
            errors: resultado.error.issues.map((item) => {
                return{
                    path: item.path,
                    message: item.message
                }
            })
        }
    }else{
        resultado= {
            success: resultado.success,
            ...resultado.data
        }
        return resultado
    }
}



module.exports = {
    EsquemaBaseAgente,
    EsquemaBaseCaso,
    validarScheme,
    validarSchemeAsync,
    EsquemaIdCaso,
    EsquemaIdAgente
}