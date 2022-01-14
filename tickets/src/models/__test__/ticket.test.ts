import { TicketMongo } from '../ticket';
import mongoose from 'mongoose';

it('imlements optimistic', async() => {
    const ticket = TicketMongo.build({
        title: 'concert',
        price: 5,
        userId: '123'
    })

    await ticket.save();

    const firstInstance = await TicketMongo.findById(ticket.id)
    const secondInstance = await TicketMongo.findById(ticket.id)

    firstInstance!.set({price: 10 });
    secondInstance!.set({price: 15 });

    await firstInstance!.save();
    
    try {
        await secondInstance!.save()
        throw new Error('Should not reach this point')
    } catch (err) {
        expect(err).toBeInstanceOf(mongoose.Error.VersionError)
    }
})

it('increments the version number on multiole saves', async () =>{
     const ticket = TicketMongo.build({
        title: 'concert',
        price: 5,
        userId: '123'
    })

    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);
})