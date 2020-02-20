// configurando o servidor
const express = require("express")
const server = express()

// configurar o servidor para apresentar arquivos estáticos
server.use(express.static('../frontend/public'))

//habilitar envio de dados do formularios
server.use(express.urlencoded({ extended: true}))

//configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'Karate@02',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("../frontend", {
    express: server,
    noCache: true, //boolean, verdadeiro ou false
})

// configurar a apresentação da página
server.get("/", function(req, res){

    db.query("select * from donors", function(err, result) {
        if (err) return res.send("Erro no banco de dados.")
        
        const donors = result.rows
        return res.render("index.html", {donors})
    })
 
}) 

server.post("/", function(req,res){
    //pega os dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios.")
    }

    //coloco valores dentro do banco dados
    const query = `insert into donors ("name", "email", "blood") 
        values ($1, $2, $3)`
    const value = [name, email, blood]

    db.query(query, value, function(err){
        //fluxo de erro
        if(err) return res.send("Erro no banco de dados.")

        //fluxo ideal
        return res.redirect("/")
    })
    
})


//ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function(){
console.log("iniciei o servidor!")
})