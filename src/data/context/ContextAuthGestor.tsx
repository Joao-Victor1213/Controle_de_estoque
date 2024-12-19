/*Este arquivo cria tudo relacionado ao contexto do usuario*/

/*Inportações do FireBase*/
import { signInWithPopup, signInWithEmailAndPassword, getAuth,  updateProfile, signOut } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import firebaseApp, { db} from "@/firebase/firebaseConfig";
import { GoogleAuthProvider } from "firebase/auth";
import {  collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";

/*Inportações do FireBase*/

/*Funções Criadas*/
import { convertUserToGestor, existeCodigo } from "./functions/functionsContext";
/*Funções Criadas*/

import { createContext, useState } from "react";
import { useRouter } from "next/router";
import UsuarioGestor from "@/model/UsuarioGestor";

const ContextAuthGestor =  createContext<Auth>({ //Cria o contexto do tipo Auth, inicializando tudo que é obrigatorio em Auth
    existeUsuarioGestor: ()=>{return true}, //Inicializa com funções vazias, que serão trocadas no provider
    naoExisteUsuarioGestor: ()=>{return true}, 
    loginGestorEmailSenha:async ()=>{},
    loginGestorGoogle:async ()=>{},
    cadastroGestorEmailSenha:async ()=>{},
    setUsuarioGestor:()=>{},
    buscaDocGestor:async ()=>{},
    cleanUsuarioGestor: ()=>{return true},
    limpaMensagem:()=>{}
})
export default ContextAuthGestor; //Exporta o contexto

enum tipoMensagem{
    erro,
    sucesso,
    alerta,
}
export interface Auth{ //Interface de dados que é utilizada no contexto, é criada para manter um padrão de dados no contexto
    usuarioGestor?:UsuarioGestor
    existeUsuarioGestor:()=>boolean
    naoExisteUsuarioGestor:()=>boolean
    loginGestorEmailSenha:(email:string, senha:string)=>Promise<void>
    loginGestorGoogle:()=>Promise<void>
    cadastroGestorEmailSenha:(nome:string, email:string, senha:string, codigo:string)=>Promise<void>,
    setUsuarioGestor:any,
    buscaDocGestor:(gestorId:string)=>Promise<any>,
    cleanUsuarioGestor:()=>void,
    errorMensagem?:string,
    mensagem?:string,
    limpaMensagem:()=>void,
}

export function ContextAuthGestorWrap(props:any){ //Este será o compnente que envolverá o componente que deve receber o contexto e todos seus filhos
    
    const router = useRouter()

    const [usuarioGestor, setUsuarioGestor] = useState<UsuarioGestor>() //Guarda o usuario do contexto
    const [errorMensagem, setErrorMensagem] = useState<string>() //guarda a mensagem de erro se houver
    const [mensagem, setMensagem] = useState<string>() //guarda a mensagem se houver

    function adicionaMensagem(novaMensagem:string, tipo:tipoMensagem){
        if(tipo === tipoMensagem.erro){
            setErrorMensagem(novaMensagem)
            setMensagem(undefined)
        }else{
            setErrorMensagem(undefined)
            setMensagem(novaMensagem)    
        }
    }

    function limpaMensagem(){
            setErrorMensagem(undefined)
            setMensagem(undefined)
    }

    function existeUsuarioGestor():boolean{ //Retorna true se existe usuario
        if(usuarioGestor){
            return true
        }
        return false
    }

    function naoExisteUsuarioGestor():boolean{ //retorna falso se não existe usuario
        if(usuarioGestor){
            return false
        }
        return true
    }

    function codigoFraco(senha:string): boolean{
        const temLetra = (str:string) => /[a-zA-Z]/.test(str);
        const temNumero = (str:string) => /\d/.test(str);

        if(senha.length < 6){ //Se a senha for menor que 6
            adicionaMensagem('O codigo deve ter pelo menos 10 digitos!', tipoMensagem.erro)
            return true
        }else if(!temLetra(senha)){ //Verifica se a senha tem alguma letra
            adicionaMensagem('O codigo deve ter pelo menos 1 letra!', tipoMensagem.erro)
            return true

        }else if(!temNumero(senha)){
            adicionaMensagem('O codigo deve ter pelo menos 1 numero!', tipoMensagem.erro)

            return true
        }

        return false

    }

    function senhaFraca(senha:string): boolean{
        const temLetra = (str:string) => /[a-zA-Z]/.test(str);
        const temLetraMaiuscula = (str:string) => /[A-Z]/.test(str);
        const temNumero = (str:string) => /\d/.test(str);

        if(senha.length < 6){ //Se a senha for menor que 6
            adicionaMensagem('A senha deve ter pelo menos 6 digitos!', tipoMensagem.erro)
            return true
        }else if(!temLetra(senha)){ //Verifica se a senha tem alguma letra
            adicionaMensagem('A senha deve ter pelo menos 1 letra!', tipoMensagem.erro)
            return true

        }else if(!temNumero(senha)){
            adicionaMensagem('A senha deve ter pelo menos 1 numero!', tipoMensagem.erro)

            return true
        }else if(!temLetraMaiuscula(senha)){
            adicionaMensagem('A senha deve ter pelo menos 1 letra maiuscula!', tipoMensagem.erro)

            return true
        }

        return false
    }


    async function criaDadosGestor(uid:string, nome:string, email:string, codigo:string) {
        const docRef = doc(db, 'gestores', uid)
        try {
            
           await setDoc(docRef, {
                id: uid,
                nome: nome,
                email: email,
                codigo: codigo
            })

        } catch {
            adicionaMensagem('Não foi possivel cadastrar no momento!', tipoMensagem.erro)
        }
    }

    async function cadastroGestorEmailSenha(nome:string, email:string, senha:string, codigo:string){

        if(email === '' || senha === '' || nome === '' || codigo === ''){ //Trata erros de entrada do usuario
            adicionaMensagem('Não deixe campos em branco!', tipoMensagem.erro)
            return

        }
        const codigoExiste:boolean = await existeCodigo(codigo)
        if(codigoExiste){ //Se o codigo for fracao
            adicionaMensagem('Este código já está sendo utilizado!', tipoMensagem.erro)
            return
        }
        if(senhaFraca(senha)){ //Se a senha for fraca
            return
        }
        if(codigoFraco(codigo)){ //Se o codigo for fracao
            return
        }



        try{
            const auth = getAuth(firebaseApp)
            const result = await createUserWithEmailAndPassword(auth, email, senha) //Cria um usuario mandando email e senha
            const user = result.user
            await updateProfile(user, {displayName: nome}) //Coloca um nome no usuario
            criaDadosGestor(user.uid, user.displayName??'', user.email??'', codigo)
            adicionaMensagem('Usuario Cadastrado', tipoMensagem.sucesso)

            router.push('/') //Manda para a pagina raiz
        }catch(e:any){
            console.log('Erro ao tentar cadastrar, tente novamente', e.message)
            adicionaMensagem('Erro ao tentar cadastrar, tente novamente', tipoMensagem.erro)

        }

    }

    async function existeGestorComEmail(email:string) : Promise<boolean>{
        const colRef = collection(db, "gestores"); //Pega a referencia da coleção
        
        const q = query(colRef, where("email", "==", email)); //Pega a referencia de todos os documentos com esse email
        const querySnapshot = await getDocs(q);  // Pega todos os documentos das referencias

        return !querySnapshot.empty //Retorna true se existe pelo menos um gestor com o email
    }

    async function loginGestorEmailSenha(email:string, senha:string){
        
        if(email === '' || senha === ''){ //Trata erros de entrada do usuario
            adicionaMensagem('Não deixe campos em branco', tipoMensagem.erro)

            return
        }
        const existeGestor = await existeGestorComEmail(email)
        if(!existeGestor){ //Se no banco de dados não existe um gestor com este email
            adicionaMensagem('Este email ainda não foi cadastrado', tipoMensagem.erro)
            
            return
        }
        try{
            const auth = getAuth(firebaseApp)
            const result = await signInWithEmailAndPassword(auth, email, senha)
            const user = result.user
            console.log('Usuario Logado', user)

            const docGestor = await buscaDocGestor(user.uid)

            setUsuarioGestor(convertUserToGestor(user, docGestor.codigo))
            router.reload() //Recarrega a página agora com o usuario logado, resolve o erro de não entrar como gestor
        }catch(e:any){
            console.log('Erro na hora de entrar com o email e senha', e.message)
            adicionaMensagem('Verifique seu email e senha e tente novamente.', tipoMensagem.erro)

        }

    }
    
    async function  buscaDocGestor(gestorId:string):Promise<any> {
        const docRef = doc(db, 'gestores', gestorId)
        const docData = (await getDoc(docRef)).data()
        return docData
    }

   async function loginGestorGoogle(){
        try{
            const provider = new GoogleAuthProvider()
            const auth = getAuth(firebaseApp)
            const result = await signInWithPopup(auth, provider)
            const user = result.user
            console.log('Usuario Logado', user.displayName)
            const docGestor = await buscaDocGestor(user.uid)

            setUsuarioGestor(convertUserToGestor(user, docGestor.codigo))
        }catch(e:any){
            console.log('Erro na hora de entrar com o google', e.message)
            adicionaMensagem('Não foi possivel logar com o Google', tipoMensagem.erro)
        }

    }

    async function  cleanUsuarioGestor(){
        await signOut(getAuth(firebaseApp))
        setUsuarioGestor(undefined)
        router.push('/?p=gestor')
    }




    return(
        <ContextAuthGestor.Provider value={{
            usuarioGestor,
            existeUsuarioGestor,
            naoExisteUsuarioGestor,
            loginGestorEmailSenha,
            loginGestorGoogle,
            cadastroGestorEmailSenha,
            setUsuarioGestor,
            buscaDocGestor,
            cleanUsuarioGestor,
            errorMensagem,
            mensagem,
            limpaMensagem
        }}>
            {props.children}
        </ContextAuthGestor.Provider>
    );
}