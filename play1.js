const express = require('express');
const app = express();
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
let netProfit = 0;
const play = async () => {
    var url = 'wss://api-clicker.pixelverse.xyz/socket.io/?EIO=4&transport=websocket';
    let resultcount = 0;
    var client = new W3CWebSocket(url);
    let balletid;
    let messageInterval;
    let Profit = 0;

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
    }




    client.onmessage = function (e) {
        if (typeof e.data === 'string') {
            let data = e.data.substring(2);
            //console.log("Received: '" + e.data + "'");
            if (e.data[0] === '0') {
                console.log('Connected');
                client.send('40{"tg-id":6916305597,"secret":"54906958e3ab4b84176f77bfdf229b60529515eeb300fca1c36627a4bdd1488c","initData":"query_id=AAG9cj4cAwAAAL1yPhzGlLhu&user=%7B%22id%22%3A6916305597%2C%22first_name%22%3A%22Rajitha%22%2C%22last_name%22%3A%22%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1719826442&hash=93bf5a540af597b3c5f654d20734edfe0b0d562b36f0f712aa6c23d7d26b488f"}');
            }
            else if (e.data.includes('START')) {
                console.log('Game Started');
                balletid = JSON.parse(data)[1].battleId;
                if (messageInterval) {
                    clearInterval(messageInterval);
                }
                messageInterval = setInterval(() => {
                    client.send(`42["HIT",{"battleId":"${balletid}"}]`);
                    //console.log('HIT');
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
                if(resultcount++ === 0){
                    console.log(result);
                    if(result[1].result === 'LOSE'){
                        let loss = result[1].reward;
                        Profit -= loss;
                        netProfit -= loss;
                    }else if(result[1].result === 'WIN'){
                        let win = result[1].reward;
                        Profit += win;
                        netProfit += win;
                    }
                    sendTelegramMessage(result);
                }
            }
        }
    }
    
}

const main = async () => {
    while(true){
        await play();
        console.log('Net Profit:', netProfit);
        await new Promise(resolve => setTimeout(resolve, 60000));
    }
}

app.get('/', (req, res) => {
    res.send('Net Profit: ' + netProfit);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    main();
});
