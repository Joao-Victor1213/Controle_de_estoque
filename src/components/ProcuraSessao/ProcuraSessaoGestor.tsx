import useAuthGestorContext from "@/data/hooks/hookAuthGestorContext";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "@/firebase/firebaseConfig";
import { convertUserToGestor } from "@/data/context/functions/functionsContext";
import Carregando from "../Carregando";

export default function ProcuraSessaoGestor(props: any) {
  const { setUsuarioGestor, buscaDocGestor } = useAuthGestorContext();
  const [carregando, setCarregando] = useState(true); // Estado para carregar

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {

        buscaDocGestor(user.uid).then((data)=>{
          setUsuarioGestor(convertUserToGestor(user, data.codigo));
          setCarregando(false); // Autenticação verificada, desmarcando carregando
          return
        }).catch( //Se der erro ao procurar no documento gestor
          ()=>{
            console.log("Nenhum usuário gestor encontrado.");
            setUsuarioGestor(undefined);
            setCarregando(false); // Autenticação verificada, desmarcando carregando
          }

        )
        
      } else {
        console.log("Nenhum usuário autenticado.");
        setUsuarioGestor(undefined);
        setCarregando(false); // Autenticação verificada, desmarcando carregando
      }
    });
    
    return () => unsubscribe(); // Remover o ouvinte quando o componente for desmontado
  }, [setUsuarioGestor]);

  // Renderiza "Carregando..." até que a verificação da autenticação seja concluída
  if (carregando) {
    return <Carregando/>;
  }

  // Caso tenha carregado, renderiza os filhos
  return (<>{props.children}</> ) 
}
