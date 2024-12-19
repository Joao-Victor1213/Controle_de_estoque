import FormularioCadastroGestor from "@/components/Formularios/Gestor/FormularioCadastroGestor"
import Styles from "@/styles/Autenticacao/validacao.module.css"
export default function Cadastro(){
    return(
        <main className="flex  flex-row w-screen h-screen">
            <div className={Styles.imagemDiv+" w-3/5 bg-slate-800  hidden sm:flex"}><img src='/gestorImagem.jpg'/></div>

            <FormularioCadastroGestor/>
        </main>
    )
}