import express, { Express } from 'express';

const app: Express = express();
const port: number = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(
    `Example app listenExample app listenExample app listenExample app listenExample app listenExample
      app listenExample app listening at http://localhost:${port}`
  );
});

const x: string = '3';
const y: string = '4';

console.log('hello world', x + y);

const someFunction = (x: string) => {
  console.log(
    'dafafafafaffafafafafafafafafafafafafafafafafafafafafafxdafafafafaffafafafafafafafafafafafafafafafafafafafafafxdafafafafaffafafafafafafafafafafafafafafafafafafafafafx',
    x
  );
};

console.log(someFunction('hello'));
