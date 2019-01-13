import React, {Component} from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import InputCustomizado from '../components/InputCustomizado';
import InputTypeSubmit from '../components/inputTypeSubmit';
import TratadorErros from './TratadorErros';
import SelectCustomizado from '../components/SelectCustomizado';


export class FormularioLivro extends Component{
    constructor() {
        super();    
        this.state = {titulo: '', preco: '', autor: ''};
        this.enviaForm = this.enviaForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutor = this.setAutor.bind(this);
    }
    enviaForm(evento){
        evento.preventDefault();
        console.log("Dados sendo enviados");
        $.ajax({
        url: "https://cdc-react.herokuapp.com/api/livros",
        contentType: 'application/json',
        dataType: "JSON",
        method: "POST",
        data: JSON.stringify({titulo: this.state.titulo, preco: this.state.preco, autor: this.state.autor}),
        success: function(novaListagem){
            PubSub.publish('atualiza-lista-livros',novaListagem);
            this.setState({titulo: '', preco: '', autor: ''})
        }.bind(this),
        error: function(resposta){
            //Tratar erros aqui
            new TratadorErros().publicaErros(resposta.responseJSON);
        },
        beforeSend: function(){
            PubSub.publish("limpa-erros",{})
        }
        });
    }
    setTitulo(evento){
        this.setState({titulo: evento.target.value})
    }
    setPreco(evento){
        this.setState({preco: evento.target.value})
    }
    setAutor(evento){
        this.setState({autor: evento.target.value})
    }

    render(){
        return(
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="POST">
                <InputCustomizado label="Titulo" id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo}/>
                <InputCustomizado label="Preço" id="preco" type="text" name="preco" value={this.state.preco} onChange={this.setPreco}/>
                <SelectCustomizado label="Autor" id="autor" name="autor" autores={this.props.autores} value={this.state.autor} onChange={this.setAutor}/>
                <InputTypeSubmit label="Gravar" type="submit"/>
                </form>             
            </div>  
        );
    }
}

export class TabelaLivro extends Component{

    
    render(){
        return(
            <div>            
                <table className="pure-table">
                <thead>
                    <tr>
                    <th>Titulo</th>
                    <th>Preço</th>
                    <th>Autor</th>

                    </tr>
                </thead>
                <tbody>
                    {
                    this.props.lista.map(function(livro){
                        return (
                        <tr key={livro.id}>
                            <td>{livro.titulo}</td>
                            <td>{livro.preco}</td>
                            <td>{livro.autor.nome}</td>
                        </tr>
                        );
                    })
                    }
                </tbody>
                </table> 
            </div>     
        );
    }
}

export default class LivroBox extends Component{
    constructor() {
        super();    
        this.state = {lista : [],autores: []};
    }

    componentDidMount(){
        console.log("didMount");
        $.ajax({
            url:"https://cdc-react.herokuapp.com/api/livros",
            dataType: 'json',
            success:function(resposta){    
                console.log("chegou a resposta");          
                this.setState({lista:resposta});
            }.bind(this)
            } 
        );
        PubSub.subscribe('atualiza-lista-livros',(topico,novaListagem)=>{
            this.setState({lista:novaListagem});
        });
        $.ajax({
            url:"https://cdc-react.herokuapp.com/api/autores",
            dataType: 'json',
            success:function(resposta){    
                console.log("chegaram os autores");          
                this.setState({autores:resposta});
            }.bind(this)
            } 
        );
    }

    
    render(){
        return(
            <div>
                <div className="header">
                <h1>Cadastro de livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro autores={this.state.autores}   callbackAtualizaListagem={this.atualizaListagem}/>
                    <TabelaLivro lista={this.state.lista}/>
                </div>
            </div>
        )
    }
}