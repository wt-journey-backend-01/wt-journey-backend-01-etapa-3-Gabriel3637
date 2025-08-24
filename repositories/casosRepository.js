
const db = require('../db/db')


async function read(filtro = {}, ordenacao = null, direcao = null, query = null){
    try{
        let result = false
        if(ordenacao && direcao){
            if(query){
                result = await db("casos").where(filtro).orderBy(ordenacao, direcao).andWhere(function(){
                    this.whereILike('titulo', `%${query}%`).orWhereILike('descricao', `%${query}%`)
                });
            }else {
                result = await db("casos").where(filtro).orderBy(ordenacao, direcao)
            }
        } else {
            if(query){
                result = await db("casos").where(filtro).andWhere(function(){
                    this.whereILike('titulo', `%${query}%`).orWhereILike('descricao', `%${query}%`)
                });
            }else {
                result = await db("casos").where(filtro)
            }
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
        let resp = await db("casos").where({id: id});
        if(resp.length == 0){
            return null;
        } else {
            return resp[0];
        }
    }catch(err){
        return false;
    }
}

async function create(caso){
    try{
        const result = await db('casos').insert(caso, ["*"]);

        return result[0];
    }catch(err){
        console.log(err);
        if(err.code = "23503"){
            return {code: err.code}
        }else {
            return false;
        }
    } 
}

async function remove(id){
    try{
        const result = await db("casos").where({id: id}).del();
        return result;
    }catch(err){
        console.log(err);
        return false;
    }
}

async function update(id, objUpdate) {
    try {
        const result = await db("casos").where({id: id}).update(objUpdate, ["*"])
        if(result.length == 0){
            return null;
        } else {
            return result[0]
        }
    } catch (err) {
        console.log(err);
        if(err.code = "23503"){
            return {code: err.code}
        }else {
            return false;
        }
    }
}

//create({titulo: "teste", descricao: "teste", status:"aberto", agente_id:null}).then((result)=> console.log(result))

//update(22, {titulo: "teste1", descricao: "teste", status:"aberto", agente_id:2}).then((result) => console.log(result));



module.exports = {
    findId,
    read,
    update,
    remove,
    create
}
