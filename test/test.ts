var canvas = document.getElementById("app") as HTMLCanvasElement;
var stage = engine.run(canvas);
console.log("aaa");

var map:GameMap;
var grid:Grid;
var tileSize = 64;

console.log("bbb");

console.log("test:" + CommandList.test);

var list = new CommandList();

console.log("ccc");

CommandList.setCurrentList(list);

console.log("ddd");

var gameScence = new engine.DisplayObjectContainer();
var infoScence = new engine.DisplayObjectContainer();

stage.addChild(gameScence);

//地图和人物部分

        var numCols = 10;
        var numRows = 10;

        this.touchEnabled = true;

        this.map = new GameMap(numCols,numRows);
        gameScence.addChild(this.map);

        this.grid = new Grid(numCols,numRows);
        this.grid.initWalkable();

        var player = new Player(this.grid,this.tileSize);
        Player.setPlayer(player);

        gameScence.addChild(player.playerStage);

//地图和人物部分结束


//任务和NPC和怪物部分

        this.touchEnabled = true;

        var scenceService = new SceneService()

        var taskService = new TaskService(scenceService);

        var taskPanel = new TaskPanel(gameScence,taskService);

        var dialoguePanel = new DialoguePanel(gameScence,taskService);

        DialoguePanel.setDialoguePanel(dialoguePanel);

        var npc_0 = new NPC("npc_0",taskService,dialoguePanel);
        npc_0.showNpc(this.map);

        var npc_1 = new NPC("npc_1",taskService,dialoguePanel);
        npc_1.showNpc(this.map);

        var monster = new Monster("001",scenceService);
        monster.showMonster(this.map);

//任务和NPC和怪物结束


//人物面板部分
        var gem1 = new Gem("gem_0");
        var gem2 = new Gem("gem_1");
        var gem3 = new Gem("gem_2");

        var sword1 = new Weapon("weapon_0");
        var shield1 = new Shield("shield_0");
        var head1 = new Head("head_0");

        sword1.addGem(gem1);
        shield1.addGem(gem2);
        head1.addGem(gem3);

        var hero1 = new Hero("hero_0");

        var panel = new HeroPanel();

        hero1.equip(sword1);
        hero1.equip(shield1);
        hero1.equip(head1);

        panel.equipmentMap.equip(sword1);
        panel.equipmentMap.equip(shield1);
        panel.equipmentMap.equip(head1);

        hero1.reSetCurrentHMp();
        hero1.setInTeam(true);
        
        var user = new User();
        user.addHero(hero1);
        User.setHero(hero1);

        HeroPanel.setHeroPanel(panel);
        panel.setHero(hero1);

        infoScence.addChild(panel);

        
//人物面板结束

//命令系统相关

        var npcList:NPC[] = [];
        npcList.push(npc_0);
        npcList.push(npc_1);
        var monsterList:Monster[] = [];
        monsterList.push(monster);

        var commandService = new CommandService(this,gameScence,infoScence,this.map,player,npcList,monsterList,dialoguePanel,list);
        CommandService.setCurrentService(commandService);

        this.map.touchEnabled = true;
        this.map.addEventListener(engine.TouchEvent.TOUCH_TAP, commandService.onTouch, commandService);

//命令系统相关结束










