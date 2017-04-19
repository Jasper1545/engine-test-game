class Panel extends engine.DisplayObjectContainer{

	private background:engine.Shape;

	private _width:number;
	private _height:number;
	private width:number;
	private height:number;

	public constructor(x,y,width,height) {
		super();
		this.Init();

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.drawPanel();
	}

	private Init() {
		this.background = new engine.Shape();

	}


	private drawPanel() {

		//this.background.graphics.lineStyle(10, 0x000000 );
        //this.background.graphics.beginFill( 0x071444, 1);
		this.background.graphics.beginFill( "#071444", 1);
        this.background.graphics.drawRect( 0, 0, this.width, this.height );
        this.background.graphics.endFill();
		this.background.alpha = 0.5;
        this.addChild( this.background );

	}

}


var equipmentTextConfig = [

	{name:"  name:  ",x:0,y:50},
	{name:"  attack",x:0,y:100},
	{name:"  strength",x:0,y:150},
	{name:"  agility",x:0,y:200},
	{name:"  intelligence",x:0,y:250},
	{name:"  endurance",x:0,y:300},
	{name:"  fightPower",x:0,y:350}

]

var posConfig = [

	{x:60,y:0},
	{x:60,y:100},
	{x:60,y:200},
	{x:60,y:300},
	{x:60,y:400},
	{x:60,y:500}

]

class EquipmentPanel extends engine.DisplayObjectContainer{
	
	backpanel:Panel;

	name_Texfield:engine.TextField;
	attack_Textfield:engine.TextField;
	strength_Textfield:engine.TextField;
	agility_Textfield:engine.TextField;
	intelligence_Textfield:engine.TextField;
	endurance_Textfield:engine.TextField;
	fightPower_Textfield:engine.TextField;
	
	public constructor() {
		super();
		this.backpanel = new Panel(0,0,400,400);
		this.addChild(this.backpanel);
		this.init();

	}

	private init() {

		this.name_Texfield = new engine.TextField();
		this.name_Texfield.text = equipmentTextConfig[0].name;
		this.name_Texfield.x = equipmentTextConfig[0].x;
		this.name_Texfield.y = equipmentTextConfig[0].y;
		this.addChild(this.name_Texfield);
		
		
		this.attack_Textfield = new engine.TextField();
		this.attack_Textfield.text = equipmentTextConfig[1].name;
		this.attack_Textfield.x = equipmentTextConfig[1].x;
		this.attack_Textfield.y = equipmentTextConfig[1].y;
		this.addChild(this.attack_Textfield);

		this.strength_Textfield = new engine.TextField();
		this.strength_Textfield.text = equipmentTextConfig[2].name;
		this.strength_Textfield.x = equipmentTextConfig[2].x;
		this.strength_Textfield.y = equipmentTextConfig[2].y;
		this.addChild(this.strength_Textfield);

		this.agility_Textfield = new engine.TextField();
		this.agility_Textfield.text = equipmentTextConfig[3].name;
		this.agility_Textfield.x = equipmentTextConfig[3].x;
		this.agility_Textfield.y = equipmentTextConfig[3].y;
		this.addChild(this.agility_Textfield);

		this.intelligence_Textfield = new engine.TextField();
		this.intelligence_Textfield.text = equipmentTextConfig[4].name;
		this.intelligence_Textfield.x = equipmentTextConfig[4].x;
		this.intelligence_Textfield.y = equipmentTextConfig[4].y;
		this.addChild(this.intelligence_Textfield);

		this.endurance_Textfield = new engine.TextField();
		this.endurance_Textfield.text = equipmentTextConfig[5].name;
		this.endurance_Textfield.x = equipmentTextConfig[5].x;
		this.endurance_Textfield.y = equipmentTextConfig[5].y;
		this.addChild(this.endurance_Textfield);

		this.fightPower_Textfield = new engine.TextField();
		this.fightPower_Textfield.text = equipmentTextConfig[6].name;
		this.fightPower_Textfield.x = equipmentTextConfig[6].x;
		this.fightPower_Textfield.y = equipmentTextConfig[6].y;
		this.addChild(this.fightPower_Textfield);
		
		
	}

	public setPanel(equipment:Equipment) {
		this.setPanelText(equipment);
		this.setPanelPos(equipment.type);
	}

	public setPanelText(equipment:Equipment) {
		this.name_Texfield.text = equipmentTextConfig[0].name + equipment.property.name;
		this.attack_Textfield.text = "    +" + equipment.attack + equipmentTextConfig[1].name;
		this.strength_Textfield.text = "    +" + equipment.strength + equipmentTextConfig[2].name;
		this.agility_Textfield.text = "    +" + equipment.agility + equipmentTextConfig[3].name;
		this.intelligence_Textfield.text = "    +" + equipment.intelligence + equipmentTextConfig[4].name;
		this.endurance_Textfield.text = "    +" + equipment.endurance + equipmentTextConfig[5].name;
		this.fightPower_Textfield.text = "    +" + equipment.fightPower + equipmentTextConfig[6].name;
	}

	public setPanelPos(type:number) {

		switch(type) {

			case equipmentType.WEAPON:
				this.x = posConfig[0].x;
				this.y = posConfig[0].y;
				break;

			case equipmentType.SHIELD:
				this.x = posConfig[1].x;
				this.y = posConfig[1].y;
				break;

			case equipmentType.HEAD:
				this.x = posConfig[2].x;
				this.y = posConfig[2].y;
				break;

			case equipmentType.NECK:
				this.x = posConfig[3].x;
				this.y = posConfig[3].y;
				break;

			case equipmentType.SHOULDER:
				this.x = posConfig[4].x;
				this.y = posConfig[4].y;
				break;

			case equipmentType.BODY:
				this.x = posConfig[5].x;
				this.y = posConfig[5].y;
				break;

		}

	}

}