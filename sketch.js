var V=[];			//Vertex Set
var algoOn=0;
var a=[[0],[0]]//Adjacency Matrix
var n=0;			//Nodes
var i,j;
//var iteration
var A=[];			///Ants
var destination=3;
var p=[[0],[0]];
var antNumber=4;
var p_max=150;		//Max Pheromone
var e_factor;	//Evaporation Factor
var iACO=0;			//Counter
var best=-1;
var alphaC=1,beta=0;
var gount=5;

function setConstants(){
	antNumber=parseInt(document.getElementById('antNumber').value);
	destination=parseInt(document.getElementById('destinationNode').value);
}

function disableInputs(state){
	var inp=document.querySelectorAll('.statInp');
	for(i in inp){
		inp[i].disabled = state;
	}
}

function inputWeights(){
	for(i=0;i<n;i++){
		for(j=0;j<n;j++){
			if(i==j){
				a[i][i]=-1;
			}else if(i<j){
				var val=a[i][j]>0?a[i][j]:parseInt(prompt("Enter weight for "+i+","+j));
				if(!isNaN(val)){
					a[i][j]=val;
					a[j][i]=a[i][j];
					stroke(255,150);
					line(V[i].x,V[i].y,V[j].x,V[j].y);
				}
			}
		}
	}
	p = Array(n).fill().map(() => Array(n).fill(0));
	document.getElementById('makeNodes').style.visibility="hidden";
}

function clearWeights(){
	init();
	a = Array(n).fill().map(() => Array(n).fill(0));
}

function clearPheromone(){
	init();
}

function clearNodes(){
	n=0;
	clearWeights();
	V=[];
	document.getElementById('Panel').style.visibility="hidden";
	document.getElementById('makeNodes').style.visibility="visible";
}

function isConnected(x,y){
	if(a[x][y]>0){
		return true;
	}else{
		return false;
	}
}

function checkConnected(){
	for(i=0;i<n;i++){
		if(isConnected(destination,i))
			return true;
	}
	return false;
}

function init(){
	p = Array(n).fill().map(() => Array(n).fill(0));		//Pheromone Matrix
	iACO=0;
}

function initAnts(){
	for(i=0;i<antNumber;i++)
		A[i]=new Ant();
	console.log("Initialized Ants");
}

function evaporatePheromone(){
	for(i=0;i<n;i++){
		for(j=0;j<n;j++){
			if(p[i][j]>0)
				p[i][j]-=e_factor*p[i][j]
		}
	}
}

function moveAnt(k,dest){				//Move Ant
	if(!isConnected(A[k].pos,dest)){
		console.log("Path doesn't exist between "+A[k].pos+" "+dest);
		return false;
	}
	dest=parseInt(dest);
	console.log("Move Ant ["+k+"] from "+A[k].pos+" to "+dest);
	A[k].totalCost+=a[A[k].pos][dest];
	A[k].path.push([A[k].pos,dest]);
	A[k].pos=dest;
	A[k].visited.push(dest);
}
function computeCoefficient(k,j){			//(q)ij
	console.log("Computing coefficient for Ant "+k+" from "+A[k].pos+" to "+j);
	return(Math.pow(p[A[k].pos][j],alphaC)/Math.pow(a[A[k].pos][j],beta));
}
function selectNextNode(k){
	var current,result=-1;
	for(i=0;i<n;i++){
		if(!A[k].isVisited(i)&&isConnected(A[k].pos,i)){
			console.log("Select for Edge "+A[k].pos+","+i);
	//		result=i;
			current=computeCoefficient(k,i);
			var prob=Math.random();
			console.log("Prob is "+prob+", Current is "+current+", best is "+best);
			if(current>best&&prob>0.3){
				best=current;
				result=i;
			}else if(current==best||current==-1&&prob<0.5){		//probablity=0.5
				console.log("Same prob");
				result=i;
			}else{
				if(1){
					result=result>0?result:i;
					console.log("oops");
				}
			}
		}
	}
	console.log("result: "+result);
	return result;
}

