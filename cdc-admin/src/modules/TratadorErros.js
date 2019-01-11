import PubSub from 'pubsub-js';


export default class TratadorErros{
    publicaErros(erros) {
        erros.errors.map((e)=>{
            console.log(e);
            PubSub.publish("erro-validacao",e);
        });
    }
}