const mongoose = require('mongoose')

const articlesInfo = [{
    name: 'learn-react',
    upvotes: 0,
    comments: []
},
{
    name: 'learn-node',
    upvotes: 0,
    comments: []
},
{
    name: 'learn-mongo',
    upvotes: 0,
    comments: []
}];


//Define o esquema para a criação de artigos
const articleSchema = new mongoose.Schema({
    name:{ type: String, requisred: true, unique: true},
    upvotes:{ type: Number, default: 0},
    comments:[{
        username: String,
        text: String
    }] 
});

//Cria a model Article
const Article = mongoose.model('Article', articleSchema);

async function run(){
    try{
        //Conexão ao banco de dados
        await mongoose.connect('mongodb://localhost:27017/blogDatabase');
        console.log("Conectado ao MongoDB");

        //Popular o banco de dados
        await Article.insertMany(articlesInfo);
        console.log("Artigos inseridos com sucesso")
    }
    catch(error){
        console.error("Erro ao inserir artigos: ", error);
    }
    finally{
        mongoose.connection.close();
    }
}

run();