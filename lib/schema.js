const { sql } = require("drizzle-orm");
const { text, integer, sqliteTable,numeric } = require("drizzle-orm/sqlite-core");

const posts = sqliteTable('posts', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull().default("Others"),
  created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});


module.exports = {posts};