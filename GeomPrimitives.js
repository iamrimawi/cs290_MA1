//Purpose: The engine behind the 3D primitive operations for Mini Assignment 1

//////////////////////////////////////////////
///********    Geometry Functions   *******///
//////////////////////////////////////////////
//This is where you will have to fill in some code

//Purpose: Project vector u onto vector v using the glMatrix library
//Inputs: u (vec3), v (vec3)
//Returns: projv (vec3), the projection of u onto v
function projVector(u, v) {
    var scale = (vec3.dot(u, v)/vec3.dot(v, v));//The scale in front of v is (u dot v) / (v dot v)
    var projv = vec3.create(); //Allocate a vector to hold the output
    vec3.scale(projv, v, scale); //Scale v by the appropriate amount
    return projv; //Return the result
}

//Purpose: To compute the perpendicular projection of a vector u onto a vector v
//Inputs: u (vec3), v (vec3)
//Returns: projperpv (vec3), the projection of u onto v
function projPerpVector(u, v) {
    var projv = projVector(u, v);
    var projperpv = vec3.create();
    vec3.subtract(projperpv, u, projv);
    return projperpv;
}

//Purpose: To compute the angle between the vectors ab and ac
//Inputs: a (vec3), b (vec3), c (vec3)
//Returns: angle (radians - float)
function getAngle(a, b, c) {
    //TODO: Fill this in for task 1
    return -1; //This is a dummy value for now.  Replace with true angle
}


//Purpose: For a plane determined by the points a, b, and c, with the plane
//normal determined by those points in counter-clockwise order using the
//right hand rule, decide whether the point d is above, below, or on the plane
//Inputs: a (vec3), b (vec3), c (vec3)
//Returns: 1 if d is above, -1 if d is below, 0 if d is on
function getAboveOrBelow(a, b, c, d) {
    //TODO: Fill this in for task 2
    return 0;
}









///////////////////////////////////////////////////////////////////
///********     GUI Entry Points / Plotting Utilities    *******///
///////////////////////////////////////////////////////////////////

//This is code that Chris Tralie has written in to help plot the results
//for help debugging.  Feel free to browse the code to see how plot.ly works
//and ask any questions on the forum

//This is the way I hack the axes to be equal
function getAxesEqual(vs) {
    //Determine the axis ranges
    minval = 0;
    maxval = 0;
    for (var i = 0; i < vs.length; i++) {
        for (var j = 0; j < 3; j++) {
            if (vs[i][j] < minval){ minval = vs[i][j]; }
            if (vs[i][j] > maxval){ maxval = vs[i][j]; }
        }
    }
    return {
    x:{ x: [minval, maxval], y: [0, 0], z: [0, 0],
      mode: 'lines', line: {color: '#000000', width: 1}, type: 'scatter3d', name:'xaxis'
    },
    y:{ x: [0, 0], y: [minval, maxval], z: [0, 0],
      mode: 'lines', line: {color: '#000000', width: 1}, type: 'scatter3d', name:'yaxis'
    },
    z:{ x: [0, 0], y: [0, 0], z: [minval, maxval],
      mode: 'lines', line: {color: '#000000', width: 1}, type: 'scatter3d', name:'zaxis'
    }};
}

//This function extracts the components of two different vectors from text
//fields in the web page and outputs the results in text and in a GUI
function callProjVector() {
    var ux = parseFloat(document.getElementById("ux_1").value);
    var uy = parseFloat(document.getElementById("uy_1").value);
    var uz = parseFloat(document.getElementById("uz_1").value);
    u = vec3.fromValues(ux, uy, uz);
    
    var vx = parseFloat(document.getElementById("vx_1").value);
    var vy = parseFloat(document.getElementById("vy_1").value);
    var vz = parseFloat(document.getElementById("vz_1").value);
    v = vec3.fromValues(vx, vy, vz);
    
    //Log the vec3 objects to the console to make sure everything was parsed correctly
    console.log("Computing projection of " + vec3.str(u) + " onto " + vec3.str(v));
    
    //Perform the projection
    var proj = projVector(u, v);
    var projPerp = projPerpVector(u, v);
    //Output result to two decimal places
    document.getElementById("projAnswer").value = "(" + proj[0].toFixed(2) + ", " + proj[1].toFixed(2) + ", " + proj[2].toFixed(2) + ")";
    document.getElementById("projPerpAnswer").value = "(" + projPerp[0].toFixed(2) + ", " + projPerp[1].toFixed(2) + ", " + projPerp[2].toFixed(2) + ")";
    
    
    //Plot u, v, and the parallel/perpendicular projections using plot.ly
    var uviz = { x: [0, ux], y: [0, uy], z: [0, uz],
      mode: 'markers+lines', line: {color: '#0000ff', width: 10},
      type: 'scatter3d', name: 'u',
      marker: {color: '#0000ff', size: 4, symbol: 'circle'}
    };
    var vviz = { x: [0, vx], y: [0, vy], z: [0, vz],
      mode: 'markers+lines', line: {color: '#ff0000', width: 10},
      type: 'scatter3d', name:'v',
      marker: {color: '#ff0000', size: 4, symbol: 'circle'}
    };
    var projviz = { x: [0, proj[0]], y: [0, proj[1]], z: [0, proj[2]],
      mode: 'markers+lines', line: {color: '#ff00ff', width: 10},
      type: 'scatter3d', name:'proj',
      marker: {color: '#ff00ff', size: 4, symbol: 'circle'}
    };
    var projperpviz = { x: [0, projPerp[0]], y: [0, projPerp[1]], z: [0, projPerp[2]],
      mode: 'markers+lines', line: {color: '#00ffff', width: 10, arrowhead:7},
      type: 'scatter3d', name:'projperp',
      marker: {color: '#00ffff', size: 4, symbol: 'circle'}
    };
    var axes = getAxesEqual([u, v, proj, projPerp]);
    var data = [uviz, vviz, projviz, projperpviz, axes.x, axes.y, axes.z];
    var layout = {
      autosize: false, width: 500, height: 500,
      margin: { l: 0, r: 0, b: 0, t: 65 }
    };
    Plotly.newPlot('projVis', data, layout);
}

