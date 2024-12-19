import FormularioLoginGestor from "@/components/Formularios/Gestor/FormularioLoginGestor";

import Styles from '@/styles/Autenticacao/validacao.module.css'

export default function PaginaLoginGestor(){

    return(
        <>
            <div className={Styles.imagemDiv+" w-3/5 bg-slate-800  hidden sm:flex"}><img src='/gestorImagem.jpg'/>
            </div>


            <FormularioLoginGestor/>
        </>

    );
}