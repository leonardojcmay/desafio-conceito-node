const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//middleware de validação de id, para ver se o id é valido
function validateProjectId (request, response, next) {
  const { id } = request.params;
  
  if(!isUuid(id)) {
      return response.status(400).json({ error: 'Invalid repository ID.' });
  }

  return next();
}

//utilizando somente na url desejada
app.use('/repositories/:id', validateProjectId);


//Rota que lista todos os repositórios;
app.get("/repositories", (request, response) => {
  
  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  
  //obter os dados do corpo da requisição json
  const { title, url, techs, likes=0 } = request.body;

  //validação
  if(!likes === 0){
    return response.status(400).json({ error: 'Likes init 0' })
  }

  //Criando um unico projeto
  const repository = { id: uuid(), title, url, techs, likes };

  //validação de likes
  if(likes != 0){
    return response.status(400).json({ error: 'Likes must start 0' })
  }

  //Adicionando o objeto no final do array projects
  repositories.push(repository);

  //exibindo o repositorio recem criado
  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  //obtendo o id do objeto que deseja atualizar
  const { id } = request.params;
  const { title, url, techs } = request.body;
  //const likes = repositories[repositoryIndex].likes;

  //const { title, url, techs, likes } = request.body;

  //buscar o repository dentro do array. Percorrer o array procurando pelo id
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  //Armazenando valor likes
  const likesIndex = repositories[repositoryIndex].likes;
  //console.log(repositories[repositoryIndex].likes)

  //validação
  if(repositoryIndex < 0){
      return response.status(400).json({ error: 'Repository not found' })
  }

  //criando novo project
  const repository = {
      id,
      title,
      url,
      techs
  };

  //console.log(repository.likes)
  //validação de likes
  if(repository.likes != likesIndex){
    repository.likes = likesIndex;
    //return response.status(400).json({ error: 'Cant change likes value' })
  }

  //substituindo o repository encontrado pelo repository que foi acabo de criar
  repositories[repositoryIndex] = repository;

  //retornando o repository atualizado
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  //obtendo o id do objeto
  const { id } = request.params;
    
  //buscar o projeto dentro do array. Percorrer o array procurando pelo id
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  //validação
  if(repositoryIndex < 0){
      return response.status(400).json({ error: 'Project not found' })
  }

  //retirando informação que deseja do array
  repositories.splice(repositoryIndex, 1);
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  //obtendo o id do objeto
  const { id } = request.params;

  //buscar o projeto dentro do array. Percorrer o array procurando pelo id
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  //Armazenando valor likes
  const title = repositories[repositoryIndex].title
  const url = repositories[repositoryIndex].url
  const techs = repositories[repositoryIndex].techs
  const likes = repositories[repositoryIndex].likes++ + 1;
  //console.log(repositories[repositoryIndex].likes+1)

  //validação
  if(repositoryIndex < 0){
      return response.status(400).json({ error: 'Project not found' })
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  //retornando o repository atualizado
  return response.json(repository);
});

module.exports = app;
