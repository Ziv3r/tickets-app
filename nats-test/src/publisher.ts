import nats from 'node-nats-streaming'
import {TicketCreatedPublisher} from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
})

stan.on('connect', async () => {
    const publisher = new TicketCreatedPublisher(stan)
    
    try {
        const res = await publisher.publish({
                id: '130',
                title: 'concert',
                price: 20 
            })
    }catch(error){
        console.error(error);
    }
 
    // console.log("Publishr connected to nats");

    // const data = JSON.stringify({ 
    //     id: '123',
    //     title: 'concert',
    //     price: '20',
    // })

    // stan.publish('ticket:created', data, () => {
    //     console.log("Event publish")
    // })
})