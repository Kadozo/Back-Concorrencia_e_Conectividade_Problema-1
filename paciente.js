const net = require("net");
const randomName = require("node-random-name");
function start(name) {
  const socket = new net.Socket(); //Criando o objeto Socket
  socket.connect(8000, "127.0.0.1", () => {
    //Conectando o Socket ao Servidor
    console.log("Conectado ao servidor!");
    // a Cada 10000 ms (10 segundos) o socket enviará os dados
    setInterval(
      () => {
        socket.write(valoresSensores(name));
        socket.end;
      },
      10000,
      0
    );
  });

  socket.on("error", () => {
    console.log("Erro no Servidor");
    setTimeout(() => socket.connect(8000, "127.0.0.1"), 5000);
  });

  function valoresSensores(name) {
    paciente = {
      name: name,
      freqCorp: getRandomInt(35, 38),
      freqResp: getRandomInt(50, 130),
      freqCard: getRandomInt(70, 100),
      presArt: getRandomInt(35, 40),
      oxigen: getRandomInt(85, 100),
      situation: "",
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

start(randomName());
