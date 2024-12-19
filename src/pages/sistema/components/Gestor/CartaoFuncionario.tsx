import Funcionario from '@/model/Funcionario'
import Styles from '@/styles/sistema/funcionarios/cartaofuncionario.module.css'
import IconeLixeira from '../Icones/IconeLixeira'
import IconeEditar from '../Icones/IconeEditar'
interface cartaoFuncionarioProps{
    funcionario:Funcionario
    alterar:(funcionario:Funcionario)=>any,
    excluir:(funcionario:Funcionario)=>any
}
export default function CartaoFuncionario(props:cartaoFuncionarioProps){
    const funcionario = props.funcionario
    return(
        
        <tr className={Styles.cartaofuncionario} key={funcionario.id}>
            <th className={Styles.th+' '+Styles.nome}>{funcionario.nome}</th>
            <th className={Styles.th+' '+Styles.email}>{funcionario.email}</th>
            <th className={Styles.th}>{funcionario.cargo}</th>
            <th className={Styles.th}>{funcionario.permissao}</th>
            <th>
                <div className={Styles.botoes}>
                    <button className={Styles.botao} onClick={()=>props.excluir(funcionario)}><IconeLixeira/></button>
                    <button className={Styles.botao} onClick={()=>props.alterar(funcionario)}><IconeEditar/></button>
                </div>

            </th>

        </tr>
    )
}