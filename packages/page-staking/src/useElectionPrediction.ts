// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StakerState } from '@polkadot/react-hooks/types';
import type { Option, StorageKey, u32 } from '@polkadot/types';

import { uniq } from 'lodash';
import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { AccountId32 } from '@polkadot/types/interfaces';
import { PalletElectionProviderMultiPhaseRoundSnapshot, PalletStakingNominations, PalletStakingStakingLedger, PalletStakingValidatorPrefs } from '@polkadot/types/lookup';
import { BN } from '@polkadot/util';

import { seqPhragmen, Voter } from './phragmen';

export type ElectionPrediction = Record<string, [boolean, BN]>;

interface ChainData {
  controllers: Record<string, string>;
  ledgers: Record<string, PalletStakingStakingLedger>;
  validators: Record<string, PalletStakingValidatorPrefs>;
  nominators: Record<string, PalletStakingNominations>;
}

function buildVotersListFromSnapshot (snapshot: PalletElectionProviderMultiPhaseRoundSnapshot): Voter[] {
  // Build voters lists
  const voters: Voter[] = [];
  const validators = snapshot.targets.map((value) => value.toString());

  snapshot.voters.forEach((value) => {
    // Remove duplicates and non validators from targets
    const targets = uniq(
      value[2]
        .map((target) => target.toString())
        .filter((target) => validators.includes(target))
    );

    if (targets.length > 0) {
      voters.push({
        nominatorId: value[0].toString(),
        stake: value[1].toString(),
        targets
      });
    }
  });

  return voters;
}

function buildVotersListFromChain (chainData: ChainData, ownNominators: StakerState[]): Voter[] {
  // Build map with our own targets
  const ourTargets: Record<string, string[]> = {};

  ownNominators.forEach(({ stashId, nominating = [] }) => {
    if (nominating.length > 0) {
      ourTargets[stashId] = nominating;
    }
  });
  // Build voters lists
  const voters: Voter[] = [];

  // Add nominators
  Object.keys(chainData.nominators).forEach((nomId) => {
    // Get targets
    const noms = chainData.nominators[nomId];
    let targets = noms.targets.map((target) => target.toString());

    // Replace targets if one of our own nominators
    if (nomId in ourTargets) {
      targets = ourTargets[nomId];
    }

    // Remove duplicates and non validators from targets
    const filteredTargets = uniq(targets.filter((target) => target in chainData.validators));
    const ledger = chainData.ledgers[chainData.controllers[nomId]];

    if (filteredTargets.length > 0) {
      voters.push({
        nominatorId: nomId,
        stake: ledger.active.toString(),
        targets: filteredTargets
      });
    }
  });
  // Add validators self vote
  Object.keys(chainData.validators).forEach((valId) => {
    const ledger = chainData.ledgers[chainData.controllers[valId]];

    voters.push({
      nominatorId: valId,
      stake: ledger.active.toString(),
      targets: [valId]
    });
  });

  return voters;
}

function useElectionPredictionImpl (ownNominators: StakerState[] | undefined): ElectionPrediction | undefined {
  const { api } = useApi();
  const count = useCall<u32>(api.query.staking.validatorCount);
  // If the election is ongoing, use the snapshot of Staking state
  const snapshot = useCall<Option<PalletElectionProviderMultiPhaseRoundSnapshot>>(api.query.electionProviderMultiPhase.snapshot);
  // Otherwise, get Staking state from chain
  const bonded = useCall<[StorageKey<[AccountId32]>, Option<AccountId32>][]>(api.query.staking.bonded.entries);
  const ledger = useCall<[StorageKey<[AccountId32]>, Option<PalletStakingStakingLedger>][]>(api.query.staking.ledger.entries);
  const validators = useCall<[StorageKey<[AccountId32]>, PalletStakingValidatorPrefs][]>(api.query.staking.validators.entries);
  const nominators = useCall<[StorageKey<[AccountId32]>, Option<PalletStakingNominations>][]>(api.query.staking.nominators.entries);

  // Run phragmen (useMemo to run on any changes)
  const electedStakes = useMemo(
    () => {
      let voters: Voter[];
      // ChainData
      const data: ChainData = {
        controllers: {},
        ledgers: {},
        nominators: {},
        validators: {}
      };

      // Convert all controllers
      bonded?.forEach(([{ args }, controller]) => {
        data.controllers[args[0].toString()] = controller.toString();
      });
      // Convert all ledgers
      ledger?.forEach(([{ args }, ledgerInfo]) => {
        data.ledgers[args[0].toString()] = ledgerInfo.unwrap();
      });
      // Convert all validators
      validators?.forEach(([{ args }, validatorPrefs]) => {
        data.validators[args[0].toString()] = validatorPrefs;
      });
      // Convert all nominators
      nominators?.forEach(([{ args }, nominations]) => {
        data.nominators[args[0].toString()] = nominations.unwrap();
      });

      if (Object.keys(data.controllers).length > 0 && Object.keys(data.ledgers).length > 0 &&
          Object.keys(data.validators).length > 0 && ownNominators) {
        if (snapshot === undefined || snapshot?.isNone) {
          voters = buildVotersListFromChain(data, ownNominators);
        } else {
          voters = buildVotersListFromSnapshot(snapshot.unwrap());
        }
      } else {
        voters = [];
      }

      if (voters.length > 0 && count) {
        const [, elected] = seqPhragmen(voters, count.toNumber());
        const electedStakes: ElectionPrediction = {};

        elected.forEach(({ backedStake, elected, validatorId }) => {
          electedStakes[validatorId] = [elected, new BN(backedStake.toFixed(0))];
        });

        return electedStakes;
      }

      return undefined;
    },
    [
      bonded,
      ledger,
      validators,
      nominators,
      ownNominators,
      count,
      snapshot
    ]
  );

  return electedStakes;
}

export default createNamedHook('useElectionPrediction', useElectionPredictionImpl);
