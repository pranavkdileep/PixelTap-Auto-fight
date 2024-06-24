var W3CWebSocket = require('websocket').w3cwebsocket;
const telegramBotToken = "6846260168:AAGuSGtoqRfuYhhtvZ11xoacx2nyKI2ixN0";
const telegramChatId = "1196575861";
async function sendTelegramMessage(message) {
  try {
      const response = await fetch("https://api.telegram.org/bot" + telegramBotToken + "/sendMessage", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              chat_id: telegramChatId,
              text: message
          })
      });

      const data = await response.json();
      } catch (error) {
  }
}
const play = async () => {
    var url = 'wss://api-clicker.pixelverse.xyz/socket.io/?EIO=4&transport=websocket';

    var client = new W3CWebSocket(url);
    let balletid;
    let messageInterval;

    client.onerror = function () {
        console.log('Connection Error');
    }

    client.onopen = function () {
        console.log('WebSocket Client Connected');
    }

    client.onclose = function () {
        console.log('echo-protocol Client Closed');
        if (messageInterval) {
            clearInterval(messageInterval);
        }
        return;
    }




    client.onmessage = function (e) {
        if (typeof e.data === 'string') {
            let data = e.data.substring(2);
            //console.log("Received: '" + e.data + "'");
            if (e.data[0] === '0') {
                console.log('Connected');
                client.send('40{"tg-id":5717002716,"secret":"066e3cb6c9e8bc7e404701ce954a9427e07e785486c0bad0a121215d35c711b9","initData":"query_id=AAHcicJUAgAAANyJwlSfO9St&user=%7B%22id%22%3A5717002716%2C%22first_name%22%3A%22Dileep%22%2C%22last_name%22%3A%22Kumar%22%2C%22username%22%3A%22dileep286%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1719237441&hash=df3f4110902192e7a8f55df1c551549764f925b0fec868bd9718e4b20f521441"}');
            }
            else if (e.data.includes('START')) {
                console.log('Game Started');
                balletid = JSON.parse(data)[1].battleId;
                if (messageInterval) {
                    clearInterval(messageInterval);
                }
                messageInterval = setInterval(() => {
                    client.send(`42["HIT",{"battleId":"${balletid}"}]`);
                },100);
            }
            else if (e.data.includes('SET_SUPER_HIT_ATTACK_ZONE')){
                let random = Math.floor(Math.random() * 4);
                client.send(`42["SET_SUPER_HIT_ATTACK_ZONE",{"battleId":"${balletid}","zone":${random}}]`);
            }
            else if (e.data.includes('SET_SUPER_HIT_DEFEND_ZONE')){
                let random = Math.floor(Math.random() * 4);
                client.send(`42["SET_SUPER_HIT_DEFEND_ZONE",{"battleId":"${balletid}","zone":${random}}]`);
            }
            else if (e.data.includes('reward')) {
                let result = JSON.parse(data);
                sendTelegramMessage(`You have ${result[1].result} ${result[1].reward} coins`);
                console.log(result);
            }
        }
    }
}

const main = async () => {
    while(true){
        await play();
        console.log("waiting for 30 seconds");
        await new Promise(resolve => setTimeout(resolve, 30000));
    }
}

main();

