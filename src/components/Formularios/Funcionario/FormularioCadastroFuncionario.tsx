import useAuthContext from "@/data/hooks/hookAuthContext";
import Link from "next/link";
import { useState } from "react";
import BotaoLoginGoogle from "@/components/Botoes/BotaoLoginGoogle";
import { FaSignInAlt } from "react-icons/fa";

import Styles from '@/styles/Components/Formularios/formularios.module.css'


export  default function FormularioCadastroFuncionario(){

    /*Contexto*/
    const {cadastroUsuarioEmailSenha, loginUsuarioGoogle, errorMensagem, mensagem} = useAuthContext()
    /*Contexto*/

    /*Variaveis do Formulario */
    const [nome, setNome] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [codigo, setCodigo] = useState<string>('')
    const [senha, setSenha] = useState<string>('')
    /*Variaveis do Formulario */

    /*Funções*/
    function cadastrarUsuario(e:any){
        e.preventDefault(); // Previne o recarregamento da página
        cadastroUsuarioEmailSenha(nome, email.toLocaleLowerCase(), senha, codigo)
    }
    /*Funções*/

    return (
        <div className='flex flex-col  gap-2 lg:w-2/5 items-center justify-center p-5 w-full bg-gradient-to-br'>
            {
                errorMensagem? <p className=" text-red-800">*{errorMensagem}*</p>
                :
                mensagem? <p className=" text-green-800">*{mensagem}*</p>:''
            }
            <h1 className={Styles.titulo}>Funcionários</h1>
            <form onSubmit={(e)=>cadastrarUsuario(e)} className=" flex flex-col w-full gap-1">
                <input type="name" value={nome} id="nome" placeholder="Digite seu nome" onChange={(e:any)=>setNome(e.target.value)}  className=" text-black"/>
                <input type="email" value={email} id="email" placeholder="Digite seu email" onChange={(e:any)=>setEmail(e.target.value)}  className=" text-black"/>
                <input type="text" value={codigo} id="codigo" placeholder="Digite o codigo do seu gestor" onChange={(e:any)=>setCodigo(e.target.value)}  className=" text-black"/>
                <input type="password" value={senha} id="senha" placeholder="Digite uma senha"onChange={(e:any)=>setSenha(e.target.value)} className=" text-black"></input>

                <button type="submit" className="flex justify-center items-center gap-2 bg-green-600 hover:bg-green-800 p-2 font-bold">Cadastrar <FaSignInAlt fontSize={22}/></button>

            </form>

            <BotaoLoginGoogle funcaoLogin={loginUsuarioGoogle}/>
            <p>Já possui uma conta?<Link href='/'> Entre Agora</Link></p>

        </div>


    );
}