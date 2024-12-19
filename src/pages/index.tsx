import useAuthContext from "@/data/hooks/hookAuthContext";
import useAuthGestorContext from "@/data/hooks/hookAuthGestorContext";
import PaginaLoginGestor from "./Autenticacao/gestor/PaginaLoginGestor";
import SistemaHome from "./sistema/SistemaHome";
import ProcuraSessao from "@/components/ProcuraSessao/ProcuraSessao";
import ProcuraSessaoGestor from "@/components/ProcuraSessao/ProcuraSessaoGestor";
import PaginaLoginFuncionario from "./Autenticacao/funcionario/PaginaLoginFuncionario";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {

  const {usuarioGestor} = useAuthGestorContext()
  const {usuario} = useAuthContext()
  const [irParaValidacaoGestor, setIrParaValidacaoGestor] = useState(false)//Para o usuario que sairá do formulario de funcionario para o de gestor
  const router = useRouter()

  useEffect(()=>{
    if(router.query.p == 'gestor'){ //Se foi enviado p como gestor muda página para login gestor
      if(usuarioGestor){ //Limpa a query se tiver um gestor logado, evita que vá para a pagina de login mesmo logado
        router.push('/')
      }else{
        setIrParaValidacaoGestor(true)
      }

    }else if(router.query.p == 'funcionario'){ //Se foi enviado p como funcionario muda página para login funcionario
      if(usuario){ //Limpa a query se tiver um usuarioe estiver logado, evita que vá para a pagina de login mesmo logado
        router.push('/')
      }else{
        setIrParaValidacaoGestor(false)
      }

    }
  }, [router])

  function retornaPagina(){
    if(usuarioGestor){

      return <SistemaHome permissao="gestor"/> //Retorna o sitema com permissão de gestor

    }else if(usuario){
      if(usuario.permissao == 'leitor'){
        return <SistemaHome permissao="leitor"/> //Retorna o sitema com permissão de leitor
      }

      if(usuario.permissao == 'editor'){
        return <SistemaHome permissao="editor"/> //Retorna o sitema com permissão de editor
      }
    }else{ //Se não têm nenhum usuario logado vai para página de login
      return <PaginaLoginFuncionario />
    }
  }

  function existeAlgumUsuario():boolean{ //Retorna se existe algum usuario já logado
    if(usuarioGestor){
      return true
    }

    if(usuario){
      return true
    }

    return false
  }

  
  return (
    <main className="flex  flex-row w-screen h-screen">
      <ProcuraSessao> {/*Procura alguma sessão de usuario e seta o usuario caso exista*/}
        <ProcuraSessaoGestor> {/*Procura alguma sessão de gestor e seta o gestor caso exista*/}
          { 
            /*Se existe algum usuario retorna a página por usuario, se não vai para validação*/
            existeAlgumUsuario()?
            retornaPagina() 
            :
            irParaValidacaoGestor? <PaginaLoginGestor/>:<PaginaLoginFuncionario/>
          }
        </ProcuraSessaoGestor>
      </ProcuraSessao>

    </main>
  );
}
