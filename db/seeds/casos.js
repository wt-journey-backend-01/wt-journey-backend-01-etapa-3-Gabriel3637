/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('casos').del()
  await knex('casos').insert([
    {
      titulo: 'homicidio',
      descricao: 'Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.',
      status: 'aberto',
      agente_id: 8
    },
    {
      titulo: 'roubo',
      descricao: 'Assalto a mão armada em uma loja de conveniência no centro às 19:15 do dia 12/08/2010.',
      status: 'solucionado',
      agente_id: 2
    },
    {
      titulo: 'homicidio',
      descricao: 'Crime ocorrido em uma residência no bairro Jardins às 03:00 do dia 15/09/2015.',
      status: 'aberto',
      agente_id: 4
    },
    {
      titulo: 'furto',
      descricao: 'Furto de veículo na rua principal do bairro São José às 14:20 do dia 20/11/2018.',
      status: 'aberto',
      agente_id: 5
    },
    {
      titulo: 'roubo',
      descricao: 'Assalto a pedestres no parque municipal às 17:45 do dia 05/03/2020.',
      status: 'solucionado',
      agente_id: 6
    },
    {
      titulo: 'homicidio',
      descricao: 'Incidente com vítima fatal no bairro Centro às 23:50 do dia 18/04/2012.',
      status: 'aberto',
      agente_id: 8
    },
    {
      titulo: 'sequestro',
      descricao: 'Sequestro relatado na rodovia estadual às 21:00 do dia 25/06/2019.',
      status: 'aberto',
      agente_id: 9
    },
    {
      titulo: 'roubo',
      descricao: 'Assalto a banco no centro da cidade às 10:30 do dia 30/01/2017.',
      status: 'solucionado',
      agente_id: 11
    },
    {
      titulo: 'furto',
      descricao: 'Furto de objetos pessoais em um shopping às 16:00 do dia 14/02/2021.',
      status: 'aberto',
      agente_id: 13
    },
    {
      titulo: 'homicidio',
      descricao: 'Crime registrado em um bar no bairro Vila Nova às 20:10 do dia 22/05/2013.',
      status: 'aberto',
      agente_id: 14
    },
    {
      titulo: 'roubo',
      descricao: 'Assalto a residência no bairro Alto às 02:00 do dia 10/09/2016.',
      status: 'solucionado',
      agente_id: 16
    },
    {
      titulo: 'sequestro',
      descricao: 'Sequestro de veículo na estrada rural às 18:40 do dia 07/12/2022.',
      status: 'aberto',
      agente_id: 17
    },
    {
      titulo: 'furto',
      descricao: 'Furto de bicicleta em praça pública às 13:30 do dia 19/10/2014.',
      status: 'aberto',
      agente_id: 19
    },
    {
      titulo: 'homicidio',
      descricao: 'Homicídio no bairro Industrial às 00:15 do dia 28/03/2011.',
      status: 'solucionado',
      agente_id: 20
    },
    {
      titulo: 'roubo',
      descricao: 'Assalto a joalheria no centro às 11:00 do dia 15/06/2018.',
      status: 'aberto',
      agente_id: 20
    },
    {
      titulo: 'furto',
      descricao: 'Furto de celular em transporte público às 08:45 do dia 03/04/2020.',
      status: 'solucionado',
      agente_id: 20
    },
    {
      titulo: 'sequestro',
      descricao: 'Sequestro relâmpago no bairro Central às 22:00 do dia 12/07/2015.',
      status: 'aberto',
      agente_id: 20
    },
    {
      titulo: 'homicidio',
      descricao: 'Crime passional registrado no bairro Sul às 19:30 do dia 25/08/2019.',
      status: 'aberto',
      agente_id: 20
    },
    {
      titulo: 'roubo',
      descricao: 'Assalto a supermercado no bairro Oeste às 16:50 do dia 09/02/2023.',
      status: 'solucionado',
      agente_id: 20
    },
    {
      titulo: 'furto',
      descricao: 'Furto de carteira em evento público às 20:00 do dia 17/05/2017.',
      status: 'aberto',
      agente_id: 20
    }
  ]);
};
