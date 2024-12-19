import Funcionario from "@/model/Funcionario"
import { useState } from "react"
import Styles from '@/styles/sistema/funcionarios/cartaoFuncionarioEdicao.module.css'
import BotaoComum from "../BotaoComum"
import { atualizaFuncionario } from "../../functions/firestoreFunctionsGestor"
import Carregando from "@/components/Carregando"
import UsuarioGestor from "@/model/UsuarioGestor"

interface CartaoFuncionarioEdicaoProps{
    funcionario:Funcionario,
    setFuncionarioSelecionado:any,
    usuarioGestor:UsuarioGestor | undefined
}
export default function CartaoFuncionarioEdicao(props:CartaoFuncionarioEdicaoProps){
    const [carregando, setCarregando] = useState<boolean>(false)
    const gestor = props.usuarioGestor
    const funcionario = props.funcionario
    const [nome, setNome] = useState(funcionario.nome)
    const [email, setEmail] = useState(funcionario.email)
    const [cargo, setCargo] = useState(funcionario.cargo)
    const [permissao, setPermissao] = useState(funcionario.permissao)

    async function salvarFuncionario(){
        try {
            let adicionado = false
            setCarregando(true)
            if(gestor){
                adicionado = await atualizaFuncionario(gestor.uid, new Funcionario(funcionario.id,nome,email,cargo, permissao ))
            }
            setCarregando(false)

            if(adicionado){
                props.setFuncionarioSelecionado(null)
            }
        } catch {
            
        }
    }

    return(
        carregando ? <Carregando/> //Se está carregando retorna a página carregando
        :
            <div className={Styles.cartao}>
            <input className={Styles.input} value={nome} onChange={()=>{setNome(funcionario.nome)}}></input>
            <input type="email" className={Styles.input} value={email} onChange={()=>{setEmail(funcionario.email)}}></input>
            <div className={Styles.funcao}>
                <h2>Função: </h2>
                <input className={Styles.input} value={cargo} onChange={(e:any)=>{setCargo(e.target.value)}}></input>
            </div>
            <div className={Styles.permissao}>
                <h2>Permissão: </h2>
                <select
                className={Styles.select}
                value={permissao}
                onChange={(e) => setPermissao(
                    e.target.value === 'leitor'?'leitor':'editor'
                )}
                >
                <option value="leitor">Leitor</option>
                <option value="editor">Editor</option>
                </select>
            </div>
            <BotaoComum className={Styles.botao}
            funcaoAcao={salvarFuncionario} //Cria um novo funcionario com as informações atualizadas
            texto="Salvar"
            />  
        </div>
    )
        
    
}