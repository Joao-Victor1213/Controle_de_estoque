import useAuthContext from "@/data/hooks/hookAuthContext";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";

import { FaSignInAlt } from "react-icons/fa";
import BotaoLoginGoogle from "@/components/Botoes/BotaoLoginGoogle";

import Styles from '@/styles/Components/Formularios/formularios.module.css'


export  default function FormularioLoginFuncionario(){

    /*Contexto*/
    const {loginUsuarioEmailSenha, loginUsuarioGoogle, errorMensagem, mensagem, limpaMensagem} = useAuthContext()
    /*Contexto*/

    /*Variaveis do Formulario */
    const [email, setEmail] = useState<string>('')
    const [senha, setSenha] = useState<string>('')
    /*Variaveis do Formulario */

    /*Funções*/
    function loginEmailSenha(e:any){
        e.preventDefault(); // Previne o recarregamento da página
        loginUsuarioEmailSenha(email.toLocaleLowerCase(), senha)
    }
    /*Funções*/
    useEffect(()=>{
        limpaMensagem()
    },[])
    
    return (
        <div className='flex flex-col  gap-2 lg:w-2/5 items-center justify-center p-5 w-full bg-gradient-to-br'>
            {
                errorMensagem? <p className=" text-red-800">*{errorMensagem}*</p>
                :
                mensagem? <p className=" text-green-800">*{mensagem}*</p>:''
            }
            <h1 className={Styles.titulo}>Funcionários</h1>
            <form onSubmit={(e)=>loginEmailSenha(e)} className=" flex flex-col gap-6 w-full">
                <input type="email" value={email} id="email" placeholder="Digite seu email" onChange={(e:any)=>setEmail(e.target.value)}  className=" text-black p-3 w-full"/>
                <input type="password" value={senha} id="senha" placeholder="Digite sua senha"onChange={(e:any)=>setSenha(e.target.value)} className=" text-black p-3 w-full"></input>

                <button type="submit" className="flex justify-center items-center gap-2 bg-green-600 hover:bg-green-800 p-2 font-bold w-full">Login <FaSignInAlt fontSize={22}/></button>

            </form>
            <BotaoLoginGoogle funcaoLogin={loginUsuarioGoogle}/>
            <p>Ainda não têm um cadastro?<Link href='/Autenticacao/funcionario/CadastroFuncionario'> Cadastre-se agora</Link></p>
            <p className=" text-black text-center">É um gestor? <Link href='/?p=gestor'> Ir para a parte das Empresas e Gestores</Link></p>
        </div>


    );
}