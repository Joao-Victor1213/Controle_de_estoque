import FormularioLoginFuncionario from "@/components/Formularios/Funcionario/FormularioLoginFuncionario";
import Styles from '@/styles/Autenticacao/validacao.module.css'


export default function PaginaLoginFuncionario(){

    return(
        <>
            <div className={Styles.imagemDiv+" w-3/5 bg-slate-800  hidden sm:flex"}><img src='/funcionariosImagem.jpg'/></div>
            <FormularioLoginFuncionario />
        </>

    );
}