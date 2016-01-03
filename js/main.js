function AppViewModel() {
    var self = this;
    player = new playerTest();
    enemies = new enemiesTest();
    activeEnemy = new initializeFirstEnemy();
    chooseNewEnemy();
    console.log('Call me more pls');
};
var baseStatsArray = ['Strength', 'Endurance', 'Speed', 'Luck'];
var currentEnemy = ko.observable(0);
var autoProgress = ko.observable(true);
var autoProgressBestiary = ko.observable(true);
function playerTest() {
    var self = this;
    var value;
    var growth;
    this.baseStats = {};
    this.progressBar = {};
    for (var i = 0; i < baseStatsArray.length; i++) {
        var attr = baseStatsArray[i];
        this.baseStats[attr] = {};
        this.progressBar[attr] = {};
        this.progressBar[attr].color = ko.observable('#337ab7');
        this.baseStats[attr]['value'] = ko.observable(5);
        this.baseStats[attr]['growth'] = ko.observable(2);
        this.baseStats[attr]['minExp'] = ko.observable(0);
        this.baseStats[attr]['maxExp'] = createMaxExp(attr, self);
        if (attr === "Speed") {
            this.baseStats[attr]['delay'] = createDelay(attr, self);
        };
    };
};
function createMaxExp(attr, self) {
    return ko.computed(function () {
        return Math.floor((30 + (self.baseStats[attr]['value']() / 2)) /
            self.baseStats[attr]['growth']());
    });
};
function createDelay(attr, self) {
    return ko.computed(function () {
        return Math.floor(1000 / (2 + (self.baseStats[attr]['value']() / 100)));
    });
};

var enemyList = [];
var enemyNameArray =
[
    { power: 1, name: 'Rat' },
    { power: 1, name: 'Rat King' },
    { power: 1, name: 'Bat' },
    { power: 1, name: 'Vampire Bat' },
    { power: 1, name: 'Orc' },
    { power: 1, name: 'Skeleton' },
    { power: 1, name: 'Lich' },
    { power: 1, name: 'Unicorn' },
    { power: 1, name: 'Cyclop' },
    { power: 1, name: 'Demon' },
    { power: 1, name: 'Minotaur' },
    { power: 1, name: 'Gnoll' },
    { power: 1, name: 'Beholder' },
];
var enemyTitle = [
    {
        name: 'the Unwise', bonuses: [
           { health: 150, experience: 150 }]
    },
    {
        name: 'the Imprudent', bonuses: [
           { health: 100, experience: 100 }]
    },
    {
        name: 'the Breaker', bonuses: [
           { health: 120, experience: 120 }]
    },
    {
        name: 'the Vile', bonuses: [
           { health: 250, experience: 250 }]
    },
    {
        name: 'the Young', bonuses: [
           { health: 10, experience: 10 }]
    },
    {
        name: 'the Lurking', bonuses: [
           { health: 300, experience: 300 }]
    },
    {
        name: 'the Lazy', bonuses: [
           { health: 350, experience: 350 }]
    },
    {
        name: 'the Tyrant', bonuses: [
           { health: 400, experience: 400 }]
    },
    {
        name: 'the Kind', bonuses: [
           { health: 450, experience: 450 }]
    },
    {
        name: 'the Invicible', bonuses: [
           { health: 500, experience: 500 }]
    },
    {
        name: 'the Great', bonuses: [
           { health: 550, experience: 550 }]
    },
    {
        name: 'the Wicked', bonuses: [
           { health: 600, experience: 600 }]
    },
    {
        name: 'the Suicidal', bonuses: [
           { health: 650, experience: 650 }]
    },
    {
        name: 'the Wild', bonuses: [
           { health: 700, experience: 700 }]
    },
    {
        name: 'the Ward', bonuses: [
           { health: 750, experience: 750 }]
    },
    {
        name: 'the Mighty', bonuses: [
          { health: 800, experience: 800 }]
    }
];
var gameLog = ko.observableArray([]);
function enemiesTest() {
    var self = this;
    for (var i = 0; i < enemyNameArray.length; i++) {
        var name;
        var level = i + 1;
        var power;
        var monster;
        var enemy = enemyNameArray[i];
        for (var key in enemy) {
            if (enemy.hasOwnProperty(key)) {
                name = enemy.name;
                power = enemy.power;
            };
        };
        monster = new enemyCreate(name, level, power);
        if (i === 0) {
            monster.visible = ko.observable(true);//First enemy is visible.
        };
        enemyList.push(monster);
    };
    return enemyList;
};
function enemyCreate(name, level, power) {
    var self = this;
    this.name = name;
    this.level = level;
    this.power = power// Power as "normal/elite/boss" used to increase opponent stats
    this.health = Math.floor(5 * self.level * self.power)
    this.maxHealth = this.health;
    this.experience = Math.floor(self.level * self.power)
    this.visible = ko.observable(false);
    this.title = ko.observable('');
    this.killed = ko.observable(0);
};


