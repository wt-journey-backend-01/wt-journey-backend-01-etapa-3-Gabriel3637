/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('agentes').del()
  await knex('agentes').insert([
    {
      nome: 'Rommel Carneiro',
      dataDeIncorporacao: new Date('1992-10-04'),
      cargo: 'delegado'
    },
    {
      nome: 'Ana Silva',
      dataDeIncorporacao: new Date('2000-05-12'),
      cargo: 'inspetor'
    },
    {
      nome: 'Rommel Carneiro',
      dataDeIncorporacao: new Date('1995-03-22'),
      cargo: 'delegado'
    },
    {
      nome: 'Carlos Mendes',
      dataDeIncorporacao: new Date('1992-10-04'),
      cargo: 'delegado'
    },
    {
      nome: 'Beatriz Costa',
      dataDeIncorporacao: new Date('2010-07-19'),
      cargo: 'inspetor'
    },
    {
      nome: 'Rommel Carneiro',
      dataDeIncorporacao: new Date('2005-11-30'),
      cargo: 'delegado'
    },
    {
      nome: 'Juliana Pereira',
      dataDeIncorporacao: new Date('1998-02-15'),
      cargo: 'delegado'
    },
    {
      nome: 'Marcos Lima',
      dataDeIncorporacao: new Date('2000-05-12'),
      cargo: 'inspetor'
    },
    {
      nome: 'Ana Silva',
      dataDeIncorporacao: new Date('2015-09-25'),
      cargo: 'delegado'
    },
    {
      nome: 'Pedro Almeida',
      dataDeIncorporacao: new Date('1992-10-04'),
      cargo: 'delegado'
    },
    {
      nome: 'Fernanda Oliveira',
      dataDeIncorporacao: new Date('2003-04-10'),
      cargo: 'inspetor'
    },
    {
      nome: 'Rommel Carneiro',
      dataDeIncorporacao: new Date('2010-07-19'),
      cargo: 'inspetor'
    },
    {
      nome: 'Lucas Souza',
      dataDeIncorporacao: new Date('1995-03-22'),
      cargo: 'delegado'
    },
    {
      nome: 'Ana Silva',
      dataDeIncorporacao: new Date('2005-11-30'),
      cargo: 'inspetor'
    },
    {
      nome: 'Mariana Rocha',
      dataDeIncorporacao: new Date('2015-09-25'),
      cargo: 'inspetor'
    },
    {
      nome: 'Carlos Mendes',
      dataDeIncorporacao: new Date('1998-02-15'),
      cargo: 'delegado'
    },
    {
      nome: 'Beatriz Costa',
      dataDeIncorporacao: new Date('2003-04-10'),
      cargo: 'inspetor'
    },
    {
      nome: 'Rommel Carneiro',
      dataDeIncorporacao: new Date('2000-05-12'),
      cargo: 'inspetor'
    },
    {
      nome: 'Ana Silva',
      dataDeIncorporacao: new Date('2010-07-19'),
      cargo: 'delegado'
    },
    {
      nome: 'Paulo Santos',
      dataDeIncorporacao: new Date('1992-10-04'),
      cargo: 'inspetor'
    }
  ]);
};
