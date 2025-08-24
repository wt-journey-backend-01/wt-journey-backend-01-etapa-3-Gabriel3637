
const db = require('../db/db')


async function read(filtro = {}, ordenacao = null, direcao = null){
    try{
        let result = false
        if(ordenacao && direcao){
            result = await db("agentes").where(filtro).orderBy(ordenacao, direcao)
        } else {
            result = await db("agentes").where(filtro)
        }
        
        const isSingular = Object.keys(filtro).length == 1 && 'id' in filtro && result.length == 1;

        if (isSingular){
            return result[0];
        }
        return result;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function findId(id) {
    try{
        let resp = await db("agentes").where({id: id});
        if(resp.length == 0){
            return null;
        } else {
            return resp[0];
        }
    }catch(err){
        return false;
    }
}

async function create(agente){
    try{
        const result = await db('agentes').insert(agente, ["*"]);

        return result[0];
    }catch(err){
        console.log(err);
        return false;
    } 
}

async function remove(id){
    try{
        const result = await db("agentes").where({id: id}).del();
        return result;
    }catch(err){
        console.log(err);
        return false;
    }
}

async function update(id, objUpdate) {
    try {
        const result = await db("agentes").where({id: id}).update(objUpdate, ["*"])
        if(result.length == 0){
            return null;
        }else{
            return result[0]
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

//remove(30).then((resultado => console.log(typeof(resultado))));
//read({id: 1}).then(caso => console.log(caso))

module.exports = {
    findId,
    read,
    update,
    remove,
    create
}
