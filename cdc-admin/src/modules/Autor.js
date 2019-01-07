import React, {Component} from 'react';
import $ from 'jquery';
import InputCustomizado from '../components/InputCustomizado';
import InputTypeSubmit from '../components/inputTypeSubmit';


export class FormularioAutor extends Component{
    constructor() {
        super();    
        this.state = {nome: '', email: '', senha: ''};
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setMail = this.setMail.bind(this);
        this.setSenha = this.setSenha.bind(this);
    }
    enviaForm(evento){
        evento.preventDefault();
        console.log("Dados sendo enviados");
        $.ajax({
        url: "https://cdc-react.herokuapp.com/api/autores",
        contentType: 'application/json',
        dataType: "JSON",
        method: "POST",
        data: JSON.stringify({nome: this.state.nome, email: this.state.email, senha: this.state.senha}),
        success: function(resposta){
            this.props.callbackAtualizaListagem(resposta);
        }.bind(this),
        error: function(resposta){
            console.log("erro");
        }
        });
    }
    setNome(evento){
        this.setState({nome: evento.target.value})
    }
    setMail(evento){
        this.setState({email: evento.target.value})
    }
    setSenha(evento){
        this.setState({senha: evento.target.value})
    }

    render(){
        return(
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="POST">
                <InputCustomizado label="Nome" id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome}/>
                <InputCustomizado label="Email" id="email" type="email" name="email" value={this.state.email} onChange={this.setMail}/>
                <InputCustomizado label="Senha" id="senha" type="password" name="Senha" value={this.state.Senha} onChange={this.setSenha}/>
                <InputTypeSubmit label="Gravar" type="submit"/>
                </form>             
            </div>  
        );
    }
}

export class TabelaAutores extends Component{

    
    render(){
        return(
            <div>            
                <table className="pure-table">
                <thead>
                    <tr>
                    <th>Nome</th>
                    <th>email</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    this.props.lista.map(function(autor){
                        return (
                        <tr key={autor.id}>
                            <td>{autor.nome}</td>
                            <td>{autor.email}</td>
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

export default class AutorBox extends Component{
    constructor() {
        super();    
        this.state = {lista : []};
        this.atualizaListagem = this.atualizaListagem.bind(this);
    }

    componentDidMount(){
        console.log("didMount");
        $.ajax({
            url:"https://cdc-react.herokuapp.com/api/autores",
            dataType: 'json',
            success:function(resposta){    
                console.log("chegou a resposta");          
                this.setState({lista:resposta});
            }.bind(this)
            } 
        );          
    }

    atualizaListagem(novaLista){
        this.setState({lista:novaLista});
    }
    
    render(){
        return(
            <div>
                <FormularioAutor callbackAtualizaListagem={this.atualizaListagem}/>
                <TabelaAutores lista={this.state.lista}/>
            </div>
        )
    }
}