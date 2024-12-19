import { GrGoogle  } from "react-icons/gr";


interface botaoGoogleProps{
    funcaoLogin:any
}
export default function BotaoLoginGoogle(props:botaoGoogleProps){

    return(
        <button onClick={props.funcaoLogin} className=" bg-red-800 hover:bg-red-900 flex justify-center items-center gap-4 p-2 font-bold w-full">Login com Google<GrGoogle fontSize={23} /> </button>   
     );
}