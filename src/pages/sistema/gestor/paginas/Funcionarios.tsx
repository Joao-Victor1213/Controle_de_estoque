import { useEffect, useState } from "react"
import { excluiFuncionario, retornaFuncionarios } from "../../../../functions/firestoreFunctionsGestor"

import CartaoFuncionario from "../../components/Gestor/CartaoFuncionario"
import Carregando from "@/components/Carregando"
import Styles from "@/styles/sistema/Funcionarios/funcionarios.module.css"
import Funcionario from "@/model/Funcionario"
import CartaoFuncionarioEdicao from "../../components/Gestor/CartaoFuncionarioEdicao"
import useAuthGestorContext from "@/data/hooks/hookAuthGestorContext"
import IconeFuncionarios from "../../components/Icones/IconeFuncionarios"

export default function Funcionarios(){
    const {usuarioGestor} = useAuthGestorContext()
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
    const [carregando, setCarregando] = useState(true)
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<Funcionario>()
    const [key, setKey] = useState<number>(0)
    useEffect(()=>{
        if(usuarioGestor)
        retornaFuncionarios(usuarioGestor?.uid).then((funcionarios:any)=>{
            setFuncionarios(funcionarios)
            setCarregando(false)
        })
    }, [funcionarioSelecionado, key]) //Se key ou funcionarioSelecionado mudar busca as informações novamente

    function alterarFuncionario(funcionario:Funcionario){
        setFuncionarioSelecionado(funcionario)
    }
    
    function atualizaInfo(){ //atualiza as informações dos funcionarios
        setKey(key+1)
    }

    async function excluirFuncionario(funcionario:Funcionario){
        setCarregando(true)
        if(usuarioGestor){
            try {
                await excluiFuncionario(usuarioGestor.uid, funcionario) 
                atualizaInfo() //Atualiza os cartoes dos funcionarios, agora sem o funcionario excluido
            } catch {
                //Coloque a mensagem de erro aqui
            }

        }
        setCarregando(false)

    }


    function geraCartoesFuncionarios(){
        const cartoes:any[] = []

        funcionarios.forEach((funcionario)=>{
            cartoes.push(
                <CartaoFuncionario key={funcionario.id} funcionario={funcionario} alterar={alterarFuncionario} excluir={excluirFuncionario}/>)
        })

        return cartoes
    }

    function retornaPagina(){
        
        if(carregando) { //Retorna carregando se está carregando
            return <Carregando/>
        }else if(funcionarioSelecionado){ //Retorna funcionario selecionado caso tenha algum funcionario
            return <CartaoFuncionarioEdicao usuarioGestor = {usuarioGestor??undefined} funcionario={funcionarioSelecionado} setFuncionarioSelecionado={setFuncionarioSelecionado}/>
        }else if(funcionarios.length <= 0 ){ //Retorna Uma mensagem caso não tenha nenhum funcionario
            return (
                <p className=" text-red-900 w-3/4 text-center m-10">
                    *Você ainda não têm nenhum funcionario, aceite seus funcionários em espera.*
                </p> 
            )

        }
            
        return (
            <table className={Styles.tabela}>
                <thead>
                    <tr>
                        <th className={Styles.nome}>Nome</th>
                        <th className={Styles.email}>Email</th>
                        <th className={Styles.cargo}>Cargo</th>
                        <th className={Styles.permissao}>Permissão</th>
                        <th className={Styles.botoes}></th>

                    </tr>
                </thead>
                <tbody>
                    { geraCartoesFuncionarios()}
                </tbody>
            </table>
        )
    }


    return(
            <main className={Styles.pagina}>
                <h1 className={Styles.titulo}>Funcionários <IconeFuncionarios/></h1>
                {
                    retornaPagina()    
                }
            </main>

    )
}