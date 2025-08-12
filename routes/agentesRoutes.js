const express = require('express')
const routerAgente = express.Router();
const agentesController = require('../controllers/agentesController');

// define a rota para /agentes usando o método GET
routerAgente.get('/', agentesController.getAllAgentes);
routerAgente.get('/:id/casos', agentesController.getCasosAgente)
routerAgente.get('/:id', agentesController.getAgente);
routerAgente.post('/', agentesController.postAgente);
routerAgente.put('/:id', agentesController.putAgente);
routerAgente.patch('/:id', agentesController.patchAgente);
routerAgente.delete('/:id', agentesController.deleteAgente);

module.exports = routerAgente