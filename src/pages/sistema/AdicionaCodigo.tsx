import useAuthContext from "@/data/hooks/hookAuthContext";
import { useState } from "react";
import { adicionaCodigoParaFuncionario, atualizaStatusFuncionario } from "../../functions/firestoreFunctions";
import Carregando from "@/components/Carregando";
import { useRouter } from "next/router";
import { adicionaFuncionarioAEspera } from "@/data/context/functions/functionsContext";
interface AdicionaCodigoProps{
    mensagem?:string
}
export default function AdicionaCodigo(props:AdicionaCodigoProps){
    const {usuario, cleanUsuario}= useAuthContext()
    const [codigo, setCodigo] = useState('')
    const [mensagemErro, setMensagemErro] = useState()
    const [carregando, setCarregando] = useState(false)
    const router = useRouter()

    async function adicionaCodigo(){
        setCarregando(true)
        try {
            if(usuario){
                await adicionaCodigoParaFuncionario(codigo, usuario)//Adiciona o novo codigo ao usuario
                await adicionaFuncionarioAEspera(codigo, usuario) //Adiciona o usuario a espera
                await atualizaStatusFuncionario(usuario, 'espera' ) //atualiza o status para espera
                router.reload() //Da um reload na aplicação
                setCarregando(false)
            }


        } catch (error:any) {
            setMensagemErro(error.message)

        }
        setCarregando(false)  

    }
    
    if(carregando){
        return <Carregando/>
    }

    return( //Conteudo da pagina

        <div>
            <h1>Adicione um código para continuar</h1>
            <p>{mensagemErro??props.mensagem}</p>
            <input value={codigo} onChange={(e)=>{setCodigo(e.target.value)}}></input>
            <button onClick={adicionaCodigo} className=" text-black">Adicionar</button>
            <button onClick={cleanUsuario} className=" text-black m-2">Sair</button>

        </div>
    )
}