import ProtegeRota from "@/components/Protecao/ProtegeRota";
import useAuthContext from "@/data/hooks/hookAuthContext";
import GestorLayout from "./gestor/GestorLayout";
import LeitorLayout from "./leitor/LeitorLayout";
import UsuarioFuncionario from "@/model/UsuarioFuncionario";
import AdicionaCodigo from "./AdicionaCodigo";
import PaginaDeEsperaGestor from "./PaginaDeEsperaGestor";
import { useEffect, useState } from "react";
import EditorLayout from "./editor/EditorLayout";

interface SistemaHomeProps{
  permissao: 'gestor'|'leitor'|'editor',
}



export default function SistemaHome(props:SistemaHomeProps) {
  const permissao:'gestor'|'leitor'|'editor' = props.permissao
  const {usuario, atualizaAutomaticamenteStatusFuncionario} = useAuthContext()
  const [pagina, setPagina] = useState<JSX.Element>() //Variavel que guarda a página que será utilizada

  async function retornaConteudoPelaPermissao(permissao:'gestor'|'leitor'|'editor', usuarioFuncionario:UsuarioFuncionario|undefined){    
    if(permissao == 'gestor'){ //Se é um gestor retorna a pagina de gestor
      return(
        <ProtegeRota>
              <GestorLayout/>
        </ProtegeRota>
      )
    }else if(permissao == 'editor'){
      return(
        <ProtegeRota>
          <EditorLayout/>
        </ProtegeRota>
      )
    }else if(permissao == 'leitor'){
      if(usuarioFuncionario){
        await atualizaAutomaticamenteStatusFuncionario(usuarioFuncionario) //Atualiza o status do funcionario baseado se o gestor o aceitou ou não
        if(usuarioFuncionario.codigo == 'inexistente'){ //Se o usuario ainda não têm um código ele têm que adicionar 1
          return(
            <AdicionaCodigo/>
          )
        }else if(usuarioFuncionario.status == 'espera'){ //Se o usuario ainda não foi aceito pelo Gestor
          return(
            <PaginaDeEsperaGestor/>
          )
        }else if(usuarioFuncionario.status == 'rejeitado'){//Se o usuario foi rejeitado
          return(
            <AdicionaCodigo mensagem="O gestor adicionado anteriormente não permitiu o seu acesso!"/>
          )
        }
      else{ //Se tudo esta certo retorna a pagina do leitor
          return(
            <ProtegeRota>
              <LeitorLayout/>
            </ProtegeRota>
          )
        }
  
      }
  
    }else{ //Se Não tem nenhum usuario só protege a rota
      <ProtegeRota>
      </ProtegeRota>
    }
  }

  useEffect(()=>{ //Procura o conteudo pela permissão e seta a página
    retornaConteudoPelaPermissao(permissao, usuario).then((elemento)=>{
      setPagina(elemento)
    })
  }, [usuario])

  return (
    pagina
  );
}
