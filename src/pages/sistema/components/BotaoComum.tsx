
interface botaoComumProps{
    funcaoAcao:any,
    texto?:string,
    className?:string
}
export default function BotaoComum(props:botaoComumProps){

    return(
        <button onClick={props.funcaoAcao} className={" bg-blue-500 hover:bg-blue-700 flex justify-center items-center gap-4 p-2 font-bold w-full "+props.className }>{props.texto}</button>   
     );
}