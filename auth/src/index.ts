import express from 'express';
import { json } from 'body-parser';

const PORT = 10000; 

const app = express();
app.use(json());

app.get('/api/users/give', (req,res) => {
    res.send("HI BRO!!!")
})

app.listen(PORT, () => {
    console.log(`app is listennn on ${PORT}`)
} )