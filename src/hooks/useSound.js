import { useContext } from "react";
import { SoundContext } from "../systems/soundContext";
export function useSound() {
  return useContext(SoundContext);
}
