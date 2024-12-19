import { ContextAuthWrap } from "@/data/context/ContextAuth";
import {ContextAuthGestorWrap} from "@/data/context/ContextAuthGestor";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  
  return(
   <ContextAuthGestorWrap> {/*Engloba tudo ao contexto do Gestor*/}
     <ContextAuthWrap> {/*Engloba tudo ao contexto do Usuario*/}
        <Component {...pageProps} />
     </ContextAuthWrap>
   </ContextAuthGestorWrap>

  );
}
