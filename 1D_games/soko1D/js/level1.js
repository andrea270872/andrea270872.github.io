
// test1 - FOLD
var head = new Cell('.W');
var n1 = head.append( new Cell('.>') );
var n2 = n1.appendClose( new Cell('..') );
n2.append( new Cell('.W') );

var b1 = n1.appendOpen( new Cell('.B','O') );
var b2 = b1.append( new Cell('..','O') );
var b3 = b2.append( new Cell('X.','O') );
b3.appendOpen(n2);

// finally
var levelCode = head;
