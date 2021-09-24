const net = require("net");
const http = require("http");

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

server.listen(8000, "26.91.70.227"); //servidor escutando na porta 8000 (para receber as informações dos pacientes)

//criando um server http para as requisições da interface
http
  .createServer((req, res) => {
    if (req.method == "GET") {
      //se o método for GET
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      }); // escreve o Header
      res.statusCode = 200; // atualiza o status para 200

      res.end(JSON.stringify(pacientes)); //envia o array de paciente em formato string JSON
    }
  })
  .listen(8080); // servidor http escutando na porta 8080

function verifySituation(paciente) {
  if (
    (paciente.freqCorp > 38 &&
      paciente.freqResp > 20 &&
      paciente.freqCard > 110 &&
      paciente.presArt < 72) ||
    paciente.oxigen < 92
  ) {
    paciente.situation = "Grave";
  } else {
    paciente.situation = "Estável";
  }

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
