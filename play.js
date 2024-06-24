var W3CWebSocket = require('websocket').w3cwebsocket;

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
            console.log("Received: '" + e.data + "'");
            if (e.data[0] === '0') {
                console.log('Connected');
                client.send('40{"tg-id":1196575861,"secret":"40eaabfaef2b3d6187452521fa73de042b0df5aa3993076ad0d530ff58de6d42","initData":"query_id=AAF1TFJHAAAAAHVMUkf-Ver9&user=%7B%22id%22%3A1196575861%2C%22first_name%22%3A%22PKD%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22pranavkdileep%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1719231980&hash=97d45169904b7a3d4c861e800c4ab7d086b7998f302a8b2a827b74390c4b48a5"}');
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
                console.log(result);
            }
        }
    }
}

// const main = async () => {
//     while(true){
//         await play();
//         console.log("waiting for 30 seconds");
//         await new Promise(resolve => setTimeout(resolve, 30000));
//     }
// }

// main();

play();