
import { Loop } from "../loop";
import { toGrid } from "./to-grid";
import { isSelfOverlapping } from "flo-bezier3";
import { fixBezierByPointSpacing } from "./fix-bezier-by-point-spacing";


/**
 * @hidden
 * Returns the grid-aligned loop derived from the given input loop. 
 * 
 * Also ensures that:
 * * All points are coerced onto a grid.
 * * All bezier points of a single curve are seperated.
 * @param expMax The exponent, e, such that 2^e > all bezier coordinate points.
 * @param maxBitLength 
 */
function fixBeziers(
        expMax: number, maxBitLength: number) {
            
    /** The actual control point grid spacing */
    let gridSpacing = 2**expMax * 2**(-maxBitLength);

    function sendToGrid(p: number[]) {
        return [
            toGrid(p[0], expMax, maxBitLength),
            toGrid(p[1], expMax, maxBitLength)
        ];
    }

    return (loop: number[][][]) => {
        let newPss: number[][][] = [];
        //let _p_ = loop.beziers[0][0];

        for (let i=0; i<loop.length; i++) {
            let ps = loop[i].slice();

            // Get endpoint of last good bezier or else the original start point
            let len = newPss.length;
            let prevGoodBezier = newPss[len-1];
            let prevGoodBezierEndpoint = prevGoodBezier
                ? prevGoodBezier[prevGoodBezier.length-1]
                : sendToGrid(loop[0][0]); // Bit-align original start point

            // Set the start point to the previous good bezier's endpoint
            ps[0] = prevGoodBezierEndpoint;

            // Align to grid before doing any further checks
            ps = ps.map(p => sendToGrid(p));


            // Check if ps degenerates into a self-overlapping line
            if (isSelfOverlapping(ps)) {
                //console.log(ps);
                //console.log(isSelfOverlapping(ps));
                // Change into a line with endponts that of the original bezier
                ps = [ps[0], ps[ps.length-1]];
            }
            
            ps = fixBezierByPointSpacing(ps, gridSpacing, sendToGrid);

            if (ps) { newPss.push(ps); }
        }

        let len = newPss.length;
        if (!len) { return []; }

        // Connect the last bezier end-point to the first bezier start-point.
        let ps = newPss[len-1];
        ps[ps.length-1] = newPss[0][0];

        return newPss;
    }
}


export { fixBeziers }
