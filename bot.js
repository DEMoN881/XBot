const readline = require('readline');
const mineflayer = require('mineflayer');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Введите IP сервера: ', (ip) => {
  rl.question('Введите ник: ', (username) => {
    rl.question('Введите порт: ', (port) => {
      rl.close();

      let bot = createBot(ip, port, username);

      function createBot(ip, port, username) {
        const newBot = mineflayer.createBot({
          host: ip,
          port: parseInt(port),
          username: username
        });

        newBot.once('spawn', () => {
          console.log('Бот успешно зашел в игру.');

          let isMovingForward = false;

          setInterval(() => {
            isMovingForward = !isMovingForward;

            if (isMovingForward) {
              newBot.look(Math.random() * 360, 0);
              console.log('Бот разворачивается на 360 градусов.');

              setTimeout(() => {
                newBot.setControlState('forward', true);
                console.log('Бот начал движение вперед.');
              }, 2000);
            } else {
              newBot.clearControlStates();
              console.log('Бот остановился.');
            }
          }, 5000);
        });

        newBot.on('end', () => {
          console.log('Бот отключен от сервера.');
          createBot(ip, port, username);
        });

        newBot.on('kicked', (reason) => {
          console.log(`Бот был кикнут с сервера: ${reason}`);
          createBot(ip, port, username);
        });

        newBot.on('error', (err) => {
          console.error('Произошла ошибка:', err);
          newBot.end();
        });

        return newBot;
      }
    });
  });
});
