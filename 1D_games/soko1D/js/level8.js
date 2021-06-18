
// Open and Closed
var head = new Cell('.W');
var n1 = head.append( new Cell('.>') );
var n2 = n1.append( new Cell('.B') );
var n3 = n2.append( new Cell('X.') );
var n4 = n3.append( new Cell('.W') );

var b1 = n1.appendClose( new Cell('..','C') );
var b2 = b1.append( new Cell('..','C') );
var b3 = b2.append( new Cell('..','C') );
b3.appendClose(n2);

var c1 = n1.appendOpen( new Cell('X.','O') );
var c2 = c1.append( new Cell('.B','O') );
var c3 = c2.append( new Cell('..','O') );
c3.appendOpen(n2);

// finally
var levelCode = head;
