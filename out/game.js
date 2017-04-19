var canvas = document.getElementById("app");
var stage = engine.run(canvas);
console.log("aaa");
var map;
var grid;
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
this.map = new GameMap(numCols, numRows);
gameScence.addChild(this.map);
this.grid = new Grid(numCols, numRows);
this.grid.initWalkable();
var player = new Player(this.grid, this.tileSize);
Player.setPlayer(player);
gameScence.addChild(player.playerStage);
//地图和人物部分结束
//任务和NPC和怪物部分
this.touchEnabled = true;
var scenceService = new SceneService();
var taskService = new TaskService(scenceService);
var taskPanel = new TaskPanel(gameScence, taskService);
var dialoguePanel = new DialoguePanel(gameScence, taskService);
DialoguePanel.setDialoguePanel(dialoguePanel);
var npc_0 = new NPC("npc_0", taskService, dialoguePanel);
npc_0.showNpc(this.map);
var npc_1 = new NPC("npc_1", taskService, dialoguePanel);
npc_1.showNpc(this.map);
var monster = new Monster("001", scenceService);
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
var npcList = [];
npcList.push(npc_0);
npcList.push(npc_1);
var monsterList = [];
monsterList.push(monster);
var commandService = new CommandService(this, gameScence, infoScence, this.map, player, npcList, monsterList, dialoguePanel, list);
CommandService.setCurrentService(commandService);
this.map.touchEnabled = true;
this.map.addEventListener(engine.TouchEvent.TOUCH_TAP, commandService.onTouch, commandService);
//命令系统相关结束
var battleConfig = {
    WIN: 0,
    LOSE: 1
};
class BattleService {
    constructor(hero, monster) {
        this.__hasBeenCancelled = false;
        this.hero = hero;
        this.monster = monster;
        this.currentRound = 0;
    }
    startBattle(callback) {
        this.callback = callback;
        console.log("开始战斗");
        engine.setTimeout(this.battleRound, this, 200);
    }
    stopBattle(callback) {
        this.callback = callback;
        console.log("取消战斗");
        this.__hasBeenCancelled = true;
    }
    battleCount() {
        if (this.__hasBeenCancelled) {
            this.cancalBattle();
        }
        else {
            console.log("玩家生命：" + this.hero.getHp() + "/" + this.hero.maxHp);
            console.log("怪物生命：" + this.monster.getHp() + "/" + this.monster.getMaxHp());
            if (this.hero.getHp() <= 0) {
                this.battleEnd(battleConfig.LOSE);
            }
            else if (this.monster.getHp() <= 0) {
                this.battleEnd(battleConfig.WIN);
            }
            else {
                engine.setTimeout(this.battleRound, this, 200);
            }
        }
    }
    battleRound() {
        this.currentRound++;
        console.log("第" + this.currentRound + "回合");
        this.monster.getDamage(this.hero.giveDamage());
        this.hero.getDamage(this.monster.giveDamage());
        this.battleCount();
    }
    battleEnd(info) {
        switch (info) {
            case battleConfig.WIN:
                console.log("战斗胜利");
                this.monster.scenceService.notify(this.monster.monsterId);
                this.monster.refurbishMonster();
                this.callback();
                break;
            case battleConfig.LOSE:
                console.log("战斗失败");
                console.log("重新开始");
                this.hero.reviveHero();
                this.callback();
                break;
        }
    }
    cancalBattle() {
        console.log("战斗取消");
        this.__hasBeenCancelled = false;
        this.callback();
    }
}
var characterTypeConfig = {
    HERO: 0
};
var CharacterStatusConfig = {
    NORMAL: 0,
    DEAD: 1
};
class Character extends Property {
    constructor() {
        super();
        this.status = CharacterStatusConfig.NORMAL;
    }
    get fightPower() {
        return 0;
    }
    ;
    get attack() {
        return 0;
    }
    get defence() {
        return 0;
    }
    get strength() {
        return 0;
    }
    ;
    get agility() {
        return 0;
    }
    ;
    get intelligence() {
        return 0;
    }
    ;
    get endurance() {
        return 0;
    }
    ;
}
class CharacterProperty extends Property {
    constructor() {
        super();
        this.name = "";
        this.level = 1;
        this._attackGrow = 0;
        this._defenceGrow = 0;
        this._strengthGrow = 0;
        this._agilityGrow = 0;
        this._intelligenceGrow = 0;
        this._enduranceGrow = 0;
        this.desc = "";
    }
    levelup() {
        this.level++;
    }
    get _attack() {
        return this.level * this._attackGrow;
    }
    get _defence() {
        return this.level * this._defenceGrow;
    }
    get _strength() {
        return this.level * this._strengthGrow;
    }
    get _agility() {
        return this.level * this._agilityGrow;
    }
    get _intelligence() {
        return this.level * this._intelligenceGrow;
    }
    get _endurance() {
        return this.level * this._enduranceGrow;
    }
    get fightPower() {
        var result = 0;
        result = this._attack + this._defence + (this._strength + this._agility +
            this._intelligence + this._endurance) * 0.5;
        return result;
    }
}
class WalkCommand {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    execute(callback) {
        var player = Player.getPlayer();
        player.startMove(this.x, this.y, function () {
            callback();
        });
    }
    cancel(callback) {
        var player = Player.getPlayer();
        player.stopMove(function () {
            callback();
        });
    }
}
class FightCommand {
    constructor(monster) {
        this.currentMonster = monster;
        this.currentHero = User.getHero();
        this.battleService = new BattleService(this.currentHero, this.currentMonster);
    }
    execute(callback) {
        console.log("开始战斗");
        this.battleService.startBattle(callback);
        //this.currentMonster.startFight(callback);
    }
    cancel(callback) {
        console.log("脱离战斗");
        this.battleService.stopBattle(callback);
        //this.currentMonster.stopFight(callback);
    }
}
class TalkCommand {
    constructor(npc) {
        this.currentNpc = npc;
    }
    execute(callback) {
        this.currentNpc.talkToNpc(callback);
        console.log("打开对话框");
    }
    cancel(callback) {
        this.currentNpc.stopTalkToNpc(callback);
        console.log("因取消关闭对话框");
    }
}
class CommandList {
    constructor() {
        this._list = [];
        this._frozen = false;
    }
    freeze() {
        console.log("命令列表锁定");
        this._frozen = true;
    }
    unfreeze() {
        console.log("命令列表解锁");
        this._frozen = false;
    }
    lock() {
        this.freeze();
    }
    unlock() {
        engine.setTimeout(this.unfreeze, this, 100);
    }
    static setCurrentList(list) {
        CommandList.currentList = list;
    }
    static getCurrentList() {
        return CommandList.currentList;
    }
    addCommand(command) {
        this._list.push(command);
    }
    execute() {
        if (this._frozen) {
            engine.setTimeout(this.execute, this, 100);
            return;
        }
        var command = this._list.shift();
        var service = CommandService.getCurrentService();
        this.currentCommand = command;
        if (command) {
            console.log("执行命令", command);
            service.lock();
            this.lock();
            command.execute(() => {
                service.unlock();
                this.unlock();
                this.execute();
            });
        }
        else {
            //service.unlock();
            //this.unlock();
            console.log("全部命令执行完毕");
        }
    }
    cancel() {
        this._frozen = true;
        var command = this.currentCommand;
        var service = CommandService.getCurrentService();
        engine.setTimeout(() => {
            if (this._frozen) {
                service.unlock();
                this._frozen = false;
            }
        }, this, 2000);
        if (command) {
            command.cancel(() => {
                service.unlock();
                this.unlock();
            });
            this._list = [];
        }
    }
}
CommandList.test = 1;
var buttonConfig = {
    textX: 20, textY: 20,
    changToInfoX: 256, changToInfoY: 700, changToInfoWidth: 100, changToInfoHeight: 50,
    changToGameX: 448, changToGameY: 0, changToGameWidth: 100, changToGameHeight: 50
};
class CommandService {
    constructor(stage, gameScence, infoScence, map, player, npcList, monsterList, dialoguePanel, commandList) {
        this.frozen = false;
        this.stage = stage;
        this.gameScence = gameScence;
        this.infoScence = infoScence;
        this.map = map;
        this.player = player;
        this.npcList = npcList;
        this.monsterList = monsterList;
        this.dialoguePanel = dialoguePanel;
        this.commandList = commandList;
        this.drawChangeToGameButton(buttonConfig.changToGameX, buttonConfig.changToGameY, buttonConfig.changToGameWidth, buttonConfig.changToGameHeight);
        this.drawChangeToInfoButton(buttonConfig.changToInfoX, buttonConfig.changToInfoY, buttonConfig.changToInfoWidth, buttonConfig.changToInfoHeight);
        this.stage.addChild(this.gameScence);
        this.stage.addChild(this.changeToInfoButton);
    }
    drawChangeToInfoButton(x, y, width, height) {
        this.changeToInfoButton = new engine.DisplayObjectContainer();
        var backGround = new engine.Shape();
        //backGround.graphics.beginFill(0x808000,1);
        backGround.graphics.beginFill("#808000", 1);
        backGround.graphics.drawRect(0, 0, width, height);
        backGround.graphics.endFill();
        this.changeToInfoButton.addChild(backGround);
        var textField = new engine.TextField();
        textField.text = "信息";
        textField.x = buttonConfig.textX;
        textField.y = buttonConfig.textY;
        this.changeToInfoButton.addChild(textField);
        this.changeToInfoButton.x = x;
        this.changeToInfoButton.y = y;
        this.changeToInfoButton.touchEnabled = true;
        this.changeToInfoButton.addEventListener(engine.TouchEvent.TOUCH_TAP, this.changeToInfoScence, this);
        console.log("画信息按钮");
    }
    drawChangeToGameButton(x, y, width, height) {
        this.changeToGameButton = new engine.DisplayObjectContainer();
        var backGround = new engine.Shape();
        //backGround.graphics.beginFill(0x808000,1);
        backGround.graphics.beginFill("#808000", 1);
        backGround.graphics.drawRect(0, 0, width, height);
        backGround.graphics.endFill();
        this.changeToGameButton.addChild(backGround);
        var textField = new engine.TextField();
        textField.text = "返回";
        textField.x = buttonConfig.textX;
        textField.y = buttonConfig.textY;
        this.changeToGameButton.addChild(textField);
        this.changeToGameButton.x = x;
        this.changeToGameButton.y = y;
        this.changeToGameButton.touchEnabled = true;
        this.changeToGameButton.addEventListener(engine.TouchEvent.TOUCH_TAP, this.changeToGameScence, this);
        console.log("画返回按钮");
    }
    //public changeToGameScence(e:engine.TextEvent){
    changeToGameScence(e) {
        this.stage.removeChild(this.infoScence);
        this.stage.removeChild(this.changeToGameButton);
        this.stage.addChild(this.gameScence);
        this.stage.addChild(this.changeToInfoButton);
    }
    //public changeToInfoScence(e:engine.TextEvent){
    changeToInfoScence(e) {
        this.stage.removeChild(this.gameScence);
        this.stage.removeChild(this.changeToInfoButton);
        var panel = HeroPanel.getHeroPanel();
        panel.setHero(User.getHero());
        this.stage.addChild(this.infoScence);
        this.stage.addChild(this.changeToGameButton);
    }
    static setCurrentService(service) {
        this.currentService = service;
    }
    static getCurrentService() {
        return this.currentService;
    }
    freeze() {
        this.frozen = true;
        console.log("命令服务锁定");
    }
    unfreeze() {
        this.frozen = false;
        console.log("命令服务解锁");
    }
    lock() {
        this.freeze();
    }
    unlock() {
        engine.setTimeout(this.unfreeze, this, 10);
    }
    onTouch(e) {
        var x = Math.floor(e.offsetX / 64);
        var y = Math.floor(e.offsetY / 64);
        var player = Player.getPlayer();
        var playerX = Math.floor(player.playerStage.x / 64);
        var playerY = Math.floor(player.playerStage.y / 64);
        if (!this.frozen) {
            console.log("点击事件" + "(" + e.offsetX + "," + e.offsetY + ")");
            console.log("点击位置" + "(" + x + "," + y + ")");
            console.log("玩家位置" + "(" + playerX + "," + playerY + ")");
            this.checkMap(x, y, playerX, playerY);
        }
        else {
            this.commandList.cancel();
        }
    }
    checkMap(x, y, playerX, playerY) {
        this.checkNpc(x, y, playerX, playerY);
    }
    checkNpc(x, y, playerX, playerY) {
        for (var i = 0; i < this.npcList.length; i++) {
            var npc = this.npcList[i];
            var npcX = Math.floor(npc.npcStageX / 64);
            var npcY = Math.floor((npc.npcStageY + 64) / 64);
            var talkPosX = Math.floor(npc.talkPosX / 64);
            var talkPosY = Math.floor(npc.talkPosY / 64);
            console.log("NPC位置" + "(" + npcX + "," + npcY + ")");
            if (x == npcX && y == npcY) {
                this.lock();
                console.log("去与NPC对话");
                if (playerX == talkPosX && playerY == talkPosY) {
                    this.commandList.addCommand(new TalkCommand(this.npcList[i]));
                    this.commandList.execute();
                }
                else {
                    this.commandList.addCommand(new WalkCommand(this.npcList[i].talkPosX, this.npcList[i].talkPosY));
                    this.commandList.addCommand(new TalkCommand(this.npcList[i]));
                    this.commandList.execute();
                }
                break;
            }
            else if (i == (this.npcList.length - 1)) {
                console.log("不是NPC");
                this.checkMonster(x, y, playerX, playerY);
                break;
            }
        }
    }
    checkMonster(x, y, playerX, playerY) {
        for (var i = 0; i < this.monsterList.length; i++) {
            var monster = this.monsterList[i];
            var monsterX = Math.floor(monster.monster.x / 64);
            var monsterY = Math.floor(monster.monster.y / 64);
            var fightPosX = Math.floor(monster.monsterFightPosX / 64);
            var fightPosY = Math.floor(monster.monsterFightPosY / 64);
            console.log("怪物位置" + "(" + monsterX + "," + monsterY + ")");
            if (x == monsterX && y == monsterY) {
                this.lock();
                console.log("去与怪物战斗");
                if (playerX == fightPosX && playerY == fightPosY) {
                    this.commandList.addCommand(new FightCommand(this.monsterList[i]));
                    this.commandList.execute();
                }
                else {
                    this.commandList.addCommand(new WalkCommand(this.monsterList[i].monsterFightPosX, this.monsterList[i].monsterFightPosY));
                    this.commandList.addCommand(new FightCommand(this.monsterList[i]));
                    this.commandList.execute();
                }
                break;
            }
            else if (i == (this.monsterList.length - 1)) {
                console.log("不是怪物");
                this.checkMove(x, y);
                break;
            }
        }
    }
    checkMove(x, y) {
        console.log("开始移动");
        this.commandList.addCommand(new WalkCommand(x * 64, y * 64));
        this.commandList.execute();
    }
}
var dialoguePanelPosConfig = {
    x: 450, y: 700
};
class DialoguePanel {
    constructor(stage, taskService) {
        this._hasBeenShowed = false;
        //private backColor = 0xFFFAFA;
        this.backColor = "#FFFAFA";
        this.panelX = dialoguePanelPosConfig.x;
        this.panelY = dialoguePanelPosConfig.y;
        this.panelWidth = 200;
        this.panelHeight = 300;
        this.taskNameTextFieldText = "Task";
        this.taskNameTextFieldX = 40;
        this.taskNameTextFieldY = 30;
        this.taskNameTextFieldWidth = 200;
        //private taskNameTextFieldColor = 0xFF0000;
        this.taskNameTextFieldColor = "#FF0000";
        this.taskDescTextFieldText = "Task";
        this.taskDescTextFieldX = 10;
        this.taskDescTextFieldY = 100;
        this.taskDescTextFieldWidth = 180;
        //private taskDescTextFieldColor = 0xFF0000;
        this.taskDescTextFieldColor = "#FF0000";
        //private buttonColor = 0x808000;
        this.buttonColor = "#808000";
        this.buttonX = 50;
        this.buttonY = 200;
        this.buttonWidth = 100;
        this.buttonHeight = 50;
        this.buttonTextFieldText = "确认";
        this.buttonTextFieldX = this.buttonX + 15;
        this.buttonTextFieldY = this.buttonY + 10;
        this.buttonTextFieldWidth = 100;
        //private buttonTextFieldColor = 0xFFFAFA;
        this.buttonTextFieldColor = "#FFFAFA";
        this.stage = stage;
        this.taskService = taskService;
        this.panel = new engine.DisplayObjectContainer();
        this.taskNameTextField = new engine.TextField();
        this.taskDescTextField = new engine.TextField();
        this.backGround = new engine.Shape();
        this.button = new engine.DisplayObjectContainer();
        this.buttonBack = new engine.Shape();
        this.buttonTextField = new engine.TextField();
        this.drawPanel();
    }
    static setDialoguePanel(panel) {
        this.dialoguePanel = panel;
    }
    static getdialoguePanel() {
        return this.dialoguePanel;
    }
    setText() {
        this.taskNameTextField.text = this.taskNameTextFieldText;
        this.taskNameTextField.x = this.taskNameTextFieldX;
        this.taskNameTextField.y = this.taskNameTextFieldY;
        //this.taskNameTextField.width = this.taskNameTextFieldWidth;
        //this.taskNameTextField.bold = true;
        //this.taskNameTextField.textColor = this.taskNameTextFieldColor;
        this.taskDescTextField.text = this.taskDescTextFieldText;
        this.taskDescTextField.x = this.taskDescTextFieldX;
        this.taskDescTextField.y = this.taskDescTextFieldY;
        //this.taskDescTextField.width = this.taskDescTextFieldWidth;
        //this.taskDescTextField.bold = false;
        //this.taskDescTextField.textColor = this.taskDescTextFieldColor;
    }
    drawBackGround() {
        this.backGround.graphics.beginFill(this.backColor, 1);
        this.backGround.graphics.drawRect(0, 0, this.panelWidth, this.panelHeight);
        this.backGround.graphics.endFill();
    }
    drawButtonBack() {
        this.buttonBack.graphics.beginFill(this.buttonColor, 1);
        this.buttonBack.graphics.drawRect(this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
        this.buttonBack.graphics.endFill();
    }
    setButtonText() {
        this.buttonTextField.text = this.buttonTextFieldText;
        this.buttonTextField.x = this.buttonTextFieldX;
        this.buttonTextField.y = this.buttonTextFieldY;
        //this.buttonTextField.width = this.buttonTextFieldWidth;
        //this.buttonTextField.bold = false;
        //this.buttonTextField.textColor = this.buttonTextFieldColor;
    }
    drawButton() {
        this.drawButtonBack();
        this.setButtonText();
        this.button.addChild(this.buttonBack);
        this.button.addChild(this.buttonTextField);
    }
    drawPanel() {
        this.panel.x = this.panelX;
        this.panel.y = this.panelY;
        //this.panel.width = this.panelWidth;
        //this.panel.height = this.panelHeight;
        this.drawButton();
        this.drawBackGround();
        this.setText();
        this.panel.addChild(this.backGround);
        this.panel.addChild(this.taskNameTextField);
        this.panel.addChild(this.taskDescTextField);
        this.panel.addChild(this.button);
        this.button.touchEnabled = true;
        this.button.addEventListener(engine.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
    }
    onButtonClick(e) {
        console.log("按钮被点击");
        switch (this.currentTaskStatus) {
            case TaskStatus.ACCEOTABLE:
                console.log("Accept Button Click");
                console.log("Current Task Id: " + this.currentTaskId);
                this.taskService.accept(this.currentTaskId);
                break;
            case TaskStatus.CAN_SUBMIT:
                console.log("Submit Button Click");
                this.taskService.finish(this.currentTaskId);
                break;
            default:
                console.log("Button Click");
        }
        this.removePanel();
    } //按钮被点击
    showPanel() {
        this._hasBeenShowed = true;
        this.stage.addChild(this.panel);
    }
    removePanel() {
        if (!this._hasBeenShowed) {
            console.log("对话框已经被关闭");
        }
        else {
            this._hasBeenShowed = false;
            this.stage.removeChild(this.panel);
            console.log("对话框关闭");
        }
        this.callback();
    }
    onOpen(task, callback) {
        this.callback = callback;
        this.currentTaskId = task.id;
        this.changeTaskText(task.name, task.desc);
        this.changeButton(task.status);
        this.currentTaskStatus = task.status;
        this.showPanel();
    } //被通知
    onClose(callback) {
        this.callback = callback;
        this.removePanel();
        console.log("关闭对话框");
    } //被通知
    changeTaskText(name, desc) {
        this.taskNameTextField.text = name;
        this.taskDescTextField.text = desc;
    }
    changeButton(taskStatus) {
        switch (taskStatus) {
            case TaskStatus.ACCEOTABLE:
                this.buttonTextField.text = "接受";
                break;
            case TaskStatus.CAN_SUBMIT:
                this.buttonTextField.text = "提交";
                break;
            default:
                this.buttonTextField.text = "";
                break;
        }
    }
}
var equipmentType = {
    GEM: -1,
    WEAPON: 0,
    SHIELD: 1,
    HEAD: 2,
    NECK: 3,
    SHOULDER: 4,
    BODY: 5
};
class Equipment extends Item {
    constructor() {
        super();
    }
    get fightPower() {
        return 0;
    }
    ;
    get attack() {
        return 0;
    }
    get defence() {
        return 0;
    }
    get strength() {
        return 0;
    }
    ;
    get agility() {
        return 0;
    }
    ;
    get intelligence() {
        return 0;
    }
    ;
    get endurance() {
        return 0;
    }
    ;
}
class Panel extends engine.DisplayObjectContainer {
    constructor(x, y, width, height) {
        super();
        this.Init();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.drawPanel();
    }
    Init() {
        this.background = new engine.Shape();
    }
    drawPanel() {
        //this.background.graphics.lineStyle(10, 0x000000 );
        //this.background.graphics.beginFill( 0x071444, 1);
        this.background.graphics.beginFill("#071444", 1);
        this.background.graphics.drawRect(0, 0, this.width, this.height);
        this.background.graphics.endFill();
        this.background.alpha = 0.5;
        this.addChild(this.background);
    }
}
var equipmentTextConfig = [
    { name: "  name:  ", x: 0, y: 50 },
    { name: "  attack", x: 0, y: 100 },
    { name: "  strength", x: 0, y: 150 },
    { name: "  agility", x: 0, y: 200 },
    { name: "  intelligence", x: 0, y: 250 },
    { name: "  endurance", x: 0, y: 300 },
    { name: "  fightPower", x: 0, y: 350 }
];
var posConfig = [
    { x: 60, y: 0 },
    { x: 60, y: 100 },
    { x: 60, y: 200 },
    { x: 60, y: 300 },
    { x: 60, y: 400 },
    { x: 60, y: 500 }
];
class EquipmentPanel extends engine.DisplayObjectContainer {
    constructor() {
        super();
        this.backpanel = new Panel(0, 0, 400, 400);
        this.addChild(this.backpanel);
        this.init();
    }
    init() {
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
    setPanel(equipment) {
        this.setPanelText(equipment);
        this.setPanelPos(equipment.type);
    }
    setPanelText(equipment) {
        this.name_Texfield.text = equipmentTextConfig[0].name + equipment.property.name;
        this.attack_Textfield.text = "    +" + equipment.attack + equipmentTextConfig[1].name;
        this.strength_Textfield.text = "    +" + equipment.strength + equipmentTextConfig[2].name;
        this.agility_Textfield.text = "    +" + equipment.agility + equipmentTextConfig[3].name;
        this.intelligence_Textfield.text = "    +" + equipment.intelligence + equipmentTextConfig[4].name;
        this.endurance_Textfield.text = "    +" + equipment.endurance + equipmentTextConfig[5].name;
        this.fightPower_Textfield.text = "    +" + equipment.fightPower + equipmentTextConfig[6].name;
    }
    setPanelPos(type) {
        switch (type) {
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
class EquipmentProperty extends Property {
    constructor() {
        super();
        this.name = "";
        this._attack = 0;
        this._defence = 0;
        this._strength = 0;
        this._agility = 0;
        this._intelligence = 0;
        this._endurance = 0;
        this.desc = "";
    }
}
class TileNode {
    constructor(x, y) {
        this.walkable = true;
        this.costMultiplier = 1.0;
        this.x = x;
        this.y = y;
    }
}
class Grid {
    constructor(numCols, numRows) {
        this._numCols = numCols;
        this._numRows = numRows;
        this._nodes = new Array();
        for (var i = 0; i < this._numCols; i++) {
            this._nodes[i] = new Array();
            for (var j = 0; j < this._numRows; j++) {
                this._nodes[i][j] = new TileNode(i, j);
            }
        }
    }
    getNode(x, y) {
        return this._nodes[x][y];
    }
    setEndNode(x, y) {
        this._endNode = this._nodes[x][y];
    }
    getEndNode() {
        return this._endNode;
    }
    setStartNode(x, y) {
        this._startNode = this._nodes[x][y];
    }
    getStartNode() {
        return this._startNode;
    }
    setWalkable(x, y, value) {
        this._nodes[x][y].walkable = value;
    }
    getNumCols() {
        return this._numCols;
    }
    getNumRows() {
        return this._numRows;
    }
    initWalkable() {
        for (var i = 0; i < mapconfig.length; i++) {
            this.setWalkable(mapconfig[i].x, mapconfig[i].y, mapconfig[i].walkable);
        }
    }
}
class AStar {
    constructor() {
        this._openList = [];
        this._closedList = [];
        this._path = [];
        this._heuristic = this.diagonal;
        this._straightCost = 1.0;
        this._diagCost = Math.SQRT2;
    }
    findPath(grid) {
        this._grid = grid;
        this._openList = new Array();
        this._closedList = new Array();
        this._startNode = this._grid._startNode;
        this._endNode = this._grid._endNode;
        this._startNode.g = 0;
        this._startNode.h = this._heuristic(this._startNode);
        this._startNode.f = this._startNode.g + this._startNode.h;
        return this.search();
    }
    search() {
        var currentNode = this._startNode;
        while (currentNode != this._endNode) {
            var startX = Math.max(0, currentNode.x - 1);
            var endX = Math.min(this._grid._numCols - 1, currentNode.x + 1);
            var startY = Math.max(0, currentNode.y - 1);
            var endY = Math.min(this._grid._numRows - 1, currentNode.y + 1);
            for (var i = startX; i <= endX; i++) {
                for (var j = startY; j <= endY; j++) {
                    var test = this._grid._nodes[i][j];
                    if (test == currentNode || !test.walkable || !this._grid._nodes[currentNode.x][test.y].walkable || !this._grid._nodes[test.x][currentNode.y].walkable) {
                        continue;
                    }
                    var cost = this._straightCost;
                    if (!((currentNode.x == test.x) || (currentNode.y == test.y))) {
                        cost = this._diagCost;
                    }
                    var g = currentNode.g + cost;
                    var h = this._heuristic(test);
                    var f = g + h;
                    if (this.isOpen(test) || this.isClosed(test)) {
                        if (test.f > f) {
                            test.f = f;
                            test.g = g;
                            test.h = h;
                            test.parent = currentNode;
                        }
                    }
                    else {
                        test.f = f;
                        test.g = g;
                        test.h = h;
                        test.parent = currentNode;
                        this._openList.push(test);
                    }
                }
            }
            this._closedList.push(currentNode); //已考察列表
            if (this._openList.length == 0) {
                return false;
            }
            this._openList.sort(function (a, b) {
                return a.f - b.f;
            });
            currentNode = this._openList.shift();
        }
        this.buildPath();
        return true;
    }
    getpath() {
        return this._path;
    }
    isOpen(node) {
        for (var i = 0; i < this._openList.length; i++) {
            if (this._openList[i] == node) {
                return true;
            }
        }
        return false;
    }
    isClosed(node) {
        for (var i = 0; i < this._closedList.length; i++) {
            if (this._closedList[i] == node) {
                return true;
            }
        }
        return false;
    }
    buildPath() {
        this._path = new Array();
        var node = this._endNode;
        this._path.push(node);
        while (node != this._startNode) {
            node = node.parent;
            this._path.unshift(node);
        }
    }
    manhattan(node) {
        return Math.abs(this._endNode.x - node.x) * this._straightCost + Math.abs(this._endNode.y - node.y) * this._straightCost;
    }
    euclidian(node) {
        var dx = this._endNode.x - node.x;
        var dy = this._endNode.y - node.y;
        return Math.sqrt(dx * dx + dy * dy) * this._straightCost;
    }
    diagonal(node) {
        var dx = Math.abs(this._endNode.x - node.x);
        var dy = Math.abs(this._endNode.y - node.y);
        var diag = Math.min(dx, dy);
        var straight = dx + dy;
        return this._diagCost * diag + this._straightCost * (straight - 2 * diag);
    }
    visited() {
        return this._closedList.concat(this._openList);
    }
    validNode(node, currentNode) {
        if (currentNode == node || !node.walkable)
            return false;
        if (!this._grid._nodes[currentNode.x][node.y].walkable)
            return false;
        if (!this._grid._nodes[node.x][currentNode.y].walkable)
            return false;
        return true;
    }
}
var mapconfig = [
    { x: 0, y: 0, walkable: true, image: "floor01_png" },
    { x: 0, y: 1, walkable: true, image: "floor01_png" },
    { x: 0, y: 2, walkable: true, image: "floor01_png" },
    { x: 0, y: 3, walkable: true, image: "floor01_png" },
    { x: 0, y: 4, walkable: true, image: "floor01_png" },
    { x: 0, y: 5, walkable: true, image: "floor01_png" },
    { x: 0, y: 6, walkable: true, image: "floor02_png" },
    { x: 0, y: 7, walkable: true, image: "floor02_png" },
    { x: 0, y: 8, walkable: true, image: "floor02_png" },
    { x: 0, y: 9, walkable: true, image: "floor02_png" },
    { x: 1, y: 0, walkable: false, image: "floor03_png" },
    { x: 1, y: 1, walkable: false, image: "floor03_png" },
    { x: 1, y: 2, walkable: false, image: "floor03_png" },
    { x: 1, y: 3, walkable: false, image: "floor03_png" },
    { x: 1, y: 4, walkable: false, image: "floor03_png" },
    { x: 1, y: 5, walkable: true, image: "floor01_png" },
    { x: 1, y: 6, walkable: true, image: "floor02_png" },
    { x: 1, y: 7, walkable: true, image: "floor02_png" },
    { x: 1, y: 8, walkable: true, image: "floor02_png" },
    { x: 1, y: 9, walkable: true, image: "floor02_png" },
    { x: 2, y: 0, walkable: true, image: "floor01_png" },
    { x: 2, y: 1, walkable: true, image: "floor01_png" },
    { x: 2, y: 2, walkable: true, image: "floor01_png" },
    { x: 2, y: 3, walkable: true, image: "floor01_png" },
    { x: 2, y: 4, walkable: true, image: "floor01_png" },
    { x: 2, y: 5, walkable: true, image: "floor01_png" },
    { x: 2, y: 6, walkable: false, image: "floor04_png" },
    { x: 2, y: 7, walkable: true, image: "floor02_png" },
    { x: 2, y: 8, walkable: true, image: "floor02_png" },
    { x: 2, y: 9, walkable: true, image: "floor02_png" },
    { x: 3, y: 0, walkable: false, image: "shelf01_png" },
    { x: 3, y: 1, walkable: false, image: "shelf02_png" },
    { x: 3, y: 2, walkable: true, image: "floor01_png" },
    { x: 3, y: 3, walkable: true, image: "floor01_png" },
    { x: 3, y: 4, walkable: true, image: "floor01_png" },
    { x: 3, y: 5, walkable: true, image: "floor01_png" },
    { x: 3, y: 6, walkable: false, image: "floor04_png" },
    { x: 3, y: 7, walkable: true, image: "floor02_png" },
    { x: 3, y: 8, walkable: true, image: "floor02_png" },
    { x: 3, y: 9, walkable: true, image: "floor02_png" },
    { x: 4, y: 0, walkable: false, image: "shelf03_png" },
    { x: 4, y: 1, walkable: false, image: "shelf04_png" },
    { x: 4, y: 2, walkable: true, image: "floor01_png" },
    { x: 4, y: 3, walkable: true, image: "floor01_png" },
    { x: 4, y: 4, walkable: true, image: "floor01_png" },
    { x: 4, y: 5, walkable: true, image: "floor01_png" },
    { x: 4, y: 6, walkable: false, image: "floor04_png" },
    { x: 4, y: 7, walkable: true, image: "floor02_png" },
    { x: 4, y: 8, walkable: false, image: "floor02_png" },
    { x: 4, y: 9, walkable: true, image: "floor02_png" },
    { x: 5, y: 0, walkable: true, image: "floor01_png" },
    { x: 5, y: 1, walkable: true, image: "floor01_png" },
    { x: 5, y: 2, walkable: true, image: "floor01_png" },
    { x: 5, y: 3, walkable: false, image: "table01_png" },
    { x: 5, y: 4, walkable: false, image: "table02_png" },
    { x: 5, y: 5, walkable: true, image: "floor01_png" },
    { x: 5, y: 6, walkable: true, image: "floor02_png" },
    { x: 5, y: 7, walkable: true, image: "floor02_png" },
    { x: 5, y: 8, walkable: true, image: "floor02_png" },
    { x: 5, y: 9, walkable: true, image: "floor02_png" },
    { x: 6, y: 0, walkable: true, image: "floor01_png" },
    { x: 6, y: 1, walkable: true, image: "floor01_png" },
    { x: 6, y: 2, walkable: true, image: "floor01_png" },
    { x: 6, y: 3, walkable: false, image: "table03_png" },
    { x: 6, y: 4, walkable: false, image: "table04_png" },
    { x: 6, y: 5, walkable: true, image: "floor01_png" },
    { x: 6, y: 6, walkable: true, image: "floor02_png" },
    { x: 6, y: 7, walkable: true, image: "floor02_png" },
    { x: 6, y: 8, walkable: true, image: "floor02_png" },
    { x: 6, y: 9, walkable: true, image: "floor02_png" },
    { x: 7, y: 0, walkable: true, image: "floor01_png" },
    { x: 7, y: 1, walkable: true, image: "floor01_png" },
    { x: 7, y: 2, walkable: false, image: "floor01_png" },
    { x: 7, y: 3, walkable: true, image: "floor01_png" },
    { x: 7, y: 4, walkable: true, image: "floor01_png" },
    { x: 7, y: 5, walkable: true, image: "floor01_png" },
    { x: 7, y: 6, walkable: true, image: "floor02_png" },
    { x: 7, y: 7, walkable: true, image: "floor02_png" },
    { x: 7, y: 8, walkable: true, image: "floor02_png" },
    { x: 7, y: 9, walkable: true, image: "floor02_png" },
    { x: 8, y: 0, walkable: true, image: "floor01_png" },
    { x: 8, y: 1, walkable: true, image: "floor01_png" },
    { x: 8, y: 2, walkable: true, image: "floor01_png" },
    { x: 8, y: 3, walkable: true, image: "floor01_png" },
    { x: 8, y: 4, walkable: false, image: "floor01_png" },
    { x: 8, y: 5, walkable: true, image: "floor01_png" },
    { x: 8, y: 6, walkable: true, image: "floor02_png" },
    { x: 8, y: 7, walkable: true, image: "floor02_png" },
    { x: 8, y: 8, walkable: true, image: "floor02_png" },
    { x: 8, y: 9, walkable: true, image: "floor02_png" },
    { x: 9, y: 0, walkable: true, image: "floor01_png" },
    { x: 9, y: 1, walkable: true, image: "floor01_png" },
    { x: 9, y: 2, walkable: true, image: "floor01_png" },
    { x: 9, y: 3, walkable: true, image: "floor01_png" },
    { x: 9, y: 4, walkable: true, image: "floor01_png" },
    { x: 9, y: 5, walkable: true, image: "floor01_png" },
    { x: 9, y: 6, walkable: true, image: "floor02_png" },
    { x: 9, y: 7, walkable: true, image: "floor02_png" },
    { x: 9, y: 8, walkable: true, image: "floor02_png" },
    { x: 9, y: 9, walkable: true, image: "floor02_png" }
];
class GameMap extends engine.DisplayObjectContainer {
    constructor(numCols, numRows) {
        super();
        this.init();
    }
    init() {
        for (var i = 0; i < mapconfig.length; i++) {
            var data = mapconfig[i];
            var tile = new MapTile(data);
            this.addChild(tile);
        }
    }
    static replacescene(map) {
        this.map = map;
    }
    static getCurrentMap() {
        return GameMap.map;
    }
}
GameMap.tilesize = 64;
class MapTile extends engine.DisplayObjectContainer {
    constructor(data) {
        super();
        this.init(data);
    }
    init(data) {
        this.x = data.x * GameMap.tilesize;
        this.y = data.y * GameMap.tilesize;
        this.walkable = data.walkable;
        this.image = data.image;
        var bitmap = new engine.Bitmap();
        bitmap.texture = engine.RES.getRes(this.image);
        this.addChild(bitmap);
    }
}
class Gem extends Equipment {
    constructor(configId) {
        super(); //uId
        this.type = equipmentType.GEM;
        this.configId = configId;
        this.property = new GemProperty(configId);
    }
    get fightPower() {
        var result = 0;
        result = this.property.fightPower;
        return result;
    }
    get attack() {
        return this.property._attack;
    }
    get defence() {
        return this.property._defence;
    }
    get strength() {
        return this.property._strength;
    }
    get agility() {
        return this.property._agility;
    }
    get intelligence() {
        return this.property._intelligence;
    }
    get endurance() {
        return this.property._endurance;
    }
}
var gemConfig = [
    { id: "gem_0", name: "Gem0", attack: 10, defence: 10, strength: 10, agility: 10, intelligence: 10, endurance: 10, desc: "This is Gem0" },
    { id: "gem_1", name: "Gem1", attack: 20, defence: 20, strength: 20, agility: 20, intelligence: 20, endurance: 20, desc: "This is Gem1" },
    { id: "gem_2", name: "Gem2", attack: 30, defence: 30, strength: 30, agility: 30, intelligence: 30, endurance: 30, desc: "This is Gem2" }
];
class GemProperty extends EquipmentProperty {
    constructor(configId) {
        super();
        for (var i = 0; i < gemConfig.length; i++) {
            if (configId == gemConfig[i].id) {
                var gem = gemConfig[i];
                this.name = gem.name;
                this._attack = gem.attack;
                this._defence = gem.defence;
                this._strength = gem.strength;
                this._agility = gem.agility;
                this._intelligence = gem.intelligence;
                this._endurance = gem.endurance;
                this.desc = gem.desc;
                break;
            }
            else if (i == (gemConfig.length - 1)) {
                console.warn("未找到宝石configId:" + configId);
                break;
            }
        }
    }
    get fightPower() {
        var result = 0;
        result = this._attack + this._defence + (this._strength + this._agility +
            this._intelligence + this._intelligence) * 0.5;
        return result;
    }
}
class Head extends Equipment {
    constructor(configId) {
        super();
        this.type = equipmentType.HEAD;
        this.gems = [];
        this.configId = configId;
        this.property = new HeadProperty(configId);
    }
    addGem(gem) {
        this.gems.push(gem);
    }
    get fightPower() {
        var result = 0;
        this.gems.forEach(gem => {
            result += gem.fightPower;
        });
        result += this.property.fightPower;
        return result;
    }
    get attack() {
        var result = 0;
        this.gems.forEach(gem => {
            result += gem.attack;
        });
        result += this.property._attack;
        return result;
    }
    get defence() {
        var result = 0;
        this.gems.forEach(gem => {
            result += gem.defence;
        });
        result += this.property._defence;
        return result;
    }
    get strength() {
        var result = 0;
        this.gems.forEach(gem => {
            result += gem.strength;
        });
        result += this.property._strength;
        return result;
    }
    get agility() {
        var result = 0;
        this.gems.forEach(gem => {
            result += gem.agility;
        });
        result += this.property._agility;
        return result;
    }
    get intelligence() {
        var result = 0;
        this.gems.forEach(gem => {
            result += gem.intelligence;
        });
        result += this.property._intelligence;
        return result;
    }
    get endurance() {
        var result = 0;
        this.gems.forEach(gem => {
            result += gem.endurance;
        });
        result += this.property._endurance;
        return result;
    }
}
var headConfig = [
    { id: "head_0", name: "BadHead", attack: 100, defence: 100, strength: 110, agility: 120, intelligence: 130, endurance: 140, desc: "This is BadHead" },
    { id: "head_1", name: "GoodHead", attack: 200, defence: 200, strength: 210, agility: 220, intelligence: 230, endurance: 240, desc: "This is GoodHead" }
];
class HeadProperty extends EquipmentProperty {
    constructor(configId) {
        super();
        for (var i = 0; i < headConfig.length; i++) {
            if (configId == headConfig[i].id) {
                var head = headConfig[i];
                this.name = head.name;
                this._attack = head.attack;
                this._defence = head.defence;
                this._strength = head.strength;
                this._agility = head.agility;
                this._intelligence = head.intelligence;
                this._endurance = head.endurance;
                this.desc = head.desc;
                break;
            }
            else if (i == (headConfig.length - 1)) {
                console.warn("未找到头部装备configId:" + configId);
                break;
            }
        }
    }
    get fightPower() {
        var result = 0;
        result = this._attack + this._defence + (this._agility + this._strength +
            this._intelligence + this._endurance) * 0.5;
        return result;
    }
}
class Hero extends Character {
    constructor(configId) {
        super();
        this.type = characterTypeConfig.HERO;
        this.isInTeam = false;
        this.equipments = [];
        this.configId = configId;
        this.property = new HeroProperty(configId);
        this.reSetCurrentHMp();
    }
    reSetCurrentHMp() {
        this.currentHp = this.maxHp;
        this.currentMp = this.maxMp;
    }
    reviveHero() {
        console.log("玩家复活");
        this.reSetCurrentHMp();
    }
    giveDamage() {
        return this.attack;
    }
    getDamage(damage) {
        console.log("英雄受伤害:" + damage);
        this.currentHp -= damage;
    }
    getHp() {
        return this.currentHp;
    }
    getMp() {
        return this.currentMp;
    }
    levelUp() {
        this.property.levelup;
        this.reSetCurrentHMp();
    }
    setInTeam(status) {
        this.isInTeam = status;
    }
    equip(equipment) {
        this.equipments.push(equipment);
    }
    get fightPower() {
        var result = 0;
        this.equipments.forEach(equipment => {
            result += equipment.fightPower;
        });
        result += this.property.fightPower;
        return result;
    }
    get attack() {
        var result = 0;
        this.equipments.forEach(equipment => {
            result += equipment.attack;
        });
        result += this.property._attack;
        return result;
    }
    get strength() {
        var result = 0;
        this.equipments.forEach(equipment => {
            result += equipment.strength;
        });
        result += this.property._strength;
        return result;
    }
    get agility() {
        var result = 0;
        this.equipments.forEach(equipment => {
            result += equipment.agility;
        });
        result += this.property._agility;
        return result;
    }
    get intelligence() {
        var result = 0;
        this.equipments.forEach(equipment => {
            result += equipment.intelligence;
        });
        result += this.property._intelligence;
        return result;
    }
    get endurance() {
        var result = 0;
        this.equipments.forEach(equipment => {
            result += equipment.endurance;
        });
        result += this.property._endurance;
        return result;
    }
    get maxHp() {
        return this.endurance * 50;
    }
    get maxMp() {
        return this.intelligence * 40;
    }
}
var HeroBackMapConfig = [
    { image: "hero_png", x: 0, y: 0 }
];
var heroMapConfig = [
    { id: "h0", image: "hero_png" },
    { id: "h1", image: "hero_png" },
];
var equipmentBackMapConfig = [
    { type: equipmentType.WEAPON, image: "backMap_png", x: 0, y: 0 },
    { type: equipmentType.SHIELD, image: "backMap_png", x: 0, y: 100 },
    { type: equipmentType.HEAD, image: "backMap_png", x: 0, y: 200 },
    { type: equipmentType.NECK, image: "backMap_png", x: 0, y: 300 },
    { type: equipmentType.SHOULDER, image: "backMap_png", x: 0, y: 400 },
    { type: equipmentType.BODY, image: "backMap_png", x: 0, y: 500 }
];
var equipmentMapConfig = [
    { configId: "weapon_0", image: "weapon_png" },
    { configId: "shield_0", image: "shield_png" },
    { configId: "head_0", image: "head_png" }
];
class EquipmentMap {
    constructor(stage) {
        this.head = new engine.Bitmap();
        this.neck = new engine.Bitmap();
        this.shoulder = new engine.Bitmap();
        this.body = new engine.Bitmap();
        this.weapon = new engine.Bitmap();
        this.shield = new engine.Bitmap();
        this.setBackMap();
        stage.addChild(this.head);
        stage.addChild(this.neck);
        stage.addChild(this.shoulder);
        stage.addChild(this.body);
        stage.addChild(this.weapon);
        stage.addChild(this.shield);
    }
    setBackMap() {
        this.weapon.texture = engine.RES.getRes(equipmentBackMapConfig[equipmentType.WEAPON].image);
        this.weapon.x = equipmentBackMapConfig[equipmentType.WEAPON].x;
        this.weapon.y = equipmentBackMapConfig[equipmentType.WEAPON].y;
        this.shield.texture = engine.RES.getRes(equipmentBackMapConfig[equipmentType.SHIELD].image);
        this.shield.x = equipmentBackMapConfig[equipmentType.SHIELD].x;
        this.shield.y = equipmentBackMapConfig[equipmentType.SHIELD].y;
        this.head.texture = engine.RES.getRes(equipmentBackMapConfig[equipmentType.HEAD].image);
        this.head.x = equipmentBackMapConfig[equipmentType.HEAD].x;
        this.head.y = equipmentBackMapConfig[equipmentType.HEAD].y;
        this.neck.texture = engine.RES.getRes(equipmentBackMapConfig[equipmentType.NECK].image);
        this.neck.x = equipmentBackMapConfig[equipmentType.NECK].x;
        this.neck.y = equipmentBackMapConfig[equipmentType.NECK].y;
        this.shoulder.texture = engine.RES.getRes(equipmentBackMapConfig[equipmentType.SHOULDER].image);
        this.shoulder.x = equipmentBackMapConfig[equipmentType.SHOULDER].x;
        this.shoulder.y = equipmentBackMapConfig[equipmentType.SHOULDER].y;
        this.body.texture = engine.RES.getRes(equipmentBackMapConfig[equipmentType.BODY].image);
        this.body.x = equipmentBackMapConfig[equipmentType.BODY].x;
        this.body.y = equipmentBackMapConfig[equipmentType.BODY].y;
    }
    equip(equipment) {
        var image; //equipment.property.configId
        for (var i = 0; i < equipmentMapConfig.length; i++) {
            if (equipmentMapConfig[i].configId == equipment.configId) {
                image = equipmentMapConfig[i].image;
                break;
            }
        }
        switch (equipment.type) {
            case equipmentType.HEAD:
                this.head.texture = engine.RES.getRes(image);
                break;
            case equipmentType.NECK:
                this.neck.texture = engine.RES.getRes(image);
                break;
            case equipmentType.SHOULDER:
                this.shoulder.texture = engine.RES.getRes(image);
                break;
            case equipmentType.BODY:
                this.body.texture = engine.RES.getRes(image);
                break;
            case equipmentType.WEAPON:
                this.weapon.texture = engine.RES.getRes(image);
                break;
            case equipmentType.SHIELD:
                this.shield.texture = engine.RES.getRes(image);
                break;
            default:
                console.log("fail");
        }
    }
}
class HeroMap {
    constructor(stage) {
        this.hero = new engine.Bitmap();
        this.setBackMap();
        stage.addChild(this.hero);
    }
    setBackMap() {
        this.hero.texture = engine.RES.getRes(HeroBackMapConfig[0].image);
        this.hero.x = HeroBackMapConfig[0].x;
        this.hero.y = HeroBackMapConfig[0].y;
    }
}
var heroTextConfig = [
    { name: "  name:  ", x: 0, y: 50 },
    { name: "  attack:  ", x: 0, y: 100 },
    { name: "  strength:  ", x: 0, y: 150 },
    { name: "  agility:  ", x: 0, y: 200 },
    { name: "  intelligence:  ", x: 0, y: 250 },
    { name: "  endurance:  ", x: 0, y: 300 },
    { name: "  fightPower:  ", x: 0, y: 350 },
    { name: "  MAXHP:  ", x: 200, y: 50 },
    { name: "  MAXMP:  ", x: 200, y: 100 },
    { name: "  HP:  ", x: 200, y: 150 },
    { name: "  MP:  ", x: 200, y: 200 }
];
class HeroInfoPanel extends engine.DisplayObjectContainer {
    constructor() {
        super();
        this.backpanel = new Panel(0, 0, 448, 448);
        this.addChild(this.backpanel);
        this.init();
    }
    init() {
        this.name_Texfield = new engine.TextField();
        this.name_Texfield.text = heroTextConfig[0].name;
        this.name_Texfield.x = heroTextConfig[0].x;
        this.name_Texfield.y = heroTextConfig[0].y;
        this.addChild(this.name_Texfield);
        this.attack_Textfield = new engine.TextField();
        this.attack_Textfield.text = heroTextConfig[1].name;
        this.attack_Textfield.x = heroTextConfig[1].x;
        this.attack_Textfield.y = heroTextConfig[1].y;
        this.addChild(this.attack_Textfield);
        this.strength_Textfield = new engine.TextField();
        this.strength_Textfield.text = heroTextConfig[2].name;
        this.strength_Textfield.x = heroTextConfig[2].x;
        this.strength_Textfield.y = heroTextConfig[2].y;
        this.addChild(this.strength_Textfield);
        this.agility_Textfield = new engine.TextField();
        this.agility_Textfield.text = heroTextConfig[3].name;
        this.agility_Textfield.x = heroTextConfig[3].x;
        this.agility_Textfield.y = heroTextConfig[3].y;
        this.addChild(this.agility_Textfield);
        this.intelligence_Textfield = new engine.TextField();
        this.intelligence_Textfield.text = heroTextConfig[4].name;
        this.intelligence_Textfield.x = heroTextConfig[4].x;
        this.intelligence_Textfield.y = heroTextConfig[4].y;
        this.addChild(this.intelligence_Textfield);
        this.endurance_Textfield = new engine.TextField();
        this.endurance_Textfield.text = heroTextConfig[5].name;
        this.endurance_Textfield.x = heroTextConfig[5].x;
        this.endurance_Textfield.y = heroTextConfig[5].y;
        this.addChild(this.endurance_Textfield);
        this.fightPower_Textfield = new engine.TextField();
        this.fightPower_Textfield.text = heroTextConfig[6].name;
        this.fightPower_Textfield.x = heroTextConfig[6].x;
        this.fightPower_Textfield.y = heroTextConfig[6].y;
        this.addChild(this.fightPower_Textfield);
        this.maxHp_Textfield = new engine.TextField();
        this.maxHp_Textfield.text = heroTextConfig[7].name;
        this.maxHp_Textfield.x = heroTextConfig[7].x;
        this.maxHp_Textfield.y = heroTextConfig[7].y;
        this.addChild(this.maxHp_Textfield);
        this.maxMp_Textfield = new engine.TextField();
        this.maxMp_Textfield.text = heroTextConfig[8].name;
        this.maxMp_Textfield.x = heroTextConfig[8].x;
        this.maxMp_Textfield.y = heroTextConfig[8].y;
        this.addChild(this.maxMp_Textfield);
        this.hp_Textfield = new engine.TextField();
        this.hp_Textfield.text = heroTextConfig[9].name;
        this.hp_Textfield.x = heroTextConfig[9].x;
        this.hp_Textfield.y = heroTextConfig[9].y;
        this.addChild(this.hp_Textfield);
        this.mp_Textfield = new engine.TextField();
        this.mp_Textfield.text = heroTextConfig[10].name;
        this.mp_Textfield.x = heroTextConfig[10].x;
        this.mp_Textfield.y = heroTextConfig[10].y;
        this.addChild(this.mp_Textfield);
    }
    setPanelText(hero) {
        this.name_Texfield.text = heroTextConfig[0].name + hero.property.name;
        this.attack_Textfield.text = heroTextConfig[1].name + hero.attack;
        this.strength_Textfield.text = heroTextConfig[2].name + hero.strength;
        this.agility_Textfield.text = heroTextConfig[3].name + hero.agility;
        this.intelligence_Textfield.text = heroTextConfig[4].name + hero.intelligence;
        this.endurance_Textfield.text = heroTextConfig[5].name + hero.endurance;
        this.fightPower_Textfield.text = heroTextConfig[6].name + hero.fightPower;
        this.maxHp_Textfield.text = heroTextConfig[7].name + hero.maxHp;
        this.maxMp_Textfield.text = heroTextConfig[8].name + hero.maxMp;
        this.hp_Textfield.text = heroTextConfig[9].name + hero.getHp();
        this.mp_Textfield.text = heroTextConfig[10].name + hero.getMp();
    }
}
class HeroPanel extends engine.DisplayObjectContainer {
    constructor() {
        super();
        this.heroMap = new HeroMap(this);
        this.equipmentMap = new EquipmentMap(this);
        this.equipmentPanel = new EquipmentPanel();
        this.heroInfoPanel = new HeroInfoPanel();
        this.addTouchEvent();
        this.heroInfoPanel.x = 0;
        this.heroInfoPanel.y = 600;
        this.addChild(this.heroInfoPanel);
    }
    static setHeroPanel(panel) {
        this.heroPanel = panel;
    }
    static getHeroPanel() {
        return this.heroPanel;
    }
    showPanel(equipment) {
        this.equipmentPanel.setPanel(equipment);
        this.addChild(this.equipmentPanel);
    }
    offShowPanel() {
        this.removeChild(this.equipmentPanel);
    }
    addTouchEvent() {
        this.touchEnabled = false;
        this.equipmentMap.weapon.touchEnabled = true;
        this.equipmentMap.weapon.addEventListener(engine.TouchEvent.TOUCH_BEGIN, this.onTapWeapon, this);
        this.equipmentMap.shield.touchEnabled = true;
        this.equipmentMap.shield.addEventListener(engine.TouchEvent.TOUCH_BEGIN, this.onTapShield, this);
        this.equipmentMap.head.touchEnabled = true;
        this.equipmentMap.head.addEventListener(engine.TouchEvent.TOUCH_BEGIN, this.onTapHead, this);
    }
    onTapWeapon(e) {
        console.log("weapon");
        var weapon;
        for (var i = 0; i < this.hero.equipments.length; i++) {
            if (this.hero.equipments[i].type == equipmentType.WEAPON) {
                weapon = this.hero.equipments[i];
            }
        }
        this.showPanel(weapon);
        this.removeEventListener(engine.TouchEvent.TOUCH_BEGIN, this.onTapWeapon, this);
        this.equipmentMap.weapon.touchEnabled = false;
        this.addEventListener(engine.TouchEvent.TOUCH_END, this.onTapBack, this);
        this.touchEnabled = true;
    }
    onTapShield(e) {
        console.log("shield");
        var shield;
        for (var i = 0; i < this.hero.equipments.length; i++) {
            if (this.hero.equipments[i].type == equipmentType.SHIELD) {
                shield = this.hero.equipments[i];
            }
        }
        this.showPanel(shield);
        this.removeEventListener(engine.TouchEvent.TOUCH_BEGIN, this.onTapWeapon, this);
        this.equipmentMap.weapon.touchEnabled = false;
        this.addEventListener(engine.TouchEvent.TOUCH_END, this.onTapBack, this);
        this.touchEnabled = true;
    }
    onTapHead(e) {
        console.log("head");
        var head;
        for (var i = 0; i < this.hero.equipments.length; i++) {
            if (this.hero.equipments[i].type == equipmentType.HEAD) {
                head = this.hero.equipments[i];
            }
        }
        this.showPanel(head);
        this.removeEventListener(engine.TouchEvent.TOUCH_BEGIN, this.onTapHead, this);
        this.equipmentMap.head.touchEnabled = false;
        this.addEventListener(engine.TouchEvent.TOUCH_END, this.onTapBack, this);
        this.touchEnabled = true;
    }
    onTapBack(e) {
        console.log("back");
        this.offShowPanel();
        this.removeEventListener(engine.TouchEvent.TOUCH_END, this.onTapBack, this);
        this.touchEnabled = false;
        this.equipmentMap.weapon.addEventListener(engine.TouchEvent.TOUCH_BEGIN, this.onTapWeapon, this);
        this.equipmentMap.weapon.touchEnabled = true;
        this.equipmentMap.shield.addEventListener(engine.TouchEvent.TOUCH_BEGIN, this.onTapShield, this);
        this.equipmentMap.shield.touchEnabled = true;
        this.equipmentMap.head.addEventListener(engine.TouchEvent.TOUCH_BEGIN, this.onTapHead, this);
        this.equipmentMap.head.touchEnabled = true;
    }
    setHero(hero) {
        this.hero = hero;
        this.heroInfoPanel.setPanelText(this.hero);
    }
}
var heroGrowConfig = [
    { id: "hero_0", name: "A", attack: 12, defecce: 12, strength: 15, agility: 12, intelligence: 10, endurance: 12, desc: "This is A" },
    { id: "hero_1", name: "B", attack: 15, defecce: 11, strength: 10, agility: 10, intelligence: 40, endurance: 7, desc: "This is A" }
];
class HeroProperty extends CharacterProperty {
    constructor(configId) {
        super();
        this.exp = 0;
        for (var i = 0; i < heroGrowConfig.length; i++) {
            if (configId == heroGrowConfig[i].id) {
                var hero = heroGrowConfig[i];
                this.name = hero.name;
                this._attackGrow = hero.attack;
                this._defenceGrow = hero.defecce;
                this._agilityGrow = hero.agility;
                this._strengthGrow = hero.strength;
                this._intelligenceGrow = hero.intelligence;
                this._enduranceGrow = hero.endurance;
                this.desc = hero.desc;
                break;
            }
            else if (i == (heroGrowConfig.length - 1)) {
                console.warn("未找到英雄configId:" + configId);
            }
        }
    }
    levelup() {
        this.level++;
    }
}
class IdleUpState {
    constructor(idleState) {
        this.idleState = idleState;
    }
    onEnter() {
        this.idleState.idleAnimeIndex = 0;
        this.idleState.idleAnime.texture = engine.RES.getRes(idleupconfig[0].image);
        this.idleState.player.playerStage.addChild(this.idleState.idleAnime);
        this.idleState.idleTimer.addEventListener(engine.TimerEvent.TIMER, this.timerFunc, this);
        this.idleState.idleTimer.start();
    }
    onExit() {
        this.idleState.player.playerStage.removeChild(this.idleState.idleAnime);
        this.idleState.idleTimer.removeEventListener(engine.TimerEvent.TIMER, this.timerFunc, this);
        this.idleState.idleTimer.stop();
    }
    timerFunc() {
        if (this.idleState.idleAnimeIndex < (idleupconfig.length - 1)) {
            this.idleState.idleAnimeIndex++;
            this.idleState.idleAnime.texture = engine.RES.getRes(idleupconfig[this.idleState.idleAnimeIndex].image);
            console.log("up timer: " + this.idleState.idleAnimeIndex);
        }
        else {
            this.idleState.idleAnimeIndex = 0;
        }
    }
}
class IdleDownState {
    constructor(idleState) {
        this.idleState = idleState;
    }
    onEnter() {
        this.idleState.idleAnimeIndex = 0;
        this.idleState.idleAnime.texture = engine.RES.getRes(idledownconfig[0].image);
        this.idleState.player.playerStage.addChild(this.idleState.idleAnime);
        this.idleState.idleTimer.addEventListener(engine.TimerEvent.TIMER, this.timerFunc, this);
        this.idleState.idleTimer.start();
    }
    onExit() {
        this.idleState.player.playerStage.removeChild(this.idleState.idleAnime);
        this.idleState.idleTimer.removeEventListener(engine.TimerEvent.TIMER, this.timerFunc, this);
        this.idleState.idleTimer.stop();
    }
    timerFunc() {
        if (this.idleState.idleAnimeIndex < (idledownconfig.length - 1)) {
            this.idleState.idleAnimeIndex++;
            this.idleState.idleAnime.texture = engine.RES.getRes(idledownconfig[this.idleState.idleAnimeIndex].image);
            console.log("down timer: " + this.idleState.idleAnimeIndex);
        }
        else {
            this.idleState.idleAnimeIndex = 0;
        }
    }
}
class IdleLeftState {
    constructor(idleState) {
        this.idleState = idleState;
    }
    onEnter() {
        this.idleState.idleAnimeIndex = 0;
        this.idleState.idleAnime.texture = engine.RES.getRes(idleleftconfig[0].image);
        this.idleState.player.playerStage.addChild(this.idleState.idleAnime);
        this.idleState.idleTimer.addEventListener(engine.TimerEvent.TIMER, this.timerFunc, this);
        this.idleState.idleTimer.start();
    }
    onExit() {
        this.idleState.player.playerStage.removeChild(this.idleState.idleAnime);
        this.idleState.idleTimer.removeEventListener(engine.TimerEvent.TIMER, this.timerFunc, this);
        this.idleState.idleTimer.stop();
    }
    timerFunc() {
        if (this.idleState.idleAnimeIndex < (idleleftconfig.length - 1)) {
            this.idleState.idleAnimeIndex++;
            this.idleState.idleAnime.texture = engine.RES.getRes(idleleftconfig[this.idleState.idleAnimeIndex].image);
            console.log("left timer: " + this.idleState.idleAnimeIndex);
        }
        else {
            this.idleState.idleAnimeIndex = 0;
        }
    }
}
class IdleRightState {
    constructor(idleState) {
        this.idleState = idleState;
    }
    onEnter() {
        this.idleState.idleAnimeIndex = 0;
        this.idleState.idleAnime.texture = engine.RES.getRes(idlerightconfig[0].image);
        this.idleState.player.playerStage.addChild(this.idleState.idleAnime);
        this.idleState.idleTimer.addEventListener(engine.TimerEvent.TIMER, this.timerFunc, this);
        this.idleState.idleTimer.start();
    }
    onExit() {
        this.idleState.player.playerStage.removeChild(this.idleState.idleAnime);
        this.idleState.idleTimer.removeEventListener(engine.TimerEvent.TIMER, this.timerFunc, this);
        this.idleState.idleTimer.stop();
    }
    timerFunc() {
        if (this.idleState.idleAnimeIndex < (idlerightconfig.length - 1)) {
            this.idleState.idleAnimeIndex++;
            this.idleState.idleAnime.texture = engine.RES.getRes(idlerightconfig[this.idleState.idleAnimeIndex].image);
            console.log("right timer: " + this.idleState.idleAnimeIndex);
        }
        else {
            this.idleState.idleAnimeIndex = 0;
        }
    }
}
var uId = 0;
var itemList;
var itemStatusConfig = {
    INBAG: 0,
    INUSE: 1,
};
class Item {
    constructor() {
        this.status = itemStatusConfig.INBAG;
        this.uId = uId + 1;
        uId++;
    }
    setItemStatus(status) {
        this.status = status;
    }
}
var monsterConfig = [
    { monsterId: "001", name: "monster1", x: 512, y: 256, bitMap: "player01_idle_down_png", hp: 5000, atk: 100, monsterFightPosX: 512, monsterFightPosY: 320 }
];
class Monster {
    constructor(monsterId, service) {
        this.__hasBeenCancelled = false;
        this.fullProcess = 10;
        this.currentProcess = 0;
        this.scenceService = service;
        this.monster = new engine.Bitmap();
        var x;
        var y;
        for (var i = 0; i < monsterConfig.length; i++) {
            if (monsterConfig[i].monsterId == monsterId) {
                this.monsterId = monsterId;
                x = monsterConfig[i].x;
                y = monsterConfig[i].y;
                this.monster.texture = engine.RES.getRes(monsterConfig[i].bitMap);
                this.setMonsterPos(monsterConfig[i].x, monsterConfig[i].y);
                this.monsterFightPosX = monsterConfig[i].monsterFightPosX;
                this.monsterFightPosY = monsterConfig[i].monsterFightPosY;
                this.currentHp = monsterConfig[i].hp;
                this.maxHp = monsterConfig[i].hp;
                this.atk = monsterConfig[i].atk;
            }
        }
    }
    refurbishMonster() {
        console.log("怪物刷新");
        this.currentHp = this.maxHp;
    }
    giveDamage() {
        return this.atk;
    }
    getDamage(damage) {
        console.log("怪物受伤害:" + damage);
        this.currentHp -= damage;
    }
    getHp() {
        return this.currentHp;
    }
    getMaxHp() {
        return this.maxHp;
    }
    setMonsterPos(x, y) {
        this.monster.x = x;
        this.monster.y = y;
    }
    static setCurrentMonster(monster) {
        this._currrntMonster = monster;
    }
    static getCurrentMonster() {
        return this._currrntMonster;
    }
    showMonster(stage) {
        stage.addChild(this.monster);
    }
    offShowMonster(stage) {
        stage.removeChild(this.monster);
    }
}
class MoveUpState {
    constructor(moveState) {
        this.moveState = moveState;
    }
    onEnter() {
        this.moveState.moveAnimeIndex = 0;
        this.moveState.moveAnime.texture = engine.RES.getRes(moveupconfig[0].image);
        this.moveState.player.playerStage.addChild(this.moveState.moveAnime);
        this.moveState.moveTimer.addEventListener(engine.TimerEvent.TIMER, this.timerFunc, this);
        this.moveState.moveTimer.start();
    }
    onExit() {
        this.moveState.player.playerStage.removeChild(this.moveState.moveAnime);
        this.moveState.moveTimer.removeEventListener(engine.TimerEvent.TIMER, this.timerFunc, this);
        this.moveState.moveTimer.stop();
    }
    timerFunc() {
        if (this.moveState.moveAnimeIndex < (moveupconfig.length - 1)) {
            this.moveState.moveAnimeIndex++;
            this.moveState.moveAnime.texture = engine.RES.getRes(moveupconfig[this.moveState.moveAnimeIndex].image);
            console.log("up timer: " + this.moveState.moveAnimeIndex);
        }
        else {
            this.moveState.moveAnimeIndex = 0;
        }
    }
}
class MoveDownState {
    constructor(moveState) {
        this.moveState = moveState;
    }
    onEnter() {
        this.moveState.moveAnimeIndex = 0;
        this.moveState.moveAnime.texture = engine.RES.getRes(movedownconfig[0].image);
        this.moveState.player.playerStage.addChild(this.moveState.moveAnime);
        this.moveState.moveTimer.addEventListener(engine.TimerEvent.TIMER, this.timerFunc, this);
        this.moveState.moveTimer.start();
    }
    onExit() {
        this.moveState.player.playerStage.removeChild(this.moveState.moveAnime);
        this.moveState.moveTimer.removeEventListener(engine.TimerEvent.TIMER, this.timerFunc, this);
        this.moveState.moveTimer.stop();
    }
    timerFunc() {
        if (this.moveState.moveAnimeIndex < (movedownconfig.length - 1)) {
            this.moveState.moveAnimeIndex++;
            this.moveState.moveAnime.texture = engine.RES.getRes(movedownconfig[this.moveState.moveAnimeIndex].image);
        }
        else {
            this.moveState.moveAnimeIndex = 0;
        }
    }
}
class MoveLeftState {
    constructor(moveState) {
        this.moveState = moveState;
    }
    onEnter() {
        this.moveState.moveAnimeIndex = 0;
        this.moveState.moveAnime.texture = engine.RES.getRes(moveleftconfig[0].image);
        this.moveState.player.playerStage.addChild(this.moveState.moveAnime);
        this.moveState.moveTimer.addEventListener(engine.TimerEvent.TIMER, this.timerFunc, this);
        this.moveState.moveTimer.start();
    }
    onExit() {
        this.moveState.player.playerStage.removeChild(this.moveState.moveAnime);
        this.moveState.moveTimer.removeEventListener(engine.TimerEvent.TIMER, this.timerFunc, this);
        this.moveState.moveTimer.stop();
    }
    timerFunc() {
        if (this.moveState.moveAnimeIndex < (moveleftconfig.length - 1)) {
            this.moveState.moveAnimeIndex++;
            this.moveState.moveAnime.texture = engine.RES.getRes(moveleftconfig[this.moveState.moveAnimeIndex].image);
            console.log("left timer: " + this.moveState.moveAnimeIndex);
        }
        else {
            this.moveState.moveAnimeIndex = 0;
        }
    }
}
class MoveRightState {
    constructor(moveState) {
        this.moveState = moveState;
    }
    onEnter() {
        this.moveState.moveAnimeIndex = 0;
        this.moveState.moveAnime.texture = engine.RES.getRes(moverightconfig[0].image);
        this.moveState.player.playerStage.addChild(this.moveState.moveAnime);
        this.moveState.moveTimer.addEventListener(engine.TimerEvent.TIMER, this.timerFunc, this);
        this.moveState.moveTimer.start();
    }
    onExit() {
        this.moveState.player.playerStage.removeChild(this.moveState.moveAnime);
        this.moveState.moveTimer.removeEventListener(engine.TimerEvent.TIMER, this.timerFunc, this);
        this.moveState.moveTimer.stop();
    }
    timerFunc() {
        if (this.moveState.moveAnimeIndex < (moverightconfig.length - 1)) {
            this.moveState.moveAnimeIndex++;
            this.moveState.moveAnime.texture = engine.RES.getRes(moverightconfig[this.moveState.moveAnimeIndex].image);
        }
        else {
            this.moveState.moveAnimeIndex = 0;
        }
    }
}
var npcConfig = [
    { npcId: "npc_0", name: "NPC_1", x: 256, y: 448, bitmap: "player01_idle_left_png", talkPosX: 192, talkPosY: 512 },
    { npcId: "npc_1", name: "NPC_2", x: 448, y: 64, bitmap: "player01_idle_right_png", talkPosX: 512, talkPosY: 128 }
];
class NPC {
    constructor(npcId, taskService, dialoguePanel) {
        this.tileSize = 64;
        this.emojiX = 0;
        this.emojiY = 64;
        this.npcStageWidth = 64;
        this.npcStageHeight = 128;
        this.npcStage = new engine.DisplayObjectContainer();
        this.npcStageShape = new engine.Shape();
        this.emoji = new engine.Bitmap();
        for (var i = 0; i < npcConfig.length; i++) {
            if (npcId == npcConfig[i].npcId) {
                this.npcId = npcConfig[i].npcId;
                this.npcName = npcConfig[i].name;
                this.npcBitmap = npcConfig[i].bitmap;
                this.setNpc(npcConfig[i].x, npcConfig[i].y);
                this.talkPosX = npcConfig[i].talkPosX;
                this.talkPosY = npcConfig[i].talkPosY;
            }
        }
        this.taskService = taskService;
        this.taskService.addObserver(this);
        this.taskNoneState = new TaskNoneState(this);
        this.taskAvilableState = new TaskAvilableState(this);
        this.taskSubmitState = new TaskSubmitState(this);
        this.taskStateMachine = new StateMachine(this.taskNoneState);
        this.dialoguePanel = dialoguePanel;
        this.getTask();
        this.drawNpc();
    }
    showNpc(stage) {
        stage.addChild(this.npcStage);
    }
    static setCurrentNpc(npc) {
        this._currentNpc = npc;
    }
    static getCurrentNpc() {
        return this._currentNpc;
    }
    getTask() {
        this.task = this.taskService.getTaskByCustomRole(this.rule, this.npcId);
        console.log("This Task State: " + this.task.status);
        this.checkState();
    }
    setemoji() {
        this.emoji.texture = engine.RES.getRes(this.npcBitmap);
        this.emoji.x = this.emojiX;
        this.emoji.y = this.emojiY;
        this.emoji.texture.width = this.tileSize;
        this.emoji.texture.height = this.tileSize;
    }
    setNpc(npcX, npcY) {
        this.npcStageX = npcX;
        this.npcStageY = npcY;
        this.setemoji();
    }
    drawNpc() {
        this.npcStage.x = this.npcStageX;
        this.npcStage.y = this.npcStageY;
        //this.npcStage.width = this.npcStageWidth;
        //this.npcStage.height = this.npcStageHeight;
        this.npcStage.addChild(this.npcStageShape);
        this.npcStage.addChild(this.emoji);
        this.emoji.touchEnabled = true;
    }
    checkState() {
        switch (this.task.status) {
            case TaskStatus.UNACCEPTABLE:
            case TaskStatus.DURING:
            case TaskStatus.SUBMITTED:
                this.taskStateMachine.changeState(this.taskNoneState);
                break;
            case TaskStatus.ACCEOTABLE:
                if (this.task.fromNpcId == this.npcId) {
                    this.taskStateMachine.changeState(this.taskAvilableState);
                }
                else {
                    this.taskStateMachine.changeState(this.taskNoneState);
                }
                break;
            case TaskStatus.CAN_SUBMIT:
                if (this.task.toNpcId == this.npcId) {
                    this.taskStateMachine.changeState(this.taskSubmitState);
                }
                else {
                    this.taskStateMachine.changeState(this.taskNoneState);
                }
                break;
        }
    }
    onChange(task) {
        this.task = task;
        this.checkState();
    }
    rule(taskList, npcId) {
        for (var i = 0; i < taskList.length; i++) {
            if (taskList[i].fromNpcId == npcId || taskList[i].toNpcId == npcId) {
                console.log("Find");
                return taskList[i];
            }
        }
    }
    talkToNpc(callback) {
        if (this.task.status == TaskStatus.ACCEOTABLE && this.task.fromNpcId == this.npcId) {
            this.dialoguePanel.onOpen(this.task, callback);
        }
        else if (this.task.status == TaskStatus.CAN_SUBMIT && this.task.toNpcId == this.npcId) {
            this.dialoguePanel.onOpen(this.task, callback);
        }
    }
    stopTalkToNpc(callback) {
        this.dialoguePanel.onClose(callback);
    }
}
class TaskNoneState {
    constructor(npc) {
        this.npc = npc;
    }
    onEnter() {
        console.log("Enter Task None State");
    }
    onExit() {
        console.log("Exit Task None State");
    }
}
class TaskAvilableState {
    constructor(npc) {
        //taskSignColor = 0xFF0000;
        this.taskSignColor = "#FF0000";
        this.taskSighX = 15;
        this.taskSighY = 20;
        this.taskSighWidth = 30;
        this.taskSighHeight = 30;
        this.npc = npc;
        this.taskSign = new engine.Shape();
    }
    onEnter() {
        this.drawTaskSign();
        this.npc.npcStage.addChild(this.taskSign);
        console.log("Enter Task Avilable State");
    }
    onExit() {
        this.npc.npcStage.removeChild(this.taskSign);
        console.log("Exit Task Avilable State");
    }
    drawTaskSign() {
        this.taskSign.x = this.taskSighX;
        this.taskSign.y = this.taskSighY;
        //this.taskSign.width = this.taskSighWidth;
        //this.taskSign.height = this.taskSighHeight;
        this.taskSign.graphics.beginFill(this.taskSignColor, 1);
        this.taskSign.graphics.drawRect(0, 0, this.taskSighWidth, this.taskSighHeight);
        this.taskSign.graphics.endFill();
    }
}
class TaskSubmitState {
    constructor(npc) {
        //taskSignColor = 0xFFFF00;
        this.taskSignColor = "#FFFF00";
        this.taskSighX = 15;
        this.taskSighY = 20;
        this.taskSighWidth = 30;
        this.taskSighHeight = 30;
        this.npc = npc;
        this.taskSigh = new engine.Shape();
    }
    onEnter() {
        this.drawTaskSign();
        this.npc.npcStage.addChild(this.taskSigh);
        console.log("Enter Task Submit State");
    }
    onExit() {
        this.npc.npcStage.removeChild(this.taskSigh);
        console.log("Exit Task Submit State");
    }
    drawTaskSign() {
        this.taskSigh.x = this.taskSighX;
        this.taskSigh.y = this.taskSighY;
        //this.taskSigh.width = this.taskSighWidth;
        //this.taskSigh.height = this.taskSighHeight;
        this.taskSigh.graphics.beginFill(this.taskSignColor, 1);
        this.taskSigh.graphics.drawRect(0, 0, this.taskSighWidth, this.taskSighHeight);
        this.taskSigh.graphics.endFill();
    }
}
var stateConfig = {
    idleState: 0,
    moveState: 1
};
var directionConfig = {
    downState: 0,
    upState: 1,
    leftState: 2,
    rightState: 3
};
class Player {
    constructor(grid, tileSize) {
        this.setMap(grid, tileSize);
        this.playerStage = new engine.DisplayObjectContainer();
        this.playerdirection = directionConfig.downState;
        this.playerIdleState = new PlayerIdleState(this);
        this.playerMovestate = new PlayerMoveState(this);
        this.stateSign = stateConfig.idleState;
        this.playerStateMachine = new StateMachine(this.playerIdleState);
    }
    setMap(grid, tileSize) {
        this.grid = grid;
        this.tileSize = tileSize;
    }
    static setPlayer(player) {
        this.player = player;
    }
    static getPlayer() {
        return this.player;
    }
    startMove(x, y, callback) {
        console.log("移动开始");
        this.touchX = x;
        this.touchY = y;
        this.stateSign = stateConfig.moveState;
        this.callback = callback;
        this.checkstate();
    }
    stopMove(callback) {
        console.log("移动取消");
        this.stateSign = stateConfig.idleState;
        this.callback = callback;
        this.checkstate();
        callback();
    }
    checkstate() {
        switch (this.stateSign) {
            case stateConfig.idleState:
                this.playerStateMachine.changeState(this.playerIdleState);
                this.callback();
                console.log("移动结束");
                break;
            case stateConfig.moveState:
                this.playerMovestate.checkMove(this.touchX, this.touchY);
                break;
        }
    }
    moveTo(x, y, time) {
    }
}
var idleupconfig = [
    { image: "player01_idle_up_png" }
];
var idledownconfig = [
    { image: "player01_idle_down_png" }
];
var idleleftconfig = [
    { image: "player01_idle_left_png" }
];
var idlerightconfig = [
    { image: "player01_idle_right_png" }
];
class PlayerIdleState {
    constructor(player) {
        this.animeInterval = 200;
        this.player = player;
        this.idleTimer = new engine.Timer(this.animeInterval, 0);
        this.idleAnime = new engine.Bitmap();
        this.idleNullState = new PlayerNullstate();
        this.idleUpState = new IdleUpState(this);
        this.idleDownState = new IdleDownState(this);
        this.idleLeftState = new IdleDownState(this);
        this.idleRightState = new IdleRightState(this);
        this.idleStateMachine = new StateMachine(this.idleDownState);
    }
    onEnter() {
        this.startIdleAnime();
        //console.log("Enter Idle State");
    }
    onExit() {
        this.stopIdleAnime();
        //console.log("Exit Idle State");
    }
    startIdleAnime() {
        switch (this.player.playerdirection) {
            case directionConfig.upState:
                this.idleStateMachine.changeState(this.idleUpState);
                break;
            case directionConfig.downState:
                this.idleStateMachine.changeState(this.idleDownState);
                break;
            case directionConfig.leftState:
                this.idleStateMachine.changeState(this.idleLeftState);
                break;
            case directionConfig.rightState:
                this.idleStateMachine.changeState(this.idleRightState);
                break;
        }
    }
    stopIdleAnime() {
        switch (this.player.playerdirection) {
            case directionConfig.upState:
                this.idleStateMachine.changeState(this.idleNullState);
                break;
            case directionConfig.downState:
                this.idleStateMachine.changeState(this.idleNullState);
                break;
            case directionConfig.leftState:
                this.idleStateMachine.changeState(this.idleNullState);
                break;
            case directionConfig.rightState:
                this.idleStateMachine.changeState(this.idleNullState);
                break;
        }
    }
    timerFunc() {
        switch (this.player.playerdirection) {
            case directionConfig.upState:
                this.idleStateMachine.changeState(this.idleUpState);
                break;
            case directionConfig.downState:
                this.idleStateMachine.changeState(this.idleDownState);
                break;
            case directionConfig.leftState:
                this.idleStateMachine.changeState(this.idleLeftState);
                break;
            case directionConfig.rightState:
                this.idleStateMachine.changeState(this.idleRightState);
                break;
        }
    }
}
var moveupconfig = [
    { image: "player01_walk_up_01_png" },
    { image: "player01_walk_up_02_png" },
    { image: "player01_walk_up_03_png" }
];
var movedownconfig = [
    { image: "player01_walk_down_01_png" },
    { image: "player01_walk_down_02_png" },
    { image: "player01_walk_down_03_png" }
];
var moveleftconfig = [
    { image: "player01_walk_left_01_png" },
    { image: "player01_walk_left_02_png" },
    { image: "player01_walk_left_03_png" }
];
var moverightconfig = [
    { image: "player01_walk_right_01_png" },
    { image: "player01_walk_right_02_png" },
    { image: "player01_walk_right_03_png" }
];
class PlayerMoveState {
    constructor(player) {
        this.animeInterval = 200;
        this.speed = 1;
        this.player = player;
        this.moveTimer = new engine.Timer(this.animeInterval, 0);
        this.moveAnime = new engine.Bitmap();
        this.moveNullState = new PlayerNullstate();
        this.moveUpState = new MoveUpState(this);
        this.moveDownState = new MoveDownState(this);
        this.moveLeftState = new MoveLeftState(this);
        this.moveRightState = new MoveRightState(this);
        this.moveStateMachine = new StateMachine(this.moveNullState);
    }
    onEnter() {
        this.startMoveAnime();
        this.move();
        //console.log("Enter Move State");
    }
    onExit() {
        this.stopMoveAnime();
        engine.Tween.removeTweens(this.player.playerStage); //停止移动
        //console.log("Exit Move State");
    }
    startMoveAnime() {
        switch (this.player.playerdirection) {
            case directionConfig.upState:
                this.moveStateMachine.changeState(this.moveUpState);
                //console.log("start Up");
                break;
            case directionConfig.downState:
                this.moveStateMachine.changeState(this.moveDownState);
                //console.log("start down");
                break;
            case directionConfig.leftState:
                this.moveStateMachine.changeState(this.moveLeftState);
                //console.log("start Left");
                break;
            case directionConfig.rightState:
                this.moveStateMachine.changeState(this.moveRightState);
                //console.log("start Right");
                break;
        }
    }
    stopMoveAnime() {
        switch (this.player.playerdirection) {
            case directionConfig.upState:
                this.moveStateMachine.changeState(this.moveNullState);
                break;
            case directionConfig.downState:
                this.moveStateMachine.changeState(this.moveNullState);
                break;
            case directionConfig.leftState:
                this.moveStateMachine.changeState(this.moveNullState);
                break;
            case directionConfig.rightState:
                this.moveStateMachine.changeState(this.moveNullState);
                break;
        }
    }
    timerFunc() {
        switch (this.player.playerdirection) {
            case directionConfig.upState:
                this.moveUpState.timerFunc();
                break;
            case directionConfig.downState:
                this.moveDownState.timerFunc();
                break;
            case directionConfig.leftState:
                this.moveLeftState.timerFunc();
                break;
            case directionConfig.rightState:
                this.moveRightState.timerFunc();
                break;
        }
    }
    checkMove(touchX, touchY) {
        this.pathIndex = 0;
        var startx = Math.floor(this.player.playerStage.x / this.player.tileSize);
        var starty = Math.floor(this.player.playerStage.y / this.player.tileSize);
        var endx = Math.floor(touchX / this.player.tileSize);
        var endy = Math.floor(touchY / this.player.tileSize);
        //engine.Tween.removeTweens(this.player.playerStage);
        this.player.grid.setStartNode(startx, starty);
        this.player.grid.setEndNode(endx, endy);
        this.astar = new AStar();
        this.astar._path = [];
        this.astar.findPath(this.player.grid);
        if (startx != endx || starty != endy) {
            if (this.astar._path.length != 0) {
                this.player.playerStateMachine.changeState(this.player.playerMovestate);
            }
        }
        else {
            this.player.playerStateMachine.changeState(this.player.playerIdleState);
        }
    }
    move() {
        var anime01 = engine.Tween.get(this.player.playerStage); //开始移动
        var anime02 = engine.Tween.get(this.player.playerStage);
        var distance = Math.sqrt(Math.pow(((this.astar._path[this.pathIndex].x -
            this.astar._path[this.pathIndex + 1].x)) *
            this.player.tileSize, 2) + Math.pow(((this.astar._path[this.pathIndex].y -
            this.astar._path[this.pathIndex + 1].y)) *
            this.player.tileSize, 2));
        var time = distance / this.speed * 2;
        //anime01.to({"x": this.astar._path[this.pathIndex + 1].x * this.player.tileSize}, time);
        //anime02.to({"y": this.astar._path[this.pathIndex + 1].y * this.player.tileSize}, time);
        anime01.to("x", this.astar._path[this.pathIndex + 1].x * this.player.tileSize, time);
        anime02.to("y", this.astar._path[this.pathIndex + 1].x * this.player.tileSize, time);
        anime01.call(this.changeTarget, this);
        //      
    }
    changeTarget() {
        if (this.pathIndex < (this.astar._path.length - 2)) {
            this.pathIndex++;
            //console.log("Target change");
            this.changeDirection();
            this.move();
        }
        else {
            this.pathIndex = 0;
            //console.log("Move end");
            this.player.stateSign = stateConfig.idleState; //移动结束 切换状态
            this.player.checkstate();
        }
    }
    changeDirection() {
        var nextdirection;
        if (this.astar._path[this.pathIndex].y < this.astar._path[this.pathIndex + 1].y) {
            nextdirection = directionConfig.downState;
        }
        else if (this.astar._path[this.pathIndex].y > this.astar._path[this.pathIndex + 1].y) {
            nextdirection = directionConfig.upState;
        }
        else if (this.astar._path[this.pathIndex].x < this.astar._path[this.pathIndex + 1].x) {
            nextdirection = directionConfig.rightState;
        }
        else if (this.astar._path[this.pathIndex].x > this.astar._path[this.pathIndex + 1].x) {
            nextdirection = directionConfig.leftState;
        }
        if (this.player.playerdirection != nextdirection) {
            this.stopMoveAnime();
            this.player.playerdirection = nextdirection;
            this.startMoveAnime();
        }
    }
}
class PlayerNullstate {
    onEnter() {
        //console.log("Enter Null State");
    }
    onExit() {
        //console.log("Exit Null State");
    }
}
class Property {
    constructor() {
    }
}
class SceneService {
    constructor() {
        this.observerList = new Array();
    }
    addObserver(observer) {
        this.observerList.push(observer);
    }
    notify(monsterId) {
        for (var i = 0; i < this.observerList.length; i++) {
            this.observerList[i].onChange(monsterId);
        }
    }
}
class Shield extends Equipment {
    constructor(configId) {
        super();
        this.type = equipmentType.SHIELD;
        this.gems = [];
        this.configId = configId;
        this.property = new ShieldProperty(configId);
    }
    addGem(gem) {
        this.gems.push(gem);
    }
    get fightPower() {
        var result = 0;
        this.gems.forEach(gem => {
            result += gem.fightPower;
        });
        result += this.property.fightPower;
        return result;
    }
    get attack() {
        var result = 0;
        this.gems.forEach(gem => {
            result += gem.attack;
        });
        result += this.property._attack;
        return result;
    }
    get defence() {
        var result = 0;
        this.gems.forEach(gem => {
            result += gem.defence;
        });
        result += this.property._defence;
        return result;
    }
    get strength() {
        var result = 0;
        this.gems.forEach(gem => {
            result += gem.strength;
        });
        result += this.property._strength;
        return result;
    }
    get agility() {
        var result = 0;
        this.gems.forEach(gem => {
            result += gem.agility;
        });
        result += this.property._agility;
        return result;
    }
    get intelligence() {
        var result = 0;
        this.gems.forEach(gem => {
            result += gem.intelligence;
        });
        result += this.property._intelligence;
        return result;
    }
    get endurance() {
        var result = 0;
        this.gems.forEach(gem => {
            result += gem.endurance;
        });
        result += this.property._endurance;
        return result;
    }
}
var shieldConfig = [
    { id: "shield_0", name: "SmallShield", attack: 100, defence: 100, strength: 110, agility: 120, intelligence: 130, endurance: 140, desc: "This is SmallShield" },
    { id: "shield_1", name: "BigShield", attack: 200, defence: 200, strength: 210, agility: 220, intelligence: 230, endurance: 240, desc: "This is BigShield" }
];
class ShieldProperty extends EquipmentProperty {
    constructor(configId) {
        super();
        for (var i = 0; i < shieldConfig.length; i++) {
            if (configId == shieldConfig[i].id) {
                var shield = shieldConfig[i];
                this.name = shield.name;
                this._attack = shield.attack;
                this._endurance = shield.defence;
                this._strength = shield.strength;
                this._agility = shield.agility;
                this._intelligence = shield.intelligence;
                this._endurance = shield.endurance;
                this.desc = shield.desc;
                break;
            }
            else if (i == (shieldConfig.length - 1)) {
                console.warn("未找到盾牌configId:" + configId);
                break;
            }
        }
    }
    get fightPower() {
        var result = 0;
        result = this._attack + this._defence + (this._strength + this._agility +
            this._intelligence + this._endurance) * 0.5;
        return result;
    }
}
class StateMachine {
    constructor(currentState) {
        this.currentState = currentState;
        this.currentState.onEnter();
        //console.log("State Init");
    }
    changeState(nextState) {
        this.currentState.onExit();
        this.currentState = nextState;
        this.currentState.onEnter();
        // console.log("State change");
    }
    getState() {
        return this.currentState;
    }
}
var TaskStatus = {
    UNACCEPTABLE: 0,
    ACCEOTABLE: 1,
    DURING: 2,
    CAN_SUBMIT: 3,
    SUBMITTED: 4
};
class TaskCondition {
    onAccept(task) {
        task.status = TaskStatus.DURING;
    }
    onSubmit(task) {
        task.status = TaskStatus.SUBMITTED;
    }
}
class NPCTalkTaskCondition {
    onAccept(task) {
        task.status = TaskStatus.DURING;
    }
    onSubmit(task) {
        task.status = TaskStatus.SUBMITTED;
    }
}
class KillMonsterTaskCondition {
    constructor(id, context, scenceService) {
        this.monsterId = id;
        this.context = context;
        this.status = TaskStatus.CAN_SUBMIT;
        this.scenceService = scenceService;
        this.scenceService.addObserver(this);
    }
    onAccept(task) {
        this.status = TaskStatus.DURING;
    }
    onSubmit(task) {
        this.status = TaskStatus.SUBMITTED;
    }
    onChange(id) {
        if (id == this.monsterId && this.status == TaskStatus.DURING) {
            console.log(this.status);
            this.context.setcurrent(this.context.getcurrent() + 1);
        }
    }
}
var taskConfig = [
    { Id: "000", name: "Task000", desc: "Go to NPC_2", fromNpcId: "npc_0", toNpcId: "npc_1", status: TaskStatus.ACCEOTABLE, current: 0, total: 10 }
];
class Task {
    constructor(taskService, scenceService, id) {
        this.current = 0;
        this.total = -1;
        for (var i = 0; i < taskConfig.length; i++) {
            if (taskConfig[i].Id == id) {
                this.taskService = taskService;
                this.id = taskConfig[i].Id;
                this.name = taskConfig[i].name;
                this.desc = taskConfig[i].desc;
                this.status = taskConfig[i].status;
                this.fromNpcId = taskConfig[i].fromNpcId;
                this.toNpcId = taskConfig[i].toNpcId;
                this.current = taskConfig[i].current;
                this.total = taskConfig[i].total;
                this.taskCondition = new KillMonsterTaskCondition("001", this, scenceService);
                break;
            }
            else if (i == taskConfig.length - 1) {
                console.log("未找到该任务:" + id);
                break;
            }
        }
    }
    onAccept() {
        this.taskCondition.onAccept(this);
    }
    onsubmit() {
        this.taskCondition.onSubmit(this);
    }
    getcurrent() {
        return this.current;
    }
    setcurrent(current) {
        this.current = current;
        this.checkStatus();
    }
    checkStatus() {
        if (this.current >= this.total) {
            this.current = this.total;
            this.status = TaskStatus.CAN_SUBMIT;
            console.log("Finish");
        }
        this.taskService.notify(this);
        console.log(this.status);
    }
}
/*
使用方法：
    1.drawPanel();
    2.获得panel
*/
var tasklPanelPosConfig = {
    x: 0, y: 700
};
class TaskPanel {
    constructor(stage, taskService) {
        this.id = "TaskPanel";
        //private backColor = 0xFFFAFA;
        this.backColor = "#FFFAFA";
        this.panelX = tasklPanelPosConfig.x;
        this.panelY = tasklPanelPosConfig.y;
        this.panelWidth = 200;
        this.panelHeight = 300;
        this.taskNameTextFieldText = "Task";
        this.taskNameTextFieldX = 40;
        this.taskNameTextFieldY = 30;
        this.taskNameTextFieldWidth = 200;
        //private taskNameTextFieldColor = 0xFF0000;
        this.taskNameTextFieldColor = "#FF0000";
        this.taskDescTextFieldText = "Task";
        this.taskDescTextFieldX = 10;
        this.taskDescTextFieldY = 100;
        this.taskDescTextFieldWidth = 180;
        //private taskDescTextFieldColor = 0xFF0000;
        this.taskDescTextFieldColor = "#FF0000";
        this.taskProcessTextFieldText = "0/0";
        this.taskProcessTextFieldX = 10;
        this.taskProcessTextFieldY = 170;
        this.taskProcessTextFieldWidth = 180;
        //private taskProcessTextFieldColor = 0xFF0000;
        this.taskProcessTextFieldColor = "#FF0000";
        //private buttonColor = 0x808000;
        this.buttonColor = "#808000";
        this.buttonX = 50;
        this.buttonY = 200;
        this.buttonWidth = 100;
        this.buttonHeight = 50;
        this.buttonTextFieldText = "确认";
        this.buttonTextFieldX = this.buttonX + 15;
        this.buttonTextFieldY = this.buttonY + 10;
        this.buttonTextFieldWidth = 100;
        //private buttonTextFieldColor = 0xFFFAFA;
        this.buttonTextFieldColor = "#FFFAFA";
        this.stage = stage;
        this.taskService = taskService;
        this.taskService.addObserver(this);
        this.panel = new engine.DisplayObjectContainer();
        this.taskNameTextField = new engine.TextField();
        this.taskDescTextField = new engine.TextField();
        this.taskProcessTextField = new engine.TextField();
        this.backGround = new engine.Shape();
        this.button = new engine.DisplayObjectContainer();
        this.buttonBack = new engine.Shape();
        this.buttonTextField = new engine.TextField();
        this.drawPanel();
        this.getTask();
        this.stage.addChild(this.panel);
    }
    setText() {
        this.taskNameTextField.text = this.taskNameTextFieldText;
        this.taskNameTextField.x = this.taskNameTextFieldX;
        this.taskNameTextField.y = this.taskNameTextFieldY;
        //this.taskNameTextField.width = this.taskNameTextFieldWidth;
        //this.taskNameTextField.bold = true;
        //this.taskNameTextField.textColor = this.taskNameTextFieldColor;
        this.taskDescTextField.text = this.taskDescTextFieldText;
        this.taskDescTextField.x = this.taskDescTextFieldX;
        this.taskDescTextField.y = this.taskDescTextFieldY;
        //this.taskDescTextField.width = this.taskDescTextFieldWidth;
        //this.taskDescTextField.bold = false;
        //this.taskDescTextField.textColor = this.taskDescTextFieldColor;
        this.taskProcessTextField.text = this.taskProcessTextFieldText;
        this.taskProcessTextField.x = this.taskProcessTextFieldX;
        this.taskProcessTextField.y = this.taskProcessTextFieldY;
        //this.taskProcessTextField.width = this.taskProcessTextFieldWidth;
        //this.taskProcessTextField.bold = false;
        //this.taskProcessTextField.textColor = this.taskProcessTextFieldColor;
    }
    drawBackGround() {
        this.backGround.graphics.beginFill(this.backColor, 1);
        this.backGround.graphics.drawRect(0, 0, this.panelWidth, this.panelHeight);
        this.backGround.graphics.endFill();
    }
    drawButtonBack() {
        this.buttonBack.graphics.beginFill(this.buttonColor, 1);
        this.buttonBack.graphics.drawRect(this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
        this.buttonBack.graphics.endFill();
    }
    setButtonText() {
        this.buttonTextField.text = this.buttonTextFieldText;
        this.buttonTextField.x = this.buttonTextFieldX;
        this.buttonTextField.y = this.buttonTextFieldY;
        //this.buttonTextField.width = this.buttonTextFieldWidth;
        //this.buttonTextField.bold = false;
        //this.buttonTextField.textColor = this.buttonTextFieldColor;
    }
    drawButton() {
        this.drawButtonBack();
        this.setButtonText();
        this.button.addChild(this.buttonBack);
        this.button.addChild(this.buttonTextField);
    }
    drawPanel() {
        this.panel.x = this.panelX;
        this.panel.y = this.panelY;
        //this.panel.width = this.panelWidth;
        //this.panel.height = this.panelHeight;
        this.drawButton();
        this.drawBackGround();
        this.setText();
        this.panel.addChild(this.backGround);
        this.panel.addChild(this.taskNameTextField);
        this.panel.addChild(this.taskDescTextField);
        this.panel.addChild(this.taskProcessTextField);
        this.panel.addChild(this.button);
    }
    onChange(task) {
        this.currentTaskId = task.id;
        this.changeTaskText(task.name, task.desc, task.current, task.total);
        this.changeButton(task.status);
        this.currentTaskStatus = task.status;
        //this.showPanel();
    } //被通知
    changeTaskText(name, desc, current, total) {
        this.taskNameTextField.text = name;
        this.taskDescTextField.text = desc;
        this.taskProcessTextField.text = current + "/" + total;
    }
    changeButton(taskStatus) {
        switch (taskStatus) {
            case TaskStatus.ACCEOTABLE:
                this.buttonTextField.text = "可接受";
                break;
            case TaskStatus.DURING:
                this.buttonTextField.text = "进行中";
                break;
            case TaskStatus.CAN_SUBMIT:
                this.buttonTextField.text = "可提交";
                break;
            case TaskStatus.SUBMITTED:
                this.buttonTextField.text = "已完成";
                break;
            default:
                this.buttonTextField.text = "";
                break;
        }
    }
    rule(taskList, id) {
        for (var i = 0; i < taskList.length; i++) {
            if (taskList[i].status != TaskStatus.UNACCEPTABLE) {
                console.log(id + " Find Task");
                return taskList[i];
            }
        }
    }
    getTask() {
        var task = this.taskService.getTaskByCustomRole(this.rule, this.id);
        this.onChange(task);
    }
}
var ErrorCode = {
    NO_ERRIR: 0,
    ID_NOTFOUND: 1
};
class TaskService {
    constructor(scenceService) {
        this.observerList = new Array();
        this.taskList = new Array();
        this.task01 = new Task(this, scenceService, "000");
        this.taskList.push(this.task01);
    }
    addObserver(observer) {
        this.observerList.push(observer);
    }
    accept(id) {
        for (var i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].id == id) {
                console.log("Find Task: " + this.taskList[i].id);
                this.taskList[i].status = TaskStatus.DURING;
                this.taskList[i].taskCondition.onAccept(this.taskList[i]);
                this.notify(this.taskList[i]);
                return ErrorCode.NO_ERRIR;
            }
            else if (i == this.taskList.length - 1) {
                return ErrorCode.ID_NOTFOUND;
            }
        }
    }
    finish(id) {
        for (var i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].id == id) {
                this.taskList[i].status = TaskStatus.SUBMITTED;
                this.taskList[i].taskCondition.onSubmit(this.taskList[i]);
                this.notify(this.taskList[i]);
                return ErrorCode.NO_ERRIR;
            }
            else if (i == this.taskList.length - 1) {
                return ErrorCode.ID_NOTFOUND;
            }
        }
    }
    getTaskByCustomRole(rule, Id) {
        return rule(this.taskList, Id);
    }
    notify(task) {
        for (var i = 0; i < this.observerList.length; i++) {
            this.observerList[i].onChange(task);
        }
    }
}
class User {
    constructor() {
        this.heros = [];
        this.herointeam = [];
    }
    static setHero(hero) {
        this.hero = hero;
    }
    static getHero() {
        return this.hero;
    }
    addHero(hero) {
        this.heros.push(hero);
    }
    get heroInTeam() {
        var heroInTeam = [];
        for (var i = 0; i < this.heros.length; i++) {
            if (this.heros[i].isInTeam) {
                heroInTeam.push(this.heros[i]);
            }
        }
        return heroInTeam;
    }
    get fightPower() {
        var result = 0;
        var heros = this.heroInTeam;
        for (var i = 0; i < heros.length; i++) {
            result += heros[i].fightPower;
        }
        return result;
    }
}
class Weapon extends Equipment {
    constructor(configId) {
        super();
        this.type = equipmentType.WEAPON;
        this.gems = [];
        this.configId = configId;
        this.property = new WeaponProperty(configId);
    }
    addGem(gem) {
        this.gems.push(gem);
    }
    get fightPower() {
        var result = 0;
        this.gems.forEach(gem => {
            result += gem.fightPower;
        });
        result += this.property.fightPower;
        return result;
    }
    get attack() {
        var result = 0;
        this.gems.forEach(gem => {
            result += gem.attack;
        });
        result += this.property._attack;
        return result;
    }
    get defence() {
        var result = 0;
        this.gems.forEach(gem => {
            result += gem.defence;
        });
        result += this.property._defence;
        return result;
    }
    get strength() {
        var result = 0;
        this.gems.forEach(gem => {
            result += gem.strength;
        });
        result += this.property._strength;
        return result;
    }
    get agility() {
        var result = 0;
        this.gems.forEach(gem => {
            result += gem.agility;
        });
        result += this.property._agility;
        return result;
    }
    get intelligence() {
        var result = 0;
        this.gems.forEach(gem => {
            result += gem.intelligence;
        });
        result += this.property._intelligence;
        return result;
    }
    get endurance() {
        var result = 0;
        this.gems.forEach(gem => {
            result += gem.endurance;
        });
        result += this.property._endurance;
        return result;
    }
}
var weaponConfig = [
    { id: "weapon_0", name: "SmallSword", attack: 100, defence: 100, strength: 110, agility: 120, intelligence: 130, endurance: 140, desc: "This is SmallSword" },
    { id: "weapon_1", name: "BigSword", attack: 200, defence: 200, strength: 210, agility: 220, intelligence: 230, endurance: 240, desc: "This is BigSword" }
];
class WeaponProperty extends EquipmentProperty {
    constructor(configId) {
        super();
        for (var i = 0; i < weaponConfig.length; i++) {
            if (configId == weaponConfig[i].id) {
                var weapon = weaponConfig[i];
                this.name = weapon.name;
                this._attack = weapon.attack;
                this._defence = weapon.defence;
                this._strength = weapon.strength;
                this._agility = weapon.agility;
                this._intelligence = weapon.intelligence;
                this._endurance = weapon.endurance;
                this.desc = weapon.desc;
                break;
            }
            else if (i == (weaponConfig.length - 1)) {
                console.warn("未找到武器configId:" + configId);
                break;
            }
        }
    }
    get fightPower() {
        var result = 0;
        result = this._attack + this._defence + (this._strength + this._agility +
            this._intelligence + this._endurance) * 0.5;
        return result;
    }
}
