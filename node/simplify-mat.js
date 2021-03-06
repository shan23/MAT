"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simplifyMat = void 0;
const cp_node_1 = require("./cp-node");
const get_branches_1 = require("./get-branches");
const flo_bezier3_1 = require("flo-bezier3");
const get_curve_to_next_1 = require("./get-curve-to-next");
const get_curve_between_1 = require("./get-curve/get-curve-between");
/**
 * Simplifies the given MAT by replacing the piecewise quad beziers composing
 * the MAT with fewer ones to within a given tolerance.
 * @param cpNode A representation of the MAT
 * @param anlgeTolerance Tolerance given as the degrees difference of the unit
 * direction vectors at the interface between curves. A tolerance of zero means
 * perfect smoothness is required - defaults to 15.
 * @param hausdorffTolerance The approximate maximum Hausdorff Distance tolerance -
 * defaults to 0.1
 * @param hausdorffSpacing The spacing on the curves used to calculate the Hausdorff
 * Distance - defaults to 1
 */
function simplifyMat(mat, anlgeTolerance = 15, hausdorffTolerance = 1e-1, hausdorffSpacing = 1e0) {
    let cpNode = mat.cpNode;
    // Start from a leaf
    while (!cpNode.isTerminating()) {
        cpNode = cpNode.next;
    }
    let branches = get_branches_1.getBranches(cpNode, anlgeTolerance);
    let canDeletes = [];
    for (let k = 0; k < branches.length; k++) {
        let branch = branches[k];
        // Try to remove some
        let j = 0;
        while (j < branch.length) {
            let i = j;
            while (true) {
                j++;
                if (j === branch.length) {
                    break;
                }
                let hd = getTotalHausdorffDistance(i, j, branch, hausdorffSpacing);
                if (hd > hausdorffTolerance) {
                    break;
                }
                else {
                    canDeletes.push(branch[j]);
                }
            }
            if (i + 1 === j) {
                // no simplification occured
                break;
            }
        }
    }
    for (let cpNode of canDeletes) {
        let isTerminating = cpNode.isTerminating();
        let onCircleCount = cpNode.getCpNodesOnCircle().length;
        if (isTerminating || onCircleCount !== 2) {
            continue;
        }
        cp_node_1.CpNode.remove(cpNode);
    }
    //return { cpNode, cpTrees: createNewCpTree(cpNode) }; 
    return { cpNode, cpTrees: undefined };
}
exports.simplifyMat = simplifyMat;
function getTotalHausdorffDistance(i, j, branch, hausdorffSpacing) {
    let hds = [];
    let longCurve = get_curve_between_1.getCurveBetween(branch[i], branch[j].next);
    for (; i < j + 1; i++) {
        hds.push(flo_bezier3_1.hausdorffDistance(get_curve_to_next_1.getCurveToNext(branch[i]), longCurve, hausdorffSpacing));
    }
    return Math.max(...hds);
}
//# sourceMappingURL=simplify-mat.js.map