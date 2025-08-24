const express = require('express')
const routerCaso = express.Router();
const casosController = require('../controllers/casosController');
const validates = require('../utils/validateFunctions');

/**
 * @openapi
 * components:
 *   schemas:
 *     CasoRequestBody:
 *       type: object
 *       required:
 *         - titulo
 *         - descricao
 *         - status
 *         - agente_id
 *       properties:
 *         titulo:
 *           type: string
 *         descricao:
 *           type: string
 *         status:
 *           type: string
 *         agente_id:
 *           type: string
 *           format: uuid
 *     CasoRequestBodyPatch:
 *       type: object
 *       required: []
 *       properties:
 *         titulo:
 *           type: string
 *         descricao:
 *           type: string
 *         status:
 *           type: string
 *         agente_id:
 *           type: string
 *           format: uuid
 *     CasoErroParametros:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 400
 *         message:
 *           type: string
 *           example: Parâmetros inválidos
 *         errors:
 *           type: array
 *           example:
 *             - titulo: A requisição deve possuir o campo 'titulo'
 *             - descricao: A requisição deve possuir o campo 'descricao'
 *             - status: A requisição deve possuir o campo 'status'
 *             - agente_id: A requisição deve possuir o campo 'agente_id'
 *     CasoInexistenteErro:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 404
 *         message:
 *           type: string
 *           example: Caso inexistente
 *         errors:
 *           type: array
 *           example:
 *             - id: Não existe caso com esse id
 *     CasoAgenteResponsavelErro:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 404
 *         message:
 *           type: string
 *           example: Agente inexistente
 *         errors:
 *           type: array
 *           example:
 *             - id: Não existe agente com esse id
 *     CasoSucesso:
 *       type: object
 *       required:
 *         - id
 *         - titulo
 *         - descricao
 *         - agente_id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         titulo:
 *           type: string
 *         descricao:
 *           type: string
 *         agente_id:
 *           type: string
 *           format: uuid
 *     CasoBuscarErro:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 400
 *         message:
 *           type: string
 *           example: Parâmetro de pesquisa não fornecido
 *         errors:
 *           type: array
 *           example:
 *             - querry: O parâmetro 'q' é obrigatório para pesquisa
 * 
 */


/**
 * @openapi
 *   /casos:
 *     get:
 *       summary: Retorna uma lista de casos
 *       description: Essa rota retorna uma lista de todos os agentes cadastrados.
 *       parameters:
 *         - name: id
 *           in: query
 *           description: Id para filtrar casos
 *           required: false
 *           schema:
 *             type: string
 *           style: form
 *           explode: true
 *         - name: titulo
 *           in: query
 *           description: Título para filtrar casos
 *           required: false
 *           schema:
 *             type: string
 *           style: form
 *           explode: true
 *         - name: descricao
 *           in: query
 *           description: Descrição para filtrar casos
 *           required: false
 *           schema:
 *             type: string
 *           style: form
 *           explode: true
 *         - name: status
 *           in: query
 *           description: Status para filtrar casos
 *           required: false
 *           schema:
 *             type: string
 *           style: form
 *           explode: true
 *         - name: agente_id
 *           in: query
 *           description: Agente_id para filtrar agentes responsáveis do caso
 *           required: false
 *           schema:
 *             type: string
 *           style: form
 *           explode: true
 *         - name: sort
 *           in: query
 *           description: Ordenar por um campo específico
 *           required: false
 *           schema:
 *             type: string
 *           style: form
 *           explode: true
 *       tags:
 *         - Gets
 *       responses:
 *         '200':
 *           description: Retorna todos os casos cadastrados
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 example:
 *                   - id: 58260de7-7be3-4d02-94e4-4c8f51b5fe59
 *                     titulo: homicidio
 *                     descricao: >-
 *                       Disparos foram reportados às 22:33 do dia 10/07/2007 na
 *                       região do bairro União, resultando na morte da vítima, um
 *                       homem de 45 anos.
 *                     status: aberto
 *                     agente_id: 553f2b26-331e-4302-97d8-fb5b9a95cba8
 *                   - id: 43b1333d-c8b3-41d8-a61c-d51891baa048
 *                     titulo: roubo
 *                     descricao: >-
 *                       Assalto a mão armada em uma loja de conveniência no centro
 *                       às 19:15 do dia 12/08/2010.
 *                     status: solucionado
 *                     agente_id: c93dea02-c8dd-4fa6-bba5-2bc2661dbff8
 */
routerCaso.get('/', casosController.getAllCasos);

