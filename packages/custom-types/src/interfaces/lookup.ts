// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

/* eslint-disable sort-keys */

export default {
  /**
   * Lookup3: frame_system::AccountInfo<Index, pallet_balances::AccountData<Balance>>
   **/
  FrameSystemAccountInfo: {
    nonce: 'u32',
    consumers: 'u32',
    providers: 'u32',
    sufficients: 'u32',
    data: 'PalletBalancesAccountData'
  },
  /**
   * Lookup5: pallet_balances::AccountData<Balance>
   **/
  PalletBalancesAccountData: {
    free: 'u128',
    reserved: 'u128',
    miscFrozen: 'u128',
    feeFrozen: 'u128'
  },
  /**
   * Lookup7: frame_support::weights::PerDispatchClass<T>
   **/
  FrameSupportWeightsPerDispatchClassU64: {
    normal: 'u64',
    operational: 'u64',
    mandatory: 'u64'
  },
  /**
   * Lookup11: sp_runtime::generic::digest::Digest
   **/
  SpRuntimeDigest: {
    logs: 'Vec<SpRuntimeDigestDigestItem>'
  },
  /**
   * Lookup13: sp_runtime::generic::digest::DigestItem
   **/
  SpRuntimeDigestDigestItem: {
    _enum: {
      Other: 'Bytes',
      __Unused1: 'Null',
      __Unused2: 'Null',
      __Unused3: 'Null',
      Consensus: '([u8;4],Bytes)',
      Seal: '([u8;4],Bytes)',
      PreRuntime: '([u8;4],Bytes)',
      __Unused7: 'Null',
      RuntimeEnvironmentUpdated: 'Null'
    }
  },
  /**
   * Lookup16: frame_system::EventRecord<xxnetwork_runtime::Event, primitive_types::H256>
   **/
  FrameSystemEventRecord: {
    phase: 'FrameSystemPhase',
    event: 'Event',
    topics: 'Vec<H256>'
  },
  /**
   * Lookup18: frame_system::pallet::Event<T>
   **/
  FrameSystemEvent: {
    _enum: {
      ExtrinsicSuccess: 'FrameSupportWeightsDispatchInfo',
      ExtrinsicFailed: '(SpRuntimeDispatchError,FrameSupportWeightsDispatchInfo)',
      CodeUpdated: 'Null',
      NewAccount: 'AccountId32',
      KilledAccount: 'AccountId32',
      Remarked: '(AccountId32,H256)'
    }
  },
  /**
   * Lookup19: frame_support::weights::DispatchInfo
   **/
  FrameSupportWeightsDispatchInfo: {
    weight: 'u64',
    class: 'FrameSupportWeightsDispatchClass',
    paysFee: 'FrameSupportWeightsPays'
  },
  /**
   * Lookup20: frame_support::weights::DispatchClass
   **/
  FrameSupportWeightsDispatchClass: {
    _enum: ['Normal', 'Operational', 'Mandatory']
  },
  /**
   * Lookup21: frame_support::weights::Pays
   **/
  FrameSupportWeightsPays: {
    _enum: ['Yes', 'No']
  },
  /**
   * Lookup22: sp_runtime::DispatchError
   **/
  SpRuntimeDispatchError: {
    _enum: {
      Other: 'Null',
      CannotLookup: 'Null',
      BadOrigin: 'Null',
      Module: {
        index: 'u8',
        error: 'u8',
      },
      ConsumerRemaining: 'Null',
      NoProviders: 'Null',
      Token: 'SpRuntimeTokenError',
      Arithmetic: 'SpRuntimeArithmeticError'
    }
  },
  /**
   * Lookup23: sp_runtime::TokenError
   **/
  SpRuntimeTokenError: {
    _enum: ['NoFunds', 'WouldDie', 'BelowMinimum', 'CannotCreate', 'UnknownAsset', 'Frozen', 'Unsupported']
  },
  /**
   * Lookup24: sp_runtime::ArithmeticError
   **/
  SpRuntimeArithmeticError: {
    _enum: ['Underflow', 'Overflow', 'DivisionByZero']
  },
  /**
   * Lookup25: pallet_scheduler::pallet::Event<T>
   **/
  PalletSchedulerEvent: {
    _enum: {
      Scheduled: '(u32,u32)',
      Canceled: '(u32,u32)',
      Dispatched: '((u32,u32),Option<Bytes>,Result<Null, SpRuntimeDispatchError>)'
    }
  },
  /**
   * Lookup30: pallet_balances::pallet::Event<T, I>
   **/
  PalletBalancesEvent: {
    _enum: {
      Endowed: '(AccountId32,u128)',
      DustLost: '(AccountId32,u128)',
      Transfer: '(AccountId32,AccountId32,u128)',
      BalanceSet: '(AccountId32,u128,u128)',
      Reserved: '(AccountId32,u128)',
      Unreserved: '(AccountId32,u128)',
      ReserveRepatriated: '(AccountId32,AccountId32,u128,FrameSupportTokensMiscBalanceStatus)',
      Deposit: '(AccountId32,u128)',
      Withdraw: '(AccountId32,u128)',
      Slashed: '(AccountId32,u128)'
    }
  },
  /**
   * Lookup31: frame_support::traits::tokens::misc::BalanceStatus
   **/
  FrameSupportTokensMiscBalanceStatus: {
    _enum: ['Free', 'Reserved']
  },
  /**
   * Lookup32: pallet_staking::pallet::pallet::Event<T>
   **/
  PalletStakingPalletEvent: {
    _enum: {
      EraPaid: '(u32,u128,u128)',
      Rewarded: '(AccountId32,u128)',
      Slashed: '(AccountId32,u128)',
      OldSlashingReportDiscarded: 'u32',
      StakersElected: 'Null',
      Bonded: '(AccountId32,u128)',
      Unbonded: '(AccountId32,u128)',
      Withdrawn: '(AccountId32,u128)',
      Kicked: '(AccountId32,AccountId32)',
      StakingElectionFailed: 'Null',
      Chilled: 'AccountId32',
      PayoutStarted: '(u32,AccountId32)'
    }
  },
  /**
   * Lookup33: pallet_election_provider_multi_phase::pallet::Event<T>
   **/
  PalletElectionProviderMultiPhaseEvent: {
    _enum: {
      SolutionStored: '(PalletElectionProviderMultiPhaseElectionCompute,bool)',
      ElectionFinalized: 'Option<PalletElectionProviderMultiPhaseElectionCompute>',
      Rewarded: '(AccountId32,u128)',
      Slashed: '(AccountId32,u128)',
      SignedPhaseStarted: 'u32',
      UnsignedPhaseStarted: 'u32'
    }
  },
  /**
   * Lookup34: pallet_election_provider_multi_phase::ElectionCompute
   **/
  PalletElectionProviderMultiPhaseElectionCompute: {
    _enum: ['OnChain', 'Signed', 'Unsigned', 'Fallback', 'Emergency']
  },
  /**
   * Lookup37: pallet_offences::pallet::Event
   **/
  PalletOffencesEvent: {
    _enum: {
      Offence: '([u8;16],Bytes)'
    }
  },
  /**
   * Lookup39: pallet_session::pallet::Event
   **/
  PalletSessionEvent: {
    _enum: {
      NewSession: 'u32'
    }
  },
  /**
   * Lookup40: pallet_grandpa::pallet::Event
   **/
  PalletGrandpaEvent: {
    _enum: {
      NewAuthorities: 'Vec<(SpFinalityGrandpaAppPublic,u64)>',
      Paused: 'Null',
      Resumed: 'Null'
    }
  },
  /**
   * Lookup43: sp_finality_grandpa::app::Public
   **/
  SpFinalityGrandpaAppPublic: 'SpCoreEd25519Public',
  /**
   * Lookup44: sp_core::ed25519::Public
   **/
  SpCoreEd25519Public: '[u8;32]',
  /**
   * Lookup45: pallet_im_online::pallet::Event<T>
   **/
  PalletImOnlineEvent: {
    _enum: {
      HeartbeatReceived: 'PalletImOnlineSr25519AppSr25519Public',
      AllGood: 'Null',
      SomeOffline: 'Vec<(AccountId32,PalletStakingExposure)>'
    }
  },
  /**
   * Lookup46: pallet_im_online::sr25519::app_sr25519::Public
   **/
  PalletImOnlineSr25519AppSr25519Public: 'SpCoreSr25519Public',
  /**
   * Lookup47: sp_core::sr25519::Public
   **/
  SpCoreSr25519Public: '[u8;32]',
  /**
   * Lookup50: pallet_staking::Exposure<sp_core::crypto::AccountId32, Balance>
   **/
  PalletStakingExposure: {
    total: 'Compact<u128>',
    custody: 'Compact<u128>',
    own: 'Compact<u128>',
    others: 'Vec<PalletStakingIndividualExposure>'
  },
  /**
   * Lookup53: pallet_staking::IndividualExposure<sp_core::crypto::AccountId32, Balance>
   **/
  PalletStakingIndividualExposure: {
    who: 'AccountId32',
    value: 'Compact<u128>'
  },
  /**
   * Lookup54: pallet_democracy::pallet::Event<T>
   **/
  PalletDemocracyEvent: {
    _enum: {
      Proposed: '(u32,u128)',
      Tabled: '(u32,u128,Vec<AccountId32>)',
      ExternalTabled: 'Null',
      Started: '(u32,PalletDemocracyVoteThreshold)',
      Passed: 'u32',
      NotPassed: 'u32',
      Cancelled: 'u32',
      Executed: '(u32,Result<Null, SpRuntimeDispatchError>)',
      Delegated: '(AccountId32,AccountId32)',
      Undelegated: 'AccountId32',
      Vetoed: '(AccountId32,H256,u32)',
      PreimageNoted: '(H256,AccountId32,u128)',
      PreimageUsed: '(H256,AccountId32,u128)',
      PreimageInvalid: '(H256,u32)',
      PreimageMissing: '(H256,u32)',
      PreimageReaped: '(H256,AccountId32,u128,AccountId32)',
      Blacklisted: 'H256'
    }
  },
  /**
   * Lookup56: pallet_democracy::vote_threshold::VoteThreshold
   **/
  PalletDemocracyVoteThreshold: {
    _enum: ['SuperMajorityApprove', 'SuperMajorityAgainst', 'SimpleMajority']
  },
  /**
   * Lookup57: pallet_collective::pallet::Event<T, I>
   **/
  PalletCollectiveEvent: {
    _enum: {
      Proposed: '(AccountId32,u32,H256,u32)',
      Voted: '(AccountId32,H256,bool,u32,u32)',
      Approved: 'H256',
      Disapproved: 'H256',
      Executed: '(H256,Result<Null, SpRuntimeDispatchError>)',
      MemberExecuted: '(H256,Result<Null, SpRuntimeDispatchError>)',
      Closed: '(H256,u32,u32)'
    }
  },
  /**
   * Lookup59: pallet_elections_phragmen::pallet::Event<T>
   **/
  PalletElectionsPhragmenEvent: {
    _enum: {
      NewTerm: 'Vec<(AccountId32,u128)>',
      EmptyTerm: 'Null',
      ElectionError: 'Null',
      MemberKicked: 'AccountId32',
      Renounced: 'AccountId32',
      CandidateSlashed: '(AccountId32,u128)',
      SeatHolderSlashed: '(AccountId32,u128)'
    }
  },
  /**
   * Lookup62: pallet_membership::pallet::Event<T, I>
   **/
  PalletMembershipEvent: {
    _enum: ['MemberAdded', 'MemberRemoved', 'MembersSwapped', 'MembersReset', 'KeyChanged', 'Dummy']
  },
  /**
   * Lookup63: pallet_treasury::pallet::Event<T, I>
   **/
  PalletTreasuryEvent: {
    _enum: {
      Proposed: 'u32',
      Spending: 'u128',
      Awarded: '(u32,u128,AccountId32)',
      Rejected: '(u32,u128)',
      Burnt: 'u128',
      Rollover: 'u128',
      Deposit: 'u128'
    }
  },
  /**
   * Lookup64: claims::RawEvent<Balance, sp_core::crypto::AccountId32>
   **/
  ClaimsRawEvent: {
    _enum: {
      Claimed: '(AccountId32,ClaimsEthereumAddress,u128,u128)'
    }
  },
  /**
   * Lookup65: claims::EthereumAddress
   **/
  ClaimsEthereumAddress: '[u8;20]',
  /**
   * Lookup67: pallet_vesting::pallet::Event<T>
   **/
  PalletVestingEvent: {
    _enum: {
      VestingUpdated: '(AccountId32,u128)',
      VestingCompleted: 'AccountId32'
    }
  },
  /**
   * Lookup68: pallet_utility::pallet::Event
   **/
  PalletUtilityEvent: {
    _enum: {
      BatchInterrupted: '(u32,SpRuntimeDispatchError)',
      BatchCompleted: 'Null',
      ItemCompleted: 'Null',
      DispatchedAs: 'Result<Null, SpRuntimeDispatchError>'
    }
  },
  /**
   * Lookup69: pallet_identity::pallet::Event<T>
   **/
  PalletIdentityEvent: {
    _enum: {
      IdentitySet: 'AccountId32',
      IdentityCleared: '(AccountId32,u128)',
      IdentityKilled: '(AccountId32,u128)',
      JudgementRequested: '(AccountId32,u32)',
      JudgementUnrequested: '(AccountId32,u32)',
      JudgementGiven: '(AccountId32,u32)',
      RegistrarAdded: 'u32',
      SubIdentityAdded: '(AccountId32,AccountId32,u128)',
      SubIdentityRemoved: '(AccountId32,AccountId32,u128)',
      SubIdentityRevoked: '(AccountId32,AccountId32,u128)'
    }
  },
  /**
   * Lookup70: pallet_proxy::pallet::Event<T>
   **/
  PalletProxyEvent: {
    _enum: {
      ProxyExecuted: 'Result<Null, SpRuntimeDispatchError>',
      AnonymousCreated: '(AccountId32,AccountId32,XxnetworkRuntimeProxyType,u16)',
      Announced: '(AccountId32,AccountId32,H256)',
      ProxyAdded: '(AccountId32,AccountId32,XxnetworkRuntimeProxyType,u32)'
    }
  },
  /**
   * Lookup71: xxnetwork_runtime::ProxyType
   **/
  XxnetworkRuntimeProxyType: {
    _enum: ['Any', 'NonTransfer', 'Governance', 'Staking', 'Voting']
  },
  /**
   * Lookup73: pallet_bounties::pallet::Event<T>
   **/
  PalletBountiesEvent: {
    _enum: {
      BountyProposed: 'u32',
      BountyRejected: '(u32,u128)',
      BountyBecameActive: 'u32',
      BountyAwarded: '(u32,AccountId32)',
      BountyClaimed: '(u32,u128,AccountId32)',
      BountyCanceled: 'u32',
      BountyExtended: 'u32'
    }
  },
  /**
   * Lookup74: pallet_tips::pallet::Event<T>
   **/
  PalletTipsEvent: {
    _enum: {
      NewTip: {
        tipHash: 'H256',
      },
      TipClosing: {
        tipHash: 'H256',
      },
      TipClosed: {
        tipHash: 'H256',
        who: 'AccountId32',
        payout: 'u128',
      },
      TipRetracted: {
        tipHash: 'H256',
      },
      TipSlashed: {
        tipHash: 'H256',
        finder: 'AccountId32',
        deposit: 'u128'
      }
    }
  },
  /**
   * Lookup75: chainbridge::RawEvent<sp_core::crypto::AccountId32>
   **/
  ChainbridgeRawEvent: {
    _enum: {
      RelayerThresholdChanged: 'u32',
      ChainWhitelisted: 'u8',
      RelayerAdded: 'AccountId32',
      RelayerRemoved: 'AccountId32',
      FungibleTransfer: '(u8,u64,[u8;32],U256,Bytes)',
      NonFungibleTransfer: '(u8,u64,[u8;32],Bytes,Bytes,Bytes)',
      GenericTransfer: '(u8,u64,[u8;32],Bytes)',
      VoteFor: '(u8,u64,AccountId32)',
      VoteAgainst: '(u8,u64,AccountId32)',
      ProposalApproved: '(u8,u64)',
      ProposalRejected: '(u8,u64)',
      ProposalSucceeded: '(u8,u64)',
      ProposalFailed: '(u8,u64)'
    }
  },
  /**
   * Lookup78: swap::RawEvent<Balance, sp_core::crypto::AccountId32>
   **/
  SwapRawEvent: {
    _enum: {
      FeeChanged: 'u128',
      FeeDestinationChanged: 'AccountId32'
    }
  },
  /**
   * Lookup79: xx_cmix::RawEvent<BlockNumber>
   **/
  XxCmixRawEvent: {
    _enum: {
      CmixHashesUpdated: 'Null',
      AdminPermissionUpdated: 'u32',
      SchedulingAccountUpdated: 'Null',
      CmixVariablesUpdated: 'Null',
      CmixAddressSpaceUpdated: 'Null',
      CmixPointsAdded: 'Null',
      CmixPointsDeducted: 'Null'
    }
  },
  /**
   * Lookup80: xx_economics::RawEvent<Balance>
   **/
  XxEconomicsRawEvent: {
    _enum: {
      RewardFromPool: 'u128',
      RewardMinted: 'u128',
      InflationParamsChanged: 'Null',
      InterestPointsChanged: 'Null',
      IdealLiquidityStakeChanged: 'Null',
      LiquidityRewardsBalanceChanged: 'Null'
    }
  },
  /**
   * Lookup81: xx_team_custody::RawEvent<Balance, sp_core::crypto::AccountId32>
   **/
  XxTeamCustodyRawEvent: {
    _enum: {
      PayoutFromCustody: '(AccountId32,u128)',
      PayoutFromReserve: '(AccountId32,u128)',
      CustodyDone: 'AccountId32',
      CustodianAdded: 'AccountId32',
      CustodianRemoved: 'AccountId32',
      TeamMemberUpdated: '(AccountId32,AccountId32)'
    }
  },
  /**
   * Lookup82: xx_betanet_rewards::RawEvent<sp_core::crypto::AccountId32>
   **/
  XxBetanetRewardsRawEvent: {
    _enum: {
      OptionSelected: '(AccountId32,XxBetanetRewardsRewardOption)',
      ProgramApproved: 'Null',
      ProgramEnacted: 'Null'
    }
  },
  /**
   * Lookup83: xx_betanet_rewards::RewardOption
   **/
  XxBetanetRewardsRewardOption: {
    _enum: ['NoVesting', 'Vesting1Month', 'Vesting3Month', 'Vesting6Month', 'Vesting9Month']
  },
  /**
   * Lookup84: xx_public::Event
   **/
  XxPublicEvent: {
    _enum: ['TestnetManagerUpdated', 'SaleManagerUpdated']
  },
  /**
   * Lookup85: pallet_multisig::pallet::Event<T>
   **/
  PalletMultisigEvent: {
    _enum: {
      NewMultisig: '(AccountId32,AccountId32,[u8;32])',
      MultisigApproval: '(AccountId32,PalletMultisigTimepoint,AccountId32,[u8;32])',
      MultisigExecuted: '(AccountId32,PalletMultisigTimepoint,AccountId32,[u8;32],Result<Null, SpRuntimeDispatchError>)',
      MultisigCancelled: '(AccountId32,PalletMultisigTimepoint,AccountId32,[u8;32])'
    }
  },
  /**
   * Lookup86: pallet_multisig::Timepoint<BlockNumber>
   **/
  PalletMultisigTimepoint: {
    height: 'u32',
    index: 'u32'
  },
  /**
   * Lookup87: pallet_recovery::pallet::Event<T>
   **/
  PalletRecoveryEvent: {
    _enum: {
      RecoveryCreated: 'AccountId32',
      RecoveryInitiated: '(AccountId32,AccountId32)',
      RecoveryVouched: '(AccountId32,AccountId32,AccountId32)',
      RecoveryClosed: '(AccountId32,AccountId32)',
      AccountRecovered: '(AccountId32,AccountId32)',
      RecoveryRemoved: 'AccountId32'
    }
  },
  /**
   * Lookup88: pallet_assets::pallet::Event<T, I>
   **/
  PalletAssetsEvent: {
    _enum: {
      Created: '(u32,AccountId32,AccountId32)',
      Issued: '(u32,AccountId32,u64)',
      Transferred: '(u32,AccountId32,AccountId32,u64)',
      Burned: '(u32,AccountId32,u64)',
      TeamChanged: '(u32,AccountId32,AccountId32,AccountId32)',
      OwnerChanged: '(u32,AccountId32)',
      Frozen: '(u32,AccountId32)',
      Thawed: '(u32,AccountId32)',
      AssetFrozen: 'u32',
      AssetThawed: 'u32',
      Destroyed: 'u32',
      ForceCreated: '(u32,AccountId32)',
      MetadataSet: '(u32,Bytes,Bytes,u8,bool)',
      MetadataCleared: 'u32',
      ApprovedTransfer: '(u32,AccountId32,AccountId32,u64)',
      ApprovalCancelled: '(u32,AccountId32,AccountId32)',
      TransferredApproved: '(u32,AccountId32,AccountId32,AccountId32,u64)',
      AssetStatusChanged: 'u32'
    }
  },
  /**
   * Lookup89: pallet_uniques::pallet::Event<T, I>
   **/
  PalletUniquesEvent: {
    _enum: {
      Created: '(u32,AccountId32,AccountId32)',
      ForceCreated: '(u32,AccountId32)',
      Destroyed: 'u32',
      Issued: '(u32,u32,AccountId32)',
      Transferred: '(u32,u32,AccountId32,AccountId32)',
      Burned: '(u32,u32,AccountId32)',
      Frozen: '(u32,u32)',
      Thawed: '(u32,u32)',
      ClassFrozen: 'u32',
      ClassThawed: 'u32',
      OwnerChanged: '(u32,AccountId32)',
      TeamChanged: '(u32,AccountId32,AccountId32,AccountId32)',
      ApprovedTransfer: '(u32,u32,AccountId32,AccountId32)',
      ApprovalCancelled: '(u32,u32,AccountId32,AccountId32)',
      AssetStatusChanged: 'u32',
      ClassMetadataSet: '(u32,Bytes,bool)',
      ClassMetadataCleared: 'u32',
      MetadataSet: '(u32,u32,Bytes,bool)',
      MetadataCleared: '(u32,u32)',
      Redeposited: '(u32,Vec<u32>)',
      AttributeSet: '(u32,Option<u32>,Bytes,Bytes)',
      AttributeCleared: '(u32,Option<u32>,Bytes)'
    }
  },
  /**
   * Lookup95: frame_system::Phase
   **/
  FrameSystemPhase: {
    _enum: {
      ApplyExtrinsic: 'u32',
      Finalization: 'Null',
      Initialization: 'Null'
    }
  },
  /**
   * Lookup98: frame_system::LastRuntimeUpgradeInfo
   **/
  FrameSystemLastRuntimeUpgradeInfo: {
    specVersion: 'Compact<u32>',
    specName: 'Text'
  },
  /**
   * Lookup101: frame_system::pallet::Call<T>
   **/
  FrameSystemCall: {
    _enum: {
      fill_block: {
        ratio: 'Perbill',
      },
      remark: {
        remark: 'Bytes',
      },
      set_heap_pages: {
        pages: 'u64',
      },
      set_code: {
        code: 'Bytes',
      },
      set_code_without_checks: {
        code: 'Bytes',
      },
      set_storage: {
        items: 'Vec<(Bytes,Bytes)>',
      },
      kill_storage: {
        _alias: {
          keys_: 'keys',
        },
        keys_: 'Vec<Bytes>',
      },
      kill_prefix: {
        prefix: 'Bytes',
        subkeys: 'u32',
      },
      remark_with_event: {
        remark: 'Bytes'
      }
    }
  },
  /**
   * Lookup106: frame_system::limits::BlockWeights
   **/
  FrameSystemLimitsBlockWeights: {
    baseBlock: 'u64',
    maxBlock: 'u64',
    perClass: 'FrameSupportWeightsPerDispatchClassWeightsPerClass'
  },
  /**
   * Lookup107: frame_support::weights::PerDispatchClass<frame_system::limits::WeightsPerClass>
   **/
  FrameSupportWeightsPerDispatchClassWeightsPerClass: {
    normal: 'FrameSystemLimitsWeightsPerClass',
    operational: 'FrameSystemLimitsWeightsPerClass',
    mandatory: 'FrameSystemLimitsWeightsPerClass'
  },
  /**
   * Lookup108: frame_system::limits::WeightsPerClass
   **/
  FrameSystemLimitsWeightsPerClass: {
    baseExtrinsic: 'u64',
    maxExtrinsic: 'Option<u64>',
    maxTotal: 'Option<u64>',
    reserved: 'Option<u64>'
  },
  /**
   * Lookup110: frame_system::limits::BlockLength
   **/
  FrameSystemLimitsBlockLength: {
    max: 'FrameSupportWeightsPerDispatchClassU32'
  },
  /**
   * Lookup111: frame_support::weights::PerDispatchClass<T>
   **/
  FrameSupportWeightsPerDispatchClassU32: {
    normal: 'u32',
    operational: 'u32',
    mandatory: 'u32'
  },
  /**
   * Lookup112: frame_support::weights::RuntimeDbWeight
   **/
  FrameSupportWeightsRuntimeDbWeight: {
    read: 'u64',
    write: 'u64'
  },
  /**
   * Lookup113: sp_version::RuntimeVersion
   **/
  SpVersionRuntimeVersion: {
    specName: 'Text',
    implName: 'Text',
    authoringVersion: 'u32',
    specVersion: 'u32',
    implVersion: 'u32',
    apis: 'Vec<([u8;8],u32)>',
    transactionVersion: 'u32'
  },
  /**
   * Lookup118: frame_system::pallet::Error<T>
   **/
  FrameSystemError: {
    _enum: ['InvalidSpecName', 'SpecVersionNeedsToIncrease', 'FailedToExtractRuntimeVersion', 'NonDefaultComposite', 'NonZeroRefCount', 'CallFiltered']
  },
  /**
   * Lookup121: pallet_scheduler::ScheduledV2<xxnetwork_runtime::Call, BlockNumber, xxnetwork_runtime::OriginCaller, sp_core::crypto::AccountId32>
   **/
  PalletSchedulerScheduledV2: {
    maybeId: 'Option<Bytes>',
    priority: 'u8',
    call: 'Call',
    maybePeriodic: 'Option<(u32,u32)>',
    origin: 'XxnetworkRuntimeOriginCaller'
  },
  /**
   * Lookup123: pallet_scheduler::pallet::Call<T>
   **/
  PalletSchedulerCall: {
    _enum: {
      schedule: {
        when: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'Call',
      },
      cancel: {
        when: 'u32',
        index: 'u32',
      },
      schedule_named: {
        id: 'Bytes',
        when: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'Call',
      },
      cancel_named: {
        id: 'Bytes',
      },
      schedule_after: {
        after: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'Call',
      },
      schedule_named_after: {
        id: 'Bytes',
        after: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'Call'
      }
    }
  },
  /**
   * Lookup125: pallet_babe::pallet::Call<T>
   **/
  PalletBabeCall: {
    _enum: {
      report_equivocation: {
        equivocationProof: 'SpConsensusSlotsEquivocationProof',
        keyOwnerProof: 'SpSessionMembershipProof',
      },
      report_equivocation_unsigned: {
        equivocationProof: 'SpConsensusSlotsEquivocationProof',
        keyOwnerProof: 'SpSessionMembershipProof',
      },
      plan_config_change: {
        config: 'SpConsensusBabeDigestsNextConfigDescriptor'
      }
    }
  },
  /**
   * Lookup126: sp_consensus_slots::EquivocationProof<sp_runtime::generic::header::Header<Number, sp_runtime::traits::BlakeTwo256>, sp_consensus_babe::app::Public>
   **/
  SpConsensusSlotsEquivocationProof: {
    offender: 'SpConsensusBabeAppPublic',
    slot: 'u64',
    firstHeader: 'SpRuntimeHeader',
    secondHeader: 'SpRuntimeHeader'
  },
  /**
   * Lookup127: sp_runtime::generic::header::Header<Number, sp_runtime::traits::BlakeTwo256>
   **/
  SpRuntimeHeader: {
    parentHash: 'H256',
    number: 'Compact<u32>',
    stateRoot: 'H256',
    extrinsicsRoot: 'H256',
    digest: 'SpRuntimeDigest'
  },
  /**
   * Lookup128: sp_runtime::traits::BlakeTwo256
   **/
  SpRuntimeBlakeTwo256: 'Null',
  /**
   * Lookup129: sp_consensus_babe::app::Public
   **/
  SpConsensusBabeAppPublic: 'SpCoreSr25519Public',
  /**
   * Lookup131: sp_session::MembershipProof
   **/
  SpSessionMembershipProof: {
    session: 'u32',
    trieNodes: 'Vec<Bytes>',
    validatorCount: 'u32'
  },
  /**
   * Lookup132: sp_consensus_babe::digests::NextConfigDescriptor
   **/
  SpConsensusBabeDigestsNextConfigDescriptor: {
    _enum: {
      __Unused0: 'Null',
      V1: {
        c: '(u64,u64)',
        allowedSlots: 'SpConsensusBabeAllowedSlots'
      }
    }
  },
  /**
   * Lookup134: sp_consensus_babe::AllowedSlots
   **/
  SpConsensusBabeAllowedSlots: {
    _enum: ['PrimarySlots', 'PrimaryAndSecondaryPlainSlots', 'PrimaryAndSecondaryVRFSlots']
  },
  /**
   * Lookup135: pallet_timestamp::pallet::Call<T>
   **/
  PalletTimestampCall: {
    _enum: {
      set: {
        now: 'Compact<u64>'
      }
    }
  },
  /**
   * Lookup137: pallet_balances::pallet::Call<T, I>
   **/
  PalletBalancesCall: {
    _enum: {
      transfer: {
        dest: 'MultiAddress',
        value: 'Compact<u128>',
      },
      set_balance: {
        who: 'MultiAddress',
        newFree: 'Compact<u128>',
        newReserved: 'Compact<u128>',
      },
      force_transfer: {
        source: 'MultiAddress',
        dest: 'MultiAddress',
        value: 'Compact<u128>',
      },
      transfer_keep_alive: {
        dest: 'MultiAddress',
        value: 'Compact<u128>',
      },
      transfer_all: {
        dest: 'MultiAddress',
        keepAlive: 'bool',
      },
      force_unreserve: {
        who: 'MultiAddress',
        amount: 'u128'
      }
    }
  },
  /**
   * Lookup140: pallet_authorship::pallet::Call<T>
   **/
  PalletAuthorshipCall: {
    _enum: {
      set_uncles: {
        newUncles: 'Vec<SpRuntimeHeader>'
      }
    }
  },
  /**
   * Lookup142: pallet_staking::pallet::pallet::Call<T>
   **/
  PalletStakingPalletCall: {
    _enum: {
      bond: {
        controller: 'MultiAddress',
        value: 'Compact<u128>',
        cmixId: 'Option<H256>',
      },
      bond_extra: {
        maxAdditional: 'Compact<u128>',
      },
      unbond: {
        value: 'Compact<u128>',
      },
      withdraw_unbonded: {
        numSlashingSpans: 'u32',
      },
      validate: {
        prefs: 'PalletStakingValidatorPrefs',
      },
      nominate: {
        targets: 'Vec<MultiAddress>',
      },
      chill: 'Null',
      set_controller: {
        controller: 'MultiAddress',
      },
      set_validator_count: {
        _alias: {
          new_: 'new',
        },
        new_: 'Compact<u32>',
      },
      increase_validator_count: {
        additional: 'Compact<u32>',
      },
      scale_validator_count: {
        factor: 'Percent',
      },
      force_no_eras: 'Null',
      force_new_era: 'Null',
      set_invulnerables: {
        invulnerables: 'Vec<AccountId32>',
      },
      force_unstake: {
        stash: 'AccountId32',
        numSlashingSpans: 'u32',
      },
      force_new_era_always: 'Null',
      cancel_deferred_slash: {
        era: 'u32',
        slashIndices: 'Vec<u32>',
      },
      payout_stakers: {
        validatorStash: 'AccountId32',
        era: 'u32',
      },
      rebond: {
        value: 'Compact<u128>',
      },
      set_history_depth: {
        newHistoryDepth: 'Compact<u32>',
        eraItemsDeleted: 'Compact<u32>',
      },
      reap_stash: {
        stash: 'AccountId32',
        numSlashingSpans: 'u32',
      },
      kick: {
        who: 'Vec<MultiAddress>',
      },
      set_staking_limits: {
        minNominatorBond: 'u128',
        minValidatorBond: 'u128',
        maxNominatorCount: 'Option<u32>',
        maxValidatorCount: 'Option<u32>',
        threshold: 'Option<Percent>',
        minCommission: 'Perbill',
      },
      chill_other: {
        controller: 'AccountId32',
      },
      set_cmix_id: {
        cmixId: 'H256',
      },
      transfer_cmix_id: {
        dest: 'AccountId32'
      }
    }
  },
  /**
   * Lookup144: pallet_staking::ValidatorPrefs
   **/
  PalletStakingValidatorPrefs: {
    commission: 'Compact<Perbill>',
    blocked: 'bool'
  },
  /**
   * Lookup149: pallet_election_provider_multi_phase::pallet::Call<T>
   **/
  PalletElectionProviderMultiPhaseCall: {
    _enum: {
      submit_unsigned: {
        rawSolution: 'PalletElectionProviderMultiPhaseRawSolution',
        witness: 'PalletElectionProviderMultiPhaseSolutionOrSnapshotSize',
      },
      set_minimum_untrusted_score: {
        maybeNextScore: 'Option<[u128;3]>',
      },
      set_emergency_election_result: {
        supports: 'Vec<(AccountId32,SpNposElectionsSupport)>',
      },
      submit: {
        rawSolution: 'PalletElectionProviderMultiPhaseRawSolution',
        numSignedSubmissions: 'u32'
      }
    }
  },
  /**
   * Lookup150: pallet_election_provider_multi_phase::RawSolution<runtime_common::NposSolution16>
   **/
  PalletElectionProviderMultiPhaseRawSolution: {
    solution: 'RuntimeCommonNposSolution16',
    score: '[u128;3]',
    round: 'u32'
  },
  /**
   * Lookup151: runtime_common::NposSolution16
   **/
  RuntimeCommonNposSolution16: {
    votes1: 'Vec<(Compact<u32>,Compact<u16>)>',
    votes2: 'Vec<(Compact<u32>,(Compact<u16>,Compact<PerU16>),Compact<u16>)>',
    votes3: 'Vec<(Compact<u32>,[(Compact<u16>,Compact<PerU16>);2],Compact<u16>)>',
    votes4: 'Vec<(Compact<u32>,[(Compact<u16>,Compact<PerU16>);3],Compact<u16>)>',
    votes5: 'Vec<(Compact<u32>,[(Compact<u16>,Compact<PerU16>);4],Compact<u16>)>',
    votes6: 'Vec<(Compact<u32>,[(Compact<u16>,Compact<PerU16>);5],Compact<u16>)>',
    votes7: 'Vec<(Compact<u32>,[(Compact<u16>,Compact<PerU16>);6],Compact<u16>)>',
    votes8: 'Vec<(Compact<u32>,[(Compact<u16>,Compact<PerU16>);7],Compact<u16>)>',
    votes9: 'Vec<(Compact<u32>,[(Compact<u16>,Compact<PerU16>);8],Compact<u16>)>',
    votes10: 'Vec<(Compact<u32>,[(Compact<u16>,Compact<PerU16>);9],Compact<u16>)>',
    votes11: 'Vec<(Compact<u32>,[(Compact<u16>,Compact<PerU16>);10],Compact<u16>)>',
    votes12: 'Vec<(Compact<u32>,[(Compact<u16>,Compact<PerU16>);11],Compact<u16>)>',
    votes13: 'Vec<(Compact<u32>,[(Compact<u16>,Compact<PerU16>);12],Compact<u16>)>',
    votes14: 'Vec<(Compact<u32>,[(Compact<u16>,Compact<PerU16>);13],Compact<u16>)>',
    votes15: 'Vec<(Compact<u32>,[(Compact<u16>,Compact<PerU16>);14],Compact<u16>)>',
    votes16: 'Vec<(Compact<u32>,[(Compact<u16>,Compact<PerU16>);15],Compact<u16>)>'
  },
  /**
   * Lookup203: pallet_election_provider_multi_phase::SolutionOrSnapshotSize
   **/
  PalletElectionProviderMultiPhaseSolutionOrSnapshotSize: {
    voters: 'Compact<u32>',
    targets: 'Compact<u32>'
  },
  /**
   * Lookup207: sp_npos_elections::Support<sp_core::crypto::AccountId32>
   **/
  SpNposElectionsSupport: {
    total: 'u128',
    voters: 'Vec<(AccountId32,u128)>'
  },
  /**
   * Lookup208: pallet_session::pallet::Call<T>
   **/
  PalletSessionCall: {
    _enum: {
      set_keys: {
        _alias: {
          keys_: 'keys',
        },
        keys_: 'XxnetworkRuntimeSessionKeys',
        proof: 'Bytes',
      },
      purge_keys: 'Null'
    }
  },
  /**
   * Lookup209: xxnetwork_runtime::SessionKeys
   **/
  XxnetworkRuntimeSessionKeys: {
    grandpa: 'SpFinalityGrandpaAppPublic',
    babe: 'SpConsensusBabeAppPublic',
    imOnline: 'PalletImOnlineSr25519AppSr25519Public',
    authorityDiscovery: 'SpAuthorityDiscoveryAppPublic'
  },
  /**
   * Lookup210: sp_authority_discovery::app::Public
   **/
  SpAuthorityDiscoveryAppPublic: 'SpCoreSr25519Public',
  /**
   * Lookup211: pallet_grandpa::pallet::Call<T>
   **/
  PalletGrandpaCall: {
    _enum: {
      report_equivocation: {
        equivocationProof: 'SpFinalityGrandpaEquivocationProof',
        keyOwnerProof: 'SpSessionMembershipProof',
      },
      report_equivocation_unsigned: {
        equivocationProof: 'SpFinalityGrandpaEquivocationProof',
        keyOwnerProof: 'SpSessionMembershipProof',
      },
      note_stalled: {
        delay: 'u32',
        bestFinalizedBlockNumber: 'u32'
      }
    }
  },
  /**
   * Lookup212: sp_finality_grandpa::EquivocationProof<primitive_types::H256, N>
   **/
  SpFinalityGrandpaEquivocationProof: {
    setId: 'u64',
    equivocation: 'SpFinalityGrandpaEquivocation'
  },
  /**
   * Lookup213: sp_finality_grandpa::Equivocation<primitive_types::H256, N>
   **/
  SpFinalityGrandpaEquivocation: {
    _enum: {
      Prevote: 'FinalityGrandpaEquivocationPrevote',
      Precommit: 'FinalityGrandpaEquivocationPrecommit'
    }
  },
  /**
   * Lookup214: finality_grandpa::Equivocation<sp_finality_grandpa::app::Public, finality_grandpa::Prevote<primitive_types::H256, N>, sp_finality_grandpa::app::Signature>
   **/
  FinalityGrandpaEquivocationPrevote: {
    roundNumber: 'u64',
    identity: 'SpFinalityGrandpaAppPublic',
    first: '(FinalityGrandpaPrevote,SpFinalityGrandpaAppSignature)',
    second: '(FinalityGrandpaPrevote,SpFinalityGrandpaAppSignature)'
  },
  /**
   * Lookup215: finality_grandpa::Prevote<primitive_types::H256, N>
   **/
  FinalityGrandpaPrevote: {
    targetHash: 'H256',
    targetNumber: 'u32'
  },
  /**
   * Lookup216: sp_finality_grandpa::app::Signature
   **/
  SpFinalityGrandpaAppSignature: 'SpCoreEd25519Signature',
  /**
   * Lookup217: sp_core::ed25519::Signature
   **/
  SpCoreEd25519Signature: '[u8;64]',
  /**
   * Lookup220: finality_grandpa::Equivocation<sp_finality_grandpa::app::Public, finality_grandpa::Precommit<primitive_types::H256, N>, sp_finality_grandpa::app::Signature>
   **/
  FinalityGrandpaEquivocationPrecommit: {
    roundNumber: 'u64',
    identity: 'SpFinalityGrandpaAppPublic',
    first: '(FinalityGrandpaPrecommit,SpFinalityGrandpaAppSignature)',
    second: '(FinalityGrandpaPrecommit,SpFinalityGrandpaAppSignature)'
  },
  /**
   * Lookup221: finality_grandpa::Precommit<primitive_types::H256, N>
   **/
  FinalityGrandpaPrecommit: {
    targetHash: 'H256',
    targetNumber: 'u32'
  },
  /**
   * Lookup223: pallet_im_online::pallet::Call<T>
   **/
  PalletImOnlineCall: {
    _enum: {
      heartbeat: {
        heartbeat: 'PalletImOnlineHeartbeat',
        signature: 'PalletImOnlineSr25519AppSr25519Signature'
      }
    }
  },
  /**
   * Lookup224: pallet_im_online::Heartbeat<BlockNumber>
   **/
  PalletImOnlineHeartbeat: {
    blockNumber: 'u32',
    networkState: 'SpCoreOffchainOpaqueNetworkState',
    sessionIndex: 'u32',
    authorityIndex: 'u32',
    validatorsLen: 'u32'
  },
  /**
   * Lookup225: sp_core::offchain::OpaqueNetworkState
   **/
  SpCoreOffchainOpaqueNetworkState: {
    peerId: 'OpaquePeerId',
    externalAddresses: 'Vec<OpaqueMultiaddr>'
  },
  /**
   * Lookup229: pallet_im_online::sr25519::app_sr25519::Signature
   **/
  PalletImOnlineSr25519AppSr25519Signature: 'SpCoreSr25519Signature',
  /**
   * Lookup230: sp_core::sr25519::Signature
   **/
  SpCoreSr25519Signature: '[u8;64]',
  /**
   * Lookup231: pallet_democracy::pallet::Call<T>
   **/
  PalletDemocracyCall: {
    _enum: {
      propose: {
        proposalHash: 'H256',
        value: 'Compact<u128>',
      },
      second: {
        proposal: 'Compact<u32>',
        secondsUpperBound: 'Compact<u32>',
      },
      vote: {
        refIndex: 'Compact<u32>',
        vote: 'PalletDemocracyVoteAccountVote',
      },
      emergency_cancel: {
        refIndex: 'u32',
      },
      external_propose: {
        proposalHash: 'H256',
      },
      external_propose_majority: {
        proposalHash: 'H256',
      },
      external_propose_default: {
        proposalHash: 'H256',
      },
      fast_track: {
        proposalHash: 'H256',
        votingPeriod: 'u32',
        delay: 'u32',
      },
      veto_external: {
        proposalHash: 'H256',
      },
      cancel_referendum: {
        refIndex: 'Compact<u32>',
      },
      cancel_queued: {
        which: 'u32',
      },
      delegate: {
        to: 'AccountId32',
        conviction: 'PalletDemocracyConviction',
        balance: 'u128',
      },
      undelegate: 'Null',
      clear_public_proposals: 'Null',
      note_preimage: {
        encodedProposal: 'Bytes',
      },
      note_preimage_operational: {
        encodedProposal: 'Bytes',
      },
      note_imminent_preimage: {
        encodedProposal: 'Bytes',
      },
      note_imminent_preimage_operational: {
        encodedProposal: 'Bytes',
      },
      reap_preimage: {
        proposalHash: 'H256',
        proposalLenUpperBound: 'Compact<u32>',
      },
      unlock: {
        target: 'AccountId32',
      },
      remove_vote: {
        index: 'u32',
      },
      remove_other_vote: {
        target: 'AccountId32',
        index: 'u32',
      },
      enact_proposal: {
        proposalHash: 'H256',
        index: 'u32',
      },
      blacklist: {
        proposalHash: 'H256',
        maybeRefIndex: 'Option<u32>',
      },
      cancel_proposal: {
        propIndex: 'Compact<u32>'
      }
    }
  },
  /**
   * Lookup232: pallet_democracy::vote::AccountVote<Balance>
   **/
  PalletDemocracyVoteAccountVote: {
    _enum: {
      Standard: {
        vote: 'Vote',
        balance: 'u128',
      },
      Split: {
        aye: 'u128',
        nay: 'u128'
      }
    }
  },
  /**
   * Lookup234: pallet_democracy::conviction::Conviction
   **/
  PalletDemocracyConviction: {
    _enum: ['None', 'Locked1x', 'Locked2x', 'Locked3x', 'Locked4x', 'Locked5x', 'Locked6x']
  },
  /**
   * Lookup235: pallet_collective::pallet::Call<T, I>
   **/
  PalletCollectiveCall: {
    _enum: {
      set_members: {
        newMembers: 'Vec<AccountId32>',
        prime: 'Option<AccountId32>',
        oldCount: 'u32',
      },
      execute: {
        proposal: 'Call',
        lengthBound: 'Compact<u32>',
      },
      propose: {
        threshold: 'Compact<u32>',
        proposal: 'Call',
        lengthBound: 'Compact<u32>',
      },
      vote: {
        proposal: 'H256',
        index: 'Compact<u32>',
        approve: 'bool',
      },
      close: {
        proposalHash: 'H256',
        index: 'Compact<u32>',
        proposalWeightBound: 'Compact<u64>',
        lengthBound: 'Compact<u32>',
      },
      disapprove_proposal: {
        proposalHash: 'H256'
      }
    }
  },
  /**
   * Lookup238: pallet_elections_phragmen::pallet::Call<T>
   **/
  PalletElectionsPhragmenCall: {
    _enum: {
      vote: {
        votes: 'Vec<AccountId32>',
        value: 'Compact<u128>',
      },
      remove_voter: 'Null',
      submit_candidacy: {
        candidateCount: 'Compact<u32>',
      },
      renounce_candidacy: {
        renouncing: 'PalletElectionsPhragmenRenouncing',
      },
      remove_member: {
        who: 'MultiAddress',
        hasReplacement: 'bool',
      },
      clean_defunct_voters: {
        numVoters: 'u32',
        numDefunct: 'u32'
      }
    }
  },
  /**
   * Lookup239: pallet_elections_phragmen::Renouncing
   **/
  PalletElectionsPhragmenRenouncing: {
    _enum: {
      Member: 'Null',
      RunnerUp: 'Null',
      Candidate: 'Compact<u32>'
    }
  },
  /**
   * Lookup240: pallet_membership::pallet::Call<T, I>
   **/
  PalletMembershipCall: {
    _enum: {
      add_member: {
        who: 'AccountId32',
      },
      remove_member: {
        who: 'AccountId32',
      },
      swap_member: {
        remove: 'AccountId32',
        add: 'AccountId32',
      },
      reset_members: {
        members: 'Vec<AccountId32>',
      },
      change_key: {
        _alias: {
          new_: 'new',
        },
        new_: 'AccountId32',
      },
      set_prime: {
        who: 'AccountId32',
      },
      clear_prime: 'Null'
    }
  },
  /**
   * Lookup241: pallet_treasury::pallet::Call<T, I>
   **/
  PalletTreasuryCall: {
    _enum: {
      propose_spend: {
        value: 'Compact<u128>',
        beneficiary: 'MultiAddress',
      },
      reject_proposal: {
        proposalId: 'Compact<u32>',
      },
      approve_proposal: {
        proposalId: 'Compact<u32>'
      }
    }
  },
  /**
   * Lookup242: claims::Call<T>
   **/
  ClaimsCall: {
    _enum: {
      claim: {
        dest: 'AccountId32',
        ethereumSignature: 'ClaimsEcdsaSignature',
      },
      mint_claim: {
        who: 'ClaimsEthereumAddress',
        value: 'u128',
        vestingSchedules: 'Option<Vec<(u128,u128,u32)>>',
        statement: 'Option<ClaimsStatementKind>',
      },
      claim_attest: {
        dest: 'AccountId32',
        ethereumSignature: 'ClaimsEcdsaSignature',
        statement: 'Bytes',
      },
      attest: {
        statement: 'Bytes',
      },
      move_claim: {
        _alias: {
          new_: 'new',
        },
        old: 'ClaimsEthereumAddress',
        new_: 'ClaimsEthereumAddress',
        maybePreclaim: 'Option<AccountId32>'
      }
    }
  },
  /**
   * Lookup243: claims::EcdsaSignature
   **/
  ClaimsEcdsaSignature: '[u8;65]',
  /**
   * Lookup249: claims::StatementKind
   **/
  ClaimsStatementKind: {
    _enum: ['Regular', 'Saft']
  },
  /**
   * Lookup250: pallet_vesting::pallet::Call<T>
   **/
  PalletVestingCall: {
    _enum: {
      vest: 'Null',
      vest_other: {
        target: 'MultiAddress',
      },
      vested_transfer: {
        target: 'MultiAddress',
        schedule: 'PalletVestingVestingInfo',
      },
      force_vested_transfer: {
        source: 'MultiAddress',
        target: 'MultiAddress',
        schedule: 'PalletVestingVestingInfo',
      },
      merge_schedules: {
        schedule1Index: 'u32',
        schedule2Index: 'u32'
      }
    }
  },
  /**
   * Lookup251: pallet_vesting::vesting_info::VestingInfo<Balance, BlockNumber>
   **/
  PalletVestingVestingInfo: {
    locked: 'u128',
    perBlock: 'u128',
    startingBlock: 'u32'
  },
  /**
   * Lookup252: pallet_utility::pallet::Call<T>
   **/
  PalletUtilityCall: {
    _enum: {
      batch: {
        calls: 'Vec<Call>',
      },
      as_derivative: {
        index: 'u16',
        call: 'Call',
      },
      batch_all: {
        calls: 'Vec<Call>',
      },
      dispatch_as: {
        asOrigin: 'XxnetworkRuntimeOriginCaller',
        call: 'Call'
      }
    }
  },
  /**
   * Lookup254: xxnetwork_runtime::OriginCaller
   **/
  XxnetworkRuntimeOriginCaller: {
    _enum: {
      system: 'FrameSystemRawOrigin',
      __Unused1: 'Null',
      __Unused2: 'Null',
      Void: 'SpCoreVoid',
      __Unused4: 'Null',
      __Unused5: 'Null',
      __Unused6: 'Null',
      __Unused7: 'Null',
      __Unused8: 'Null',
      __Unused9: 'Null',
      __Unused10: 'Null',
      __Unused11: 'Null',
      __Unused12: 'Null',
      __Unused13: 'Null',
      Council: 'PalletCollectiveRawOrigin',
      TechnicalCommittee: 'PalletCollectiveRawOrigin'
    }
  },
  /**
   * Lookup255: frame_system::RawOrigin<sp_core::crypto::AccountId32>
   **/
  FrameSystemRawOrigin: {
    _enum: {
      Root: 'Null',
      Signed: 'AccountId32',
      None: 'Null'
    }
  },
  /**
   * Lookup256: pallet_collective::RawOrigin<sp_core::crypto::AccountId32, I>
   **/
  PalletCollectiveRawOrigin: {
    _enum: {
      Members: '(u32,u32)',
      Member: 'AccountId32',
      _Phantom: 'Null'
    }
  },
  /**
   * Lookup258: sp_core::Void
   **/
  SpCoreVoid: 'Null',
  /**
   * Lookup259: pallet_identity::pallet::Call<T>
   **/
  PalletIdentityCall: {
    _enum: {
      add_registrar: {
        account: 'AccountId32',
      },
      set_identity: {
        info: 'PalletIdentityIdentityInfo',
      },
      set_subs: {
        subs: 'Vec<(AccountId32,Data)>',
      },
      clear_identity: 'Null',
      request_judgement: {
        regIndex: 'Compact<u32>',
        maxFee: 'Compact<u128>',
      },
      cancel_request: {
        regIndex: 'u32',
      },
      set_fee: {
        index: 'Compact<u32>',
        fee: 'Compact<u128>',
      },
      set_account_id: {
        _alias: {
          new_: 'new',
        },
        index: 'Compact<u32>',
        new_: 'AccountId32',
      },
      set_fields: {
        index: 'Compact<u32>',
        fields: 'PalletIdentityBitFlags',
      },
      provide_judgement: {
        regIndex: 'Compact<u32>',
        target: 'MultiAddress',
        judgement: 'PalletIdentityJudgement',
      },
      kill_identity: {
        target: 'MultiAddress',
      },
      add_sub: {
        sub: 'MultiAddress',
        data: 'Data',
      },
      rename_sub: {
        sub: 'MultiAddress',
        data: 'Data',
      },
      remove_sub: {
        sub: 'MultiAddress',
      },
      quit_sub: 'Null'
    }
  },
  /**
   * Lookup260: pallet_identity::types::IdentityInfo<FieldLimit>
   **/
  PalletIdentityIdentityInfo: {
    additional: 'Vec<(Data,Data)>',
    display: 'Data',
    legal: 'Data',
    web: 'Data',
    riot: 'Data',
    email: 'Data',
    pgpFingerprint: 'Option<[u8;20]>',
    image: 'Data',
    twitter: 'Data'
  },
  /**
   * Lookup296: pallet_identity::types::BitFlags<pallet_identity::types::IdentityField>
   **/
  PalletIdentityBitFlags: {
    _bitLength: 64,
    Display: 1,
    Legal: 2,
    Web: 4,
    Riot: 8,
    Email: 16,
    PgpFingerprint: 32,
    Image: 64,
    Twitter: 128
  },
  /**
   * Lookup297: pallet_identity::types::IdentityField
   **/
  PalletIdentityIdentityField: {
    _enum: ['__Unused0', 'Display', 'Legal', '__Unused3', 'Web', '__Unused5', '__Unused6', '__Unused7', 'Riot', '__Unused9', '__Unused10', '__Unused11', '__Unused12', '__Unused13', '__Unused14', '__Unused15', 'Email', '__Unused17', '__Unused18', '__Unused19', '__Unused20', '__Unused21', '__Unused22', '__Unused23', '__Unused24', '__Unused25', '__Unused26', '__Unused27', '__Unused28', '__Unused29', '__Unused30', '__Unused31', 'PgpFingerprint', '__Unused33', '__Unused34', '__Unused35', '__Unused36', '__Unused37', '__Unused38', '__Unused39', '__Unused40', '__Unused41', '__Unused42', '__Unused43', '__Unused44', '__Unused45', '__Unused46', '__Unused47', '__Unused48', '__Unused49', '__Unused50', '__Unused51', '__Unused52', '__Unused53', '__Unused54', '__Unused55', '__Unused56', '__Unused57', '__Unused58', '__Unused59', '__Unused60', '__Unused61', '__Unused62', '__Unused63', 'Image', '__Unused65', '__Unused66', '__Unused67', '__Unused68', '__Unused69', '__Unused70', '__Unused71', '__Unused72', '__Unused73', '__Unused74', '__Unused75', '__Unused76', '__Unused77', '__Unused78', '__Unused79', '__Unused80', '__Unused81', '__Unused82', '__Unused83', '__Unused84', '__Unused85', '__Unused86', '__Unused87', '__Unused88', '__Unused89', '__Unused90', '__Unused91', '__Unused92', '__Unused93', '__Unused94', '__Unused95', '__Unused96', '__Unused97', '__Unused98', '__Unused99', '__Unused100', '__Unused101', '__Unused102', '__Unused103', '__Unused104', '__Unused105', '__Unused106', '__Unused107', '__Unused108', '__Unused109', '__Unused110', '__Unused111', '__Unused112', '__Unused113', '__Unused114', '__Unused115', '__Unused116', '__Unused117', '__Unused118', '__Unused119', '__Unused120', '__Unused121', '__Unused122', '__Unused123', '__Unused124', '__Unused125', '__Unused126', '__Unused127', 'Twitter']
  },
  /**
   * Lookup298: pallet_identity::types::Judgement<Balance>
   **/
  PalletIdentityJudgement: {
    _enum: {
      Unknown: 'Null',
      FeePaid: 'u128',
      Reasonable: 'Null',
      KnownGood: 'Null',
      OutOfDate: 'Null',
      LowQuality: 'Null',
      Erroneous: 'Null'
    }
  },
  /**
   * Lookup299: pallet_proxy::pallet::Call<T>
   **/
  PalletProxyCall: {
    _enum: {
      proxy: {
        real: 'AccountId32',
        forceProxyType: 'Option<XxnetworkRuntimeProxyType>',
        call: 'Call',
      },
      add_proxy: {
        delegate: 'AccountId32',
        proxyType: 'XxnetworkRuntimeProxyType',
        delay: 'u32',
      },
      remove_proxy: {
        delegate: 'AccountId32',
        proxyType: 'XxnetworkRuntimeProxyType',
        delay: 'u32',
      },
      remove_proxies: 'Null',
      anonymous: {
        proxyType: 'XxnetworkRuntimeProxyType',
        delay: 'u32',
        index: 'u16',
      },
      kill_anonymous: {
        spawner: 'AccountId32',
        proxyType: 'XxnetworkRuntimeProxyType',
        index: 'u16',
        height: 'Compact<u32>',
        extIndex: 'Compact<u32>',
      },
      announce: {
        real: 'AccountId32',
        callHash: 'H256',
      },
      remove_announcement: {
        real: 'AccountId32',
        callHash: 'H256',
      },
      reject_announcement: {
        delegate: 'AccountId32',
        callHash: 'H256',
      },
      proxy_announced: {
        delegate: 'AccountId32',
        real: 'AccountId32',
        forceProxyType: 'Option<XxnetworkRuntimeProxyType>',
        call: 'Call'
      }
    }
  },
  /**
   * Lookup301: pallet_bounties::pallet::Call<T>
   **/
  PalletBountiesCall: {
    _enum: {
      propose_bounty: {
        value: 'Compact<u128>',
        description: 'Bytes',
      },
      approve_bounty: {
        bountyId: 'Compact<u32>',
      },
      propose_curator: {
        bountyId: 'Compact<u32>',
        curator: 'MultiAddress',
        fee: 'Compact<u128>',
      },
      unassign_curator: {
        bountyId: 'Compact<u32>',
      },
      accept_curator: {
        bountyId: 'Compact<u32>',
      },
      award_bounty: {
        bountyId: 'Compact<u32>',
        beneficiary: 'MultiAddress',
      },
      claim_bounty: {
        bountyId: 'Compact<u32>',
      },
      close_bounty: {
        bountyId: 'Compact<u32>',
      },
      extend_bounty_expiry: {
        bountyId: 'Compact<u32>',
        remark: 'Bytes'
      }
    }
  },
  /**
   * Lookup302: pallet_tips::pallet::Call<T>
   **/
  PalletTipsCall: {
    _enum: {
      report_awesome: {
        reason: 'Bytes',
        who: 'AccountId32',
      },
      retract_tip: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
      },
      tip_new: {
        reason: 'Bytes',
        who: 'AccountId32',
        tipValue: 'Compact<u128>',
      },
      tip: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
        tipValue: 'Compact<u128>',
      },
      close_tip: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
      },
      slash_tip: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256'
      }
    }
  },
  /**
   * Lookup303: chainbridge::Call<T>
   **/
  ChainbridgeCall: {
    _enum: {
      set_threshold: {
        threshold: 'u32',
      },
      set_resource: {
        id: '[u8;32]',
        method: 'Bytes',
      },
      remove_resource: {
        id: '[u8;32]',
      },
      whitelist_chain: {
        id: 'u8',
      },
      add_relayer: {
        v: 'AccountId32',
      },
      remove_relayer: {
        v: 'AccountId32',
      },
      acknowledge_proposal: {
        nonce: 'u64',
        srcId: 'u8',
        rId: '[u8;32]',
        call: 'Call',
      },
      reject_proposal: {
        nonce: 'u64',
        srcId: 'u8',
        rId: '[u8;32]',
        call: 'Call',
      },
      eval_vote_state: {
        nonce: 'u64',
        srcId: 'u8',
        prop: 'Call'
      }
    }
  },
  /**
   * Lookup304: swap::Call<T>
   **/
  SwapCall: {
    _enum: {
      transfer_native: {
        amount: 'u128',
        recipient: 'Bytes',
        destId: 'u8',
      },
      transfer: {
        to: 'AccountId32',
        amount: 'u128',
      },
      set_swap_fee: {
        fee: 'Compact<u128>',
      },
      set_fee_destination: {
        dest: 'AccountId32'
      }
    }
  },
  /**
   * Lookup305: xx_cmix::Call<T>
   **/
  XxCmixCall: {
    _enum: {
      set_cmix_hashes: {
        hashes: 'XxCmixCmixSoftwareHashes',
      },
      set_scheduling_account: {
        who: 'AccountId32',
      },
      set_next_cmix_variables: {
        variables: 'XxCmixCmixVariables',
      },
      submit_cmix_points: {
        data: 'Vec<(AccountId32,u32)>',
      },
      submit_cmix_deductions: {
        data: 'Vec<(AccountId32,u32)>',
      },
      set_cmix_address_space: {
        _alias: {
          size_: 'size',
        },
        size_: 'u8',
      },
      set_admin_permission: {
        permission: 'u32'
      }
    }
  },
  /**
   * Lookup306: xx_cmix::cmix::SoftwareHashes<primitive_types::H256>
   **/
  XxCmixCmixSoftwareHashes: {
    server: 'H256',
    fatbin: 'H256',
    libpow: 'H256',
    gateway: 'H256',
    scheduling: 'H256',
    wrapper: 'H256',
    udb: 'H256',
    notifications: 'H256',
    extra: 'Option<Vec<H256>>'
  },
  /**
   * Lookup308: xx_cmix::cmix::Variables
   **/
  XxCmixCmixVariables: {
    performance: 'XxCmixCmixPerformance',
    timeouts: 'XxCmixCmixTimeouts',
    scheduling: 'XxCmixCmixScheduling',
    registration: 'XxCmixCmixUserRegistration'
  },
  /**
   * Lookup309: xx_cmix::cmix::Performance
   **/
  XxCmixCmixPerformance: {
    period: 'u64',
    points: 'XxCmixCmixRewardPoints',
    countries: 'Vec<([u8;2],u8)>',
    multipliers: 'Vec<(u8,u16)>'
  },
  /**
   * Lookup310: xx_cmix::cmix::RewardPoints
   **/
  XxCmixCmixRewardPoints: {
    success: 'u32',
    failure: 'u32',
    block: 'u32'
  },
  /**
   * Lookup315: xx_cmix::cmix::Timeouts
   **/
  XxCmixCmixTimeouts: {
    precomputation: 'u64',
    realtime: 'u64',
    advertisement: 'u64'
  },
  /**
   * Lookup316: xx_cmix::cmix::Scheduling
   **/
  XxCmixCmixScheduling: {
    teamSize: 'u8',
    batchSize: 'u32',
    minDelay: 'u64',
    poolThreshold: 'Permill'
  },
  /**
   * Lookup318: xx_cmix::cmix::UserRegistration
   **/
  XxCmixCmixUserRegistration: {
    max: 'u32',
    period: 'u64'
  },
  /**
   * Lookup321: xx_economics::Call<T>
   **/
  XxEconomicsCall: {
    _enum: {
      set_inflation_params: {
        params: 'XxEconomicsInflationInflationFixedParams',
      },
      set_interest_points: {
        points: 'Vec<XxEconomicsInflationIdealInterestPoint>',
      },
      set_liquidity_rewards_stake: {
        amount: 'Compact<u128>',
      },
      set_liquidity_rewards_balance: {
        amount: 'Compact<u128>'
      }
    }
  },
  /**
   * Lookup322: xx_economics::inflation::InflationFixedParams
   **/
  XxEconomicsInflationInflationFixedParams: {
    minInflation: 'Compact<Perbill>',
    idealStake: 'Compact<Perbill>',
    falloff: 'Compact<Perbill>'
  },
  /**
   * Lookup324: xx_economics::inflation::IdealInterestPoint<B>
   **/
  XxEconomicsInflationIdealInterestPoint: {
    block: 'u32',
    interest: 'Compact<Perbill>'
  },
  /**
   * Lookup325: xx_team_custody::Call<T>
   **/
  XxTeamCustodyCall: {
    _enum: {
      payout: {
        who: 'AccountId32',
      },
      custody_bond: {
        custody: 'AccountId32',
        controller: 'AccountId32',
        value: 'Compact<u128>',
      },
      custody_bond_extra: {
        custody: 'AccountId32',
        value: 'Compact<u128>',
      },
      custody_set_controller: {
        custody: 'AccountId32',
        controller: 'AccountId32',
      },
      custody_set_proxy: {
        custody: 'AccountId32',
        proxy: 'AccountId32',
      },
      team_custody_set_proxy: {
        proxy: 'AccountId32',
      },
      add_custodian: {
        custodian: 'AccountId32',
      },
      remove_custodian: {
        custodian: 'AccountId32',
      },
      replace_team_member: {
        _alias: {
          new_: 'new',
        },
        who: 'AccountId32',
        new_: 'AccountId32'
      }
    }
  },
  /**
   * Lookup326: xx_betanet_rewards::Call<T>
   **/
  XxBetanetRewardsCall: {
    _enum: {
      select_option: {
        option: 'XxBetanetRewardsRewardOption',
      },
      approve: 'Null'
    }
  },
  /**
   * Lookup327: xx_public::Call<T>
   **/
  XxPublicCall: {
    _enum: {
      set_testnet_manager_account: {
        who: 'AccountId32',
      },
      set_sale_manager_account: {
        who: 'AccountId32',
      },
      testnet_distribute: {
        data: 'Vec<XxPublicTransferData>',
      },
      sale_distribute: {
        data: 'Vec<XxPublicTransferData>'
      }
    }
  },
  /**
   * Lookup329: xx_public::TransferData<sp_core::crypto::AccountId32, Balance, Block>
   **/
  XxPublicTransferData: {
    destination: 'AccountId32',
    amount: 'Compact<u128>',
    schedules: 'Option<Vec<(u128,u128,u32)>>'
  },
  /**
   * Lookup330: pallet_multisig::pallet::Call<T>
   **/
  PalletMultisigCall: {
    _enum: {
      as_multi_threshold_1: {
        otherSignatories: 'Vec<AccountId32>',
        call: 'Call',
      },
      as_multi: {
        threshold: 'u16',
        otherSignatories: 'Vec<AccountId32>',
        maybeTimepoint: 'Option<PalletMultisigTimepoint>',
        call: 'WrapperKeepOpaque<Call>',
        storeCall: 'bool',
        maxWeight: 'u64',
      },
      approve_as_multi: {
        threshold: 'u16',
        otherSignatories: 'Vec<AccountId32>',
        maybeTimepoint: 'Option<PalletMultisigTimepoint>',
        callHash: '[u8;32]',
        maxWeight: 'u64',
      },
      cancel_as_multi: {
        threshold: 'u16',
        otherSignatories: 'Vec<AccountId32>',
        timepoint: 'PalletMultisigTimepoint',
        callHash: '[u8;32]'
      }
    }
  },
  /**
   * Lookup333: pallet_recovery::pallet::Call<T>
   **/
  PalletRecoveryCall: {
    _enum: {
      as_recovered: {
        account: 'AccountId32',
        call: 'Call',
      },
      set_recovered: {
        lost: 'AccountId32',
        rescuer: 'AccountId32',
      },
      create_recovery: {
        friends: 'Vec<AccountId32>',
        threshold: 'u16',
        delayPeriod: 'u32',
      },
      initiate_recovery: {
        account: 'AccountId32',
      },
      vouch_recovery: {
        lost: 'AccountId32',
        rescuer: 'AccountId32',
      },
      claim_recovery: {
        account: 'AccountId32',
      },
      close_recovery: {
        rescuer: 'AccountId32',
      },
      remove_recovery: 'Null',
      cancel_recovered: {
        account: 'AccountId32'
      }
    }
  },
  /**
   * Lookup334: pallet_assets::pallet::Call<T, I>
   **/
  PalletAssetsCall: {
    _enum: {
      create: {
        id: 'Compact<u32>',
        admin: 'MultiAddress',
        minBalance: 'u64',
      },
      force_create: {
        id: 'Compact<u32>',
        owner: 'MultiAddress',
        isSufficient: 'bool',
        minBalance: 'Compact<u64>',
      },
      destroy: {
        id: 'Compact<u32>',
        witness: 'PalletAssetsDestroyWitness',
      },
      mint: {
        id: 'Compact<u32>',
        beneficiary: 'MultiAddress',
        amount: 'Compact<u64>',
      },
      burn: {
        id: 'Compact<u32>',
        who: 'MultiAddress',
        amount: 'Compact<u64>',
      },
      transfer: {
        id: 'Compact<u32>',
        target: 'MultiAddress',
        amount: 'Compact<u64>',
      },
      transfer_keep_alive: {
        id: 'Compact<u32>',
        target: 'MultiAddress',
        amount: 'Compact<u64>',
      },
      force_transfer: {
        id: 'Compact<u32>',
        source: 'MultiAddress',
        dest: 'MultiAddress',
        amount: 'Compact<u64>',
      },
      freeze: {
        id: 'Compact<u32>',
        who: 'MultiAddress',
      },
      thaw: {
        id: 'Compact<u32>',
        who: 'MultiAddress',
      },
      freeze_asset: {
        id: 'Compact<u32>',
      },
      thaw_asset: {
        id: 'Compact<u32>',
      },
      transfer_ownership: {
        id: 'Compact<u32>',
        owner: 'MultiAddress',
      },
      set_team: {
        id: 'Compact<u32>',
        issuer: 'MultiAddress',
        admin: 'MultiAddress',
        freezer: 'MultiAddress',
      },
      set_metadata: {
        id: 'Compact<u32>',
        name: 'Bytes',
        symbol: 'Bytes',
        decimals: 'u8',
      },
      clear_metadata: {
        id: 'Compact<u32>',
      },
      force_set_metadata: {
        id: 'Compact<u32>',
        name: 'Bytes',
        symbol: 'Bytes',
        decimals: 'u8',
        isFrozen: 'bool',
      },
      force_clear_metadata: {
        id: 'Compact<u32>',
      },
      force_asset_status: {
        id: 'Compact<u32>',
        owner: 'MultiAddress',
        issuer: 'MultiAddress',
        admin: 'MultiAddress',
        freezer: 'MultiAddress',
        minBalance: 'Compact<u64>',
        isSufficient: 'bool',
        isFrozen: 'bool',
      },
      approve_transfer: {
        id: 'Compact<u32>',
        delegate: 'MultiAddress',
        amount: 'Compact<u64>',
      },
      cancel_approval: {
        id: 'Compact<u32>',
        delegate: 'MultiAddress',
      },
      force_cancel_approval: {
        id: 'Compact<u32>',
        owner: 'MultiAddress',
        delegate: 'MultiAddress',
      },
      transfer_approved: {
        id: 'Compact<u32>',
        owner: 'MultiAddress',
        destination: 'MultiAddress',
        amount: 'Compact<u64>'
      }
    }
  },
  /**
   * Lookup335: pallet_assets::types::DestroyWitness
   **/
  PalletAssetsDestroyWitness: {
    accounts: 'Compact<u32>',
    sufficients: 'Compact<u32>',
    approvals: 'Compact<u32>'
  },
  /**
   * Lookup336: pallet_uniques::pallet::Call<T, I>
   **/
  PalletUniquesCall: {
    _enum: {
      create: {
        class: 'Compact<u32>',
        admin: 'MultiAddress',
      },
      force_create: {
        class: 'Compact<u32>',
        owner: 'MultiAddress',
        freeHolding: 'bool',
      },
      destroy: {
        class: 'Compact<u32>',
        witness: 'PalletUniquesDestroyWitness',
      },
      mint: {
        class: 'Compact<u32>',
        instance: 'Compact<u32>',
        owner: 'MultiAddress',
      },
      burn: {
        class: 'Compact<u32>',
        instance: 'Compact<u32>',
        checkOwner: 'Option<MultiAddress>',
      },
      transfer: {
        class: 'Compact<u32>',
        instance: 'Compact<u32>',
        dest: 'MultiAddress',
      },
      redeposit: {
        class: 'Compact<u32>',
        instances: 'Vec<u32>',
      },
      freeze: {
        class: 'Compact<u32>',
        instance: 'Compact<u32>',
      },
      thaw: {
        class: 'Compact<u32>',
        instance: 'Compact<u32>',
      },
      freeze_class: {
        class: 'Compact<u32>',
      },
      thaw_class: {
        class: 'Compact<u32>',
      },
      transfer_ownership: {
        class: 'Compact<u32>',
        owner: 'MultiAddress',
      },
      set_team: {
        class: 'Compact<u32>',
        issuer: 'MultiAddress',
        admin: 'MultiAddress',
        freezer: 'MultiAddress',
      },
      approve_transfer: {
        class: 'Compact<u32>',
        instance: 'Compact<u32>',
        delegate: 'MultiAddress',
      },
      cancel_approval: {
        class: 'Compact<u32>',
        instance: 'Compact<u32>',
        maybeCheckDelegate: 'Option<MultiAddress>',
      },
      force_asset_status: {
        class: 'Compact<u32>',
        owner: 'MultiAddress',
        issuer: 'MultiAddress',
        admin: 'MultiAddress',
        freezer: 'MultiAddress',
        freeHolding: 'bool',
        isFrozen: 'bool',
      },
      set_attribute: {
        class: 'Compact<u32>',
        maybeInstance: 'Option<u32>',
        key: 'Bytes',
        value: 'Bytes',
      },
      clear_attribute: {
        class: 'Compact<u32>',
        maybeInstance: 'Option<u32>',
        key: 'Bytes',
      },
      set_metadata: {
        class: 'Compact<u32>',
        instance: 'Compact<u32>',
        data: 'Bytes',
        isFrozen: 'bool',
      },
      clear_metadata: {
        class: 'Compact<u32>',
        instance: 'Compact<u32>',
      },
      set_class_metadata: {
        class: 'Compact<u32>',
        data: 'Bytes',
        isFrozen: 'bool',
      },
      clear_class_metadata: {
        class: 'Compact<u32>'
      }
    }
  },
  /**
   * Lookup337: pallet_uniques::types::DestroyWitness
   **/
  PalletUniquesDestroyWitness: {
    instances: 'Compact<u32>',
    instanceMetadatas: 'Compact<u32>',
    attributes: 'Compact<u32>'
  },
  /**
   * Lookup339: pallet_scheduler::Releases
   **/
  PalletSchedulerReleases: {
    _enum: ['V1', 'V2']
  },
  /**
   * Lookup340: pallet_scheduler::pallet::Error<T>
   **/
  PalletSchedulerError: {
    _enum: ['FailedToSchedule', 'NotFound', 'TargetBlockNumberInPast', 'RescheduleNoChange']
  },
  /**
   * Lookup347: sp_consensus_babe::BabeEpochConfiguration
   **/
  SpConsensusBabeBabeEpochConfiguration: {
    c: '(u64,u64)',
    allowedSlots: 'SpConsensusBabeAllowedSlots'
  },
  /**
   * Lookup348: pallet_babe::pallet::Error<T>
   **/
  PalletBabeError: {
    _enum: ['InvalidEquivocationProof', 'InvalidKeyOwnershipProof', 'DuplicateOffenceReport']
  },
  /**
   * Lookup350: pallet_balances::BalanceLock<Balance>
   **/
  PalletBalancesBalanceLock: {
    id: '[u8;8]',
    amount: 'u128',
    reasons: 'PalletBalancesReasons'
  },
  /**
   * Lookup351: pallet_balances::Reasons
   **/
  PalletBalancesReasons: {
    _enum: ['Fee', 'Misc', 'All']
  },
  /**
   * Lookup354: pallet_balances::ReserveData<ReserveIdentifier, Balance>
   **/
  PalletBalancesReserveData: {
    id: '[u8;8]',
    amount: 'u128'
  },
  /**
   * Lookup356: pallet_balances::Releases
   **/
  PalletBalancesReleases: {
    _enum: ['V1_0_0', 'V2_0_0']
  },
  /**
   * Lookup357: pallet_balances::pallet::Error<T, I>
   **/
  PalletBalancesError: {
    _enum: ['VestingBalance', 'LiquidityRestrictions', 'InsufficientBalance', 'ExistentialDeposit', 'KeepAlive', 'ExistingVestingSchedule', 'DeadAccount', 'TooManyReserves']
  },
  /**
   * Lookup359: pallet_transaction_payment::Releases
   **/
  PalletTransactionPaymentReleases: {
    _enum: ['V1Ancient', 'V2']
  },
  /**
   * Lookup361: frame_support::weights::WeightToFeeCoefficient<Balance>
   **/
  FrameSupportWeightsWeightToFeeCoefficient: {
    coeffInteger: 'u128',
    coeffFrac: 'Perbill',
    negative: 'bool',
    degree: 'u8'
  },
  /**
   * Lookup363: pallet_authorship::UncleEntryItem<BlockNumber, primitive_types::H256, sp_core::crypto::AccountId32>
   **/
  PalletAuthorshipUncleEntryItem: {
    _enum: {
      InclusionHeight: 'u32',
      Uncle: '(H256,Option<AccountId32>)'
    }
  },
  /**
   * Lookup364: pallet_authorship::pallet::Error<T>
   **/
  PalletAuthorshipError: {
    _enum: ['InvalidUncleParent', 'UnclesAlreadySet', 'TooManyUncles', 'GenesisUncle', 'TooHighUncle', 'UncleAlreadyIncluded', 'OldUncle']
  },
  /**
   * Lookup365: pallet_staking::StakingLedger<sp_core::crypto::AccountId32, Balance, primitive_types::H256>
   **/
  PalletStakingStakingLedger: {
    stash: 'AccountId32',
    total: 'Compact<u128>',
    active: 'Compact<u128>',
    unlocking: 'Vec<PalletStakingUnlockChunk>',
    claimedRewards: 'Vec<u32>',
    cmixId: 'Option<H256>'
  },
  /**
   * Lookup367: pallet_staking::UnlockChunk<Balance>
   **/
  PalletStakingUnlockChunk: {
    value: 'Compact<u128>',
    era: 'Compact<u32>'
  },
  /**
   * Lookup368: pallet_staking::Nominations<sp_core::crypto::AccountId32>
   **/
  PalletStakingNominations: {
    targets: 'Vec<AccountId32>',
    submittedIn: 'u32',
    suppressed: 'bool'
  },
  /**
   * Lookup369: pallet_staking::ActiveEraInfo
   **/
  PalletStakingActiveEraInfo: {
    index: 'u32',
    start: 'Option<u64>'
  },
  /**
   * Lookup371: pallet_staking::EraRewardPoints<sp_core::crypto::AccountId32>
   **/
  PalletStakingEraRewardPoints: {
    total: 'u32',
    individual: 'BTreeMap<AccountId32, u32>'
  },
  /**
   * Lookup373: pallet_staking::Forcing
   **/
  PalletStakingForcing: {
    _enum: ['NotForcing', 'ForceNew', 'ForceNone', 'ForceAlways']
  },
  /**
   * Lookup375: pallet_staking::UnappliedSlash<sp_core::crypto::AccountId32, Balance>
   **/
  PalletStakingUnappliedSlash: {
    validator: 'AccountId32',
    own: 'u128',
    others: 'Vec<(AccountId32,u128)>',
    reporters: 'Vec<AccountId32>',
    payout: 'u128'
  },
  /**
   * Lookup377: pallet_staking::slashing::SlashingSpans
   **/
  PalletStakingSlashingSlashingSpans: {
    spanIndex: 'u32',
    lastStart: 'u32',
    lastNonzeroSlash: 'u32',
    prior: 'Vec<u32>'
  },
  /**
   * Lookup378: pallet_staking::slashing::SpanRecord<Balance>
   **/
  PalletStakingSlashingSpanRecord: {
    slashed: 'u128',
    paidOut: 'u128'
  },
  /**
   * Lookup381: pallet_staking::Releases
   **/
  PalletStakingReleases: {
    _enum: ['V1_0_0Ancient', 'V2_0_0', 'V3_0_0', 'V4_0_0', 'V5_0_0', 'V6_0_0', 'V7_0_0', 'V7_5_0', 'V8_0_0']
  },
  /**
   * Lookup382: pallet_staking::pallet::pallet::Error<T>
   **/
  PalletStakingPalletError: {
    _enum: ['NotController', 'NotStash', 'AlreadyBonded', 'AlreadyPaired', 'EmptyTargets', 'DuplicateIndex', 'InvalidSlashIndex', 'InsufficientBond', 'NoMoreChunks', 'NoUnlockChunk', 'FundedTarget', 'InvalidEraToReward', 'InvalidNumberOfNominations', 'NotSortedAndUnique', 'AlreadyClaimed', 'IncorrectHistoryDepth', 'IncorrectSlashingSpans', 'BadState', 'TooManyTargets', 'BadTarget', 'CannotChillOther', 'TooManyNominators', 'TooManyValidators', 'ValidatorCmixIdNotUnique', 'ValidatorMustHaveCmixId', 'ValidatorCommissionTooLow', 'StashAlreadyHasCmixId', 'StashNoCmixId', 'StashValidating', 'StashActiveValidator', 'StashElectedValidator', 'ElectionOngoing']
  },
  /**
   * Lookup383: pallet_election_provider_multi_phase::Phase<Bn>
   **/
  PalletElectionProviderMultiPhasePhase: {
    _enum: {
      Off: 'Null',
      Signed: 'Null',
      Unsigned: '(bool,u32)',
      Emergency: 'Null'
    }
  },
  /**
   * Lookup385: pallet_election_provider_multi_phase::ReadySolution<sp_core::crypto::AccountId32>
   **/
  PalletElectionProviderMultiPhaseReadySolution: {
    supports: 'Vec<(AccountId32,SpNposElectionsSupport)>',
    score: '[u128;3]',
    compute: 'PalletElectionProviderMultiPhaseElectionCompute'
  },
  /**
   * Lookup386: pallet_election_provider_multi_phase::RoundSnapshot<sp_core::crypto::AccountId32>
   **/
  PalletElectionProviderMultiPhaseRoundSnapshot: {
    voters: 'Vec<(AccountId32,u64,Vec<AccountId32>)>',
    targets: 'Vec<AccountId32>'
  },
  /**
   * Lookup393: pallet_election_provider_multi_phase::signed::SignedSubmission<sp_core::crypto::AccountId32, Balance, runtime_common::NposSolution16>
   **/
  PalletElectionProviderMultiPhaseSignedSignedSubmission: {
    who: 'AccountId32',
    deposit: 'u128',
    rawSolution: 'PalletElectionProviderMultiPhaseRawSolution',
    reward: 'u128'
  },
  /**
   * Lookup394: pallet_election_provider_multi_phase::pallet::Error<T>
   **/
  PalletElectionProviderMultiPhaseError: {
    _enum: ['PreDispatchEarlySubmission', 'PreDispatchWrongWinnerCount', 'PreDispatchWeakSubmission', 'SignedQueueFull', 'SignedCannotPayDeposit', 'SignedInvalidWitness', 'SignedTooMuchWeight', 'OcwCallWrongEra', 'MissingSnapshotMetadata', 'InvalidSubmissionIndex', 'CallNotAllowed']
  },
  /**
   * Lookup395: sp_staking::offence::OffenceDetails<sp_core::crypto::AccountId32, Offender>
   **/
  SpStakingOffenceOffenceDetails: {
    offender: '(AccountId32,PalletStakingExposure)',
    reporters: 'Vec<AccountId32>'
  },
  /**
   * Lookup400: sp_core::crypto::KeyTypeId
   **/
  SpCoreCryptoKeyTypeId: '[u8;4]',
  /**
   * Lookup401: pallet_session::pallet::Error<T>
   **/
  PalletSessionError: {
    _enum: ['InvalidProof', 'NoAssociatedValidatorId', 'DuplicatedKey', 'NoKeys', 'NoAccount']
  },
  /**
   * Lookup402: pallet_grandpa::StoredState<N>
   **/
  PalletGrandpaStoredState: {
    _enum: {
      Live: 'Null',
      PendingPause: {
        scheduledAt: 'u32',
        delay: 'u32',
      },
      Paused: 'Null',
      PendingResume: {
        scheduledAt: 'u32',
        delay: 'u32'
      }
    }
  },
  /**
   * Lookup403: pallet_grandpa::StoredPendingChange<N, Limit>
   **/
  PalletGrandpaStoredPendingChange: {
    scheduledAt: 'u32',
    delay: 'u32',
    nextAuthorities: 'Vec<(SpFinalityGrandpaAppPublic,u64)>',
    forced: 'Option<u32>'
  },
  /**
   * Lookup405: pallet_grandpa::pallet::Error<T>
   **/
  PalletGrandpaError: {
    _enum: ['PauseFailed', 'ResumeFailed', 'ChangePending', 'TooSoon', 'InvalidKeyOwnershipProof', 'InvalidEquivocationProof', 'DuplicateOffenceReport']
  },
  /**
   * Lookup409: pallet_im_online::BoundedOpaqueNetworkState<PeerIdEncodingLimit, MultiAddrEncodingLimit, AddressesLimit>
   **/
  PalletImOnlineBoundedOpaqueNetworkState: {
    peerId: 'Bytes',
    externalAddresses: 'Vec<Bytes>'
  },
  /**
   * Lookup413: pallet_im_online::pallet::Error<T>
   **/
  PalletImOnlineError: {
    _enum: ['InvalidKey', 'DuplicatedHeartbeat']
  },
  /**
   * Lookup417: pallet_democracy::PreimageStatus<sp_core::crypto::AccountId32, Balance, BlockNumber>
   **/
  PalletDemocracyPreimageStatus: {
    _enum: {
      Missing: 'u32',
      Available: {
        data: 'Bytes',
        provider: 'AccountId32',
        deposit: 'u128',
        since: 'u32',
        expiry: 'Option<u32>'
      }
    }
  },
  /**
   * Lookup418: pallet_democracy::types::ReferendumInfo<BlockNumber, primitive_types::H256, Balance>
   **/
  PalletDemocracyReferendumInfo: {
    _enum: {
      Ongoing: 'PalletDemocracyReferendumStatus',
      Finished: {
        approved: 'bool',
        end: 'u32'
      }
    }
  },
  /**
   * Lookup419: pallet_democracy::types::ReferendumStatus<BlockNumber, primitive_types::H256, Balance>
   **/
  PalletDemocracyReferendumStatus: {
    end: 'u32',
    proposalHash: 'H256',
    threshold: 'PalletDemocracyVoteThreshold',
    delay: 'u32',
    tally: 'PalletDemocracyTally'
  },
  /**
   * Lookup420: pallet_democracy::types::Tally<Balance>
   **/
  PalletDemocracyTally: {
    ayes: 'u128',
    nays: 'u128',
    turnout: 'u128'
  },
  /**
   * Lookup421: pallet_democracy::vote::Voting<Balance, sp_core::crypto::AccountId32, BlockNumber>
   **/
  PalletDemocracyVoteVoting: {
    _enum: {
      Direct: {
        votes: 'Vec<(u32,PalletDemocracyVoteAccountVote)>',
        delegations: 'PalletDemocracyDelegations',
        prior: 'PalletDemocracyVotePriorLock',
      },
      Delegating: {
        balance: 'u128',
        target: 'AccountId32',
        conviction: 'PalletDemocracyConviction',
        delegations: 'PalletDemocracyDelegations',
        prior: 'PalletDemocracyVotePriorLock'
      }
    }
  },
  /**
   * Lookup424: pallet_democracy::types::Delegations<Balance>
   **/
  PalletDemocracyDelegations: {
    votes: 'u128',
    capital: 'u128'
  },
  /**
   * Lookup425: pallet_democracy::vote::PriorLock<BlockNumber, Balance>
   **/
  PalletDemocracyVotePriorLock: '(u32,u128)',
  /**
   * Lookup428: pallet_democracy::Releases
   **/
  PalletDemocracyReleases: {
    _enum: ['V1']
  },
  /**
   * Lookup429: pallet_democracy::pallet::Error<T>
   **/
  PalletDemocracyError: {
    _enum: ['ValueLow', 'ProposalMissing', 'AlreadyCanceled', 'DuplicateProposal', 'ProposalBlacklisted', 'NotSimpleMajority', 'InvalidHash', 'NoProposal', 'AlreadyVetoed', 'DuplicatePreimage', 'NotImminent', 'TooEarly', 'Imminent', 'PreimageMissing', 'ReferendumInvalid', 'PreimageInvalid', 'NoneWaiting', 'NotVoter', 'NoPermission', 'AlreadyDelegating', 'InsufficientFunds', 'NotDelegating', 'VotesExist', 'InstantNotAllowed', 'Nonsense', 'WrongUpperBound', 'MaxVotesReached', 'TooManyProposals']
  },
  /**
   * Lookup431: pallet_collective::Votes<sp_core::crypto::AccountId32, BlockNumber>
   **/
  PalletCollectiveVotes: {
    index: 'u32',
    threshold: 'u32',
    ayes: 'Vec<AccountId32>',
    nays: 'Vec<AccountId32>',
    end: 'u32'
  },
  /**
   * Lookup432: pallet_collective::pallet::Error<T, I>
   **/
  PalletCollectiveError: {
    _enum: ['NotMember', 'DuplicateProposal', 'ProposalMissing', 'WrongIndex', 'DuplicateVote', 'AlreadyInitialized', 'TooEarly', 'TooManyProposals', 'WrongProposalWeight', 'WrongProposalLength']
  },
  /**
   * Lookup436: pallet_elections_phragmen::SeatHolder<sp_core::crypto::AccountId32, Balance>
   **/
  PalletElectionsPhragmenSeatHolder: {
    who: 'AccountId32',
    stake: 'u128',
    deposit: 'u128'
  },
  /**
   * Lookup437: pallet_elections_phragmen::Voter<sp_core::crypto::AccountId32, Balance>
   **/
  PalletElectionsPhragmenVoter: {
    votes: 'Vec<AccountId32>',
    stake: 'u128',
    deposit: 'u128'
  },
  /**
   * Lookup438: pallet_elections_phragmen::pallet::Error<T>
   **/
  PalletElectionsPhragmenError: {
    _enum: ['UnableToVote', 'NoVotes', 'TooManyVotes', 'MaximumVotesExceeded', 'LowBalance', 'UnableToPayBond', 'MustBeVoter', 'ReportSelf', 'DuplicatedCandidate', 'MemberSubmit', 'RunnerUpSubmit', 'InsufficientCandidateFunds', 'NotMember', 'InvalidWitnessData', 'InvalidVoteCount', 'InvalidRenouncing', 'InvalidReplacement']
  },
  /**
   * Lookup439: pallet_membership::pallet::Error<T, I>
   **/
  PalletMembershipError: {
    _enum: ['AlreadyMember', 'NotMember']
  },
  /**
   * Lookup440: pallet_treasury::Proposal<sp_core::crypto::AccountId32, Balance>
   **/
  PalletTreasuryProposal: {
    proposer: 'AccountId32',
    value: 'u128',
    beneficiary: 'AccountId32',
    bond: 'u128'
  },
  /**
   * Lookup442: frame_support::PalletId
   **/
  FrameSupportPalletId: '[u8;8]',
  /**
   * Lookup443: pallet_treasury::pallet::Error<T, I>
   **/
  PalletTreasuryError: {
    _enum: ['InsufficientProposersBalance', 'InvalidIndex', 'TooManyApprovals']
  },
  /**
   * Lookup444: claims::Error<T>
   **/
  ClaimsError: {
    _enum: ['InvalidEthereumSignature', 'SignerHasNoClaim', 'SenderHasNoClaim', 'PotUnderflow', 'InvalidStatement', 'VestedBalanceExists']
  },
  /**
   * Lookup447: pallet_vesting::Releases
   **/
  PalletVestingReleases: {
    _enum: ['V0', 'V1']
  },
  /**
   * Lookup448: pallet_vesting::pallet::Error<T>
   **/
  PalletVestingError: {
    _enum: ['NotVesting', 'AtMaxVestingSchedules', 'AmountLow', 'ScheduleIndexOutOfBounds', 'InvalidScheduleParams']
  },
  /**
   * Lookup449: pallet_utility::pallet::Error<T>
   **/
  PalletUtilityError: {
    _enum: ['TooManyCalls']
  },
  /**
   * Lookup450: pallet_identity::types::Registration<Balance, MaxJudgements, MaxAdditionalFields>
   **/
  PalletIdentityRegistration: {
    judgements: 'Vec<(u32,PalletIdentityJudgement)>',
    deposit: 'u128',
    info: 'PalletIdentityIdentityInfo'
  },
  /**
   * Lookup458: pallet_identity::types::RegistrarInfo<Balance, sp_core::crypto::AccountId32>
   **/
  PalletIdentityRegistrarInfo: {
    account: 'AccountId32',
    fee: 'u128',
    fields: 'PalletIdentityBitFlags'
  },
  /**
   * Lookup460: pallet_identity::pallet::Error<T>
   **/
  PalletIdentityError: {
    _enum: ['TooManySubAccounts', 'NotFound', 'NotNamed', 'EmptyIndex', 'FeeChanged', 'NoIdentity', 'StickyJudgement', 'JudgementGiven', 'InvalidJudgement', 'InvalidIndex', 'InvalidTarget', 'TooManyFields', 'TooManyRegistrars', 'AlreadyClaimed', 'NotSub', 'NotOwned']
  },
  /**
   * Lookup463: pallet_proxy::ProxyDefinition<sp_core::crypto::AccountId32, xxnetwork_runtime::ProxyType, BlockNumber>
   **/
  PalletProxyProxyDefinition: {
    delegate: 'AccountId32',
    proxyType: 'XxnetworkRuntimeProxyType',
    delay: 'u32'
  },
  /**
   * Lookup467: pallet_proxy::Announcement<sp_core::crypto::AccountId32, primitive_types::H256, BlockNumber>
   **/
  PalletProxyAnnouncement: {
    real: 'AccountId32',
    callHash: 'H256',
    height: 'u32'
  },
  /**
   * Lookup469: pallet_proxy::pallet::Error<T>
   **/
  PalletProxyError: {
    _enum: ['TooMany', 'NotFound', 'NotProxy', 'Unproxyable', 'Duplicate', 'NoPermission', 'Unannounced', 'NoSelfProxy']
  },
  /**
   * Lookup470: pallet_bounties::Bounty<sp_core::crypto::AccountId32, Balance, BlockNumber>
   **/
  PalletBountiesBounty: {
    proposer: 'AccountId32',
    value: 'u128',
    fee: 'u128',
    curatorDeposit: 'u128',
    bond: 'u128',
    status: 'PalletBountiesBountyStatus'
  },
  /**
   * Lookup471: pallet_bounties::BountyStatus<sp_core::crypto::AccountId32, BlockNumber>
   **/
  PalletBountiesBountyStatus: {
    _enum: {
      Proposed: 'Null',
      Approved: 'Null',
      Funded: 'Null',
      CuratorProposed: {
        curator: 'AccountId32',
      },
      Active: {
        curator: 'AccountId32',
        updateDue: 'u32',
      },
      PendingPayout: {
        curator: 'AccountId32',
        beneficiary: 'AccountId32',
        unlockAt: 'u32'
      }
    }
  },
  /**
   * Lookup472: pallet_bounties::pallet::Error<T>
   **/
  PalletBountiesError: {
    _enum: ['InsufficientProposersBalance', 'InvalidIndex', 'ReasonTooBig', 'UnexpectedStatus', 'RequireCurator', 'InvalidValue', 'InvalidFee', 'PendingPayout', 'Premature']
  },
  /**
   * Lookup473: pallet_tips::OpenTip<sp_core::crypto::AccountId32, Balance, BlockNumber, primitive_types::H256>
   **/
  PalletTipsOpenTip: {
    reason: 'H256',
    who: 'AccountId32',
    finder: 'AccountId32',
    deposit: 'u128',
    closes: 'Option<u32>',
    tips: 'Vec<(AccountId32,u128)>',
    findersFee: 'bool'
  },
  /**
   * Lookup474: pallet_tips::pallet::Error<T>
   **/
  PalletTipsError: {
    _enum: ['ReasonTooBig', 'AlreadyKnown', 'UnknownTip', 'NotFinder', 'StillOpen', 'Premature']
  },
  /**
   * Lookup477: chainbridge::ProposalVotes<sp_core::crypto::AccountId32, BlockNumber>
   **/
  ChainbridgeProposalVotes: {
    votesFor: 'Vec<AccountId32>',
    votesAgainst: 'Vec<AccountId32>',
    status: 'ChainbridgeProposalStatus',
    expiry: 'u32'
  },
  /**
   * Lookup478: chainbridge::ProposalStatus
   **/
  ChainbridgeProposalStatus: {
    _enum: ['Initiated', 'Approved', 'Rejected']
  },
  /**
   * Lookup479: chainbridge::Error<T>
   **/
  ChainbridgeError: {
    _enum: ['ThresholdNotSet', 'InvalidChainId', 'InvalidThreshold', 'ChainNotWhitelisted', 'ChainAlreadyWhitelisted', 'ResourceDoesNotExist', 'RelayerAlreadyExists', 'RelayerInvalid', 'MustBeRelayer', 'RelayerAlreadyVoted', 'ProposalAlreadyExists', 'ProposalDoesNotExist', 'ProposalNotComplete', 'ProposalAlreadyComplete', 'ProposalExpired']
  },
  /**
   * Lookup480: xx_cmix::Error<T>
   **/
  XxCmixError: {
    _enum: ['AdminPermissionExpired', 'MustBeScheduling']
  },
  /**
   * Lookup481: xx_team_custody::custody::CustodyInfo<sp_core::crypto::AccountId32, Balance>
   **/
  XxTeamCustodyCustodyCustodyInfo: {
    allocation: 'Compact<u128>',
    vested: 'Compact<u128>',
    custody: 'AccountId32',
    reserve: 'AccountId32'
  },
  /**
   * Lookup482: xx_team_custody::Error<T>
   **/
  XxTeamCustodyError: {
    _enum: ['InvalidTeamMember', 'InvalidCustodyAccount', 'MustBeCustodian', 'PayoutNotAvailable', 'PayoutFailedInsufficientFunds', 'CustodyPeriodEnded', 'GovernanceCustodyActive', 'GovernanceCustodyPeriodEnded', 'TeamMemberExists']
  },
  /**
   * Lookup483: xx_betanet_rewards::UserInfo<Balance>
   **/
  XxBetanetRewardsUserInfo: {
    principal: 'u128',
    reward: 'u128',
    option: 'XxBetanetRewardsRewardOption'
  },
  /**
   * Lookup484: xx_betanet_rewards::Error<T>
   **/
  XxBetanetRewardsError: {
    _enum: ['NoRewards', 'EnactmentBlockHasPassed']
  },
  /**
   * Lookup486: pallet_multisig::Multisig<BlockNumber, Balance, sp_core::crypto::AccountId32>
   **/
  PalletMultisigMultisig: {
    when: 'PalletMultisigTimepoint',
    deposit: 'u128',
    depositor: 'AccountId32',
    approvals: 'Vec<AccountId32>'
  },
  /**
   * Lookup488: pallet_multisig::pallet::Error<T>
   **/
  PalletMultisigError: {
    _enum: ['MinimumThreshold', 'AlreadyApproved', 'NoApprovalsNeeded', 'TooFewSignatories', 'TooManySignatories', 'SignatoriesOutOfOrder', 'SenderInSignatories', 'NotFound', 'NotOwner', 'NoTimepoint', 'WrongTimepoint', 'UnexpectedTimepoint', 'MaxWeightTooLow', 'AlreadyStored']
  },
  /**
   * Lookup489: pallet_recovery::RecoveryConfig<BlockNumber, Balance, sp_core::crypto::AccountId32>
   **/
  PalletRecoveryRecoveryConfig: {
    delayPeriod: 'u32',
    deposit: 'u128',
    friends: 'Vec<AccountId32>',
    threshold: 'u16'
  },
  /**
   * Lookup491: pallet_recovery::ActiveRecovery<BlockNumber, Balance, sp_core::crypto::AccountId32>
   **/
  PalletRecoveryActiveRecovery: {
    created: 'u32',
    deposit: 'u128',
    friends: 'Vec<AccountId32>'
  },
  /**
   * Lookup492: pallet_recovery::pallet::Error<T>
   **/
  PalletRecoveryError: {
    _enum: ['NotAllowed', 'ZeroThreshold', 'NotEnoughFriends', 'MaxFriends', 'NotSorted', 'NotRecoverable', 'AlreadyRecoverable', 'AlreadyStarted', 'NotStarted', 'NotFriend', 'DelayPeriod', 'AlreadyVouched', 'Threshold', 'StillActive', 'AlreadyProxy', 'BadState']
  },
  /**
   * Lookup493: pallet_assets::types::AssetDetails<Balance, sp_core::crypto::AccountId32, DepositBalance>
   **/
  PalletAssetsAssetDetails: {
    owner: 'AccountId32',
    issuer: 'AccountId32',
    admin: 'AccountId32',
    freezer: 'AccountId32',
    supply: 'u64',
    deposit: 'u128',
    minBalance: 'u64',
    isSufficient: 'bool',
    accounts: 'u32',
    sufficients: 'u32',
    approvals: 'u32',
    isFrozen: 'bool'
  },
  /**
   * Lookup494: pallet_assets::types::AssetBalance<Balance, Extra>
   **/
  PalletAssetsAssetBalance: {
    balance: 'u64',
    isFrozen: 'bool',
    sufficient: 'bool',
    extra: 'Null'
  },
  /**
   * Lookup496: pallet_assets::types::Approval<Balance, DepositBalance>
   **/
  PalletAssetsApproval: {
    amount: 'u64',
    deposit: 'u128'
  },
  /**
   * Lookup497: pallet_assets::types::AssetMetadata<DepositBalance, frame_support::storage::bounded_vec::BoundedVec<T, S>>
   **/
  PalletAssetsAssetMetadata: {
    deposit: 'u128',
    name: 'Bytes',
    symbol: 'Bytes',
    decimals: 'u8',
    isFrozen: 'bool'
  },
  /**
   * Lookup498: pallet_assets::pallet::Error<T, I>
   **/
  PalletAssetsError: {
    _enum: ['BalanceLow', 'BalanceZero', 'NoPermission', 'Unknown', 'Frozen', 'InUse', 'BadWitness', 'MinBalanceZero', 'NoProvider', 'BadMetadata', 'Unapproved', 'WouldDie']
  },
  /**
   * Lookup499: pallet_uniques::types::ClassDetails<sp_core::crypto::AccountId32, DepositBalance>
   **/
  PalletUniquesClassDetails: {
    owner: 'AccountId32',
    issuer: 'AccountId32',
    admin: 'AccountId32',
    freezer: 'AccountId32',
    totalDeposit: 'u128',
    freeHolding: 'bool',
    instances: 'u32',
    instanceMetadatas: 'u32',
    attributes: 'u32',
    isFrozen: 'bool'
  },
  /**
   * Lookup501: pallet_uniques::types::InstanceDetails<sp_core::crypto::AccountId32, DepositBalance>
   **/
  PalletUniquesInstanceDetails: {
    owner: 'AccountId32',
    approved: 'Option<AccountId32>',
    isFrozen: 'bool',
    deposit: 'u128'
  },
  /**
   * Lookup502: pallet_uniques::types::ClassMetadata<DepositBalance, StringLimit>
   **/
  PalletUniquesClassMetadata: {
    deposit: 'u128',
    data: 'Bytes',
    isFrozen: 'bool'
  },
  /**
   * Lookup503: pallet_uniques::types::InstanceMetadata<DepositBalance, StringLimit>
   **/
  PalletUniquesInstanceMetadata: {
    deposit: 'u128',
    data: 'Bytes',
    isFrozen: 'bool'
  },
  /**
   * Lookup506: pallet_uniques::pallet::Error<T, I>
   **/
  PalletUniquesError: {
    _enum: ['NoPermission', 'Unknown', 'AlreadyExists', 'WrongOwner', 'BadWitness', 'InUse', 'Frozen', 'WrongDelegate', 'NoDelegate', 'Unapproved']
  },
  /**
   * Lookup508: sp_runtime::MultiSignature
   **/
  SpRuntimeMultiSignature: {
    _enum: {
      Ed25519: 'SpCoreEd25519Signature',
      Sr25519: 'SpCoreSr25519Signature',
      Ecdsa: 'SpCoreEcdsaSignature'
    }
  },
  /**
   * Lookup509: sp_core::ecdsa::Signature
   **/
  SpCoreEcdsaSignature: '[u8;65]',
  /**
   * Lookup511: frame_system::extensions::check_spec_version::CheckSpecVersion<T>
   **/
  FrameSystemExtensionsCheckSpecVersion: 'Null',
  /**
   * Lookup512: frame_system::extensions::check_tx_version::CheckTxVersion<T>
   **/
  FrameSystemExtensionsCheckTxVersion: 'Null',
  /**
   * Lookup513: frame_system::extensions::check_genesis::CheckGenesis<T>
   **/
  FrameSystemExtensionsCheckGenesis: 'Null',
  /**
   * Lookup516: frame_system::extensions::check_nonce::CheckNonce<T>
   **/
  FrameSystemExtensionsCheckNonce: 'Compact<u32>',
  /**
   * Lookup517: frame_system::extensions::check_weight::CheckWeight<T>
   **/
  FrameSystemExtensionsCheckWeight: 'Null',
  /**
   * Lookup518: pallet_transaction_payment::ChargeTransactionPayment<T>
   **/
  PalletTransactionPaymentChargeTransactionPayment: 'Compact<u128>',
  /**
   * Lookup519: claims::PrevalidateAttests<T>
   **/
  ClaimsPrevalidateAttests: 'Null',
  /**
   * Lookup520: xxnetwork_runtime::Runtime
   **/
  XxnetworkRuntimeRuntime: 'Null'
};
