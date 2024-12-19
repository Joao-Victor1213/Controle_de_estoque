import Usuario from "./Usuario"

export default class UsuarioGestor implements Usuario {
    private Uid:string
    private Nome:string
    private Email:string
    private Provedor:string
    private Codigo:string
    private UrlImagem:string

    constructor( uid:string, nome:string , email:string , provedor:string , codigo:string, urlImagem:string) {
        this.Uid = uid
        this.Email = email
        this.Nome = nome
        this.Provedor = provedor
        this.Codigo = codigo
        this.UrlImagem = urlImagem    
    }

    
    public adicionaNome(nome : string):UsuarioGestor {
        return new UsuarioGestor(this.Uid,nome, this.Email, this.Provedor, this.Codigo,this.UrlImagem);
    }
    
    /*Getters*/
    
    public get uid() : string {
        return this.Uid
    }

    public get nome() : string {
        return this.Nome
    }

    
    public get email() : string {
        return this.Email
    }

    public get urlImagem():string{
        return this.UrlImagem
    }
    
    public get provedor() : string {
        return this.Provedor
    }

    public get codigo() : string {
        return this.Codigo
    }
    
    
}