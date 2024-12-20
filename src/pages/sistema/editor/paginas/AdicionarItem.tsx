import { useState } from "react";
import BotaoComum from "../../components/BotaoComum";
import { adicionaItemPorCodigo } from "../../../../functions/firestoreFunctions";
import Item from "@/model/Item";
import useAuthContext from "@/data/hooks/hookAuthContext";
import Styles from '@/styles/sistema/Adicionar/adicionar.module.css'
import Carregando from "@/components/Carregando";
export default function AdicionarItem(){

    const {usuario} = useAuthContext()
    const [nome, setNome] = useState<string>('')
    const [quantidade, setQuantidade] = useState(0)
    const [descricao, setDescricao] = useState('')
    const [erroMensagem, setErroMensagem] = useState<string>()
    const [carregando, setCarregando] = useState(false)
    function mudaQuantidade(valor:number){
        if(valor>=0){
            setQuantidade(valor)
        }else{
            setQuantidade(0)
        }
    }
    
    function limpaValores(){
        setNome('')
        setQuantidade(0)
        setDescricao('')
    }

    async function adicionar(){
        if(usuario){
            setCarregando(true)
            const resposta = await adicionaItemPorCodigo(new Item( '', nome, descricao, quantidade), usuario.codigo)
            setCarregando(false)

            if(resposta == false){
                setErroMensagem('Não foi possivel adicionar.')
            }

            setErroMensagem('') //Se chegou até aqui não deu erro, então não se deve mostrar nenhuma mensagem de erro
            limpaValores() //Limpa todos os valores
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
                <h1 className=" text-center">Adicionar Item</h1   >
                <p>{erroMensagem? erroMensagem:''}</p>
                <input className={Styles.input} placeholder="Nome" value={ nome } onChange={(e)=>{setNome(e.target.value)}} />
                <input className={Styles.input} type='number' placeholder="Quantidade Inicial" value={ quantidade } onChange={(e)=>{mudaQuantidade(+e.target.value)}}/>
                <textarea placeholder="Descrição" value={ descricao } onChange={(e)=>{setDescricao(e.target.value)}} className={Styles.descricao} />

                <BotaoComum funcaoAcao={adicionar} texto="Adicionar"/>
            </div>
        </main>

    )
}