//This function extracts the angle between vectors ab and ac and outputs
//the result as text, along with drawing the vectors in the GUI
function callComputeAngle() {
    var ax = parseFloat(document.getElementById("ax_2").value);
    var ay = parseFloat(document.getElementById("ay_2").value);
    var az = parseFloat(document.getElementById("az_2").value);
    var a = vec3.fromValues(ax, ay, az);
    
    var bx = parseFloat(document.getElementById("bx_2").value);
    var by = parseFloat(document.getElementById("by_2").value);
    var bz = parseFloat(document.getElementById("bz_2").value);
    var b = vec3.fromValues(bx, by, bz);

    var cx = parseFloat(document.getElementById("cx_2").value);
    var cy = parseFloat(document.getElementById("cy_2").value);
    var cz = parseFloat(document.getElementById("cz_2").value);
    var c = vec3.fromValues(cx, cy, cz);
    
    //Log the vec3 objects to the console to make sure everything was parsed correctly
    console.log("Computing angle between " + vec3.str(b) + " and " + vec3.str(c) + " with respect to " + vec3.str(a));
    
    //Perform the projection
    var angle = getAngle(a, b, c);
    //Output result in radians up to two decimal places
    document.getElementById("angleAnswer").value = angle.toFixed(2) + " radians";
    
    
    //Plot u, v, and the parallel/perpendicular projections using plot.ly
    var aviz = { x: [ax], y: [ay], z: [az],
      mode: 'markers+lines', line: {color: '#ffffff', width: 10},
      type: 'scatter3d', name: 'a',
      marker: {color: '#0000ff', size: 10, symbol: 'circle'}
    };
    var bviz = { x: [bx], y: [by], z: [bz],
      mode: 'markers+lines', line: {color: '#ffffff', width: 10},
      type: 'scatter3d', name:'b',
      marker: {color: '#ff0000', size: 10, symbol: 'circle'}
    };
    var cviz = { x: [cx], y: [cy], z: [cz],
      mode: 'markers+lines', line: {color: '#ffffff', width: 10},
      type: 'scatter3d', name:'c',
      marker: {color: '#ff00ff', size: 10, symbol: 'circle'}
    };
    var abviz = { x: [ax, bx], y: [ay, by], z: [az, bz],
      mode: 'lines', line: {color: '#000000', width: 10},
      type: 'scatter3d', name: 'ab',
    };
    var acviz = { x: [ax, cx], y: [ay, cy], z: [az, cz],
      mode: 'lines', line: {color: '#555555', width: 10},
      type: 'scatter3d', name: 'ac',
    };
    var axes = getAxesEqual([a, b, c]);
    var data = [aviz, bviz, cviz, abviz, acviz, axes.x, axes.y, axes.z];
    var layout = {
      autosize: false, width: 500, height: 500,
      margin: { l: 0, r: 0, b: 0, t: 65 }
    };
    Plotly.newPlot('angleVis', data, layout);    
}

//This function parses point a, b, c, and d and determines if d is above
//the plane spanned by a, b, and c
function callComputeAboveBelow() {
    var ax = parseFloat(document.getElementById("ax_3").value);
    var ay = parseFloat(document.getElementById("ay_3").value);
    var az = parseFloat(document.getElementById("az_3").value);
    var a = vec3.fromValues(ax, ay, az);
    
    var bx = parseFloat(document.getElementById("bx_3").value);
    var by = parseFloat(document.getElementById("by_3").value);
    var bz = parseFloat(document.getElementById("bz_3").value);
    var b = vec3.fromValues(bx, by, bz);

    var cx = parseFloat(document.getElementById("cx_3").value);
    var cy = parseFloat(document.getElementById("cy_3").value);
    var cz = parseFloat(document.getElementById("cz_3").value);
    var c = vec3.fromValues(cx, cy, cz);

    var dx = parseFloat(document.getElementById("dx_3").value);
    var dy = parseFloat(document.getElementById("dy_3").value);
    var dz = parseFloat(document.getElementById("dz_3").value);
    var d = vec3.fromValues(dx, dy, dz);
    
    //Perform the computation
    var res = getAboveOrBelow(a, b, c, d);
    //Output result
    document.getElementById("aboveBelowAnswer").value = "" + res;
}
