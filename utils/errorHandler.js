const {z} = require("zod");

const schemeBaseCaso = z.object({
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
    agente_id: z.nullable(z.int({
        error: (campo) => campo.input === undefined ? "A requisição deve possuir o campo 'agente_id'" : "A requisição deve possuir o campo 'agente_id' válido (inteiro ou null)" 
    }))
});

const schemeBaseAgente = z.object({
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
}, {error: "Atributo desconhecido"})

const schemeBaseId = z.intersection(z.string({error: "O id deve ser de um tipo válido (string)"}), z.uuidv4({error: "O id deve possuir formato valido (uuid)"}));

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
    schemeBaseAgente,
    schemeBaseCaso,
    validarScheme,
    validarSchemeAsync,
    schemeBaseId,
}