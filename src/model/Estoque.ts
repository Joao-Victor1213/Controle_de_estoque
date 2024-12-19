import Item from "./Item";

export default class Estoque {
    private Items:Item[]

    constructor(items:Item[] = []) {
        this.Items = items
    }

    /*getters*/
    
    public get items() : Item[] {
        return this.Items
    }
    
    /*getters*/

    public buscaItem(id:string) {
        
        this.Items.forEach((item)=>{
            if(item.id === id){
                return item
            }
        })

        return null
    }
    public adicionaItem(item:Item) {
        this.Items.push(item)
    }

    public adicionaItems(items:Item[]) {
        items.forEach((item)=>{
            this.Items.push(item)
        })
    }
}