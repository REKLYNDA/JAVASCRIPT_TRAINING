function Dog(name, color, age)
{
	this.name = name;
	this.color = color;
	this.age = age;
	this.aboie = function () { console.log("Wouaf " + this.name)};
}


var petitCaniche = new Dog("Chou", "Black", 3);
var grosPitbull = new Dog("Rex", "Blue", 12);

//console.log(petitCaniche);
//console.log(grosPitbull);

grosPitbull.aboie();