/*Este arquivo cria tudo relacionado ao contexto do usuario*/

/*Inportações do FireBase*/
import { signInWithPopup, signInWithEmailAndPassword, getAuth, updateProfile, signOut } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import firebaseApp, { db} from "@/firebase/firebaseConfig";
import { GoogleAuthProvider } from "firebase/auth";
import {   doc, getDoc,setDoc, updateDoc } from "firebase/firestore";

/*Inportações do FireBase*/

/*Funções Criadas*/
import { adicionaFuncionarioAEspera, buscaGestorPorCodigo, convertUserToUsuario, existeCodigo, existeFuncionarioComEmail, gestorTemEsseFuncionario, gestorTemEsseFuncionarioEmEspera } from "./functions/functionsContext";
/*Funções Criadas*/

import { createContext, useState } from "react";
import { useRouter } from "next/router";
import UsuarioFuncionario from "@/model/UsuarioFuncionario";

const ContextAuth =  createContext<Auth>({ //Cria o contexto do tipo Auth, inicializando tudo que é obrigatorio em Auth
    existeUsuario: ()=>{return true}, //Inicializa com funções vazias, que serão trocadas no provider
    naoExisteUsuario: ()=>{return true}, 
    loginUsuarioEmailSenha:()=>{},
    loginUsuarioGoogle:()=>{},
    cadastroUsuarioEmailSenha:()=>{},
    setUsuario:()=>{},
    buscaDadosFuncionario:async ()=>{},
    atualizaAutomaticamenteStatusFuncionario: async ()=>{},
    cleanUsuario: ()=>{return true},
    limpaMensagem:()=>{}
})

export default ContextAuth; //Exporta o contexto

enum tipoMensagem{
    erro,
    sucesso,
    alerta,
}


export interface Auth{ //Interface de dados que é utilizada no contexto, é criada para manter um padrão de dados no contexto
    usuario?:UsuarioFuncionario
    existeUsuario:()=>boolean
    naoExisteUsuario:()=>boolean
    loginUsuarioEmailSenha:(email:string, senha:string)=>void
    loginUsuarioGoogle:()=>void
    cadastroUsuarioEmailSenha:(nome:string, email:string, senha:string, codigo:string)=>void,
    setUsuario:any,
    cleanUsuario:()=>void,
    buscaDadosFuncionario: (funcionarioId:string)=>Promise<any>,
    atualizaAutomaticamenteStatusFuncionario:(usuario:UsuarioFuncionario)=>Promise<any>,
    errorMensagem?:string,
    mensagem?:string,
    limpaMensagem:()=>void,
}

