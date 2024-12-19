import { FaSignOutAlt } from "react-icons/fa";

interface BotaoSairProps{
    funcaoSair:()=>void
}
export default function BotaoSair(props:BotaoSairProps){
    return <button onClick={props.funcaoSair}><FaSignOutAlt /></button>
}