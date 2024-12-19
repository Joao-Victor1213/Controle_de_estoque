import Funcionario from '@/model/Funcionario'
import Styles from '@/styles/sistema/Funcionarios/cartaofuncionario.module.css'
interface cartaoFuncionarioProps{
    funcionario:Funcionario
    aceitar:(funcionario:Funcionario)=>any,
    rejeitar:(funcionario:Funcionario)=>any
}
export default function CartaoFuncionarioEmEspera(props:cartaoFuncionarioProps){
    const funcionario = props.funcionario

    if(funcionario){
        return(
        
            <tr className={Styles.cartaofuncionario} key={funcionario.id}>
                <th className={Styles.th}>{funcionario.nome}</th>
                <th className={Styles.th}>{funcionario.email}</th>
                <th className={Styles.th}>{funcionario.cargo}</th>
                <th className={Styles.th}>{funcionario.permissao}</th>
                <th>
                    <div className={Styles.botoes}>
                        <button className={Styles.botao} onClick={()=>props.rejeitar(funcionario)}>Rejeitar</button>
                        <button className={Styles.botao} onClick={()=>props.aceitar(funcionario)}>Aceitar</button>
                    </div>
    
                </th>
    
            </tr>
        )
    }else{
        return <></>
    }

}