
// Impossible
var head = new Cell('.W');
var n1 = head.append( new Cell('.>') );
var n2 = n1.append( new Cell('.B') );
var n3 = n2.append( new Cell('.B') );
var n4 = n3.append( new Cell('..') );
var n5 = n4.append( new Cell('..') );
n5.append( new Cell('.W') );

var b1 = n2.appendClose( new Cell('X.','C') );
var b2 = b1.append( new Cell('.W','C') );
var b3 = b2.append( new Cell('X.','C') );
b3.appendClose(n3);

var c1 = n4.appendClose( new Cell('..','C') );
c1.appendClose(n5);

// finally
var levelCode = head;
