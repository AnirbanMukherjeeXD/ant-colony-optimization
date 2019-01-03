function Node(x, y) {
  this.x = x;
  this.y = y;
  this.show = function() {
    noStroke();
    fill(255);
    ellipse(this.x, this.y, 30, 30);
  }
}