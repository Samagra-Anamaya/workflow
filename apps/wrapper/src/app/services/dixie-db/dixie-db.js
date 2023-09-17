import Dexie from 'dexie';

export const db = new Dexie("mydb");
db.version(1).stores({
    assessment: '++id, assessment', // Primary key and indexed props
});
