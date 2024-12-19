import { useContext } from "react";
import ContextAuthGestor from "../context/ContextAuthGestor";

export default function useAuthGestorContext(){
    return useContext(ContextAuthGestor)
}