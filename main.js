const { Spot, WebsocketStream } = require('@binance/connector')

const apiKey = process.env.API_KEY
const apiSecret = process.env.API_SECRET
const targetCoin = process.env.TARGET_COIN.toLowerCase()
const investment = process.env.INV

const client = new Spot(apiKey, apiSecret)
let executed = false;

const callbacks = {
    open: () => {
        console.log('Connected with Websocket server')
    },
    close: () => {
        console.log('Disconnected with Websocket server')
    },
    message: data => {
        if (executed) return;
        console.log(data)
        client.newOrder(targetCoin, 'BUY', 'MARKET', {
            quoteOrderQty: investment,
          }).then(response => {
            client.logger.log(response.data)
        })
        .catch(error => client.logger.error(error))
        .finally(
            executed = true
        )
    }
}  

const stream = new WebsocketStream({callbacks})

stream.bookTicker(targetCoin)