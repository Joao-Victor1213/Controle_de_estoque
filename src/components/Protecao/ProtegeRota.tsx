import { useRouter } from "next/router"
import useAuthContext from "@/data/hooks/hookAuthContext"
import { useEffect, useState } from "react"
import Carregando from "../Carregando"

export default function ProtegeRota(props:any){
    const {naoExisteUsuario} = useAuthContext()
    const [carregando, setCarregando] = useState(true)
    const router = useRouter()
  
    useEffect(() => { //Espera até que saia do servidor para ai sim usar o router
       if (naoExisteUsuario()) {
           router.push("/");
        }

        setCarregando(false)
      }, []);

      if(carregando){ //não deixa renderizar nenhuma vez enquanto o useeffect espera ate a página ser carregada para redirecionar
        return <Carregando/>
      }
    
      return props.children;

}