function initializeFirstEnemy() {
    var enemyTest = {};
    for (var key in enemyList[0]) {
        if (enemyList[0].hasOwnProperty(key)) {
                var enemyStats = enemyList[0][key];
                enemyTest[key] = {};
                enemyTest[key] = ko.observable(enemyStats);
        }
    };
    return enemyTest;
};
function chooseNewEnemy(current) {
    if (current >= 0) {
        currentEnemy(current);
    };
    var enemyPosition = enemyList[currentEnemy()];
    if (enemyPosition === undefined) {
        var currPos = currentEnemy();
        currentEnemy(currPos - 1);
    };
    // Code below will overwrite activeEnemy observable which was initialized before with new values using ko.observable.
    var randomNumber = 0;
    for (var key in enemyPosition) {
        if (enemyPosition.hasOwnProperty(key)) {
            var enemyInfo = enemyPosition[key];

            if (key === 'name') {
                randomNumber = Math.floor(Math.random() * enemyTitle.length);
                var title = enemyTitle[randomNumber];
                enemyPosition['title'] = title.name;
                titleS = enemyPosition['title'];
                activeEnemy['title'](titleS);
            }
            for (var bonus in title.bonuses[0]) {
                var bonusValue = title.bonuses[0][key];
                if (key === bonus) {
                    enemyInfo = enemyPosition['experience'];
                    enemyInfo = (Math.floor(enemyInfo * (1 + (bonusValue / 100))));
                }
                if (bonus === "health" && key === "maxHealth") {
                    bonusValue = title.bonuses[0]['health'];
                    enemyInfo = enemyPosition['maxHealth'];
                    enemyInfo = Math.floor(enemyInfo * (1 + (bonusValue / 100)));
                    activeEnemy['health'](enemyInfo);
                }
            }
                activeEnemy[key](enemyInfo);
        };
    };
    attack();
};
function idleStatExperience(stat, value) {
    var idleStat = this[stat + 'Idle'];
    clearTimeout(idleStat);
    if (value > 0) {
        idleStat = setInterval(function () { addStatExp(stat, value); }, 100);
    };
};
function calculateStats() {
    for (var i = 0; i < baseStatsArray.length; i++) {
        var attr = baseStatsArray[i];
        statExp(attr);
    };
};
function addStat(stat) {
    var value = player.baseStats[stat]['value'];
    value(value() + 1);//Incrementing stat by "amount"...
};
function addStatExp(stat, value) {
    var minExp = player.baseStats[stat]['minExp'];
    minExp(minExp() + value);
    statExp(stat);
};
function statExp(stat) {
    var minExp = player.baseStats[stat]['minExp'];
    var maxExp = player.baseStats[stat]['maxExp'];
    while (minExp() >= maxExp()) {
        minExp(minExp() - maxExp())
        addStat(stat);
    };
};
function progressPerCent(stat) {
    var val1 = player.baseStats[stat]['minExp']();
    var val2 = player.baseStats[stat]['maxExp']();
    var percent = (val1 / val2) * 100;
    if (percent >= 80) {
        player.progressBar[stat].color('red');
    }
    else if(percent >= 50){
        player.progressBar[stat].color('green')
    }
    else {
        player.progressBar[stat].color('#337ab7')
    }
    return percent;
};

