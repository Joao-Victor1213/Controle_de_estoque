import useAuthContext from "@/data/hooks/hookAuthContext";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "@/firebase/firebaseConfig";
import { convertUserToUsuario } from "@/data/context/functions/functionsContext";
import Carregando from "../Carregando";

export default function ProcuraSessao(props: any) {
  const { setUsuario, buscaDadosFuncionario } = useAuthContext();
  const [carregando, setCarregando] = useState(true); // Estado para carregar

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Usuário detectado:", user);
        buscaDadosFuncionario(user.uid).then((dadosFuncionario)=>{
          setUsuario(convertUserToUsuario(user,dadosFuncionario.codigo, dadosFuncionario.status, dadosFuncionario.permissao));
        })

      } else {
        console.log("Nenhum usuário autenticado.");
        setUsuario(undefined);
      }
      setCarregando(false); // Autenticação verificada, desmarcando carregando
    });
    
    return () => unsubscribe(); // Remover o ouvinte quando o componente for desmontado
  }, [setUsuario]);

  // Renderiza "Carregando..." até que a verificação da autenticação seja concluída
  if (carregando) {
    return <Carregando/>;
  }

  // Caso tenha carregado, renderiza os filhos
  return (<>{props.children}</> ) 
}