/**
 * @openapi
 *   /casos/search:
 *     get:
 *       summary: Retorna os casos que possuam a(s) palavra(s) chave(s) especificada(s)
 *       description: >-
 *         Essa rota retorna todos os casos que possuam a(s) palavra(s) chave(s)
 *         especificada(s) presente(s) nos campos titulo ou descricao
 *       parameters:
 *         - name: q
 *           in: query
 *           description: Palvra(s) chave(s) para buscar
 *           required: true
 *           schema:
 *             type: string
 *       tags:
 *         - Gets
 *       responses:
 *         '200':
 *           description: Retorna todos os casos com a(s) palavra(s) chave(s) especificada(s)
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 example:
 *                   - id: 58260de7-7be3-4d02-94e4-4c8f51b5fe59
 *                     titulo: homicidio
 *                     descricao: >-
 *                       Disparos foram reportados às 22:33 do dia 10/07/2007 na
 *                       região do bairro União, resultando na morte da vítima, um
 *                       homem de 45 anos.
 *                     status: aberto
 *                     agente_id: 553f2b26-331e-4302-97d8-fb5b9a95cba8
 *                   - id: 43b1333d-c8b3-41d8-a61c-d51891baa048
 *                     titulo: homicidio
 *                     descricao: >-
 *                       Crime ocorrido em uma residência no bairro Jardins às
 *                       03:00 do dia 15/09/2015.
 *                     status: aberto
 *                     agente_id: 2bf83017-8e0d-43c5-b3b1-6ee98b4fdac2
 *         '400':
 *           description: Erro ao buscar devido a palvra(s) chave(s) não especificada(s)
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CasoBuscarErro'
 */
routerCaso.get('/search', casosController.pesquisarCasos);

/**
 * @openapi
 *   /casos/{id}:
 *     get:
 *       summary: Retorna um caso
 *       description: Essa rota retorna um caso cadastrado com determinado id.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Id do caso para ser retornado
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *       tags:
 *         - Gets
 *       responses:
 *         '200':
 *           description: Retorna o caso cadastrado com id especificado
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CasoSucesso'
 *         '404':
 *           description: Erro ao buscar o caso inexistente
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CasoInexistenteErro'
 */
routerCaso.get('/:id', casosController.getCaso);

/**
 * @openapi
 *   /casos:
 *     post:
 *       summary: Cria o registro de um novo caso
 *       description: Essa rota cria o registro de um novo caso e retorna o caso criado.
 *       tags:
 *         - Posts
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CasoRequestBody'
 *         required:
 *           - titulo
 *           - descricao
 *           - status
 *           - agente_id
 *       responses:
 *         '201':
 *           description: Retorna o caso criado com sucesso
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CasoSucesso'
 *         '400':
 *           description: Erro ao criar o caso, devido a dados inválidos
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CasoErroParametros'
 *         '404':
 *           description: Erro ao criar o caso, devido ao agente inexistente
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AgenteInexistenteErro'
 */
routerCaso.post('/', validates.validateCasoFullBody, casosController.postCaso);


/**
 * @openapi
 * /casos/{id}:
 *     put:
 *       summary: Atualiza completamente o registro de um caso
 *       description: >-
 *         Essa rota atualiza completamente o registro de um caso e retorna o caso
 *         atualizado.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Id do caso para ser atualizado
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *       tags:
 *         - Puts
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CasoRequestBody'
 *         required:
 *           - titulo
 *           - descricao
 *           - status
 *           - agente_id
 *       responses:
 *         '200':
 *           description: Retorna o caso criado com sucesso
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CasoSucesso'
 *         '400':
 *           description: Erro ao atualizar o caso, devido a dados inválidos
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CasoErroParametros'
 *         '404':
 *           description: Erro ao atualizar o caso inexistente
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CasoInexistenteErro'
 */
routerCaso.put('/:id', validates.validateCasoFullBody, casosController.putCaso);

/**
 * @openapi
 * /casos/{id}:
 *     patch:
 *       summary: Atualiza parcialmente o registro de um caso
 *       description: >-
 *         Essa rota atualiza parcialmente o registro de um caso e retorna o caso
 *         atualizado.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Id do caso para ser atualizado
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *       tags:
 *         - Patches
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CasoRequestBodyPatch'
 *       responses:
 *         '200':
 *           description: Retorna o caso criado com sucesso
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CasoSucesso'
 *         '400':
 *           description: Erro ao criar o caso, devido a dados inválidos
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CasoErroParametros'
 *         '404':
 *           description: Erro ao atualizar o caso inexistente
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CasoInexistenteErro'
 */
routerCaso.patch('/:id', validates.validateCasoPartialBody, casosController.patchCaso);

/**
 * @openapi
 * /casos/{id}:
 *     delete:
 *       summary: Deleta o registro de um caso
 *       description: Essa rota deleta o registro de um caso
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Id do caso para ser excluído
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *       tags:
 *         - Deletes
 *       responses:
 *         '204':
 *           description: Caso excluido com sucesso, sem retorno
 *         '404':
 *           description: Erro ao deletar o caso inexistente
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CasoInexistenteErro'
 */
routerCaso.delete('/:id', casosController.deleteCaso);

/**
 * @openapi
 *   /casos/{caso_id}/agente:
 *     get:
 *       summary: Retorna o agente responsável pelo caso
 *       description: >-
 *         Essa rota retorna os dados do agente responsável pelo caso cadastrado
 *         com determinado id.
 *       parameters:
 *         - name: caso_id
 *           in: path
 *           description: Id do caso para retornar o agente responsável
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *       tags:
 *         - Gets
 *       responses:
 *         '200':
 *           description: >-
 *             Retorna os dados do agente responsável pelo caso cadastrado com id
 *             especificado
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AgenteSucesso'
 *         '404':
 *           description: Erro ao buscar o caso inexistente
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CasoInexistenteErro'
 */
routerCaso.get('/:caso_id/agente', casosController.getAgenteCaso);

module.exports = routerCaso