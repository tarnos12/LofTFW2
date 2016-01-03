var idleDamage;
function attack() {
    var delay = player.baseStats.Speed.delay();
    pauseFight();
    idleDamage = setInterval(function () { damageDeal(); }, delay);
};
function damageDeal() {
    var currentHp = activeEnemy.health();
    var playerDamage = player.baseStats.Strength.value();
    activeEnemy.health(currentHp - playerDamage);
    if (activeEnemy.health() <= 0) {
        var kills = enemyList[currentEnemy()].killed();
        enemyList[currentEnemy()].killed(kills + 1);
        if (currentEnemy() + 1 < enemyList.length) {
            enemyList[currentEnemy() + 1].visible(true);
        };
        enemyDefeat();
        if (autoProgress() && (enemyList[currentEnemy() + 1])) {
            if (autoProgressBestiary()) {
                if (kills >= 15) {
                    chooseNewEnemy(currentEnemy() + 1);
                }
                else {
                    chooseNewEnemy();
                }
            }
            else {
                chooseNewEnemy(currentEnemy() + 1);
            }
        }
        else {
            chooseNewEnemy();
        }
        pauseFight();
        attack();
    };
};

function pauseFight() {
    clearTimeout(idleDamage);
};

function enemyDefeat() {
    var statBonus = activeEnemy.experience();
    if (gameLog().length >= 10) {
        gameLog.pop();
    };
    gameLog.unshift('Experience ' + statBonus);
    for (var key in player.baseStats) {
        addStatExp(key, statBonus);
    };
};