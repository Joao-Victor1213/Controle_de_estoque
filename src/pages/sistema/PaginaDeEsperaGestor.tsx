import useAuthContext from "@/data/hooks/hookAuthContext"

export default function PaginaDeEsperaGestor(){
    const {cleanUsuario}= useAuthContext()
    return(<div>
        <p>Espere seu gestor aceitar você</p>
        <button onClick={()=>{cleanUsuario()}} className=" text-black"> Sair</button>
    </div>)
}