

/* Fonction qui se lance au chargement de la page : window.onload */

window.onload = function () {
	var canvasWidth = 900;
	var canvasHeight = 600;
	var blockSize = 30;
	var ctx;
	var delay = 100;
	var snakee;
	
	init();
	
	
	/* Fonction qui initialise le canvas, élément html qui permet de dessiner
	    document         : Représente notre page html
		createElement    : Nous crée un élément de type canvas
		body.appendChild : Ajoute le canvas au body de la page html 
		ctx              : Variable représentant le contexte du canvas, entre autre sa surface
		getContext("2d") : Indique que nous allons dessiner en 2 dimensions
		snakee           : Le serpent représentée sous forme d'un tableau de blocks
		refreshCanvas    : Fonction servant à rafraîchir l'intérieur du canvas
	
	 */
	function init() {
		var canvas = document.createElement('canvas');
		canvas.width = 600;
		canvas.height = 600;
		canvas.style.border = "2px solid";
		document.body.appendChild(canvas);
		ctx = canvas.getContext("2d");
		snakee = new Snake([[6, 4], [5, 4], [4, 4]]);
		refreshCanvas();
	}
	
	
	
	/* 
	   Cette fonction efface tout le contenu du canvas,
	   Met à jour les nouvelles coordonnées du serpent,
	   Dessine ce dernier dans sa nouvelle position,
	   Et ce à chaque /\ t écoulé (delay)
	 */
	
	function refreshCanvas()
	{
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		snakee.advance();
		snakee.draw();
		
		setTimeout(refreshCanvas, delay);	
	}
	
	
	/* Cette fonction déssine un bloc
	   ctx          : Le conttexte du canvas
	   positon      : Les coordonnées x et y du block, le pixel en haut à gauche
	   x et y       : Coordonnées du pixel en haut à gauche à partir duquel le bloc sera dessiné
	   blockSize    : Longueur et largeur d'un bloc et écart nécessaire entre les pixels de départ de 2 blocs successifs du snake  2B___BlockSize___1B
	   ctx.fillRect : Dessiner sur la surface du canvas
	   On multiplie par blockSize pour laisser cette espace au dessin du block suivant
	*/
	
	function drawBlock(ctx, position) {
		
		var x = position[0] * blockSize;
		var y = position[1] * blockSize;
		ctx.fillRect(x, y, blockSize, blockSize);
	}
	
	
	
	/* Constructeur de notre snake
	
	   At body    : le corps du snake
	   Me draw    : Méthode déssinant le snake
	                -> On sauve le contexte
				    -> On choisit la couleur du dessin
				    -> On boucle sur chaque bloc du snake en callant pur each of them la fct drawBlock
				    -> On restore ensuite le contexte
				 
	   Me advance : Méthode faisant avancer le serpent en jouant sur les extrémités ( on add un new, on del le last)
	                -> On copie les coord de la tête dans une var
					-> On incrémente cette var
					-> On ajoute cette nouvele position en tête de liste du corps pour qu'elle soit dessinée en premier 
					-> On supprime le dernier élément de la liste
	
	*/
	function Snake(body) {
		
		this.body = body;
		this.draw = function () {
			
			ctx.save();
			ctx.fillStyle = "#ff0000";
			for( var i = 0; i < this.body.length; i++) {
				
				drawBlock(ctx, this.body[i]);
			}
			ctx.restore();
				
		};
		this.advance = function () {
			
			var nextPosition = this.body[0].slice();
			nextPosition[0] +=1;
			this.body.unshift(nextPosition);
			this.body.pop();
			
		}
	}
	
	
	
} 

/*
Faire avancer le serpent en augmentant l'abscisse de chacun de ses blocs
this.advance = function () {
			
			for( var i = 0; i < this.body.length; i++){
				
				this.body[i] [0] += 1;
				//this.body[i] [1] += 1;
			}
		}
*/