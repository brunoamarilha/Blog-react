import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
}))

app.use(express.json());

app.get('/api/articles/:name', async (req, res) => {

    const { name } = req.params;   
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    const db = client.db('blogDatabase');
    const article = await db.collection('articles').findOne({ name });
    
    if (article){
        res.json(article);
    }
    else
    {
        res.sendStatus(404);
    }
});

app.put('/api/articles/:name/upvote', async (req,res) => {
    const { name } = req.params;
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    const db = client.db('blogDatabase');
    await db.collection('articles').updateOne({ name }, {
        $inc: { upvotes: 1}
    } );
    const article = await db.collection('articles').findOne({ name });

    if (article) {
        article.upVotes += 1;
        res.send(`O artigo ${name} agore possui ${article.upvotes} votos!`)
    }
    else
    {
        res.send("Este artigo não existe");
    }
});

app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params;
    const { postedBy, text} = req.body;    
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    const db = client.db('blogDatabase');

    await db.collection('articles').updateOne({name},{
        $push: {comments: {postedBy, text}}
    });
    const article = await db.collection('articles').findOne({name});
    
    if (article){
        res.send(article.comments);
    }
    else{
        res.send('Este artigo não existe');
    }
});


app.listen(8000,() => {
    console.log('Servidor sendo executado na porta 8000');
});