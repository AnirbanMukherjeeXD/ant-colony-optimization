function Ant() {
    this.pos = 0;
    this.visited=[];
	this.path=[];
	this.totalCost=0;
	this.visited.push(0);
	this.isVisited = function(jj) {
		for(var ii=0;ii<this.visited.length;ii++){
			if(this.visited[ii]==jj)
				return(true);
		}
		return(false);
	}
	this.updatePheromone = function() {

		if(this.visited.length>1&&this.pos==destination){
			console.log("Updating from "+destination);
			var p_level=p_coefficient/this.totalCost;		//Q
			while(this.path.length!=0){
				var edge=this.path.pop();				
				p[edge[0]][edge[1]]+=p_level;
				p[edge[1]][edge[0]]+=p_level;
			}
			this.totalCost=0;
			this.visited.push(0);
			this.pos=0;
		}
	}
}