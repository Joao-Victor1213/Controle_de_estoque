import { useEffect, useState } from "react"
import {  deletaItemPorCodigo, retornaEstoquePorCodigo } from "../../../../functions/firestoreFunctions"
import Styles from '@/styles/sistema/Estoque/estoque.module.css'
import Carregando from "@/components/Carregando"
import Estoque from "@/model/Estoque"
import Item from "@/model/Item"
import useAuthContext from "@/data/hooks/hookAuthContext"
import CartaoItemEdicaoFuncionarioLeitor from "../../components/Funcionario/CartaoItemEdicaoFuncionarioLeitor"
import CartaoItemLeitor from "../../components/Funcionario/CartaoItemLeitor"

export default function EstoquePagina(){


    const {usuario} = useAuthContext()
    const [estoque, setEstoque] = useState<Estoque>()
    const [carregando, setCarregando] = useState(true)
    const [itemSelecionado, setItemSelecionado] = useState<Item>()
    const [key, setKey] = useState(0)
    

    useEffect(()=>{
        if(usuario){
            retornaEstoquePorCodigo(usuario.codigo).then((resposta:Estoque)=>{
                console.log('Dados por Codigo', resposta)
                console.log('Meu usuario', usuario)

                setEstoque(resposta)
                setCarregando(false)
            }).catch((erro)=>{
                console.log('Erro ao retornar Estoque por Codigo', erro)
            })
        }else{

        }


    }, [itemSelecionado, key]) //Sempre que itemSelecionado mudar recarrega o estoque


    function selecionaEsteItem(item:Item){
        setItemSelecionado(item)
    }
    
    async function deletaEsteItem(item:Item){
        if(usuario){
            const resposta = await deletaItemPorCodigo(item,usuario.codigo)
            if(resposta === false){
                //Coloque a mensagem de erro aqui
            }else{
                recarregaEstoque()

            }
        }

    }

    function geraCartoesItems(){
        if(carregando){
            return <Carregando/>
        }
        
        const cartoes:any[] = []
        console.log(estoque)
        estoque?.items.forEach((item:Item)=>{
            cartoes.push(
                <CartaoItemLeitor key={item.id} item={item}  deletaEste={deletaEsteItem} selecionaEste={selecionaEsteItem}/>
            )
        })

        return cartoes
    }

    function recarregaEstoque(){
        setKey(key+1)
    }

    if(usuario){
        return(
            <main key= {key} className={(carregando?Styles.carregando:Styles.pagina)}>
                { 
                itemSelecionado?
                    <CartaoItemEdicaoFuncionarioLeitor item={itemSelecionado} setItemSelecionado={setItemSelecionado} usuario={usuario}/>
                    :geraCartoesItems()
                }
            </main>

    )
    }else{
        return(<></>)
    }

}