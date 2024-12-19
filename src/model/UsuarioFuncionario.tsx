import Usuario from "./Usuario"
export type status = 'aceito'|'espera'|'rejeitado'
export type permissao = 'editor'|'leitor'
export default class UsuarioFuncionario implements Usuario {
    private Uid:string
    private Nome:string
    private Email:string
    private Provedor:string
    private UrlImagem:string
    private Codigo:string
    private Permissao:permissao
    private Status:status
    
    constructor( uid:string, nome:string , email:string , provedor:string , urlImagem:string, codigo:string, permissao:permissao,status:status) {
        this.Uid = uid
        this.Email = email
        this.Nome = nome
        this.Provedor = provedor
        this.UrlImagem = urlImagem    
        this.Codigo = codigo
        this.Permissao = permissao
        this.Status = status
    }

    
    public adicionaNome(nome : string):UsuarioFuncionario {
        return new UsuarioFuncionario(this.uid, nome, this.Email, this.Provedor, this.UrlImagem, this.Codigo, this.Permissao,this.Status);
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
    
    
    public get provedor():string{
        return this.Provedor
    }

    public get codigo():string{
        return this.Codigo
    }

    public get status():string{
        return this.Status
    }
    public get permissao():string{
        return this.Permissao
    }
}