
// 2 folds
var head = new Cell('.W');
var n1 = head.append( new Cell('.<') );
var n2 = n1.append( new Cell('.B') );
var n3 = n2.append( new Cell('X.') );
var n4 = n3.append( new Cell('..') );
n4.append( new Cell('.W') );

var b1 = n1.appendOpen( new Cell('X.','O') );
var b2 = b1.append( new Cell('.B','O') );
b2.appendOpen(n2);

var c1 = n3.appendOpen( new Cell('..','O') );
var c2 = c1.append( new Cell('.W','O') );
c2.appendOpen(n4);

// finally
var levelCode = head;
