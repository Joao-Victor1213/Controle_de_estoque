import FormularioCadastroFuncionario from "@/components/Formularios/Funcionario/FormularioCadastroFuncionario"
import Styles from '@/styles/Autenticacao/validacao.module.css'
export default function CadastroFuncionario(){
    return(
        <main className="flex  flex-row w-screen h-screen">
            <div className={Styles.imagemDiv+" w-3/5 bg-slate-800  hidden sm:flex"}><img src="/funcionariosImagem.jpg"/></div>

            <FormularioCadastroFuncionario/>
        </main>
    )
}