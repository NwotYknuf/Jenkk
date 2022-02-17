import { Generator } from "./generator"

interface HasRNG {

    cloneWithNewRNG(): Generator
}

const hasRNG = (generator: any): boolean => "cloneWithNewRNG" in generator

export { type HasRNG, hasRNG }