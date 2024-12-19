import Item from "@/model/Item";
import { useState } from "react";
import BotaoComum from "./BotaoComum";
import Styles from '@/styles/sistema/Estoque/cartaoItemEdicao.module.css'
import { atualizaItem } from "../functions/firestoreFunctions";
import Usuario from "@/model/Usuario";

interface CartaoItemEdicaoProps{
    item:Item,
    setItemSelecionado:any, 
    usuario:Usuario | undefined
}



export default function CartaoItemEdicao(props:CartaoItemEdicaoProps){
    const usuario = props.usuario
    const item = props.item
    const [nomeItem] = useState(item.nome)
    const [descricaoItem, setDescricaoItem] = useState(item.descricao)
    const [quantidadeItem, setQuantidadeItem] = useState(item.quantidade)

    async function salvarItem(){
        let atualizou = false
        if(usuario){
            atualizou = await atualizaItem(usuario.uid, new Item(item.id, nomeItem, descricaoItem, quantidadeItem))

        }

        if(atualizou){
            props.setItemSelecionado(null)
        }
    }

    function alteraQuantidade(valor:number){
        if(valor >= 0){
            setQuantidadeItem(valor)
        }
    }
    return(
        <div className={Styles.cartao}>
            <input className={Styles.inputText} type="text" value={nomeItem}/>
            <input className={Styles.inputNumber} type="number" value={quantidadeItem} onChange={(e)=>alteraQuantidade(+e.target.value)}/>

            <textarea className={Styles.textArea} value={descricaoItem} onChange={(e)=>{setDescricaoItem(e.target.value)}}/>
            <BotaoComum funcaoAcao={salvarItem} texto="Salvar"/>
        </div>
    )
}