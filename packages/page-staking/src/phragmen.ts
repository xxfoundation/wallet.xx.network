// @ts-check
/* eslint no-param-reassign: */
import BigNumber from 'bignumber.js';
import { minBy } from 'lodash';

export type Voter = {
  nominatorId: string,
  stake: string,
  targets: string[],
}

type Nominator = {
  nominatorId: string,
  budget: BigNumber,
  edges: Edge[],
  load: BigNumber,
}

type Edge = {
  validatorId: string,
  load: BigNumber,
  weight: BigNumber,
}

type Candidate = {
  approvalStake: BigNumber,
  backedStake: BigNumber,
  elected: boolean,
  score: BigNumber,
}

type ValidatorInfo = {
  validatorId: string,
  elected: boolean,
  backedStake: BigNumber,
  score: BigNumber,
}

type Validators = Record<string, Candidate>;

const setup = (voters: Voter[]): [Validators, Nominator[]] => {
  const validators: Validators = {};
  const nominators: Nominator[] = voters.map(({ nominatorId, stake, targets }) => {
    const edges: Edge[] = targets.map((candidate) => {
      if (!(candidate in validators)) {
        validators[candidate] = {
          approvalStake: new BigNumber(stake),
          backedStake: new BigNumber(0),
          elected: false,
          score: new BigNumber(0)
        };
      } else {
        validators[candidate].approvalStake = validators[candidate].approvalStake.plus(stake);
      }

      return {
        load: new BigNumber(0),
        validatorId: candidate,
        weight: new BigNumber(0)
      };
    });

    return {
      budget: new BigNumber(stake),
      edges,
      load: new BigNumber(0),
      nominatorId
    };
  });

  return [validators, nominators];
};

const equalise = (nominators: Nominator[], elected: Validators, iterations: number): [Nominator[], Validators] => {
  for (let i = 0; i < iterations; i++) {
    nominators.forEach((nominator) => {
      if (nominator.edges.filter(({ validatorId }) => elected[validatorId] !== undefined).length > 1) {
        // Remove all backing
        nominator.edges.forEach((edge) => {
          const validator = elected[edge.validatorId];

          if (validator) {
            validator.backedStake = validator.backedStake.minus(edge.weight);
            edge.weight = new BigNumber(0);
          }
        });

        // Get edges that point to an elected candidate and sort them by ascending backing stake
        const electedEdges = nominator.edges.filter(({ validatorId }) => elected[validatorId] !== undefined).sort((a, b) => elected[a.validatorId].backedStake.gt(elected[b.validatorId].backedStake) ? 1 : -1);
        let totalBackedStake = new BigNumber(0);
        let lastIndex = electedEdges.length - 1;

        electedEdges.some((edge, idx) => {
          const backedStake = elected[edge.validatorId].backedStake;

          if (backedStake.multipliedBy(idx).minus(totalBackedStake).gt(nominator.budget)) {
            lastIndex = idx - 1;

            return true;
          }

          totalBackedStake = totalBackedStake.plus(backedStake);

          return false;
        });
        const lastStake = elected[electedEdges[lastIndex].validatorId].backedStake;
        const waysToSplit = lastIndex + 1;
        const excess = nominator.budget.plus(totalBackedStake).minus(lastStake.multipliedBy(waysToSplit));

        for (let j = 0; j < waysToSplit; j++) {
          electedEdges[j].weight = excess.div(waysToSplit).plus(lastStake).minus(elected[electedEdges[j].validatorId].backedStake);
          elected[electedEdges[j].validatorId].backedStake = elected[electedEdges[j].validatorId].backedStake.plus(electedEdges[j].weight);
        }
      }
    });
  }

  return [nominators, elected];
};

const seqPhragmenCore = (voters: Voter[], count: number): [Nominator[], Validators, Validators] => {
  // Setup validators and nominators
  const [validators, nominators] = setup(voters);
  const numVals = Object.keys(validators).length;
  const numRounds = count > numVals ? numVals : count;

  // Main election loop
  const winners: string[] = [];

  for (let round = 0; round < numRounds; round++) {
    // First loop: initialize scores
    Object.keys(validators).forEach((validatorId) => {
      const validator = validators[validatorId];

      if (!validator.elected) {
        if (validator.approvalStake.gt(0)) {
          validator.score = new BigNumber(1).div(validator.approvalStake);
        } else {
          validator.score = new BigNumber(1000);
        }
      }
    });

    // Second loop: increment scores
    nominators.forEach((nominator) => {
      nominator.edges.forEach((edge) => {
        const validator = validators[edge.validatorId];

        if (!validator.elected && validator.approvalStake.gt(0)) {
          validator.score = validator.score.plus(nominator.load.multipliedBy(nominator.budget).div(validator.approvalStake));
        }
      });
    });

    // Find winner
    const winner = minBy(Object.keys(validators), (validatorId) => {
      if (validators[validatorId].elected) {
        return 1000;
      }

      return validators[validatorId].score.toNumber();
    }) || '';

    winners.push(winner);
    validators[winner].elected = true;

    // Third loop: update voter loads
    nominators.forEach((nominator) => {
      nominator.edges.forEach((edge) => {
        if (edge.validatorId === winner) {
          const validator = validators[edge.validatorId];

          edge.load = validator.score.minus(nominator.load);
          nominator.load = validator.score;
        }
      });
    });
  }

  // Update backing stakes
  nominators.forEach((nominator) => {
    nominator.edges.forEach((edge) => {
      const validator = validators[edge.validatorId];

      if (validator.elected) {
        edge.weight = edge.load.div(nominator.load).multipliedBy(nominator.budget);
      } else {
        edge.weight = new BigNumber(0);
      }

      validator.backedStake = validator.backedStake.plus(edge.weight);
    });
  });

  const elected: Validators = winners.reduce((acc, winner) => ({
    ...acc,
    [winner]: validators[winner]
  }), {});

  return [nominators, elected, validators];
};

const iterations = 10;

export const seqPhragmen = (voters: Voter[], count: number): [Nominator[], ValidatorInfo[]] => {
  let [nominators, elected, validators] = seqPhragmenCore(voters, count);

  [nominators, elected] = equalise(nominators, elected, iterations);
  // Sort all by stake
  const ordered: ValidatorInfo[] = Object.keys(validators).map((validatorId) => {
    return {
      backedStake: validatorId in elected ? elected[validatorId].backedStake : new BigNumber(1).div(validators[validatorId].score),
      elected: validatorId in elected,
      score: validators[validatorId].score,
      validatorId
    };
  }).sort((a, b) => a.backedStake.gt(b.backedStake) ? -1 : 1);

  return [nominators, ordered];
};
