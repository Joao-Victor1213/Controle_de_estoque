import useAuthGestorContext from "@/data/hooks/hookAuthGestorContext";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";

import { FaSignInAlt } from "react-icons/fa";
import BotaoLoginGoogle from "../../Botoes/BotaoLoginGoogle";
import Carregando from "@/components/Carregando";

import Styles from '@/styles/Components/Formularios/formularios.module.css'
export  default function FormularioLoginGestor(){

    /*Contexto*/
    const { loginGestorEmailSenha, loginGestorGoogle, errorMensagem, mensagem, limpaMensagem} = useAuthGestorContext()
    /*Contexto*/

    /*Variaveis do Formulario */
    const [email, setEmail] = useState<string>('')
    const [senha, setSenha] = useState<string>('')
    const [carregando, setCarregando] = useState(false)
    /*Variaveis do Formulario */

    /*Funções*/
    function loginEmailSenha(e:any){
        e.preventDefault(); // Previne o recarregamento da página

        setCarregando(true) //Começa a carregar

        loginGestorEmailSenha(email.toLocaleLowerCase(), senha).then(()=>{
            setCarregando(false) //Quando o retorno de login chegar para de carregar
        })
    }
    /*Funções*/
    useEffect(()=>{
        limpaMensagem()
    },[])
    
    return (
        carregando? <Carregando/>
        :
        <div className='flex flex-col  gap-2 lg:w-2/5 items-center justify-center p-5 w-full bg-gradient-to-br'>
            {
                errorMensagem? <p className=" text-red-800">*{errorMensagem}*</p>
                :
                mensagem? <p className=" text-green-800">*{mensagem}*</p>:''
            }
            <h1 className={Styles.titulo}>Empresas e Gestores</h1>

            <form onSubmit={(e)=>loginEmailSenha(e)} className=" flex flex-col gap-6 w-full">
                <input type="email" value={email} id="email" placeholder="Digite seu email" onChange={(e:any)=>setEmail(e.target.value)}  className=" text-black p-3 w-full"/>
                <input type="password" value={senha} id="senha" placeholder="Digite sua senha"onChange={(e:any)=>setSenha(e.target.value)} className=" text-black p-3 w-full"></input>

                <button type="submit" className="flex justify-center items-center gap-2 bg-green-600 hover:bg-green-800 p-2 font-bold w-full">Login <FaSignInAlt fontSize={22}/></button>

            </form>
            <BotaoLoginGoogle funcaoLogin={()=>{
                setCarregando(true)

                loginGestorGoogle().then(()=>{
                    setCarregando(false)
                })

            }}/>
            <p>Ainda não têm um cadastro?<Link href='/Autenticacao/gestor/CadastroGestor'> Cadastre-se Agora</Link></p>
            <p>É um funcionário?<Link href='/?p=funcionario'> Vá para funcionários</Link></p>

        </div>


    );
}