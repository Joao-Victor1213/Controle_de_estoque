import { useEffect, useState } from "react"
import { deletaItem, retornaEstoque } from "../../../../functions/firestoreFunctions"
import Styles from '@/styles/sistema/Estoque/estoque.module.css'
import Carregando from "@/components/Carregando"
import CartaoItem from "../../components/CartaoItem"
import Estoque from "@/model/Estoque"
import Item from "@/model/Item"
import CartaoItemEdicao from "../../components/CartaoItemEdicao"
import useAuthGestorContext from "@/data/hooks/hookAuthGestorContext"

export default function EstoquePagina(){
    const {usuarioGestor} = useAuthGestorContext()
    const [estoque, setEstoque] = useState<Estoque>()
    const [carregando, setCarregando] = useState(true)
    const [itemSelecionado, setItemSelecionado] = useState<Item>()
    const [key, setKey] = useState(0)

    useEffect(()=>{
        if(usuarioGestor){
            retornaEstoque(usuarioGestor.uid).then((estoque:Estoque)=>{
                setEstoque(estoque)
                setCarregando(false) 
            })
        }else{
            console.log('erro')
        }

    }, [itemSelecionado, key])

    function selecionaEsteItem(item:Item){
        setItemSelecionado(item)
    }
    function deletaEsteItem(item:Item){
        if(usuarioGestor)
        deletaItem(usuarioGestor?.uid,item)
        recarregaEstoque()
    }

    function geraCartoesItems(){
        if(carregando){
            return <Carregando/>
        }
        
        const cartoes:any[] = []
        console.log(estoque)
        estoque?.items.forEach((item:Item)=>{
            cartoes.push(
                <CartaoItem key={item.id} item={item}  deletaEste={deletaEsteItem} selecionaEste={selecionaEsteItem}/>
            )
        })

        return cartoes
    }

    function recarregaEstoque(){
        setKey(key+1)
    }

    return(
            <main key= {key} className={(carregando?Styles.carregando:Styles.pagina)}>
                { 
                itemSelecionado?
                    <CartaoItemEdicao item={itemSelecionado} setItemSelecionado={setItemSelecionado} usuario={usuarioGestor ?? undefined}/>
                    :geraCartoesItems()
                }
            </main>

    )
}