import React, {Component} from 'react';
import PubSub from 'pubsub-js';

export default class SelectCustomizado extends Component {
    constructor(){
        super();
        this.state = {msgError:''}
    }
    render(){
        return(
        <div className="pure-control-group">
            <label htmlFor={this.props.id}>{this.props.label}</label> 
            <select {...this.props}>{
                    this.props.autores.map(function(autor){
                        return(
                            <option key={ autor.id } value={autor.id}>{autor.nome}</option>
                        )
                    })
                }
            </select>
            <span className="error">{this.state.msgError}</span>               
             
        </div>
        )
    }

    componentDidMount(){
        PubSub.subscribe("erro-validacao",(topico,erro)=>{
            if (erro.field === this.props.name){
                this.setState({msgError: erro.defaultMessage});
            }
        });
        PubSub.subscribe("limpa-erros",(topico)=>{
            this.setState({msgError: ''});
        });
    }
}
