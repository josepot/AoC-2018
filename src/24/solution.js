const LOGS_ON = false;
const log = LOGS_ON ? console.log : Function.prototype;

const getVulnerabilities = vulnerabilitiesRaw =>
  vulnerabilitiesRaw
    ? vulnerabilitiesRaw
        .slice(1, -1)
        .split('; ')
        .map(vulnerabilityRaw => {
          const [type, rawList] = vulnerabilityRaw.split(' to ');
          return {[type]: new Set(rawList.split(', '))};
        })
        .reduce((acc, current) => Object.assign(acc, current), {
          weak: new Set(),
          immune: new Set(),
        })
    : {weak: new Set(), immune: new Set()};

const getGroupData = (type, lines, inc = 0) => {
  return lines.map((line, idx) => {
    const [
      ,
      nUnits,
      hitPoints,
      vulnerabilitiesRaw,
      attackPoints,
      attackType,
      initiative,
    ] = line
      .match(
        /(\d+)\sunits\seach\swith\s(\d+)\shit\spoints\s(\(.*\))?\s?with\san\sattack\sthat\sdoes\s(\d+)\s(\w+)\sdamage\sat\sinitiative\s(\d+)/
      )
      .map(x => {
        const i = parseInt(x, 10);
        return Number.isNaN(i) ? x : i;
      });

    return Object.assign(getVulnerabilities(vulnerabilitiesRaw), {
      nUnits,
      hitPoints,
      attackPoints: attackPoints + inc,
      attackType,
      initiative,
      type,
      number: idx + 1,
    });
  });
};

const getEffectivePower = ({nUnits, attackPoints}) => nUnits * attackPoints;

const getDamage = (attacker, defender) =>
  getEffectivePower(attacker) *
  (defender.weak.has(attacker.attackType) ? 2 : 1);

const getAndRemoveDefender = defending => attacker => {
  const [winner, , removeIdx] = defending.reduce(
    ([cWinner, maxDamage, wIdx], defender, idx) => {
      const damage = getDamage(attacker, defender);
      log(
        `${attacker.type} group ${attacker.number} would deal defending group ${
          defender.number
        } ${damage} damage`
      );

      if (defender.immune.has(attacker.attackType))
        return [cWinner, maxDamage, wIdx];
      if (damage > maxDamage) return [defender, damage, idx];
      if (damage < maxDamage) return [cWinner, maxDamage, wIdx];
      if (getEffectivePower(cWinner) > getEffectivePower(defender))
        return [cWinner, maxDamage, wIdx];
      if (getEffectivePower(cWinner) < getEffectivePower(defender))
        return [defender, damage, idx];
      return defender.initiative > cWinner.initiative
        ? [defender, damage, idx]
        : [cWinner, maxDamage, wIdx];
    },
    [null, 0, -1]
  );
  if (!winner) return [attacker, null, 0];
  defending.splice(removeIdx, 1);
  return [attacker, winner];
};

const getAttackPairs = (attacking, defendingOriginal) => {
  const defending = defendingOriginal.slice(0);

  attacking.sort((a, b) => {
    const powerDiff = getEffectivePower(b) - getEffectivePower(a);
    if (powerDiff !== 0) return powerDiff;
    return b.initiative - a.initiative;
  });

  const result = attacking
    .map(getAndRemoveDefender(defending))
    .filter(([, defender]) => defender);
  return result;
};

const attack = pairs => {
  log('');
  pairs
    .sort(([a], [b]) => b.initiative - a.initiative)
    .forEach(([attacker, defender]) => {
      if (attacker.nUnits <= 0) return;
      const damage = getDamage(attacker, defender);
      const loses = Math.min(
        defender.nUnits,
        Math.floor(
          (damage / (defender.nUnits * defender.hitPoints)) * defender.nUnits
        )
      );
      log(
        `${attacker.type} group ${attacker.number} attacks defending group ${
          defender.number
        }, killing ${loses} units`
      );
      defender.nUnits = Math.max(0, defender.nUnits - loses);
    });
};

const solution1 = (lines, inc) => {
  const infectionIdx = lines.findIndex(l => l.startsWith('Infection:'));
  const immuneLines = lines.slice(1, infectionIdx - 1);
  const infectionLines = lines.slice(infectionIdx + 1);

  let immuneSystem = getGroupData('Immune System', immuneLines, inc);
  let infection = getGroupData('Infection', infectionLines);

  let prevImmuneUnits = 0;
  let prevInfectionUnits = 0;
  do {
    log('');
    log('');
    log('Immune System:');
    immuneSystem.forEach(({number, nUnits}) =>
      log(`Group ${number} contains ${nUnits} units`)
    );
    log('Infection:');
    infection.forEach(({number, nUnits}) =>
      log(`Group ${number} contains ${nUnits} units`)
    );
    log('');

    attack([
      ...getAttackPairs(infection, immuneSystem),
      ...getAttackPairs(immuneSystem, infection),
    ]);
    immuneSystem = immuneSystem.filter(({nUnits}) => nUnits > 0);
    infection = infection.filter(({nUnits}) => nUnits > 0);

    const currentImmuneUnits = immuneSystem.reduce((a, b) => a + b.nUnits, 0);
    const currentInfectionUnits = infection.reduce((a, b) => a + b.nUnits, 0);

    if (
      currentImmuneUnits === prevImmuneUnits &&
      currentInfectionUnits === prevInfectionUnits
    )
      return [null, null];
    prevImmuneUnits = currentImmuneUnits;
    prevInfectionUnits = currentInfectionUnits;
  } while (immuneSystem.length > 0 && infection.length > 0);

  return [prevImmuneUnits, prevInfectionUnits];
};

const solution2 = lines => {
  let immnuneUnits;
  let i = 1;
  do {
    [immnuneUnits] = solution1(lines, i++);
  } while (immnuneUnits === 0 || immnuneUnits == null);
  return immnuneUnits;
};

module.exports = [solution1, solution2];
