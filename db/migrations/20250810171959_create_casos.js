/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  return await knex.schema.createTable('casos', (table) => {
    table.increments('id').primary();
    table.string('titulo').notNullable();
    table.string('descricao').notNullable();
    table.enu('status', ["aberto", "solucionado"]).notNullable();
    table.integer('agente_id').nullable().references('id').inTable('agentes').onDelete('SET NULL');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  return await knex.schema.dropTable('casos')
};
