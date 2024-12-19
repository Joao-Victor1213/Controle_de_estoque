import Item from "@/model/Item"
import Styles from "@/styles/sistema/Estoque/cartaoitem.module.css"
import IconeLixeira from "./Icones/IconeLixeira"
import IconeEditar from "./Icones/IconeEditar"

interface cartaoItemProps{
    item:Item,
    selecionaEste:(item:Item)=>void,
    deletaEste:(item:Item)=>void
}
export default function CartaoItem(props:cartaoItemProps){
    const item = props.item
        if(item){
            return(
                <div className={Styles.cartaoitem}>
                    <div className={Styles.informacoes}>
                        <h2 className={Styles.itemNome}>{item.nome}</h2>
                        <p className={Styles.descricao}>{item.descricao}</p>
                        <p className={Styles.quantidade}><b>Quantidade: {item.quantidade}</b></p>
                    </div>
                    <div className={Styles.botoes}>
                            <button onClick ={()=>props.deletaEste(item)} className={Styles.botao}><IconeLixeira/></button>
                            <button onClick={()=>props.selecionaEste(item)} className={Styles.botao}><IconeEditar/></button>
                    </div>
        
                </div>
            )
        }else{
            return <></>
        }

}