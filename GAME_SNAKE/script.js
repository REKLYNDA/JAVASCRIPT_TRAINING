/* JEU DU SERPENT */

/*  ETAPES 
   
    1 - Création du canvas
	2 - Rafraichissement du canvas
	3 - Création du serpent
	4 - Diriger le serpent
	5 - Ajouter la pomme 
	6 - Gestion des collisions
	7 - Consommation de la pomme
	8 - Score et Game Over
	9 - Ajout du style au jeu
*/



/* Fonction qui se lance au chargement de la page : window.onload */

window.onload = function () {
	var canvasWidth = 900;
	var canvasHeight = 600;
	var blockSize = 30;
	var ctx;
	var delay = 100;
	var snakee;
	var applee;
	var widthInBlocks = canvasWidth / blockSize;
	var heightInBlocks = canvasHeight / blockSize;
	var score;
	
	init();
	
	
	/* Fonction qui initialise le canvas, élément html qui permet de dessiner
	    document                   : Représente notre page html
		createElement('canvas')    : Nous crée un élément de type canvas
		body.appendChild           : Ajoute le canvas au body de la page html 
		ctx                        : Variable représentant le contexte du canvas, entre autre sa surface
		getContext("2d")           : Indique que nous allons dessiner en 2 dimensions
		snakee                     : Le serpent représentée sous forme d'un tableau de blocks
		refreshCanvas              : Fonction servant à rafraîchir l'intérieur du canvas
	
	 */
	function init() {
		var canvas = document.createElement('canvas');
		canvas.width = 900;
		canvas.height = 600;
		canvas.style.border = "2px solid";
		document.body.appendChild(canvas);
	
		ctx = canvas.getContext("2d");
		snakee = new Snake([[6, 4], [5, 4], [4, 4], [3, 4], [2, 4]], "down");
		applee = new Apple([6, 10]);
		score = 0;
		refreshCanvas();
	}
	
	/* 
	   Cette fonction calcule la new position du serpent dans un premier temps
	   Vérifie si cette position correspond à 1 collision
	   Si oui G.O
	   Si non, on vérifie si le serpent a mangé une pomme 
	       (si oui,
	           --> on augmente le score, on record dans un booleen le fait qu'il ait eat 1 pomme
		  
		       --> On donne une new position à la pomme tant qu'il se trouve sur le serpent 
		   )
	   On efface tout le contenu du canvas, on dessine le serpent dans sa nouvelle position, la pomme, on affiche le score. On refait tout cela à chaque /\ t écoulé (delay)
	 */
	
	function refreshCanvas()
	{
		snakee.advance();
		if (snakee.checkCollision()) {
			
			gameOver();
		}
		
		else {
			
			if ( snakee.isEatingApple(applee))
			{
				score ++;
				snakee.ateApple = true;
				do
					{
						applee.setNewPosition();
					} while (applee.isOnSnake(snakee));
			}
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			snakee.draw();
			applee.draw();
			drawScore();
			setTimeout(refreshCanvas, delay);	
			
			
		}
		
	}
	
	
	/*  Affiche Game Over lorsqu'on a perdu
	    Indique l'appui de la touche espace pour recommencer
	*/
	
	function gameOver()
	{
		ctx.save();
		ctx.fillText("Game Over", 5, 15);
		ctx.fillText("Appuyez sur la touche Espace pour rejouer", 5, 30);
		ctx.restore();
		
	}
	
	/* Relance la partie en cas de Game over
	   Il suffit juste de réinitialiser le serpent, la pomme et le score
	   Ensuite on fait appel à refreshCannvas
	*/
	function restart(){
		snakee = new Snake([[6, 4], [5, 4], [4, 4], [3, 4], [2, 4]], "down");
		applee = new Apple([6, 10]);
		score = 0;
		refreshCanvas();
	}
	
	/* Fonction qui affiche le score*/
	function drawScore () {
		
		ctx.save();
		ctx.fillText(score.toString(), 5, canvasHeight - 5);
		ctx.restore();
		
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
	
	    At body           : le corps du snake
	    At direction      : la direction du snake
		At ateApple       : le serpent a mangé la pomme (booleen)
	   
	    Me draw           : Méthode déssinant le snake
							-> On sauve le contexte
							-> On choisit la couleur du dessin
							-> On boucle sur chaque bloc du snake en callant pur each of them la fct drawBlock
							-> On restore ensuite le contexte
				 
        Me advance        : Méthode faisant avancer le serpent en jouant sur les extrémités ( on add un new, on del le last)
							-> On copie les coord de la tête dans une var
							-> On incrémente cette var
							-> On ajoute cette nouvele position en tête de liste du corps pour qu'elle soit dessinée en premier 
							-> On supprime le dernier élément de la liste

	    Me setDirection   : Met à jour la direction du serpent avec la valeur du paramètre newDirection
							-> First, en fonction de la valeur initiale this.direction on déduit les direction permises
							-> Si newDirection est une dir permise , on met à jour la direction

		Me checkCollision : Vérifie s'il y a collision du serpent avec un mur ou avc lui-même
		                    -> On définit 2 booleens qui nous disent respectivement si les coord x de la tête du serpent ont dépassé les extrémités de l'axe des abscisses et les celles de l'axe des ordonnées
							-> On itère sur le reste du corps du serpent pour savoir si les coordonnées de la tête coincident avec l'un des blocs du reste du corps
							
	   Me isEatingApple   : Indique si le serpent a mangé une pomme 
	   
	                        -> Compare les coordonnées de la tête su serpent (bloc) avec ceux du bloc situant la pomme 
							
							-> Renvoie true si les mêmes , false sinon
	*/
	function Snake(body, direction) {
		
		this.body = body;
		this.direction = direction;
		this.ateApple = false;
		this.draw = function () {
			
			ctx.save();
			ctx.fillStyle = "#ff0000";
			for (var i = 0; i < this.body.length; i++) {
				
				drawBlock(ctx, this.body[i]);
			}
			ctx.restore();
				
		};
		this.advance = function () {
			
			var nextPosition = this.body[0].slice();
			switch(this.direction){
					
				case "left":
					 nextPosition[0] -=1;
					
					 break;
					
			   /* Exemple implémentation du déplacement du serpent vers la gauche
					
					[4] [5] [T6]
		             [T5 5] [T6]
	              [T4] [T5] [T6]
             [T3] [T4] [T5]      */
				
				case "right":
					 nextPosition[0] +=1;
					 
					 break;
					
				case "down":
					 nextPosition[1] +=1;
					 break;
					
				case "up":
					 nextPosition[1] -=1;
					
					 break;
					
				default:	
					throw("Invalid Direction");
			}
			this.body.unshift(nextPosition);
			if (!this.ateApple)
			   this.body.pop();   /* JJe ne supprime pas de bloc s'il a mangé une pomme*/
			else
				this.ateApple = false;
			
		}
		
		this.setDirection = function(newDirection) {
			
			 var allowedDirections;
			 switch(this.direction) {
				   
				 case "left":
		          case "right":
					   allowedDirections = ["up","down"];
			           break;
				case "up":
		         case "down":
					   allowedDirections = ["left", "right"];
			           break;
				default :
					throw("Invalid Direction");
			}
			if (allowedDirections.indexOf(newDirection) > -1) {  // Si newDirection est une direction présente dans le tableau allowedDirections
				
				this.direction = newDirection;
			}
			
		}
		
		this.checkCollision = function(){
			
			
			
			var wallCollision = false;
			var snakeCollision = false;
			var head = this.body[0];
			var rest = this.body.slice(1);
			var snakeX = head[0];
			var snakeY = head[1];
			var minX = 0;
			var minY = 0;
			var maxX = widthInBlocks - 1 ;
			var maxY = heightInBlocks - 1;
			var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX ;
			var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
			
			
			if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
			{
				
				wallCollision = true;
			}
			
			for (var i =0; i < rest.length; i++){
				
				if (snakeX === rest[i][0] && snakeY === rest[i][1])
				
				{
					snakeCollision = true;
				}
			}
			
			return wallCollision || snakeCollision;
		};
		
		this.isEatingApple = function(appleToEat) {
			
			var head = this.body[0];
			if (head[0] === appleToEat.position[0] && head[1] == appleToEat.position[1])
				return true;
			else 
				return false;
		};
		
		
	}
	
	/* Constructeur  déssinant la pomme que doit eat le serpent
	
	   at position : Coordonnées du bloc définissant la position de la pomme sur le canvas
	   
	   Me draw     : Fonction dessinnant un cercle
	                 -> On sauv le ctx
					 -> On définit la couleur du dessin
					 -> beginPath permet de commencer nouveau chemmin
					 -> On définit le rayon, c'est la moitié de la taille du bloc 30px / 2 
					 -> x et y sont les coordonnées du centre du cercle
					 -> Ce sont les coordonées de position que l'on multiplie par blockSize pour laisser de l'espace 
					 et auxquelles on rajoute le rayon 
					 -> Math.PI*2 est l'angle du rayon (360)
					 -> On remplit le cercle avec le meth fill
					 -> On restore ensuite le ctx
					 
	   Me setNewPosition : Définit aléatoirement une new position pour la pomme 
	                      -> Usage de la fct Math.random (renvoie un nbre entre 0 et 1)
						  -> Usage de la fonction Math.round (donne un arrondi)
						  -> On multiplie par le nbre de blocs maxi sur l'axe concernée - 1 pour get un 
						  abscisse ou ordonnée possible
						  -> on set ensuite l'attr position à ces new coordonnées
       Me isOnSnake     : Vérifie si la pomme est placée sur un snake en particulier 
	                       -> boucle sur les blocs du serpent
						   -> Renvoie true si coincidence de la position de la pomme avec celle d'un bloc
	*/
	function Apple(position) {
		
		this.position = position;
		this.draw = function () {
			
			ctx.save();
			ctx.fillStyle = "#33cc33";
			ctx.beginPath();
			var radius = blockSize/2;
			var x = this.position[0] * blockSize + radius;
			var y = this.position[1] * blockSize  + radius; 
			ctx.arc(x, y, radius, 0, Math.PI*2, true);
			ctx.fill();
			ctx.restore();
		};
		
		this.setNewPosition = function(){
			
			var newX = Math.round(Math.random() * (widthInBlocks - 1));
			var newY = Math.round(Math.random() * (heightInBlocks - 1));
			this.position = [newX, newY];
		};
		
		this.isOnSnake = function (snakeToCheck){
			
			var isOnSnake = false;
			for (var i =0; i< snakeToCheck.body.length; i ++ ){
				
			    if( this.position[0] === snakeToCheck.body[i][0] &&  this.position[1] === snakeToCheck.body[i][0]){
					
					isOnSnake = true;
				}
				
			 }
			 return isOnSnake;
		};
	
	}

	
	/* Cette fonction est rattachée à notre page html et détecte un appui de touche du clavier
	grâce à la variable évènement e. Grâce à cette dernière, on récupère le code de la touche, 
	de là on déduit la nouvelle direction du Srepent (on set l'attribut direction du Snake à newDirection
	ssi cette direction est permmise par rapport à la 1ere direction / actuelle direction ).
	
	Si on appuie sur la touche Espace, on execute la fonction restart
	*/
	document.onkeydown = function handleKeyDown(e) {
	
	    var key = e.keyCode;
		var newDirection;
		switch(key) {

			case 37:
				newDirection = "left";
				break;
			case 38:
				newDirection = "up";
				break;
			case 39:
				newDirection = "right";
				break;
			case 40:
				newDirection = "down";
				break;
			case 32:
				restart();
				return;  // Stoppe l'exécution de la fonction
			default:
				return;
		}
		snakee.setDirection(newDirection);
	
    }
	
} 

/*
Faire avancer le serpent en augmentant l'abscisse de chacun de ses blocs
this.advance = function () {
			
			for( var i = 0; i < this.body.length; i++){
				
				this.body[i] [0] += 1;
				//this.body[i] [1] += 1;
			}
		
		
		[4] [5] [T6]
		 [T5 5] [T6]
	  [T4] [T5] [T6]
 [T3] [T4] [T5]
*/