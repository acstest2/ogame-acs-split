import FleetTypes from '../FleetTypes.json';

export function SetResourceStatistics(combatReports) {
    combatReports.forEach(report => {
        let totalCapacity = 0;
        report.attackers.forEach(attacker => {
            let playerCapacity = 0;
            attacker.fleet.forEach(ship => {
                playerCapacity += ship.postCount * (FleetTypes.ships[ship.shipType].baseCapacity * (1 + (attacker.hyperspaceTech * 0.05)));
            })
            attacker.fleetCapacity = playerCapacity;
            totalCapacity += playerCapacity;
        })

        report.attackers.forEach(attacker => {
            attacker.metalLoot = report.metalLoot * (attacker.fleetCapacity / totalCapacity)
            attacker.crystalLoot = report.crystalLoot * (attacker.fleetCapacity / totalCapacity)
            attacker.deuteriumLoot = report.deuteriumLoot * (attacker.fleetCapacity / totalCapacity)
        })

        CalculateLossFromShips(report.attackers);
        CalculateLossFromShips(report.defenders);
        CalculateDeuteriumConsumption(report.attackers);
        CalculateDeuteriumConsumption(report.attackers);
    })
}

function CalculateLossFromShips(fleeters) {
    fleeters.forEach(fleeter => {
        let totalLoss = {
            metal: 0,
            crystal: 0,
            deuterium: 0
        };
        fleeter.fleet.forEach(ship => {
            let shipsLost = ship.preCount - ship.postCount;
            if (FleetTypes.ships[ship.shipType]) {
                totalLoss.metal += shipsLost * FleetTypes.ships[ship.shipType].buildCost.metal;
                totalLoss.crystal += shipsLost * FleetTypes.ships[ship.shipType].buildCost.crystal;
                totalLoss.deuterium += shipsLost * FleetTypes.ships[ship.shipType].buildCost.deuterium;
            }
            else {
                totalLoss.metal += shipsLost * FleetTypes.defence[ship.shipType].buildCost.metal;
                totalLoss.crystal += shipsLost * FleetTypes.defence[ship.shipType].buildCost.crystal;
                totalLoss.deuterium += shipsLost * FleetTypes.defence[ship.shipType].buildCost.deuterium;
            }
        })
        fleeter.unitsLost = totalLoss
    })
}

function CalculateDeuteriumConsumption(fleeters) {
    fleeters.forEach(fleeter => {
        if (!fleeter.deuteriumConsumption)
            fleeter.deuteriumConsumption = 0;
    })
}