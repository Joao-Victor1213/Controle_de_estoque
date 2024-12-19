import Styles from '@/styles/sistema/sistema.module.css'
import useAuthGestorContext from '@/data/hooks/hookAuthGestorContext'
import { useState } from 'react'
import Estoque from './paginas/Estoque'
import Funcionarios from './paginas/Funcionarios'
import AdicionarItem from './paginas/AdicionarItem'
import FuncionariosEmEspera from './paginas/FuncionariosEmEspera'
import BotaoSair from '../components/BotaoSair'


import IconeEstoque from '../components/Icones/IconeEstoque'
import IconeAdicionarEstoque from '../components/Icones/IconeAdicionarEstoque'
import IconeFuncionarios from '../components/Icones/IconeFuncionarios'
import IconeFuncionariosEmEspera from '../components/Icones/IconeFuncionariosEmEspera'
import ProtegeRota from '@/components/Protecao/ProtegeRota'

export default function GestorLayout(){
    const {usuarioGestor, cleanUsuarioGestor} = useAuthGestorContext()
    const [pagina, setPagina] = useState('Estoque')

    function retornaPagina(){
        switch (pagina) {
            case 'Estoque':
                return <Estoque/>
            case 'Funcionarios':
                return <Funcionarios/>
            case 'Adicionar Item':
                return <AdicionarItem/>
            case 'FuncionariosEmEspera':
                return <FuncionariosEmEspera/>
            default:
                return <Estoque/>
        }

    }

    if(usuarioGestor){
        return ( 
            <div id="layout" className={Styles.layout}>
    
                <nav className={Styles.nav}>
                <img src={usuarioGestor.urlImagem ? usuarioGestor.urlImagem :'/Usergestor.jpg'} alt='Foto de Perfil' className={Styles.imagemPerfil}></img>
                <h1 className={Styles.nome}>{usuarioGestor?.nome}</h1>
                <h1 className={Styles.codigo}>Código: {usuarioGestor?.codigo}</h1>
    
                    <ul>
                        <li><button onClick={()=>setPagina('Estoque')}>Estoque <IconeEstoque/></button></li>
                        <li><button onClick={()=>setPagina('Funcionarios')}> Funcionários <IconeFuncionarios/></button></li>
                        <li><button onClick={()=>setPagina('FuncionariosEmEspera')}>Em espera <IconeFuncionariosEmEspera/></button></li>
                        <li><button onClick={()=>setPagina('Adicionar Item')}>Adicionar <IconeAdicionarEstoque  /></button></li>
    
    
                    </ul>
                    <BotaoSair funcaoSair={cleanUsuarioGestor}/>
                </nav>
       
                {/*Nav para parte mobile*/}
                {/*Para parte mobile eu separei o nav em dois, um que fica em cima e outro em baixo, só aparecem em telas pequenas*/}

                <nav className={Styles.navMobile1}>
          
                    <ul>
                        <li><button onClick={()=>setPagina('Estoque')}> <IconeEstoque/></button></li>
                        <li><button onClick={()=>setPagina('Funcionarios')}>  <IconeFuncionarios/></button></li>
                        <li><button onClick={()=>setPagina('FuncionariosEmEspera')}><IconeFuncionariosEmEspera/></button></li>
                        <li><button onClick={()=>setPagina('Adicionar Item')}><IconeAdicionarEstoque  /></button></li>
    
    
                    </ul>
                    <BotaoSair funcaoSair={cleanUsuarioGestor}/>
                </nav>

                <nav className={Styles.navMobile2}>
                    <img src={usuarioGestor.urlImagem ? usuarioGestor.urlImagem :'/Usergestor-Menor.jpg'} alt='Foto de Perfil' className={Styles.imagemPerfilMenor}></img>
                    <h1 className={Styles.nome}>{usuarioGestor?.nome}</h1>
                    <h1 className={Styles.codigo}>Código: {usuarioGestor?.codigo}</h1>
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