export function ContextAuthWrap(props:any){ //Este será o compnente que envolverá o componente que deve receber o contexto e todos seus filhos
    
    const router = useRouter()

    const [usuario, setUsuario] = useState<UsuarioFuncionario>() //Guarda o usuario do contexto
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

    function existeUsuario():boolean{ //Retorna true se existe usuario
        if(usuario){
            return true
        }
        return false
    }

    function naoExisteUsuario():boolean{ //retorna falso se não existe usuario
        if(usuario){
            return false
        }
        return true
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

    async function cadastroUsuarioEmailSenha(nome:string, email:string, senha:string, codigo:string){

        if(email === '' || senha === '' || nome === '' || codigo === ''){ //Trata erros de entrada do usuario
            adicionaMensagem('Não deixe campos em branco!', tipoMensagem.erro)
            return

        }

        const codigoNaoExiste = !(await existeCodigo(codigo))

        if(codigoNaoExiste){
            adicionaMensagem('Adicione um código válido!', tipoMensagem.erro)
            return
        }
        if(senhaFraca(senha)){ //Se a senha for fraca
            return
        }


        try{
            const auth = getAuth(firebaseApp)
            const result = await createUserWithEmailAndPassword(auth, email, senha) //Cria um usuario mandando email e senha
            const user = result.user
            await updateProfile(user, {displayName: nome}) //Coloca um nome no usuario
            await criaDadosFuncionario(user.uid, nome, email, codigo)
            await adicionaEsperaCasoNaoEsteja(await buscaDadosFuncionario(user.uid), user) //Adicionar a espera no gestor se já não estiver na espera ou aceito
 
            adicionaMensagem('Usuario Cadastrado', tipoMensagem.sucesso)

            router.push('/') //Manda para a pagina raiz
        }catch(e:any){
            console.log('Erro ao tentar cadastrar, tente novamente', e.message)
            adicionaMensagem('Erro ao tentar cadastrar, tente novamente', tipoMensagem.erro)

        }

    }


    async function criaDadosFuncionario(uid:string, nome:string, email:string, codigo:string) {
        const docRef = doc(db, 'funcionarios', uid)
        try {
            
           await setDoc(docRef, {
                id: uid,
                nome: nome,
                email: email,
                codigo: codigo,
                status: 'espera',
                permissao: 'leitor'
            })
            console.log('Dados do funcionario criados com sucesso');

        } catch {
            adicionaMensagem('Erro ao cadastrar usuario', tipoMensagem.erro)
            
        }
    }
    
    async function buscaDadosFuncionario(funcionarioId:string){
        const docRef = doc(db, 'funcionarios', funcionarioId)
        const dataFuncionario = (await getDoc(docRef)).data()

        return({
            id: dataFuncionario?.id,
            nome: dataFuncionario?.nome,
            email: dataFuncionario?.email,
            codigo: dataFuncionario?.codigo,
            status: dataFuncionario?.status,
            permissao: dataFuncionario?.permissao
        })
    }

    async function adicionaEsperaCasoNaoEsteja(dadosFuncionario:any, user:any){ //Adicionar a espera no gestor se já não estiver na espera ou aceito
        try {
            if(dadosFuncionario.codigo == 'inexistente'){ //Se não existe codigo só retorna vazio
                return
            }  

            if(!(await gestorTemEsseFuncionarioEmEspera(dadosFuncionario.codigo, dadosFuncionario.id))){ // Se o gestor já não tem o funcionario em espera
                if(!(await gestorTemEsseFuncionario(dadosFuncionario.codigo, dadosFuncionario.id))){ //Se o gestor não tem esse funcionario
                    adicionaFuncionarioAEspera(dadosFuncionario.codigo, convertUserToUsuario(user, dadosFuncionario.codigo, dadosFuncionario.status, dadosFuncionario.permissao)) //Adiciona esse funcionario a espera
                }
            }     

        } catch (error:any) {
            throw new Error('Não foi possivel verificar a situação com Gestor.'+error.message)
        }
    }
    async function atualizaAutomaticamenteStatusFuncionario(usuario:UsuarioFuncionario) { //Verifica e atualiza o status do usuario quanto ao gestor
        if(usuario && usuario.codigo){
            try {
                const userDocRef = doc(db, 'funcionarios', usuario.uid)
                const gestor = await buscaGestorPorCodigo(usuario.codigo)
                if(gestor){
                    if(await gestorTemEsseFuncionario(gestor.data().codigo, usuario.uid)){
                        updateDoc(userDocRef, {
                            status:'aceito'
                        })
                    }else if(await gestorTemEsseFuncionarioEmEspera(gestor.data().codigo, usuario.uid)){
                        updateDoc(userDocRef, {
                            status:'espera'
                        })
                    }else{
                        updateDoc(userDocRef, {
                            status:'rejeitado'
                        })
                    }            
                }
            } catch {
                throw new Error('Não foi possivel atualizar o status do funcionario.')
            }    
        }
    }
    async function loginUsuarioEmailSenha(email:string, senha:string){
        
        if(email === '' || senha === ''){ //Trata erros de entrada do usuario
            adicionaMensagem('Não deixe campos em branco', tipoMensagem.erro)

            return
        }
        const existeFuncionario = await existeFuncionarioComEmail(email)
        if(!existeFuncionario){
            adicionaMensagem('Este email ainda não foi cadastrado', tipoMensagem.erro)
            return
        }

        try{
            const auth = getAuth(firebaseApp)
            const result = await signInWithEmailAndPassword(auth, email, senha)
            const user = result.user

            const dadosFuncionario = await buscaDadosFuncionario(user.uid)

            adicionaEsperaCasoNaoEsteja(dadosFuncionario, user) //Adicionar a espera no gestor se já não estiver na espera ou aceito
            const usuario:UsuarioFuncionario = convertUserToUsuario(user, dadosFuncionario.codigo, dadosFuncionario.status, dadosFuncionario.permissao)
            await atualizaAutomaticamenteStatusFuncionario(usuario) //Verifica e atualiza o status do usuario quanto ao gestor
            setUsuario(usuario)

        }catch(e:any){
            console.log('Erro na hora de entrar com o email e senha', e.message)
            adicionaMensagem('Verifique seu email e senha e tente novamente.', tipoMensagem.erro)

        }

    }

   async function loginUsuarioGoogle(){
        try{
            const provider = new GoogleAuthProvider()
            const auth = getAuth(firebaseApp)
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            console.log('Usuario Logado', user.displayName)

            if(user.email && user.displayName){ //Se o nome e o email estão setados corretamente
                
                const existeDadosDesteFuncionario = await existeFuncionarioComEmail(user.email) //Verifica se existe os dados deste funcionario
                if(!existeDadosDesteFuncionario){ //Se não existem dados deste funcionario
                    await criaDadosFuncionario(user.uid, user.displayName, user.email, 'inexistente')
                }
            }
            const dadosFuncionario = await buscaDadosFuncionario(user.uid)

            adicionaEsperaCasoNaoEsteja(dadosFuncionario, user) //Adicionar a espera no gestor se já não estiver na espera ou aceito
            const usuario:UsuarioFuncionario = convertUserToUsuario(user, dadosFuncionario.codigo, dadosFuncionario.status, dadosFuncionario.permissao)
            await atualizaAutomaticamenteStatusFuncionario(usuario) //Verifica e atualiza o status do usuario quanto ao gestor

            setUsuario(usuario)
        }catch(e:any){
            console.log('Erro na hora de entrar com o google', e.message)
            adicionaMensagem('Não foi possivel logar com o Google', tipoMensagem.erro)
        }

    }

    async function  cleanUsuario(){
        await signOut(getAuth(firebaseApp))
        setUsuario(undefined)
    }




    return(
        <ContextAuth.Provider value={{
            usuario,
            existeUsuario,
            naoExisteUsuario,
            loginUsuarioEmailSenha,
            loginUsuarioGoogle,
            cadastroUsuarioEmailSenha,
            setUsuario,
            buscaDadosFuncionario,
            atualizaAutomaticamenteStatusFuncionario,
            cleanUsuario,
            errorMensagem,
            mensagem,
            limpaMensagem
        }}>
            {props.children}
        </ContextAuth.Provider>
    );
}