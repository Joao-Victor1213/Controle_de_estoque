import { useState } from "react";
import BotaoComum from "../../components/BotaoComum";
import { adicionaItem } from "../../functions/firestoreFunctions";
import Item from "@/model/Item";
import useAuthGestorContext from "@/data/hooks/hookAuthGestorContext";
import Styles from '@/styles/sistema/Adicionar/adicionar.module.css'
import IconeAdicionarEstoque from "../../components/Icones/IconeAdicionarEstoque";
export default function AdicionarItem(){

    const {usuarioGestor} = useAuthGestorContext()
    const [nome, setNome] = useState<string>('')
    const [quantidade, setQuantidade] = useState(0)
    const [descricao, setDescricao] = useState('')
    function mudaQuantidade(valor:number){
        if(valor>=0){
            setQuantidade(valor)
        }else{
            setQuantidade(0)
        }
    }
    
    function adicionar(){
        if(usuarioGestor){
            adicionaItem(usuarioGestor.uid, new Item( '', nome, descricao, quantidade))
        }else{
            console.log('Erro')
        }
    }

    return(
        <main className={Styles.pagina}>
            <div className={Styles.formulario}>
                <h1 className={Styles.titulo}> Adicionar Item <IconeAdicionarEstoque/> </h1>

                <input className={Styles.input} placeholder="Nome" value={ nome } onChange={(e)=>{setNome(e.target.value)}} />
                <input className={Styles.input} type='number' placeholder="Quantidade Inicial" value={ quantidade } onChange={(e)=>{mudaQuantidade(+e.target.value)}}/>
                <textarea placeholder="Descrição" value={ descricao } onChange={(e)=>{setDescricao(e.target.value)}} className={Styles.descricao} />

                <BotaoComum funcaoAcao={adicionar} texto="Adicionar"/>
            </div>
        </main>

    )
}