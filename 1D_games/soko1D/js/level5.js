
// 2 more folds
var head = new Cell('.W');
var n1 = head.append( new Cell('.>') );
var n2 = n1.append( new Cell('.B') );
var n3 = n2.append( new Cell('.B') );
var n4 = n3.append( new Cell('..') );
var n5 = n4.append( new Cell('X.') );
n5.append( new Cell('.W') );


var b1 = n2.appendOpen( new Cell('X.','O') );
b1.appendOpen(n3);

var c1 = n3.appendOpen( new Cell('.B','O') );
var c2 = c1.append( new Cell('X.','O') );
var c3 = c2.append( new Cell('..','O') );
c3.appendOpen(n4);


// finally
var levelCode = head;
