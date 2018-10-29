import LlRbTree from 'flo-ll-rb-tree';
import { Loop } from "../../loop";
import { CpNode } from '../../cp-node';
/**
 * Find and add two-prongs that remove any holes in the shape.
 * @param loops
 * @param cpTrees
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
declare function findAndAddHoleClosing2Prongs(loops: Loop[], cpTrees: Map<Loop, LlRbTree<CpNode>>, extreme: number): void;
export { findAndAddHoleClosing2Prongs };
