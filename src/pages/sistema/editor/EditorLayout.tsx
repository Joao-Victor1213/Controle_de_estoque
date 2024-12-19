import Styles from '@/styles/sistema/sistema.module.css'
import { useState } from 'react'
import Estoque from './paginas/Estoque'
import AdicionarItem from './paginas/AdicionarItem'
import useAuthContext from '@/data/hooks/hookAuthContext'
import IconeEstoque from '../components/Icones/IconeEstoque'
import IconeAdicionarEstoque from '../components/Icones/IconeAdicionarEstoque'
import BotaoSair from '../components/BotaoSair'
import ProtegeRota from '@/components/Protecao/ProtegeRota'

export default function EditorLayout(){
    const {usuario, cleanUsuario} = useAuthContext()
    const [pagina, setPagina] = useState('Estoque')

    function retornaPagina(){
        switch (pagina) {
            case 'Estoque':
                return <Estoque/>
     
            case 'Adicionar Item':
                return <AdicionarItem/>
            default:
                return <Estoque/>
        }

    }


    if(usuario){
        return ( 
            <div id="layout" className={Styles.layout}>
    
            <nav className={Styles.nav}>
                        
                        <img       
                            onError={(e:any) => {
                                e.target.onerror = null; // Prevenir loop infinito
                                e.target.src = '/Usergestor-Menor.jpg'; // Substituir pela imagem padrão
                            }}
                            src={usuario.urlImagem}
                            alt='Foto de Perfil'
                            className={Styles.imagemPerfilMenor} >
                        </img>

                    <h1 className={Styles.nome}>{usuario?.nome}</h1>
                    <h2 className={Styles.codigo}> {usuario?.codigo}</h2>
    
                    <ul>
                        <li> <button onClick={()=>setPagina('Estoque')}>Estoque  <IconeEstoque/></button></li>
                        <li><button onClick={()=>setPagina('Adicionar Item')}> Adicionar <IconeAdicionarEstoque/></button></li>
                        <BotaoSair funcaoSair={cleanUsuario}/>
    
                    </ul>
                </nav>

                {/*Nav para parte mobile*/}
                {/*Para parte mobile eu separei o nav em dois, um que fica em cima e outro em baixo, só aparecem em telas pequenas*/}

                <nav className={Styles.navMobile1}>
          
                    <ul>
                        <li><button onClick={()=>setPagina('Estoque')}> <IconeEstoque/></button></li>
                        <li><button onClick={()=>setPagina('Adicionar Item')}><IconeAdicionarEstoque  /></button></li>
    
    
                    </ul>
                    <BotaoSair funcaoSair={cleanUsuario}/>
                </nav>

                <nav className={Styles.navMobile2}>
                    <img       
                        onError={(e:any) => {
                            e.target.onerror = null; // Prevenir loop infinito
                            e.target.src = '/Usergestor-Menor.jpg'; // Substituir pela imagem padrão
                         }}
                        src={usuario.urlImagem}
                        alt='Foto de Perfil'
                        className={Styles.imagemPerfilMenor} >
                    </img>
                    <h1 className={Styles.nome}>{usuario?.nome}</h1>
                    <h1 className={Styles.codigo}>Código: {usuario?.codigo}</h1>
                </nav>
                {/*Nav para parte mobile*/}

                <div id='pagina' className={Styles.pagina}>
                    {
                        retornaPagina()
                    }
                </div> 
    
            </div>
        )
    }else{
        return <ProtegeRota/>
    }

}