import { getDoc, getDocs, collection, updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import Funcionario from "@/model/Funcionario";
import { atualizaStatusFuncionarioPorId } from "./firestoreFunctions";


/*Funcionarios do gestor*/
export async function retornaFuncionarios(idgestor:string):Promise<Funcionario[]>{
  const funcionarios:Funcionario[] = []
  const colRef = collection(db,'gestores', idgestor, 'funcionarios')
  const docs = await getDocs(colRef)
  docs.forEach((doc)=>{
    const funcionario = new Funcionario(doc.id, doc.data().nome, doc.data().email, doc.data().cargo, doc.data().permissao)
      funcionarios.push(funcionario)
  })

  return funcionarios;
}

export async function retornaFuncionariosEmEspera(idgestor:string):Promise<Funcionario[]>{
  const funcionariosEmEspera:Funcionario[] = []
  const colRef = collection(db,'gestores', idgestor, 'funcionariosEmEspera')
  const docs = await getDocs(colRef)
  docs.forEach((doc)=>{
    const funcionario = new Funcionario(doc.id, doc.data().nome, doc.data().email, doc.data().cargo, doc.data().permissao)
      funcionariosEmEspera.push(funcionario)
  })

  return funcionariosEmEspera;
}

export async function retornaFuncionario(idgestor:string, idFuncionario:string):Promise<Funcionario>{
  const docRef = doc(db,'gestores', idgestor, 'funcionarios', idFuncionario)
  const funcionarioData:any = await getDoc(docRef)
  const funcionario =  new Funcionario(funcionarioData.id, funcionarioData.data().nome, funcionarioData.data().email, funcionarioData.data().cargo, funcionarioData.data().permissao)
  return funcionario;
}

export async function excluiFuncionario(idgestor: string, funcionario: Funcionario){
  try {
    const docRef = doc(db, 'gestores', idgestor, 'funcionarios',funcionario.id)
    await deleteDoc(docRef)
    atualizaStatusFuncionarioPorId(funcionario.id, 'rejeitado')

  } catch {
    throw new Error('Não foi excluir o funcionario corretamente.')
  }
}

export async function atualizaFuncionario(idgestor: string, funcionario: Funcionario): Promise<boolean> {

  try {
      /*Atualiza funcionario na parte do gestor*/
      const docRef = doc(db, "gestores", idgestor, "funcionarios", funcionario.id);
      await updateDoc(docRef, { 
      nome: funcionario.nome,
      email: funcionario.email,
      cargo: funcionario.cargo,
      permissao: funcionario.permissao,
    });

    /*Atualiza funcionario na parte do usuario*/
    const docUsuarioRef = doc(db, 'funcionarios', funcionario.id)
    await updateDoc(docUsuarioRef,
      {    
        nome: funcionario.nome,
        email: funcionario.email,
        cargo: funcionario.cargo,
        permissao: funcionario.permissao,
      }
    )

    console.log("Funcionário atualizado com sucesso.");
    return true;
  } catch (error) {
    console.error("Erro ao atualizar funcionário:", error);
    throw new Error('Não foi possivel atualizar o funcionario.')
  }
}


async function excluiFuncionarioEmEspera(funcionarioId:string, gestorId:string){
  try {
    const docRef = doc(db, 'gestores', gestorId, 'funcionariosEmEspera', funcionarioId)
    await deleteDoc(docRef)
  } catch {
    throw new Error('Não foi possivel excluir funcionario em espera')
  }

}

export async function rejeitaFuncionarioEmEspera(funcionarioId:string, gestorId:string){
  try {
    const docRef = doc(db, 'funcionarios', funcionarioId)
    await updateDoc(docRef,{ //Muda o status do funcionario para rejeitado
      status:'rejeitado',
      codigo:'inexistente'
    })
  
    excluiFuncionarioEmEspera(funcionarioId,gestorId)
  } catch {
    throw new Error('Não foi possivel rejeitar no momento.')
  }
}

export async function  adicionaFuncionario(funcionario:Funcionario, gestorId:string) { //Adiciona o novo funcionario ao gestor
  const docRef = doc(db, 'gestores', gestorId, 'funcionarios', funcionario.id)
  await setDoc(docRef, { //Adiciona um novo funcionario ao gestor
    id: funcionario.id,
    email:funcionario.email,
    nome: funcionario.nome,
    cargo:funcionario.cargo,
    permissao: funcionario.permissao
  })
}


export async function  aceitaFuncionario(funcionario:Funcionario, gestorId:string) { //troca o estado de um funcionario em espera para aceito
  try {

    const docRefFuncionario = doc(db, 'funcionarios', funcionario.id)
    await updateDoc(docRefFuncionario,{ //Muda o status do funcionario para aceito
      status:'aceito'
    })

    adicionaFuncionario(funcionario, gestorId) //Adiciona o novo funcionario ao gestor
  
    excluiFuncionarioEmEspera(funcionario.id,gestorId)
  
  } catch {
    throw new Error('Não foi possivel aceitar o funcionario no momento.')

  }

}
/*Funcionarios do gestor*/