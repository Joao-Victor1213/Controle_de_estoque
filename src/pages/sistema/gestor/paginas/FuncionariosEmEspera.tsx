import { useEffect, useState } from "react"
import {aceitaFuncionario, rejeitaFuncionarioEmEspera, retornaFuncionariosEmEspera } from "../../../../functions/firestoreFunctionsGestor"
import Carregando from "@/components/Carregando"
import Styles from "@/styles/sistema/Funcionarios/funcionarios.module.css"
import Funcionario from "@/model/Funcionario"
import useAuthGestorContext from "@/data/hooks/hookAuthGestorContext"
import CartaoFuncionarioEmEspera from "../../components/Gestor/CartaoFuncionarioEmEspera"
import IconeFuncionariosEmEspera from "../../components/Icones/IconeFuncionariosEmEspera"

export default function FuncionariosEmEspera(){
    const {usuarioGestor} = useAuthGestorContext()
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
    const [carregando, setCarregando] = useState(true)
    const [key, setKey] = useState<number>(0) //key é usado para controlar quando atualizar as informações

    useEffect(()=>{
        setCarregando(true)
        if(usuarioGestor){
            retornaFuncionariosEmEspera(usuarioGestor.uid).then((funcionarios:any)=>{
                setFuncionarios(funcionarios)
                setCarregando(false)
            })
        }

    }, [key])

    function atualizaInfo(){
        setKey(key+1)
    }

    async function aceitarFuncionario(funcionario:Funcionario){
        setCarregando(true)
        if(usuarioGestor){
            try {
                await aceitaFuncionario(funcionario, usuarioGestor.uid)
                atualizaInfo()
            } catch  {
                //Coloca Mensagem de erro aqui
            }

        }
        setCarregando(false)

    }

    async function rejeitarFuncionario(funcionario:Funcionario){
        if(usuarioGestor){
            try {
                await rejeitaFuncionarioEmEspera(funcionario.id, usuarioGestor.uid)
                atualizaInfo()
            } catch {
                //Coloca Mensagem de erro aqui
            }

        }
    }


    function geraCartoesFuncionarios(){
        
        const cartoes:any[] = []
        console.log(funcionarios)
        funcionarios.forEach((funcionario)=>{
            cartoes.push(
                <CartaoFuncionarioEmEspera key={funcionario.id} funcionario={funcionario} aceitar={aceitarFuncionario} rejeitar={rejeitarFuncionario}/>)
        })

        return cartoes
    }

    function retornaPagina(){
        if(carregando) { //Retorna carregando se está carregando
            return <Carregando/>
        }else if(funcionarios.length <= 0 ){ //Retorna Uma mensagem caso não tenha nenhum funcionario
            return (
                <p className=" text-red-900 w-3/4 text-center m-10">
                    *Você ainda não têm nenhum funcionario em espera, peça para seus funcionários entrarem na plataforma com seu código.*
                </p> 
            )

        }

        return(
            <table className={Styles.tabela}>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Cargo</th>
                        <th>Permissão</th>
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
                <h1 className={Styles.titulo}>Funcionários em espera<IconeFuncionariosEmEspera/></h1>
                {
                    retornaPagina()    
                }
            </main>

    )
}