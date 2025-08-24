const express = require('express')
const routerAgente = express.Router();
const agentesController = require('../controllers/agentesController');
const validates = require('../utils/validateFunctions');

/**
 * @openapi
 * components:
 *   schemas:
 *     AgenteRequestBody:
 *       type: object
 *       required:
 *         - nome
 *         - dataDeIncorporacao
 *         - cargo
 *       properties:
 *         nome:
 *           type: string
 *         dataDeIncorporacao:
 *           type: string
 *           format: date
 *         cargo:
 *           type: string
 *     AgenteRequestBodyPatch:
 *       type: object
 *       required: []
 *       properties:
 *         nome:
 *           type: string
 *         dataDeIncorporacao:
 *           type: string
 *         cargo:
 *           type: string
 *     AgenteErroParametros:
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
 *             - nome: A requisição deve possuir o campo 'nome'
 *             - dataDeIncorporacao: A requisição deve possuir o campo 'dataDeIncorporacao'
 *             - cargo: A requisição deve possuir o campo 'cargo'
 *     AgenteInexistenteErro:
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
 *     AgenteSucesso:
 *       type: object
 *       required:
 *         - id
 *         - nome
 *         - dataDeIncorporacao
 *         - cargo
 *       properties:
 *         id:
 *           type: string
 *         nome:
 *           type: string
 *         dataDeIncorporacao:
 *           type: string
 *           format: date
 *         cargo:
 *           type: string
 */

/**
 * @openapi
 * /agentes:
 *     get:
 *       summary: Retorna uma lista de agentes
 *       description: Essa rota retorna uma lista de todos os agentes cadastrados.
 *       parameters:
 *         - name: id
 *           in: query
 *           description: Id para filtrar agentes
 *           required: false
 *           schema:
 *             type: string
 *           style: form
 *           explode: true
 *         - name: nome
 *           in: query
 *           description: Nome para filtrar agentes
 *           required: false
 *           schema:
 *             type: string
 *           style: form
 *           explode: true
 *         - name: dataDeIncorporacao
 *           in: query
 *           description: dataDeIncorporacao para filtrar agentes
 *           required: false
 *           schema:
 *             type: string
 *           style: form
 *           explode: true
 *         - name: cargo
 *           in: query
 *           description: Cargo para filtrar agentes
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
 *           description: Retorna todos os agentes cadastrados
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 example:
 *                   - id: 4dcd8f2a-1a2f-4786-af0a-d7baee70f270
 *                     nome: Rommel Carneiro
 *                     dataDeIncorporacao: '1992-10-04'
 *                     cargo: delegado
 *                   - id: c93dea02-c8dd-4fa6-bba5-2bc2661dbff8
 *                     nome: Ana Silva
 *                     dataDeIncorporacao: '2000-05-12'
 *                     cargo: investigador
 */
routerAgente.get('/', agentesController.getAllAgentes);

/**
 * @openapi
 * /agentes/{id}:
 *     get:
 *       summary: Retorna um agentes
 *       description: Essa rota retorna um agente cadastrado com determinado id.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Id do agente para ser retornado
 *           required: true
 *           schema:
 *             type: string
 *       tags:
 *         - Gets
 *       responses:
 *         '200':
 *           description: Retorna o agente cadastrado com id especificado
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AgenteSucesso'
 *         '404':
 *           description: Erro ao encontrar o agente inexistente
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AgenteInexistenteErro'
 */
routerAgente.get('/:id', agentesController.getAgente);

/**
 * @openapi
 * /agentes:
 *     post:
 *           summary: Cria o registro de um novo agente
 *           description: Essa rota cria o registro de um novo agente e retorna o agente criado.
 *           tags:
 *             - Posts
 *           requestBody:
 *             content:
 *               application/json:
 *                 schema:
 *                   $ref: '#/components/schemas/AgenteRequestBody'
 *             required:
 *               - nome
 *               - dataDeIncorporacao
 *               - cargo
 *           responses:
 *             '201':
 *               description: Retorna o agente criado com sucesso
 *               content:
 *                 application/json:
 *                   schema:
 *                     $ref: '#/components/schemas/AgenteSucesso'
 *             '400':
 *               description: Erro ao criar o agente, devido a dados inválidos
 *               content:
 *                 application/json:
 *                   schema:
 *                     $ref: '#/components/schemas/AgenteErroParametros'
 */
