export  default class Item{
    private Id:string
    private Nome:string
    private Descricao:string
    private Quantidade:number

    constructor(id:string = '', nome:string, descricao:string, quantidade:number){
        this.Id = id
        this.Nome = nome
        this.Descricao = descricao
        this.Quantidade = quantidade
    }

    /*getters*/
    public get id() : string {
        return this.Id
    }

    public get nome() : string {
        return this.Nome
    }

    public get descricao() : string {
        return this.Descricao
    }

    public get quantidade() : number {
        return this.Quantidade
    }
    
}