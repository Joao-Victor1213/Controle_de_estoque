import { useContext } from "react";
import AuthContext from "../context/ContextAuth";

export default function useAuthContext(){
    return useContext(AuthContext)
}