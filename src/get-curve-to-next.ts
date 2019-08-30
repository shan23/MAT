
import { CpNode } from "./cp-node";
import { getCurveBetween } from "./get-curve/get-curve-between";


/**
 * Returns the bezier curve from the maximal disk of the given [[CpNode]] to the 
 * next [[CpNode]]'s maximal disk and thus directly represents a piece of the 
 * medial axis.
 * @param cpNode 
 */
function getCurveToNext(cpNode: CpNode) {
	return getCurveBetween(cpNode, cpNode.next);
}


export { getCurveToNext }