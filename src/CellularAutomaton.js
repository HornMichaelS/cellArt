// A constructor for a cell object to represent an individual cell in the
// simulation.
let Cell = function(x, y) {
    // Each cell stores its coordinates internally, so that we do not
    // need to represent the grid as a 2d array, which is space limit,
    // and potentially inefficient.
    this.x = x;
    this.y = y;

    this.numNeighbors = 0;
    this.alive = false;

    this.willEvaluate = false;
};

/**
  * A class which represents the state of a 'life-like' cellular automaton.
  */
export default class CellularAutomaton {

    /**
      * Constructor initializes the state of the gameworld to an empty grid.
      */
    constructor() {
        // A count of the total number of live cells
        this.liveCells = 0;

        // Contains references to all cells for which the number of neighbors
        // changed in the last update.
        // Hey there.
        this.evalQueue = [];

        // Contains references to all cells for which the state changed in
        // the last update.
        this.changedQueue = [];

        // Contains references to every cell who is alive, or who has living
        // neighbors.
        this.cellMap = {};

        // Contains references to every cell that was changed by he user,
        // since the last update cycle.
        this.userChangedMap = {};

        this.userMadeChanges = false;

        // Some interesting rule sets:
        // B345/S25678 -- Crystalline structures
        this.survivalRule = [0, 0, 1, 1, 0, 0, 0, 0, 0];
        this.birthRule = [0, 0, 0, 1, 0, 0, 0, 0, 0];
    }

    /**
      * Integrate user changes to the automaton into the state.
      */
    reconcileUserChanges() {
        // If user changed a cell back to its natural state, it should be
        // removed from both the userChangedMap and the changedQueue.
        for (let key in this.userChangedMap) {
            if (this.userChangedMap.hasOwnProperty(key)) {
                let cell = this.userChangedMap[key];
                let cqIndex = this.changedQueue.indexOf(cell);
                if (cqIndex !== -1) {
                    delete this.userChangedMap[key];
                    this.changedQueue.splice(cqIndex, 1);
                } else {
                    this.cellMap[key] = cell;
                }
            }
        }

        for (let key in this.userChangedMap) {
            if (this.userChangedMap.hasOwnProperty(key)) {
                let cell = this.userChangedMap[key];
                this.updateNumNeighbors(cell);
                this.changedQueue.push(cell);
                if (!cell.willEvaluate) {
                    this.evalQueue.push(cell);
                }
            }
        }

        this.userChangedMap = {};
        this.userMadeChanges = false;
    }

    /**
      * Move the simulation forward by one step.
      */
    update() {
        if (this.userMadeChanges) {
            this.reconcileUserChanges();
        }
        /**
          * For every cell who's state changed in the last update, update
          * the numNeighbors property of its neighboring cells.
          */
        for (let k = 0; k < this.changedQueue.length; k++) {
            let cell = this.changedQueue[k];

            if (cell !== undefined) {
                for (let i = cell.y - 1; i <= cell.y + 1; i++) {
                    for (let j = cell.x - 1; j <= cell.x + 1; j++) {
                        if (i !== cell.y || j !== cell.x) {
                            let neighborKey = j + ', ' + i;
                            let neighbor = this.cellMap[neighborKey];

                            /**
                              * If neighbor exists, update its numNeighbor
                              * property to reflect the change in the given
                              * cell's state. Else, if neighbor does not exist
                              * AND the state ofthe given cell changed from
                              * dead to alive, then create a new neighbor cell
                              * at (j, i), and initialize its neighbor count
                              * to 1.
                              */
                            if (neighbor !== undefined) {
                                if (cell.alive) {
                                    neighbor.numNeighbors++;
                                } else {
                                    neighbor.numNeighbors--;
                                }
                            } else if (cell.alive) {
                                neighbor = new Cell(j, i);
                                neighbor.numNeighbors = 1;
                                this.cellMap[neighborKey] = neighbor;
                            }

                            /**
                              * Every neighbor of a changed cell should be
                              * evaluated at the end of the update cycle.
                              */
                            if (!neighbor.willEvaluate) {
                                this.evalQueue.push(neighbor);
                                neighbor.willEvaluate = true;
                            }
                        }
                    }
                }
            }
        }

        this.changedQueue = [];

        /**
          * Evaluate every cell for which numNeighbors changed in the last
          * update, to check whether their state should change.
          */
        for (let i = 0; i < this.evalQueue.length; i++) {
            let cell = this.evalQueue[i];

            /**
              * Determine, based on the number of neighbors, whether the cell
              * meets either the survival rule or the birth rule.
              */
            let cellShouldDie = this.survivalRule[cell.numNeighbors] === 0;
            let cellShouldBeBorn = this.birthRule[cell.numNeighbors] === 1;


            /**
              * Introduce a slight probability for the cell to disobey the
              * rules (just for fun).
              */
            let cellIsObedient = (Math.random() * 5) > 0.001;

            // Update the cell
            if (cell.alive) {
                if (cellShouldDie && cellIsObedient) {
                    cell.alive = false;
                    this.liveCells--;
                    cell.changedNaturally = true;
                    this.changedQueue.push(cell);
                }
            } else if (cellShouldBeBorn && cellIsObedient) {
                cell.alive = true;
                this.liveCells++;
                cell.changedNaturally = true;
                this.changedQueue.push(cell);
            }

            /**
              * After a cell has gone through the natural evaluaton
              * cycle, it no longer needs to be marked as changed by the user.
              */
            cell.changedByUser = false;
            cell.willEvaluate = false;
        }

        this.evalQueue = [];
    }

    /**
      * Count the number of neighbors of the given cell.
      * @param {Object} cell The cell to be evaluated and updated.
      */
    updateNumNeighbors(cell) {
        let numNeighbors = 0;

        for (let i = cell.y - 1; i <= cell.y + 1; i++) {
            for (let j = cell.x - 1; j <= cell.x + 1; j++) {
                if (j !== cell.x || i !== cell.y) {
                    let neighborKey = j + ', ' + i;
                    let neighbor = this.cellMap[neighborKey];
                    if (neighbor !== undefined && neighbor.alive) {
                        numNeighbors++;
                    }
                }
            }
        }

        cell.numNeighbors = numNeighbors;
    }

    /**
      * If no cell is alive at the given coordinate, add a new live cell at
      * that point.
      * @param {Number} x The x coordinate of the cell to be added.
      * @param {Number} y The y coordinate of the cell to be added.
      */
    addCell(x, y) {
        let key = x + ',' + y;
        let cell = this.cellMap[key];

        if (cell === undefined) {
            cell = new Cell(x, y);
        }

        if (!cell.alive) {
            cell.alive = true;
            if (this.userChangedMap[key] === undefined) {
                this.userChangedMap[key] = cell;
            } else {
                delete this.userChangedMap[key];
            }
        }

        this.userMadeChanges = true;
    }

    /**
      * If there is a live cell at the given coordinates, remove it.
      * @param {Number} x The x coordinate of the cell to remove
      * @param {Number} y The y coordinate of the cell to remove
      */
    removeCell(x, y) {
        let key = x + ',' + y;
        let cell = this.cellMap[key];

        if (cell !== undefined && cell.alive) {
            cell.alive = false;
            if (this.userChangedMap[key] === undefined) {
                this.userChangedMap[key] = cell;
            } else {
                delete this.userChangedMap.key;
            }
        }

        this.userMadeChanges = true;
    }
};