routerAgente.post('/', validates.validateAgenteFullBody, agentesController.postAgente);

/**
 * @openapi
 * /agentes/{id}:
 *     put:
 *           summary: Atualiza completamente o registro de um agente
 *           description: >-
 *             Essa rota atualiza completamente o registro de um agente e retorna o
 *             agente atualizado.
 *           parameters:
 *             - name: id
 *               in: path
 *               description: Id do agente para ser atualizado
 *               required: true
 *               schema:
 *                 type: string
 *           tags:
 *             - Puts
 *           requestBody:
 *             content:
 *               application/json:
 *                 schema:
 *                   $ref: '#/components/schemas/AgenteRequestBody'
 *             required:
 *               - nome
 *               - dataDeIncorporacao
 *               - cargo
 *           responses:
 *             '200':
 *               description: Retorna o agente criado com sucesso
 *               content:
 *                 application/json:
 *                   schema:
 *                     $ref: '#/components/schemas/AgenteSucesso'
 *             '400':
 *               description: Erro ao atualizar o agente, devido a dados inválidos
 *               content:
 *                 application/json:
 *                   schema:
 *                     $ref: '#/components/schemas/AgenteErroParametros'
 *             '404':
 *               description: Erro ao atualizar o agente inexistente
 *               content:
 *                 application/json:
 *                   schema:
 *                     $ref: '#/components/schemas/AgenteInexistenteErro'
 */
routerAgente.put('/:id', validates.validateAgenteFullBody, agentesController.putAgente);

/**
 * @openapi
 * /agentes/{id}:
 *     patch:
 *       summary: Atualiza parcialmente o registro de um agente
 *       description: >-
 *         Essa rota atualiza parcialmente o registro de um agente e retorna o
 *         agente atualizado.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Id do agente para ser atualizado
 *           required: true
 *           schema:
 *             type: string
 *       tags:
 *         - Patches
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AgenteRequestBodyPatch'
 *       responses:
 *         '200':
 *           description: Retorna o agente criado com sucesso
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AgenteSucesso'
 *         '400':
 *           description: Erro ao atualizar parcialmente o agente, devido a dados inválidos
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AgenteErroParametros'
 *         '404':
 *           description: Erro ao atualizar parcialmente o agente inexistente
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AgenteInexistenteErro'
 */
routerAgente.patch('/:id', validates.validateAgentePartialBody, agentesController.patchAgente);
/**
 * @openapi
 * /agentes/{id}:
 *     delete:
 *       summary: Deleta o registro de um agentes
 *       description: Essa rota deleta o registro de um agente
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Id do agente para ser excluído
 *           required: true
 *           schema:
 *             type: string
 *       tags:
 *         - Deletes
 *       responses:
 *         '204':
 *           description: Agente excluido com sucesso, sem retorno
 *         '404':
 *           description: Erro ao deletar o agente inexistente
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AgenteInexistenteErro'
 */

routerAgente.delete('/:id', agentesController.deleteAgente);


/**
 * @openapi
 *   /agentes/{id}/casos:
 *     get:
 *       summary: Retorna os casos designados à um agente
 *       description: >-
 *         Essa rota retorna os dados dos casos designados à um agente
 *         com determinado id.
 *       parameters:
 *         - name: id
 *           in: path
 *           description: Id do agente para retornar os casos designinados
 *           required: true
 *           schema:
 *             type: string
 *       tags:
 *         - Gets
 *       responses:
 *         '200':
 *           description: >-
 *             Retorna os dados dos casos designados ao agente cadastrado com id
 *             especificado
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
 *         '404':
 *           description: Erro ao buscar o agente inexistente
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AgenteInexistenteErro'
 */
routerAgente.get('/:id/casos', agentesController.getCasosAgente)

module.exports = routerAgente