import useAuthContext from "@/data/hooks/hookAuthContext"
import Styles from '@/styles/PaginaDeEsperaGestor.module.css'

export default function PaginaDeEsperaGestor(){
    const {cleanUsuario}= useAuthContext()
    return(
    <div className={Styles.pagina}>
        <p className={Styles.titulo}>Espere seu gestor aceitar você</p>
        <button onClick={()=>{cleanUsuario()}} className={Styles.botao}> Sair</button>
    </div>)
}