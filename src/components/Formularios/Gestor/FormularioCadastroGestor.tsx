import useAuthGestorContext from "@/data/hooks/hookAuthGestorContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import BotaoLoginGoogle from "@/components/Botoes/BotaoLoginGoogle";
import { FaSignInAlt } from "react-icons/fa";

import Styles from '@/styles/Components/Formularios/formularios.module.css'
import Carregando from "@/components/Carregando";

export  default function FormularioCadastroGestor(){

    /*Contexto*/
    const {cadastroGestorEmailSenha, loginGestorGoogle, errorMensagem, mensagem, limpaMensagem} = useAuthGestorContext()
    /*Contexto*/

    /*Variaveis do Formulario */
    const [nome, setNome] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [codigo, setCodigo] = useState<string>('')
    const [senha, setSenha] = useState<string>('')
    const [carregando, setCarregando] = useState(false)
    /*Variaveis do Formulario */ 

    /*Funções*/
    function cadastrarUsuario(e:any){
        e.preventDefault(); // Previne o recarregamento da página
        setCarregando(true) //Começa a carregar
        cadastroGestorEmailSenha(nome, email.toLowerCase(), senha,codigo).then(()=>{
            setCarregando(false) //Ao terminar de cadastras termina de carregar
        })
    }

    /*Funções*/

    useEffect(()=>{
        limpaMensagem()
    },[])
    
    if(carregando){
        return <Carregando/>
    }

    return (
        <div className='flex flex-col  gap-2 lg:w-2/5 items-center justify-center p-5 w-full bg-gradient-to-br'>
            {
                errorMensagem? <p className=" text-red-800">*{errorMensagem}*</p>
                :
                mensagem? <p className=" text-green-800">*{mensagem}*</p>:''
            }
            <h1 className={Styles.titulo}>Empresas e Gestores</h1>
            <form onSubmit={(e)=>cadastrarUsuario(e)} className=" flex flex-col w-full gap-1">
                <input type="name" value={nome} id="nome" placeholder="Digite seu nome" onChange={(e:any)=>setNome(e.target.value)}  className=" text-black w-full"/>
                <input type="email" value={email} id="email" placeholder="Digite seu email" onChange={(e:any)=>setEmail(e.target.value)}  className=" text-black w-full"/>
                <input type="codigo" value={codigo} id="codigo" placeholder="Adicione um codigo para sua conta" onChange={(e:any)=>setCodigo(e.target.value)}  className=" text-black w-full"/>
                <input type="password" value={senha} id="senha" placeholder="Digite uma senha"onChange={(e:any)=>setSenha(e.target.value)} className=" text-black w-full"></input>

                <button type="submit" className="flex justify-center items-center gap-2 bg-green-600 hover:bg-green-800 p-2 font-bold">Cadastrar <FaSignInAlt fontSize={22}/></button>

            </form>

            <BotaoLoginGoogle funcaoLogin={loginGestorGoogle}/>
            <p >Já possui uma conta?<Link href='/?p=gestor'> Entre agora</Link></p>

        </div>


    );
}