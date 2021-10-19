//IMPORTANDO AS BIBLIOTECAS
const express = require("express");
const net = require("net");
const http = require("http");
const cors = require("cors");

//CONSTANTES DE ENDEREÇO
const _PORT = 8080;
const _IP = "127.0.0.1";

//DECLARAÇÃO DE VARIÁVEIS
const app = express();
app.use(express.json());
app.use(cors());
//---------------------------------------------------

//DECLARANDO AS ROTAS
app.get("/patients", (req, res) => {
  console.log(pacientes.length);
  return res.json(pacientes);
});

app.post("/filter", (req, res) => {
  amount = req.body.amount;

  return res.json({ message: "Quantidade alterada para " + amount });
});

app.post("/fixedPatient", (req, res) => {
  let fixado;
  pacientes.map((paciente) => {
    //procura o index do paciente que terá os dados atualizados
    if (req.body.name == paciente.name) {
      fixado = paciente;
      return res.json(fixado);
    }
  });
});
//-------------------------------------------------------------------------------------------------------------

//INICIANDO SERVIDOR HTTP

app.listen(_PORT, _IP, () => {
  console.log("Servidor Iniciado em " + "http://" + _IP + ":" + _PORT + "/");
});

//Array que armazenará todo os pacientes e seus dados
let pacientes = [];

const server = net.createServer((socket) => {
  console.log("Novo cliente conectado!");

  socket.on("end", () => {
    console.log("Cliente desconectado.");
  });

  socket.on("error", () => {
    console.log("Conexão abortada");
  });

  //função que será executada no momento que o servidor receber o dado
  socket.on("data", (message) => {
    console.log(pacientes.length);
    message = verifySituation(JSON.parse(message)); // verifica se o paciente está estável ou grave
    let match = null;
    //percorre o array de pacientes para saber se deve atualizar ou criar um novo registro
    pacientes.map((paciente) => {
      if (paciente.name == message.name) {
        match = message;
      }
    });
    //se o paciente não tiver o nome no array, será criado o novo registro
    if (!match) {
      pacientes.push(message);
      orderArray(pacientes); //ordena o array por gravidade (oxigenação)
    }
    // se o paciente já estiver no array, os dados serão atualizados
    else {
      let pos;
      pacientes.map((paciente, index) => {
        //procura o index do paciente que terá os dados atualizados
        if (message.name == paciente.name) {
          pos = index;
        }
      });
      pacientes.splice(pos, 1, message); //substitui os dados do paciente

      orderArray(pacientes); //ordena o array por gravidade (oxigenação)
    }
  });
});

server.listen(8000, "localhost"); //servidor escutando na porta 8000 (para receber as informações dos pacientes)

function verifySituation(paciente) {
  i = 0;
  if (paciente.tempCorp > 38) {
    i++;
  }
  if (paciente.freqResp > 20) {
    i++;
  }
  if (paciente.freqCard > 110) {
    i++;
  }
  if (paciente.presArt < 72) {
    i++;
  }
  if (paciente.oxigen < 92) {
    i += 3;
  }

  if (i >= 3) {
    paciente.situation = "Grave";
  } else {
    paciente.situation = "Estável";
  }
  paciente.priority = i;

  return paciente;
}

function orderArray(pacientes) {
  quickSort(pacientes, 0, pacientes.length - 1);

  return pacientes;
}

function quickSort(vet, ini, fim) {
  let i = ini;
  let f = fim;
  let m = Math.floor((i + f) / 2);

  while (i < f) {
    while (vet[i].oxigen < vet[m].oxigen) i++;

    while (vet[f].oxigen > vet[m].oxigen) f--;

    if (i <= f) {
      let temp = vet[i];
      vet[i] = vet[f];
      vet[f] = temp;
      i++;
      f--;
    }
  }

  if (f > ini) quickSort(vet, ini, f);

  if (i < fim) quickSort(vet, i, fim);
}
