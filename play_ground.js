window.onload = function () {

    var s = Snap().attr({
        id: "play_ground",
        fill: "grey"
    });


    for (var i=0; i < num_points; i++){
        var x = 2 * radius * (i+5) + radius;
        var y = 2 * radius;
        p = s.circle(x, y, radius).attr({
            id: "pt" + i,
            fill: "lightblue",
            stroke: "darkcyan",
            strokeWidth: 5,
            clicked: false,
            class: "point"
        }).drag(move, start, stop)
            .click(clickHandler);

        t = s.text(x-14, y, "pt" + i).attr({
            pt_id: "pt" + i,
            fill: "darkcyan",
            class: "point_txt"
        });

        t.dblclick(clickVHanlder);
    }
}

var num_points = 5;
var radius = 32;



var dist = function(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

var clickLHandler = function () {

    var input_l = parseFloat(window.prompt("Lower-bound of Edge",this.attr('lower_bound')));
    var input_u = parseFloat(window.prompt("Upper-bound of Edge",this.attr('upper_bound')));
    if (input_l <= input_u || isNaN(input_l) || isNaN(input_u)) {
        var txt = "[" + (isNaN(input_l) ? "-\u221e" : Math.round(input_l))  + ", "
            + (isNaN(input_u) ? "\u221e)" : Math.round(input_u)  + "]");
        this.attr({
            lower_bound: input_l,
            upper_bound: input_u,
            text: txt
        })
    }else{
        window.alert("Invalid Input!");
    }


    return 0;
}

var clearEdge = function () {
    var s = Snap(document.getElementById("play_ground"));
     s.selectAll(".edge").remove();
     s.selectAll(".edge_txt").remove();
}

var createEdge = function () {

   var s = Snap(document.getElementById("play_ground"));
   var selected = [];
    s.selectAll(".point").forEach(function (t) {
       if (t.attr("clicked") === "true"){
           selected.push(t);
           console.log()
       }
   })


    if (selected.length === 2){
       var v0 = selected[0];
       var v1 = selected[1];

        var boxOne = v0.getBBox();
        var boxTwo = v1.getBBox();
        var line = s.line(boxOne.cx, boxOne.cy, boxTwo.cx, boxTwo.cy);
        var l_bound = Math.sqrt(Math.pow(boxTwo.cx-boxOne.cx, 2) + Math.pow(boxTwo.cy-boxOne.cy, 2));
        line.attr({
            stroke: 'darkcyan',
            strokeWidth: 5,
            class: "edge",
            v0_id: v0.attr("id"),
            v1_id: v1.attr("id"),
            opacity: 0.5
        });

        var range = "[" + Math.round(l_bound)  + ", " + "\u221e)";
        var txt = s.text((boxOne.cx + boxTwo.cx)/2, (boxOne.cy + boxTwo.cy)/2, range);
        txt.attr({
            x1: boxOne.cx,
            y1: boxOne.cy,
            x2: boxTwo.cx,
            y2: boxTwo.cy,
            v0_id: v0.attr("id"),
            v1_id: v1.attr("id"),
            lower_bound: l_bound,
            upper_bound: NaN,
            fill: 'orange',
            class: 'edge_txt'

        });

        txt.dblclick(clickLHandler);

        v0.attr({
            clicked: false,
            fill: "lightblue"
        });
        v1.attr({
            clicked: false,
            fill: "lightblue"
        })
    }else{
        window.alert("Please Select Two Points!")
    }
}


var move = function(dx,dy) {

    var p = this;
    this.attr({
        transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
    });

    var s = Snap(document.getElementById("play_ground"));
    var v0_selected_line = [];
    var v1_selected_line = [];

    var v0_selected_txt = [];
    var v1_selected_txt = [];



    s.selectAll(".edge").forEach(function (t) {
        if (t.attr("v0_id") === p.attr('id')){
            v0_selected_line.push(t);
        }else if(t.attr("v1_id") === p.attr('id')){
            v1_selected_line.push(t);
        }
    })

    s.selectAll(".edge_txt").forEach(function (t) {
        if (t.attr("v0_id") === p.attr('id')){
            v0_selected_txt.push(t);
        }else if(t.attr("v1_id") === p.attr('id')){
            v1_selected_txt.push(t);
        }
    })

    var box = p.getBBox();

    s.selectAll(".point_txt").forEach(function (t) {
        if (t.attr("pt_id") === p.attr('id')){
            t.attr({
                x: box.cx - 14,
                y: box.cy
            })
        }
    })


    v0_selected_txt.forEach(function (t) {



        var _x1 = parseFloat(t.attr('x1'));
        var _y1 = parseFloat(t.attr('y1'));
        var _x2 = parseFloat(t.attr('x2'));
        var _y2 = parseFloat(t.attr('y2'));

        t.attr({
            x1:  box.cx,
            y1:  box.cy,
            x: (box.cx + _x2) / 2,
            y: (box.cy + _y2) / 2
        })

        var _len = dist(_x1, _y1, _x2, _y2);
        if (isNaN(_len)){
            _len = 1;
        }
        var len = dist(box.cx, box.cy, _x2, _y2);
        if (isNaN(_len)){
            len = 1;
        }
        var _l_bound = parseFloat(t.attr('lower_bound'));
        var _u_bound = parseFloat(t.attr('upper_bound'));

        var l_bound = (isNaN(_l_bound * (len / _len)) ? 0 : _l_bound * (len / _len));
        var u_bound =  (isNaN(_u_bound * (len / _len)) ? NaN : _u_bound * (len / _len));

        // console.log(l_bound);


        var txt = "[" + (isNaN(l_bound) ? 0 : Math.round(l_bound))  + ", "
            + (isNaN(u_bound) ? "\u221e)" : Math.round(u_bound)  + "]");
        // console.log(l_bound);
        // console.log(t.attr('upper_bound'));
        t.attr({
            text: txt,
            lower_bound: l_bound,
            upper_bound: u_bound
        })




    })

    v1_selected_txt.forEach(function (t) {
        // console.log("meo");
        var _x1 = parseFloat(t.attr('x1'));
        var _y1 = parseFloat(t.attr('y1'));
        var _x2 = parseFloat(t.attr('x2'));
        var _y2 = parseFloat(t.attr('y2'));

        t.attr({
            x2:  box.cx,
            y2:  box.cy,
            x: (box.cx + _x1) / 2,
            y: (box.cy + _y1) / 2
        })

        var _len = dist(_x1, _y1, _x2, _y2);
        if (isNaN(_len) || _len === 0){
            _len = 1;
        }
        var len = dist(box.cx, box.cy, _x1, _y1);
        if (isNaN(_len) || len === 0){
            len = 1;
        }
        var _l_bound = parseFloat(t.attr('lower_bound'));
        var _u_bound = parseFloat(t.attr('upper_bound'));

        var l_bound = (isNaN(_l_bound * (len / _len)) ? 0 : _l_bound * (len / _len));
        var u_bound =  (isNaN(_u_bound * (len / _len)) ? NaN : _u_bound * (len / _len));



        var txt = "[" + (isNaN(l_bound) ? 0 : Math.round(l_bound))  + ", "
            + (isNaN(u_bound) ? "\u221e)" : Math.round(u_bound)  + "]");
        t.attr({
            text: txt,
            lower_bound: l_bound,
            upper_bound: u_bound
        })
    })


    v0_selected_line.forEach(function (t) {
        t.attr({
            x1:  box.cx,
            y1:  box.cy
        })
    })

    v1_selected_line.forEach(function (t) {
        t.attr({
            x2: box.cx,
            y2: box.cy
        })
    })

}

var start = function() {
    this.data('origTransform', this.transform().local );
}

var stop = function() {
    console.log('finished dragging');
}

var clickHandler = function(){
    if (this.attr("clicked") === "true"){
        this.attr({
            fill: "lightblue",
            clicked: false
        })
    }else{
        this.attr({
            fill: "lightpink",
            clicked: true
        })
    }
}

var creatVertex = function(){

    var label = window.prompt("New Vertex Label", "pt" + num_points);
    var s = Snap(document.getElementById("play_ground"));

    var x = 2 * radius * (num_points+5) + radius;
    var y = 2 * radius;

    p = s.circle(x, y, radius).attr({
        id: "pt" + num_points,
        label: "pt" + num_points,
        fill: "lightblue",
        stroke: "darkcyan",
        strokeWidth: 5,
        clicked: false,
        class: "point"
    }).drag(move, start, stop)
        .click(clickHandler);

    t = s.text(x-14, y, label).attr({
        pt_id: "pt" + num_points,
        fill: "darkcyan",
        class: "point_txt"
    });

    num_points+=1;
}

var clickVHanlder = function () {

    var input = window.prompt("Label of Vertex",this.attr('text'));
    this.attr({
        text: input
    })

}

var removeVertex = function () {

    var s = Snap(document.getElementById("play_ground"));

    var selected_ids = [];

    s.selectAll(".point").forEach(function (t) {
        if (t.attr("clicked") === "true"){
            selected_ids.push(t.attr("id"));
            t.remove()
        }
    })

    s.selectAll(".point_txt").forEach(function (t) {
        selected_ids.forEach(function (t2) {
            if (t2 === t.attr("pt_id")){
                t.remove()
            }
        })
    })

    s.selectAll(".edge").forEach(function (t) {
        selected_ids.forEach(function (t2) {
            if (t2 === t.attr("v0_id") || t2 === t.attr("v1_id")){
                t.remove()
            }
        })
    })

    s.selectAll(".edge_txt").forEach(function (t) {
        selected_ids.forEach(function (t2) {
            if (t2 === t.attr("v0_id") || t2 === t.attr("v1_id")){
                t.remove()
            }
        })
    })


}