function ACO(){
		if(!checkConnected()){
			alert("Final node not connected");
			return;
		}
		initAnts();
		iACO++;
		var ai;
		for(ai=0;ai<antNumber;ai++){
			best=-1;
			while(A[ai].pos!=destination&&gount%100!=0){
				//best=-1;
				//gount++;
				var nxtNode=selectNextNode(ai)
				if(nxtNode==-1){												//DeadEnd
					//console.log("Returning to..."+A[ai].visited[A[ai].visited.length-2]);
					//A[ai].pos=A[ai].visited[A[ai].visited.length-2];		
					A[ai].pos=A[ai].visited[A[ai].visited.indexOf(A[ai].pos)-1];
					A[ai].path.pop();
					console.log("Returned to "+A[ai].pos);
					console.log("Path:  "+A[ai].path);
					console.log("Visited length:  "+A[ai].visited.length);
					console.log("Visited:  "+A[ai].visited);
				}else{
					moveAnt(ai,nxtNode);
					if(A[ai].pos==destination)
						console.log("Dest reachesss  "+destination)
				}
			}
		}
		for(ai=0;ai<antNumber;ai++){
			A[ai].updatePheromone();
		}
		
	

	evaporatePheromone();
}

function drawEdges(){
	for(i=0;i<n;i++){
		for(j=0;j<n;j++){
			if(i<j&&a[i][j]>0){
				line(V[i].x,V[i].y,V[j].x,V[j].y);
			}
		}
	}
}

function viewPheromone(){
	for(i=0;i<n;i++){
		for(j=0;j<n;j++){
			if(i<j&&a[i][j]>0){
				var col='rgba(255,0,0,'+(p[i][j]/150)+')';
				stroke(col);
				strokeWeight(5);
				line(V[i].x,V[i].y,V[j].x,V[j].y);
			}
		}
	}
}

function setup() {
	createCanvas(640,360);
	background(50);
	var algOn=document.getElementById('algOn');
	var algOff=document.getElementById('algOff');
	
}

function startAlgo(){
	setConstants();
	if(!checkConnected()){
		alert("Final node not connected");
		return;
	}
	disableInputs(true);
	algOn.style.display='none';
	algOff.style.display='block';
	algoOn=1;
}

function stopAlgo(){
	disableInputs(false);
	algOn.style.display='block';
	algOff.style.display='none';
	algoOn=0;
}

function draw(){
	
	fill(255);
	background(50);
	if(V.length>1){
		stroke(255,150);
		drawEdges();
		
	}
	p_coefficient=parseInt(document.getElementById('p_coefficient').value);		//P coefficient
	document.getElementById('p_value').innerHTML=p_coefficient;
	
	e_factor=parseInt(document.getElementById('e_factor').value)/100;		//Evaporation Factor
	document.getElementById('e_value').innerHTML=e_factor*100+"%";
	
	//console.log(frameCount);
	viewPheromone();
	stroke(0);
	ellipse(mouseX,mouseY,20,20);
	textSize(20);
	textAlign(CENTER, CENTER);
	for(i=0;i<V.length;i++){
		V[i].show();
		fill(0);
		text(i, V[i].x, V[i].y);
	}
	if(algoOn==1)
		ACO();
	for(i=0;i<n;i++)
		for(j=0;j<n;j++)
			a[i][j]=a[j][i];
	textSize(15);
	textFont('Tw Cen MT');
	fill(255);
	txt="Iteration "+iACO;
	text(txt,50,50);
	
}

function mousePressed(){
	if(mouseX<640&&mouseY<360){
		if(n>0){
			document.getElementById('Panel').style.visibility="visible";
		}
		V[n]=new Node(mouseX, mouseY);
		n++;
		if(n>1){
			var temp=a;
			a = Array(n).fill().map(() => Array(n).fill(0));		
			for(i=0;i<n-1;i++)
				for(j=0;j<n-1;j++)
					a[i][j]=temp[i][j];
		}else
			a = Array(n).fill().map(() => Array(n).fill(0));
	}
}

