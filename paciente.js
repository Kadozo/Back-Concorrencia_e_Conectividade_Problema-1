const { Worker, isMainThread, workerData } = require("worker_threads");
const net = require("net");
const randomName = require("node-random-name");
function start(name) {
  const socket = new net.Socket(); //Criando o objeto Socket
  socket.connect(8000, "localhost", () => {
    //Conectando o Socket ao Servidor
    console.log("Conectado ao servidor!");
    // a Cada 10000 ms (10 segundos) o socket enviará os dados
    setInterval(
      () => {
        socket.write(valoresSensores(name));
        socket.end;
      },
      5000,
      0
    );
  });

  socket.on("error", () => {
    console.log("Erro no Servidor");
    setTimeout(() => socket.connect(8000, "26.91.70.227"), 5000);
  });

  function valoresSensores(name) {
    paciente = {
      name: name,
      tempCorp: getRandomInt(35, 38),
      freqResp: getRandomInt(50, 130),
      freqCard: getRandomInt(70, 100),
      presArt: getRandomInt(35, 40),
      oxigen: getRandomInt(85, 100),
      situation: "",
      priority: 0,
    };

    //retorna uma string JSON para ser enviada pelo socket
    return JSON.stringify(paciente);
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

if (isMainThread) {
  for (let index = 0; index < process.argv[2]; index++) {
    setTimeout(() => {
      const worker = new Worker(__filename, {
        workerData: {
          name: "paciente" + index,
        },
      });
    }, 2000);
  }
} else {
  start(workerData.name);
}
