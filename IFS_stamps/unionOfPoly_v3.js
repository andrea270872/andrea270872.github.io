
function distance(p,q){
    let d2 = (p.x-q.x)**2 + (p.y-q.y)**2;
    return d2**.5;
}

function translateFromPoly(poly) {
    return poly.map(P => {
        return { X: P.x, Y: P.y }
    });
}

function translateToPoly(path) {
    return path.map(P => {
        return { x: P.X, y: P.Y }
    });
}


// define function to add multiple polygons (union) using the clipper.js library!
function unionPolys(...polys){
    console.assert(polys.length>1, "unionPolys() requires at least 2 polygons to unite!");

    let cpr = new ClipperLib.Clipper();
    cpr.AddPaths( [ translateFromPoly(polys[0]) ] , ClipperLib.PolyType.ptSubject, true); // main shape
    for (let i=1;i<polys.length;i++){
        cpr.AddPaths( [translateFromPoly(polys[i])] , ClipperLib.PolyType.ptClip, true);
    }
    let subject_fillType = ClipperLib.PolyFillType.pftNonZero;
    let clip_fillType = ClipperLib.PolyFillType.pftNonZero;
    
    //var clipTypes = [ClipperLib.ClipType.ctUnion, ClipperLib.ClipType.ctDifference, ClipperLib.ClipType.ctXor, ClipperLib.ClipType.ctIntersection];
    let solution_paths = new ClipperLib.Paths();
    cpr.Execute(ClipperLib.ClipType.ctUnion,
        solution_paths, subject_fillType, clip_fillType);

    // DEBUG console.log("solution_paths" , JSON.stringify(solution_paths[0]));

    return translateToPoly(solution_paths[0]);
}

function subtract2Polys(poly1,poly2){
    /* DEBUG console.log("subtract2Polys:" , JSON.stringify(poly1) , translateFromPoly(poly1) , " , ", 
                    JSON.stringify(poly2) );
    */                    

    let cpr = new ClipperLib.Clipper();
    cpr.AddPaths( [ translateFromPoly(poly1) ] , ClipperLib.PolyType.ptSubject, true); // main shape
    cpr.AddPaths( [ translateFromPoly(poly2) ] , ClipperLib.PolyType.ptClip, true);
    let subject_fillType = ClipperLib.PolyFillType.pftNonZero;
    let clip_fillType = ClipperLib.PolyFillType.pftNonZero;
    
    //var clipTypes = [ClipperLib.ClipType.ctUnion, ClipperLib.ClipType.ctDifference, ClipperLib.ClipType.ctXor, ClipperLib.ClipType.ctIntersection];
    let solution_paths = new ClipperLib.Paths();
    cpr.Execute(ClipperLib.ClipType.ctDifference,
        solution_paths, subject_fillType, clip_fillType);

    // DEBUG console.log("subtract2Polys:solution_paths" , JSON.stringify(solution_paths[0]));

    return translateToPoly(solution_paths[0]);
}

function centerOfPoly(poly){
    /*
    let centerX = 0;
    let centerY = 0;
    for (p of poly){
        centerX+=p.x;
        centerY+=p.y;
    }
    centerX = centerX / poly.length;
    centerY = centerY / poly.length;
    //console.log("center", centerX,centerY);
    return {x:centerX,y:centerY};
    */
    let rectPoly = boundingBox(poly);
    //console.log("rectPoly", rectPoly );
    return {'x': (rectPoly[2].x - rectPoly[0].x)/2  + rectPoly[0].x,
            'y': (rectPoly[2].y - rectPoly[0].y)/2  + rectPoly[0].y };
}

/*
function maxRadiusPoly(poly,center){
    let rad = -Infinity;
    for (p of poly){
        let d = distance(p,center);
        if (d>rad) rad = d;
    }
    return rad;
}
*/

function boundingBox(poly,margin=0){
    let xArr = poly.map( P => P.x );
    let yArr = poly.map( P => P.y );
    let xMin = Math.min( ...xArr );
    let xMax = Math.max( ...xArr );
    let yMin = Math.min( ...yArr );
    let yMax = Math.max( ...yArr );

    xMin += margin;
    xMax -= margin;
    yMin += margin;
    yMax -= margin;
    return [{'x':xMin,'y':yMin},
            {'x':xMax,'y':yMin},
            {'x':xMax,'y':yMax},
            {'x':xMin,'y':yMax}
           ];
}
