db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE || "test"); // Use the database from env or 'test' if not provided

db.createUser({
  user: process.env.MONGO_INITDB_ROOT_USERNAME, // Use the username from the env variables
  pwd: process.env.MONGO_INITDB_ROOT_PASSWORD, // Use the password from the env variables
  roles: [
    {
      role: "readWrite",
      db: process.env.MONGO_INITDB_DATABASE || "test", // Grant readWrite role to the user on the specified database
    },
  ],
});

db.createCollection("delete_me"); // Example: Creates a collection in the new database
