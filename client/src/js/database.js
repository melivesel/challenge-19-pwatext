import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  try {
    console.log("Post to the database");
    const jateDb = await openDB('jate');
    const tx = jateDb.transaction('jate', 'readwrite');
    const store = tx.objectStore('jate');
    const request = store.put({content, id: 1 });
    const result = await request; 
    console.log('Data saved to the database', result);
  } catch (error) {
    console.error('Error saving data to the database:', error);
    // You can add additional error handling logic here, such as logging, displaying messages to the user, etc.
  }
};
// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  console.log('GET from the database');

  // Create a connection to the database database and version we want to use.
  const contactDb = await openDB('jate', 1);

  // Create a new transaction and specify the database and data privileges.
  const tx = contactDb.transaction('jate', 'readonly');

  // Open up the desired object store.
  const store = tx.objectStore('jate');

  // Use the .getAll() method to get all data in the database.
  const request = store.get(1);

  // Get confirmation of the request.
  const result = await request;
  console.log('result.value', result);
  return result?.content;
};
initdb();
