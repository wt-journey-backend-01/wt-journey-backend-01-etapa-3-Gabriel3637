const express = require('express')
const routerCaso = express.Router();
const casosController = require('../controllers/casosController');

// define a rota para /agentes usando o método GET
routerCaso.get('/', casosController.getAllCasos);
routerCaso.get('/search', casosController.pesquisarCasos);
routerCaso.get('/:id', casosController.getCaso);
routerCaso.post('/', casosController.postCaso);
routerCaso.put('/:id', casosController.putCaso);
routerCaso.patch('/:id', casosController.patchCaso);
routerCaso.delete('/:id', casosController.deleteCaso);
routerCaso.get('/:caso_id/agente', casosController.getAgenteCaso);

module.exports = routerCaso