import { useState } from "react";
import BotaoComum from "../../components/BotaoComum";
import { adicionaItem } from "../../../../functions/firestoreFunctions";
import Item from "@/model/Item";
import useAuthGestorContext from "@/data/hooks/hookAuthGestorContext";
import Styles from '@/styles/sistema/Adicionar/adicionar.module.css'
import IconeAdicionarEstoque from "../../components/Icones/IconeAdicionarEstoque";
import Carregando from "@/components/Carregando";
export default function AdicionarItem(){

    const {usuarioGestor} = useAuthGestorContext()
    const [nome, setNome] = useState<string>('')
    const [quantidade, setQuantidade] = useState(0)
    const [descricao, setDescricao] = useState('')
    const [carregando, setCarregando] = useState(false)
    function mudaQuantidade(valor:number){
        if(valor>=0){
            setQuantidade(valor)
        }else{
            setQuantidade(0)
        }
    }
    
    async function adicionar(){
        if(usuarioGestor){
            setCarregando(true)
            await adicionaItem(usuarioGestor.uid, new Item( '', nome, descricao, quantidade))
            setDescricao('')
            setNome('')
            setQuantidade(0)
            setCarregando(false)

        }else{
            console.log('Erro')
        }
    }
    if(carregando){
        return <Carregando/>
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