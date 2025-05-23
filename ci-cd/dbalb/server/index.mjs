import express from 'express';
import { config } from 'dotenv'
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';


config();

const app = express();
const port = process.env.PORT || 80;



const marshallOptions = {
  convertEmptyValues: false,
  removeUndefinedValues: true,
};



app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
  const { name, description, completed } = req.body.todo;

  const todo = {
    sort_key: uuidv4(),
    partition_key: 'todo',
    name,
    description,
    completed,
  };



  res.status(200).send({
    todo,
  });
});

app.get('/', async (_, res) => {
  const Items = ['aa','bb','cc']

  res.status(200).send({
    todos: Items,
  });
});

app.get('/healthcheck', async (_, res) => res.status(200).send(JSON.stringify('OK')));

app.listen(port, () => {
  console.info(`API listening on port ${port}`)
});
