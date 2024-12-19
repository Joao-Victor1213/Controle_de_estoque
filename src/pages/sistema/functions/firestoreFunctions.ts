import { getDocs, collection, updateDoc, addDoc,deleteDoc, query, where, doc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import Estoque from "@/model/Estoque";
import Item from "@/model/Item";
import UsuarioFuncionario, { status } from "@/model/UsuarioFuncionario";
import { existeCodigo } from "@/data/context/functions/functionsContext";

/*Funcoes por Codigo*/

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

export async function retornaEstoquePorCodigo(codigo:string):Promise<Estoque>{
  try {


    const gestorDoc = await buscaGestorPorCodigo(codigo);
    if (!gestorDoc) {
      // Nenhum gestor encontrado
      return new Estoque([]);
    }
    const gestorId = gestorDoc?.id;



    // Referência à subcoleção `estoque` do gestor encontrado
    const estoqueRef = collection(db, 'gestores', gestorId, 'estoque');
    const estoqueSnapshot = await getDocs(estoqueRef);

    if (estoqueSnapshot.empty) {
      // Subcoleção vazia
      return new Estoque([]);
    }

    // Mapeia os documentos da subcoleção para retornar os dados
    const items:Item[] = []
    const itemsFirebase = estoqueSnapshot.docs
    itemsFirebase.forEach((itemFirebase)=>{
      items.push(convertItemFirebaseToItemModel(itemFirebase.id, itemFirebase.data()))
    })

    const estoque:Estoque = new Estoque(items) //Adiciona os items a um novo estoque
    
    return estoque;
  } catch (error) {
    console.error("Erro ao buscar estoque:", error);
    return new Estoque([])
  }

}

export async function alteraItemPorCodigo( item:Item, codigoGestor:string,  idItem:string):Promise<boolean>{
const gestor = await buscaGestorPorCodigo(codigoGestor)
if(!gestor){
  return false
}else{
  try{
      const itemRef = doc(db, 'gestores', gestor.id, 'estoque', idItem)
      await updateDoc(itemRef, {
          id: item.id,
          item: item.nome,
          quantidade: item.quantidade,
          descricao: item.descricao
      })
      return true

  }catch{
      return false

  }

}

}

export async function adicionaItemPorCodigo(item:Item, codigoGestor:string){ //Adiciona um item atráves do código de um gestor
  const gestor = await buscaGestorPorCodigo(codigoGestor) //Busca as informações do gestor
  if(gestor){
    const colRef = collection(db,'gestores', gestor?.id, 'estoque')
    await addDoc(colRef,retornaItemLiteral(item))
  }else{
    return false
  }

}

export async function deletaItemPorCodigo(item:Item, codigoGestor:string){ //Deleta um item atráves do código de um gestor
  const gestor = await buscaGestorPorCodigo(codigoGestor)
  if(gestor){
    try{
      const docRef = doc(db, 'gestores', gestor.id, 'estoque', item.id)
      await deleteDoc(docRef)
      return true

    }catch{
      return false
    }

  }else{
    return false
  }
}

export async function atualizaStatusFuncionarioPorId(funcionarioId:string, status:status) {
  if(funcionarioId){
    try {
      const docRef = doc(db, 'funcionarios', funcionarioId)

      if(status == 'rejeitado'){ //Se ele foi rejeitado também deve ter o codigo inexistente
        await updateDoc(docRef, {
          status: status,
          codigo:'inexistente'
        })
      }else{
        await updateDoc(docRef, {
          status: status
        })
      }
  
    } catch  {
      throw new Error('Não foi possivel atualizar')
    }

  }else{
    throw new Error('Sem Usuario')
  }

}

export async function atualizaStatusFuncionario(funcionario:UsuarioFuncionario | undefined, status:status) {
  if(funcionario){
    try {
      const docRef = doc(db, 'funcionarios', funcionario.uid)
      
      if(status == 'rejeitado'){ //Se ele foi rejeitado também deve ter o codigo inexistente
        await updateDoc(docRef, {
          status: status,
          codigo:'inexistente'
        })
      }else{
        await updateDoc(docRef, {
          status: status
        })
      }

    } catch {
      throw new Error('Não foi possivel atualizar')
    }

  }else{
    throw new Error('Sem Usuario')
  }

}
export async function adicionaCodigoParaFuncionario(codigo:string, funcionario:UsuarioFuncionario | undefined):Promise<void>{

  if(funcionario){ //Se foi mandado um funcionario
    const naoExisteCodigo = !(await existeCodigo(codigo)) //Não existe codigo é o contrario da resposta de existe código
    
    if(naoExisteCodigo){ //Se foi mandado um codigo inexistente
      throw new Error('Adicione um código válido!')
    }

    const docRef = doc(db, 'funcionarios', funcionario.uid)
    try {
      await updateDoc(docRef, {
        codigo:codigo
      })


      return 
  
    } catch {

      throw new Error('Não foi possivel adicionar o código no momento..')

    }
  }

  throw new Error('Não foi possivel adicionar o código no momento..')
}
/*Funcoes por Codigo*/

/*Item*/
export function convertItemFirebaseToItemModel(id:string, itemFirebase:any) : Item{
  return new Item(id, itemFirebase.item, itemFirebase.descricao, itemFirebase.quantidade)
}
/*Item*/

function retornaItemLiteralSemId(item:Item){
  return({
    item: item.nome,
    descricao: item.descricao,
    quantidade: item.quantidade
  })
}

function retornaItemLiteral(item:Item){ //Converte um objeto item para um item literal, é usado para enviar items para o banco de dados
  return({
    id: item.id,
    item: item.nome,
    descricao: item.descricao,
    quantidade: item.quantidade
  })
}




export async function retornaEstoque(idgestor:string): Promise<Estoque>{
    const estoque = new Estoque()
    const items:Item[] = []
    const colRef = collection(db,'gestores', idgestor, 'estoque')
    const docs = await getDocs(colRef)
    docs.forEach((doc)=>{
        const item = new Item(doc.id, doc.data().item, doc.data().descricao, +doc.data().quantidade)
        items.push(item)
    })

    estoque.adicionaItems(items)
    return estoque;
}

export async function adicionaItem(idgestor: string, item: Item) {

  const colRef = collection(db, "gestores", idgestor, "estoque");
  try {
    await addDoc(colRef, retornaItemLiteralSemId(item))
    console.log("Adicionado")
    return true
  } catch {
    return false
  }


}

export async function atualizaItem(idgestor: string, item: Item) {

  const docRef = doc(db, "gestores", idgestor, "estoque", item.id);
  try {
    updateDoc(docRef, {
      descricao: item.descricao,
      quantidade: item.quantidade
    })  
    return true
  } catch {
    return false
  }


}

export async function deletaItem(idgestor: string, item: Item) {

  const docRef = doc(db, "gestores", idgestor, "estoque", item.id);
  try {
    deleteDoc(docRef)  
    console.log("Deletado");

    return true
  } catch {
    return false
  }


}