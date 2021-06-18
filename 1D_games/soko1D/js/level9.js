
// Level 9- A bit of everything
var head = new Cell('.W');
var n1 = head.append( new Cell('..') );
var n2 = n1.append( new Cell('.<') );
var n3 = n2.append( new Cell('..') );
var n4 = n3.append( new Cell('.B') );
var n5 = n4.append( new Cell('.W') );

// deposit area
var b1 = n4.appendClose( new Cell('X.','C') );
var b2 = b1.append( new Cell('..','C') );
var b3 = b2.append( new Cell('X.','C') );
b3.appendClose(n5);

var c1 = n4.appendOpen( new Cell('..','O') );
var c2 = c1.append( new Cell('X.','O') );
var c3 = c2.append( new Cell('..','O') );
c3.appendOpen(n5);

// first fork in the corridor
var d1 = n1.appendClose( new Cell('.B','C') );
d1.appendClose(n2);
var e1 = n1.appendOpen( new Cell('..','O') );
e1.appendOpen(n2);

// second fork in the corridor
var dd1 = n2.appendClose( new Cell('..','C') );
dd1.appendClose(n3);
var ee1 = n2.appendOpen( new Cell('.W','O') );
ee1.appendOpen(n3);

// third fork in the corridor
var ddd1 = n3.appendClose( new Cell('.B','C') );
ddd1.appendClose(n4);
var eee1 = n3.appendOpen( new Cell('..','O') );
eee1.appendOpen(n4);

// finally
var levelCode = head;
