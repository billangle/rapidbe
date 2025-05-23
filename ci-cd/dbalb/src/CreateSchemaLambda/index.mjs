import pkg from 'pg';
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";





export const handler = async (event) => {

  const client = new SecretsManagerClient();
  const secretData = await client.send(
    new GetSecretValueCommand({
      SecretId: process.env.DB_SECRET_ARN,
    }),
  );
  
  const secret = JSON.parse(secretData.SecretString);
  console.log ("Secret: ", secret);

  const pgclient = new pkg.Client({
    user: secret.username,
    host: process.env.DB_HOST,
    database: 'postgres', // Connect to default DB
    password: secret.password,
    port: 5432,
    ssl: {
      rejectUnauthorized: false, // For self-signed certificates
    },
  });
  
   console.log('Connecting to PostgreSQL ' +  secret.password + " : "  + process.env.DB_HOST);

  try {
    await pgclient.connect();
    console.log('Connected to PostgreSQL');
    
    // SQL commands to create the schema
    //const createSchemaQuery = 'CREATE SCHEMA IF NOT EXISTS thrive;';
    //CREATE DATABASE dbname;
    const createSchemaQuery = 'CREATE DATABASE thrive;';
    await pgclient.query(createSchemaQuery);
    console.log('Schema created or already exists');
    
    await pgclient.end();
  } catch (err) {
    console.error('Error running SQL query', err.stack);
    //throw new Error(err);
  }
}