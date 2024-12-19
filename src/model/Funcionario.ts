export type permissao = 'leitor'|'editor'

export default class Funcionario{
    private Id:string
    private Nome:string
    private Email:string
    private Cargo:string
    private Permissao:permissao

    constructor(id:string, nome:string, email:string, cargo:string, permissao:permissao){
        this.Id = id
        this.Email = email
        this.Nome = nome
        this.Cargo = cargo
        this.Permissao = permissao
    }

    //Getters
    public get id() : string {
        return this.Id
    }

    public get nome() : string {
        return this.Nome
    }
    
    public get email() : string {
        return this.Email
    }
    
    public get cargo() : string {
        return this.Cargo
    }
    
    public get permissao() : permissao {
        return this.Permissao
    }
    
}