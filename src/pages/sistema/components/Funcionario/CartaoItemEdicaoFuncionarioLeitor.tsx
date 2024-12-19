import Item from "@/model/Item";
import {useState } from "react";
import BotaoComum from "../BotaoComum";
import Styles from '@/styles/sistema/Estoque/cartaoItemEdicao.module.css'
import { alteraItemPorCodigo } from "../../../../functions/firestoreFunctions";
import UsuarioFuncionario from "@/model/UsuarioFuncionario";

interface CartaoItemEdicaoProps{
    usuario:UsuarioFuncionario,
    item:Item,
    setItemSelecionado:any, 
}



export default function CartaoItemEdicaoFuncionarioLeitor(props:CartaoItemEdicaoProps){
    const usuario = props.usuario
    const item = props.item
    const [nomeItem] = useState(item?.nome)
    const [descricaoItem] = useState(item?.descricao)
    const [quantidadeItem, setQuantidadeItem] = useState(item?.quantidade)

    async function salvarItem(){
        let atualizou = false
        atualizou = await alteraItemPorCodigo( new Item(item.id, nomeItem, descricaoItem, quantidadeItem),usuario.codigo , item.id)

        if(atualizou){
            props.setItemSelecionado(null)
        }
    }

    function alteraQuantidade(valor:number){
        if(valor >= 0){
            setQuantidadeItem(valor)
        }
    }
    if(item && usuario){
        return(
            <div className={Styles.cartao}>
                <input className={Styles.inputText} type="text" value={nomeItem}/>
                <input className={Styles.inputNumber} type="number" value={quantidadeItem} onChange={(e)=>alteraQuantidade(+e.target.value)}/>
    
                <BotaoComum funcaoAcao={salvarItem} texto="Salvar"/>
            </div>
        )   
    }else{
        return <></>
    }

}