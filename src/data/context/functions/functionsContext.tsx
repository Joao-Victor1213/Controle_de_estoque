import { User } from "firebase/auth"
import Usuario from "@/model/UsuarioFuncionario"
import UsuarioGestor from "@/model/UsuarioGestor"

import UsuarioFuncionario, { status } from "@/model/UsuarioFuncionario"
import { permissao } from "@/model/UsuarioFuncionario"
import {  collection, doc, getDocs, query, setDoc, where } from "firebase/firestore"
import { db } from "@/firebase/firebaseConfig"



 /*Verificar se já existe algumas informações na database*/
export async function existeFuncionarioComEmail(email:string) : Promise<boolean>{
    const existe = await verificaSeExiste('email', email, 'funcionarios')
    return existe
}

export async function existeCodigo(codigo:string) : Promise<boolean>{
    const existe = await verificaSeExiste('codigo', codigo, 'gestores')
    return existe
} 

export async function verificaSeExiste(nomeNoDocumento:string, valor:string, colecao:string) {
    const colRef = collection(db, colecao);

    const q = query(colRef, where(nomeNoDocumento, "==", valor));
    const querySnapshot = await getDocs(q);  
    return !querySnapshot.empty  
}
/*Verifica se já existe algumas informações na database*/

export function convertUserToUsuario(user:User, codigo:string, status:status, permissao:permissao){
    return new Usuario(
        user.uid? user.uid:'',
         user.displayName? user.displayName:'',
          user.email? user.email:'',
           user.providerId,
            user.photoURL? user.photoURL:'',
            codigo,
            permissao,
            status
    )
}

export function convertUserToUsuarioFuncionario(user:User, codigo:string, status:status, permissao:permissao){
    return new Usuario(
        user.uid? user.uid:'',
         user.displayName? user.displayName:'',
          user.email? user.email:'',
           user.providerId,
            user.photoURL? user.photoURL:'',
            codigo,
            permissao,
            status
    )
}

export function convertUserToGestor(user:User, codigo:string){
     return new UsuarioGestor(
         user.uid? user.uid:'',
          user.displayName? user.displayName:'',
           user.email? user.email:'',
           user.providerId,
           codigo,
             user.photoURL? user.photoURL:''
     )
}



    /*Funções de manejo de estado do funcionario com o Gestor*/
   
    export async function buscaGestorPorCodigo(codigo:string){
      // Referência à coleção de gestores
      const gestoresRef = collection(db, "gestores");
      // Consulta para encontrar o gestor com o código especificado
      const gestoresQuery = query(gestoresRef, where("codigo", "==", codigo));
      const gestoresSnapshot = await getDocs(gestoresQuery);
    
      if (gestoresSnapshot.empty){
          return undefined
      }else{
          // Obtém o primeiro documento correspondente
          const gestorDoc = gestoresSnapshot.docs[0]; 
          return gestorDoc
      }
    
    }

    export async function adicionaFuncionarioAEspera(codigo:string, funcionario:UsuarioFuncionario){
        try {
            const gestor = await buscaGestorPorCodigo(codigo)
            if(gestor){
                const docRef = doc(db, 'gestores', gestor.id, 'funcionariosEmEspera', funcionario.uid)
                setDoc(docRef, {
                    id: funcionario.uid,
                    nome: funcionario.nome,
                    email: funcionario.email,
                    imagem: funcionario.urlImagem,
                    cargo: 'inexistente',
                    permissao: funcionario.permissao
                })
    
            }
            return
        } catch {
            throw new Error('Não foi possivel adicionar o usuario a espera')
        }

    }

    export async function gestorTemEsseFuncionario(codigoGestor:string, funcionarioId:string) : Promise<boolean>{
        try {
            const gestor = await buscaGestorPorCodigo(codigoGestor)
            if(gestor){
                const funcionariosRef = collection(db, "gestores", gestor.id, 'funcionarios');
                // Consulta para encontrar o gestor com o código especificado
                const funcionariosQuery = query(funcionariosRef, where("id", "==", funcionarioId));
                const funcionarios = await getDocs(funcionariosQuery);
              
                if (funcionarios.empty){
                    return false
                }else{
                    // Obtém o primeiro documento correspondente
                    return true
                }
            }else{
                throw new Error('Não foi possivel encontrar o gestor.')
            }

        } catch (error:any) {
            throw new Error('Não foi possivel realizar a operação: '+error.message)

        }

    }

    
    export async function gestorTemEsseFuncionarioEmEspera(codigoGestor:string, funcionarioId:string) : Promise<boolean>{
        try {
            const gestor = await buscaGestorPorCodigo(codigoGestor)
            if(gestor){
                const funcionariosRef = collection(db, "gestores", gestor.id, 'funcionariosEmEspera');
                // Consulta para encontrar o gestor com o código especificado
                const funcionariosQuery = query(funcionariosRef, where("id", "==", funcionarioId));
                const funcionarios = await getDocs(funcionariosQuery);
              
                if (funcionarios.empty){
                    return false
                }else{
                    // Obtém o primeiro documento correspondente
                    return true
                }
            }else{
                throw new Error('Não foi possivel encontrar o gestor.')
            }

        } catch (error:any) {
            throw new Error('Não foi possivel realizar a operação: '+error.message)

        }

    }

    /*Funções de manejo de estado do funcionario com o Gestor*/