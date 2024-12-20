import useAuthContext from "@/data/hooks/hookAuthContext"
import Styles from '@/styles/PaginaDeEsperaGestor.module.css'

export default function PaginaDeEsperaGestor(){
    const {cleanUsuario, usuario}= useAuthContext()
    return(
    <div className={Styles.pagina}>
        <p className={Styles.titulo}>Espere seu gestor de código {usuario?.codigo} aceitar você</p>
        <button onClick={()=>{cleanUsuario()}} className={Styles.botao}> Sair</button>
    </div>)
}