//Invocación de los paquetes
var express = require("express");
var mysql = require("mysql");
var cors = require("cors");

var app = express();
app.use(express.json());
app.use(cors());

//Se establecen los parámetros de conexión a la base de datos
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "generation",
  database: "criaderodb",
});

//Probamos la conexión
connection.connect(function (error) {
  if (error) {
    throw error; //Capturar el error
  } else {
    console.log("La conexión es exitosa");
  }
});
//configuración de rutas

app.get("/", function (req, res) {
  res.send("Ruta INICIO");
});

//Registro de crias y clasifiacion
app.post("/api/crias", (req, res) => {
  //Creando objeto para insertar nueva cria
  let data = {
    nombre_registrador: req.body.nombre_registrador,
    peso_ingreso: req.body.peso_ingreso,
    marmoleo: req.body.marmoleo,
    color_musculo: req.body.color_musculo,
  };
  let sql = "INSERT INTO registrarCria SET ?";
  let peso = data.peso_ingreso,
    color = data.color_musculo,
    marmoleo = data.marmoleo;
  //Clasicacion de Cria Tipo 1 o Tipo 2
  if (
    peso >= 15 &&
    peso <= 25 &&
    color <= 5 &&
    color >= 3 &&
    (marmoleo == 1 || marmoleo == 2)
  ) {
    data.clasificacion = 1;
  } else if (
    (peso < 15 || peso > 25) &&
    (color == 1 || color == 2 || color == 6 || color == 7) &&
    marmoleo >= 3 &&
    marmoleo <= 5
  ) {
    data.clasificacion = 2;
  } else {
    data.clasificacion = 0;
  }
  connection.query(sql, data, (error, results) => {
    if (error) {
      throw error;
    } else {
       Object.assign(data,{id: results.insertId}) // SE AGREGO NUEVO
      res.send(results);
    }
  });
});

//Registro de algun ID a Cuarentena (0 = Sin cuarentena, 1 = Cuarentena)
app.put("/api/crias/:id/:cuarentena", (req, res) => {
  connection.query(
    "UPDATE registrarCria SET cuarentena = 1 WHERE id= ? ",
    [req.params.id],
    (error, fila) => {
      if (error) {
        throw error;
      } else {
        res.send(fila);
      }
    }
  );
});


//Registro de sensores en una cría preexistente por id
app.post("/api/crias", (req, res) => {
  //Creando objeto para insertar datos sensores
  let data = {
    id: req.body.id,
    freCardiaca: req.body.freCardiaca,
    preSanguinea: req.body.preSanguinea,
    freRespiratoria: req.body.freRespiratoria,
    temperatura: req.body.temperatura,
    nombre_registrador: req.body.nombre_registrador,
  };
  let sql = "INSERT INTO RegistroSensore SET ?";

  connection.query(sql, data, (error, results) => {
    if (error) {
      throw error;
    } else {
      res.send(results);
    }
  });
});

//Variable Puerto
const port = "3000";

//Requiere dos parametros puerto(escucha las conexiones ), (función para recojer o corraborar)
app.listen(port, function () {
  console.log("Servidor OK en puerto: " + port);
});

//EXTRA (HACER JOINS)

// Mostrar toda la información de la base de datos
//dos parametros callback (req---> peticion , resp ----> response)
app.get("/api/crias", (req, res) => {
  connection.query("SELECT * FROM registrarCria", (error, filas) => {
    if (error) {
      throw error;
    } else {
      res.send(filas);
    }
  });
});

//Eliminar un solo dato de la db de registro de crías.
app.delete("/api/crias:id", (req, res) => {
  connection.query(
    "DELETE FROM registrarCria WHERE id= ? ",
    [req.params.id],
    (error, filas) => {
      if (error) {
        throw error;
      } else {
        res.send(filas);
      }
    }
  );
});


//Editar registro de cria ya quedo oks
app.put('/api/crias/:id', (req, res)=>{
    let id = req.params.id;
    let nombre_registrador = req.body.nombre_registrador;
    let peso_ingreso = req.body.peso_ingreso;
    let marmoleo = req.body.marmoleo;
    let color_musculo = req.body.color_musculo;
    let sql = "UPDATE registrarCria SET nombre_registrador =?, peso_ingreso =?, marmoleo =?, color_musculo =? WHERE id=?";
    connection.query(sql,[nombre_registrador,peso_ingreso,marmoleo,color_musculo,id], function(error, results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }

    });

});