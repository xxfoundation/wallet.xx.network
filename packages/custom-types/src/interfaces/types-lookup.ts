// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/types/lookup';

import type { Data } from '@polkadot/types';
import type { BTreeMap, Bytes, Compact, Enum, Null, Option, Result, Set, Struct, Text, U256, U8aFixed, Vec, WrapperKeepOpaque, bool, u128, u16, u32, u64, u8 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { Vote } from '@polkadot/types/interfaces/elections';
import type { OpaqueMultiaddr, OpaquePeerId } from '@polkadot/types/interfaces/imOnline';
import type { AccountId32, Call, H256, MultiAddress, PerU16, Perbill, Percent, Permill } from '@polkadot/types/interfaces/runtime';
import type { Event } from '@polkadot/types/interfaces/system';

declare module '@polkadot/types/lookup' {
  /** @name FrameSystemAccountInfo (3) */
  interface FrameSystemAccountInfo extends Struct {
    readonly nonce: u32;
    readonly consumers: u32;
    readonly providers: u32;
    readonly sufficients: u32;
    readonly data: PalletBalancesAccountData;
  }

  /** @name PalletBalancesAccountData (5) */
  interface PalletBalancesAccountData extends Struct {
    readonly free: u128;
    readonly reserved: u128;
    readonly miscFrozen: u128;
    readonly feeFrozen: u128;
  }

  /** @name FrameSupportWeightsPerDispatchClassU64 (7) */
  interface FrameSupportWeightsPerDispatchClassU64 extends Struct {
    readonly normal: u64;
    readonly operational: u64;
    readonly mandatory: u64;
  }

  /** @name SpRuntimeDigest (11) */
  interface SpRuntimeDigest extends Struct {
    readonly logs: Vec<SpRuntimeDigestDigestItem>;
  }

  /** @name SpRuntimeDigestDigestItem (13) */
  interface SpRuntimeDigestDigestItem extends Enum {
    readonly isOther: boolean;
    readonly asOther: Bytes;
    readonly isConsensus: boolean;
    readonly asConsensus: ITuple<[U8aFixed, Bytes]>;
    readonly isSeal: boolean;
    readonly asSeal: ITuple<[U8aFixed, Bytes]>;
    readonly isPreRuntime: boolean;
    readonly asPreRuntime: ITuple<[U8aFixed, Bytes]>;
    readonly isRuntimeEnvironmentUpdated: boolean;
    readonly type: 'Other' | 'Consensus' | 'Seal' | 'PreRuntime' | 'RuntimeEnvironmentUpdated';
  }

  /** @name FrameSystemEventRecord (16) */
  interface FrameSystemEventRecord extends Struct {
    readonly phase: FrameSystemPhase;
    readonly event: Event;
    readonly topics: Vec<H256>;
  }

  /** @name FrameSystemEvent (18) */
  interface FrameSystemEvent extends Enum {
    readonly isExtrinsicSuccess: boolean;
    readonly asExtrinsicSuccess: FrameSupportWeightsDispatchInfo;
    readonly isExtrinsicFailed: boolean;
    readonly asExtrinsicFailed: ITuple<[SpRuntimeDispatchError, FrameSupportWeightsDispatchInfo]>;
    readonly isCodeUpdated: boolean;
    readonly isNewAccount: boolean;
    readonly asNewAccount: AccountId32;
    readonly isKilledAccount: boolean;
    readonly asKilledAccount: AccountId32;
    readonly isRemarked: boolean;
    readonly asRemarked: ITuple<[AccountId32, H256]>;
    readonly type: 'ExtrinsicSuccess' | 'ExtrinsicFailed' | 'CodeUpdated' | 'NewAccount' | 'KilledAccount' | 'Remarked';
  }

  /** @name FrameSupportWeightsDispatchInfo (19) */
  interface FrameSupportWeightsDispatchInfo extends Struct {
    readonly weight: u64;
    readonly class: FrameSupportWeightsDispatchClass;
    readonly paysFee: FrameSupportWeightsPays;
  }

  /** @name FrameSupportWeightsDispatchClass (20) */
  interface FrameSupportWeightsDispatchClass extends Enum {
    readonly isNormal: boolean;
    readonly isOperational: boolean;
    readonly isMandatory: boolean;
    readonly type: 'Normal' | 'Operational' | 'Mandatory';
  }

  /** @name FrameSupportWeightsPays (21) */
  interface FrameSupportWeightsPays extends Enum {
    readonly isYes: boolean;
    readonly isNo: boolean;
    readonly type: 'Yes' | 'No';
  }

  /** @name SpRuntimeDispatchError (22) */
  interface SpRuntimeDispatchError extends Enum {
    readonly isOther: boolean;
    readonly isCannotLookup: boolean;
    readonly isBadOrigin: boolean;
    readonly isModule: boolean;
    readonly asModule: {
      readonly index: u8;
      readonly error: u8;
    } & Struct;
    readonly isConsumerRemaining: boolean;
    readonly isNoProviders: boolean;
    readonly isToken: boolean;
    readonly asToken: SpRuntimeTokenError;
    readonly isArithmetic: boolean;
    readonly asArithmetic: SpRuntimeArithmeticError;
    readonly type: 'Other' | 'CannotLookup' | 'BadOrigin' | 'Module' | 'ConsumerRemaining' | 'NoProviders' | 'Token' | 'Arithmetic';
  }

  /** @name SpRuntimeTokenError (23) */
  interface SpRuntimeTokenError extends Enum {
    readonly isNoFunds: boolean;
    readonly isWouldDie: boolean;
    readonly isBelowMinimum: boolean;
    readonly isCannotCreate: boolean;
    readonly isUnknownAsset: boolean;
    readonly isFrozen: boolean;
    readonly isUnsupported: boolean;
    readonly type: 'NoFunds' | 'WouldDie' | 'BelowMinimum' | 'CannotCreate' | 'UnknownAsset' | 'Frozen' | 'Unsupported';
  }

  /** @name SpRuntimeArithmeticError (24) */
  interface SpRuntimeArithmeticError extends Enum {
    readonly isUnderflow: boolean;
    readonly isOverflow: boolean;
    readonly isDivisionByZero: boolean;
    readonly type: 'Underflow' | 'Overflow' | 'DivisionByZero';
  }

  /** @name PalletSchedulerEvent (25) */
  interface PalletSchedulerEvent extends Enum {
    readonly isScheduled: boolean;
    readonly asScheduled: ITuple<[u32, u32]>;
    readonly isCanceled: boolean;
    readonly asCanceled: ITuple<[u32, u32]>;
    readonly isDispatched: boolean;
    readonly asDispatched: ITuple<[ITuple<[u32, u32]>, Option<Bytes>, Result<Null, SpRuntimeDispatchError>]>;
    readonly type: 'Scheduled' | 'Canceled' | 'Dispatched';
  }

  /** @name PalletBalancesEvent (30) */
  interface PalletBalancesEvent extends Enum {
    readonly isEndowed: boolean;
    readonly asEndowed: ITuple<[AccountId32, u128]>;
    readonly isDustLost: boolean;
    readonly asDustLost: ITuple<[AccountId32, u128]>;
    readonly isTransfer: boolean;
    readonly asTransfer: ITuple<[AccountId32, AccountId32, u128]>;
    readonly isBalanceSet: boolean;
    readonly asBalanceSet: ITuple<[AccountId32, u128, u128]>;
    readonly isReserved: boolean;
    readonly asReserved: ITuple<[AccountId32, u128]>;
    readonly isUnreserved: boolean;
    readonly asUnreserved: ITuple<[AccountId32, u128]>;
    readonly isReserveRepatriated: boolean;
    readonly asReserveRepatriated: ITuple<[AccountId32, AccountId32, u128, FrameSupportTokensMiscBalanceStatus]>;
    readonly isDeposit: boolean;
    readonly asDeposit: ITuple<[AccountId32, u128]>;
    readonly isWithdraw: boolean;
    readonly asWithdraw: ITuple<[AccountId32, u128]>;
    readonly isSlashed: boolean;
    readonly asSlashed: ITuple<[AccountId32, u128]>;
    readonly type: 'Endowed' | 'DustLost' | 'Transfer' | 'BalanceSet' | 'Reserved' | 'Unreserved' | 'ReserveRepatriated' | 'Deposit' | 'Withdraw' | 'Slashed';
  }

  /** @name FrameSupportTokensMiscBalanceStatus (31) */
  interface FrameSupportTokensMiscBalanceStatus extends Enum {
    readonly isFree: boolean;
    readonly isReserved: boolean;
    readonly type: 'Free' | 'Reserved';
  }

  /** @name PalletStakingPalletEvent (32) */
  interface PalletStakingPalletEvent extends Enum {
    readonly isEraPaid: boolean;
    readonly asEraPaid: ITuple<[u32, u128, u128]>;
    readonly isRewarded: boolean;
    readonly asRewarded: ITuple<[AccountId32, u128]>;
    readonly isSlashed: boolean;
    readonly asSlashed: ITuple<[AccountId32, u128]>;
    readonly isOldSlashingReportDiscarded: boolean;
    readonly asOldSlashingReportDiscarded: u32;
    readonly isStakersElected: boolean;
    readonly isBonded: boolean;
    readonly asBonded: ITuple<[AccountId32, u128]>;
    readonly isUnbonded: boolean;
    readonly asUnbonded: ITuple<[AccountId32, u128]>;
    readonly isWithdrawn: boolean;
    readonly asWithdrawn: ITuple<[AccountId32, u128]>;
    readonly isKicked: boolean;
    readonly asKicked: ITuple<[AccountId32, AccountId32]>;
    readonly isStakingElectionFailed: boolean;
    readonly isChilled: boolean;
    readonly asChilled: AccountId32;
    readonly isPayoutStarted: boolean;
    readonly asPayoutStarted: ITuple<[u32, AccountId32]>;
    readonly type: 'EraPaid' | 'Rewarded' | 'Slashed' | 'OldSlashingReportDiscarded' | 'StakersElected' | 'Bonded' | 'Unbonded' | 'Withdrawn' | 'Kicked' | 'StakingElectionFailed' | 'Chilled' | 'PayoutStarted';
  }

  /** @name PalletElectionProviderMultiPhaseEvent (33) */
  interface PalletElectionProviderMultiPhaseEvent extends Enum {
    readonly isSolutionStored: boolean;
    readonly asSolutionStored: ITuple<[PalletElectionProviderMultiPhaseElectionCompute, bool]>;
    readonly isElectionFinalized: boolean;
    readonly asElectionFinalized: Option<PalletElectionProviderMultiPhaseElectionCompute>;
    readonly isRewarded: boolean;
    readonly asRewarded: ITuple<[AccountId32, u128]>;
    readonly isSlashed: boolean;
    readonly asSlashed: ITuple<[AccountId32, u128]>;
    readonly isSignedPhaseStarted: boolean;
    readonly asSignedPhaseStarted: u32;
    readonly isUnsignedPhaseStarted: boolean;
    readonly asUnsignedPhaseStarted: u32;
    readonly type: 'SolutionStored' | 'ElectionFinalized' | 'Rewarded' | 'Slashed' | 'SignedPhaseStarted' | 'UnsignedPhaseStarted';
  }

  /** @name PalletElectionProviderMultiPhaseElectionCompute (34) */
  interface PalletElectionProviderMultiPhaseElectionCompute extends Enum {
    readonly isOnChain: boolean;
    readonly isSigned: boolean;
    readonly isUnsigned: boolean;
    readonly isFallback: boolean;
    readonly isEmergency: boolean;
    readonly type: 'OnChain' | 'Signed' | 'Unsigned' | 'Fallback' | 'Emergency';
  }

  /** @name PalletOffencesEvent (37) */
  interface PalletOffencesEvent extends Enum {
    readonly isOffence: boolean;
    readonly asOffence: ITuple<[U8aFixed, Bytes]>;
    readonly type: 'Offence';
  }

  /** @name PalletSessionEvent (39) */
  interface PalletSessionEvent extends Enum {
    readonly isNewSession: boolean;
    readonly asNewSession: u32;
    readonly type: 'NewSession';
  }

  /** @name PalletGrandpaEvent (40) */
  interface PalletGrandpaEvent extends Enum {
    readonly isNewAuthorities: boolean;
    readonly asNewAuthorities: Vec<ITuple<[SpFinalityGrandpaAppPublic, u64]>>;
    readonly isPaused: boolean;
    readonly isResumed: boolean;
    readonly type: 'NewAuthorities' | 'Paused' | 'Resumed';
  }

  /** @name SpFinalityGrandpaAppPublic (43) */
  interface SpFinalityGrandpaAppPublic extends SpCoreEd25519Public {}

  /** @name SpCoreEd25519Public (44) */
  interface SpCoreEd25519Public extends U8aFixed {}

  /** @name PalletImOnlineEvent (45) */
  interface PalletImOnlineEvent extends Enum {
    readonly isHeartbeatReceived: boolean;
    readonly asHeartbeatReceived: PalletImOnlineSr25519AppSr25519Public;
    readonly isAllGood: boolean;
    readonly isSomeOffline: boolean;
    readonly asSomeOffline: Vec<ITuple<[AccountId32, PalletStakingExposure]>>;
    readonly type: 'HeartbeatReceived' | 'AllGood' | 'SomeOffline';
  }

  /** @name PalletImOnlineSr25519AppSr25519Public (46) */
  interface PalletImOnlineSr25519AppSr25519Public extends SpCoreSr25519Public {}

  /** @name SpCoreSr25519Public (47) */
  interface SpCoreSr25519Public extends U8aFixed {}

  /** @name PalletStakingExposure (50) */
  interface PalletStakingExposure extends Struct {
    readonly total: Compact<u128>;
    readonly custody: Compact<u128>;
    readonly own: Compact<u128>;
    readonly others: Vec<PalletStakingIndividualExposure>;
  }

  /** @name PalletStakingIndividualExposure (53) */
  interface PalletStakingIndividualExposure extends Struct {
    readonly who: AccountId32;
    readonly value: Compact<u128>;
  }

  /** @name PalletDemocracyEvent (54) */
  interface PalletDemocracyEvent extends Enum {
    readonly isProposed: boolean;
    readonly asProposed: ITuple<[u32, u128]>;
    readonly isTabled: boolean;
    readonly asTabled: ITuple<[u32, u128, Vec<AccountId32>]>;
    readonly isExternalTabled: boolean;
    readonly isStarted: boolean;
    readonly asStarted: ITuple<[u32, PalletDemocracyVoteThreshold]>;
    readonly isPassed: boolean;
    readonly asPassed: u32;
    readonly isNotPassed: boolean;
    readonly asNotPassed: u32;
    readonly isCancelled: boolean;
    readonly asCancelled: u32;
    readonly isExecuted: boolean;
    readonly asExecuted: ITuple<[u32, Result<Null, SpRuntimeDispatchError>]>;
    readonly isDelegated: boolean;
    readonly asDelegated: ITuple<[AccountId32, AccountId32]>;
    readonly isUndelegated: boolean;
    readonly asUndelegated: AccountId32;
    readonly isVetoed: boolean;
    readonly asVetoed: ITuple<[AccountId32, H256, u32]>;
    readonly isPreimageNoted: boolean;
    readonly asPreimageNoted: ITuple<[H256, AccountId32, u128]>;
    readonly isPreimageUsed: boolean;
    readonly asPreimageUsed: ITuple<[H256, AccountId32, u128]>;
    readonly isPreimageInvalid: boolean;
    readonly asPreimageInvalid: ITuple<[H256, u32]>;
    readonly isPreimageMissing: boolean;
    readonly asPreimageMissing: ITuple<[H256, u32]>;
    readonly isPreimageReaped: boolean;
    readonly asPreimageReaped: ITuple<[H256, AccountId32, u128, AccountId32]>;
    readonly isBlacklisted: boolean;
    readonly asBlacklisted: H256;
    readonly type: 'Proposed' | 'Tabled' | 'ExternalTabled' | 'Started' | 'Passed' | 'NotPassed' | 'Cancelled' | 'Executed' | 'Delegated' | 'Undelegated' | 'Vetoed' | 'PreimageNoted' | 'PreimageUsed' | 'PreimageInvalid' | 'PreimageMissing' | 'PreimageReaped' | 'Blacklisted';
  }

  /** @name PalletDemocracyVoteThreshold (56) */
  interface PalletDemocracyVoteThreshold extends Enum {
    readonly isSuperMajorityApprove: boolean;
    readonly isSuperMajorityAgainst: boolean;
    readonly isSimpleMajority: boolean;
    readonly type: 'SuperMajorityApprove' | 'SuperMajorityAgainst' | 'SimpleMajority';
  }

  /** @name PalletCollectiveEvent (57) */
  interface PalletCollectiveEvent extends Enum {
    readonly isProposed: boolean;
    readonly asProposed: ITuple<[AccountId32, u32, H256, u32]>;
    readonly isVoted: boolean;
    readonly asVoted: ITuple<[AccountId32, H256, bool, u32, u32]>;
    readonly isApproved: boolean;
    readonly asApproved: H256;
    readonly isDisapproved: boolean;
    readonly asDisapproved: H256;
    readonly isExecuted: boolean;
    readonly asExecuted: ITuple<[H256, Result<Null, SpRuntimeDispatchError>]>;
    readonly isMemberExecuted: boolean;
    readonly asMemberExecuted: ITuple<[H256, Result<Null, SpRuntimeDispatchError>]>;
    readonly isClosed: boolean;
    readonly asClosed: ITuple<[H256, u32, u32]>;
    readonly type: 'Proposed' | 'Voted' | 'Approved' | 'Disapproved' | 'Executed' | 'MemberExecuted' | 'Closed';
  }

  /** @name PalletElectionsPhragmenEvent (59) */
  interface PalletElectionsPhragmenEvent extends Enum {
    readonly isNewTerm: boolean;
    readonly asNewTerm: Vec<ITuple<[AccountId32, u128]>>;
    readonly isEmptyTerm: boolean;
    readonly isElectionError: boolean;
    readonly isMemberKicked: boolean;
    readonly asMemberKicked: AccountId32;
    readonly isRenounced: boolean;
    readonly asRenounced: AccountId32;
    readonly isCandidateSlashed: boolean;
    readonly asCandidateSlashed: ITuple<[AccountId32, u128]>;
    readonly isSeatHolderSlashed: boolean;
    readonly asSeatHolderSlashed: ITuple<[AccountId32, u128]>;
    readonly type: 'NewTerm' | 'EmptyTerm' | 'ElectionError' | 'MemberKicked' | 'Renounced' | 'CandidateSlashed' | 'SeatHolderSlashed';
  }

  /** @name PalletMembershipEvent (62) */
  interface PalletMembershipEvent extends Enum {
    readonly isMemberAdded: boolean;
    readonly isMemberRemoved: boolean;
    readonly isMembersSwapped: boolean;
    readonly isMembersReset: boolean;
    readonly isKeyChanged: boolean;
    readonly isDummy: boolean;
    readonly type: 'MemberAdded' | 'MemberRemoved' | 'MembersSwapped' | 'MembersReset' | 'KeyChanged' | 'Dummy';
  }

  /** @name PalletTreasuryEvent (63) */
  interface PalletTreasuryEvent extends Enum {
    readonly isProposed: boolean;
    readonly asProposed: u32;
    readonly isSpending: boolean;
    readonly asSpending: u128;
    readonly isAwarded: boolean;
    readonly asAwarded: ITuple<[u32, u128, AccountId32]>;
    readonly isRejected: boolean;
    readonly asRejected: ITuple<[u32, u128]>;
    readonly isBurnt: boolean;
    readonly asBurnt: u128;
    readonly isRollover: boolean;
    readonly asRollover: u128;
    readonly isDeposit: boolean;
    readonly asDeposit: u128;
    readonly type: 'Proposed' | 'Spending' | 'Awarded' | 'Rejected' | 'Burnt' | 'Rollover' | 'Deposit';
  }

  /** @name ClaimsRawEvent (64) */
  interface ClaimsRawEvent extends Enum {
    readonly isClaimed: boolean;
    readonly asClaimed: ITuple<[AccountId32, ClaimsEthereumAddress, u128, u128]>;
    readonly type: 'Claimed';
  }

  /** @name ClaimsEthereumAddress (65) */
  interface ClaimsEthereumAddress extends U8aFixed {}

  /** @name PalletVestingEvent (67) */
  interface PalletVestingEvent extends Enum {
    readonly isVestingUpdated: boolean;
    readonly asVestingUpdated: ITuple<[AccountId32, u128]>;
    readonly isVestingCompleted: boolean;
    readonly asVestingCompleted: AccountId32;
    readonly type: 'VestingUpdated' | 'VestingCompleted';
  }

  /** @name PalletUtilityEvent (68) */
  interface PalletUtilityEvent extends Enum {
    readonly isBatchInterrupted: boolean;
    readonly asBatchInterrupted: ITuple<[u32, SpRuntimeDispatchError]>;
    readonly isBatchCompleted: boolean;
    readonly isItemCompleted: boolean;
    readonly isDispatchedAs: boolean;
    readonly asDispatchedAs: Result<Null, SpRuntimeDispatchError>;
    readonly type: 'BatchInterrupted' | 'BatchCompleted' | 'ItemCompleted' | 'DispatchedAs';
  }

  /** @name PalletIdentityEvent (69) */
  interface PalletIdentityEvent extends Enum {
    readonly isIdentitySet: boolean;
    readonly asIdentitySet: AccountId32;
    readonly isIdentityCleared: boolean;
    readonly asIdentityCleared: ITuple<[AccountId32, u128]>;
    readonly isIdentityKilled: boolean;
    readonly asIdentityKilled: ITuple<[AccountId32, u128]>;
    readonly isJudgementRequested: boolean;
    readonly asJudgementRequested: ITuple<[AccountId32, u32]>;
    readonly isJudgementUnrequested: boolean;
    readonly asJudgementUnrequested: ITuple<[AccountId32, u32]>;
    readonly isJudgementGiven: boolean;
    readonly asJudgementGiven: ITuple<[AccountId32, u32]>;
    readonly isRegistrarAdded: boolean;
    readonly asRegistrarAdded: u32;
    readonly isSubIdentityAdded: boolean;
    readonly asSubIdentityAdded: ITuple<[AccountId32, AccountId32, u128]>;
    readonly isSubIdentityRemoved: boolean;
    readonly asSubIdentityRemoved: ITuple<[AccountId32, AccountId32, u128]>;
    readonly isSubIdentityRevoked: boolean;
    readonly asSubIdentityRevoked: ITuple<[AccountId32, AccountId32, u128]>;
    readonly type: 'IdentitySet' | 'IdentityCleared' | 'IdentityKilled' | 'JudgementRequested' | 'JudgementUnrequested' | 'JudgementGiven' | 'RegistrarAdded' | 'SubIdentityAdded' | 'SubIdentityRemoved' | 'SubIdentityRevoked';
  }

  /** @name PalletProxyEvent (70) */
  interface PalletProxyEvent extends Enum {
    readonly isProxyExecuted: boolean;
    readonly asProxyExecuted: Result<Null, SpRuntimeDispatchError>;
    readonly isAnonymousCreated: boolean;
    readonly asAnonymousCreated: ITuple<[AccountId32, AccountId32, XxnetworkRuntimeProxyType, u16]>;
    readonly isAnnounced: boolean;
    readonly asAnnounced: ITuple<[AccountId32, AccountId32, H256]>;
    readonly isProxyAdded: boolean;
    readonly asProxyAdded: ITuple<[AccountId32, AccountId32, XxnetworkRuntimeProxyType, u32]>;
    readonly type: 'ProxyExecuted' | 'AnonymousCreated' | 'Announced' | 'ProxyAdded';
  }

  /** @name XxnetworkRuntimeProxyType (71) */
  interface XxnetworkRuntimeProxyType extends Enum {
    readonly isAny: boolean;
    readonly isNonTransfer: boolean;
    readonly isGovernance: boolean;
    readonly isStaking: boolean;
    readonly isVoting: boolean;
    readonly type: 'Any' | 'NonTransfer' | 'Governance' | 'Staking' | 'Voting';
  }

  /** @name PalletBountiesEvent (73) */
  interface PalletBountiesEvent extends Enum {
    readonly isBountyProposed: boolean;
    readonly asBountyProposed: u32;
    readonly isBountyRejected: boolean;
    readonly asBountyRejected: ITuple<[u32, u128]>;
    readonly isBountyBecameActive: boolean;
    readonly asBountyBecameActive: u32;
    readonly isBountyAwarded: boolean;
    readonly asBountyAwarded: ITuple<[u32, AccountId32]>;
    readonly isBountyClaimed: boolean;
    readonly asBountyClaimed: ITuple<[u32, u128, AccountId32]>;
    readonly isBountyCanceled: boolean;
    readonly asBountyCanceled: u32;
    readonly isBountyExtended: boolean;
    readonly asBountyExtended: u32;
    readonly type: 'BountyProposed' | 'BountyRejected' | 'BountyBecameActive' | 'BountyAwarded' | 'BountyClaimed' | 'BountyCanceled' | 'BountyExtended';
  }

  /** @name PalletTipsEvent (74) */
  interface PalletTipsEvent extends Enum {
    readonly isNewTip: boolean;
    readonly asNewTip: {
      readonly tipHash: H256;
    } & Struct;
    readonly isTipClosing: boolean;
    readonly asTipClosing: {
      readonly tipHash: H256;
    } & Struct;
    readonly isTipClosed: boolean;
    readonly asTipClosed: {
      readonly tipHash: H256;
      readonly who: AccountId32;
      readonly payout: u128;
    } & Struct;
    readonly isTipRetracted: boolean;
    readonly asTipRetracted: {
      readonly tipHash: H256;
    } & Struct;
    readonly isTipSlashed: boolean;
    readonly asTipSlashed: {
      readonly tipHash: H256;
      readonly finder: AccountId32;
      readonly deposit: u128;
    } & Struct;
    readonly type: 'NewTip' | 'TipClosing' | 'TipClosed' | 'TipRetracted' | 'TipSlashed';
  }

  /** @name ChainbridgeRawEvent (75) */
  interface ChainbridgeRawEvent extends Enum {
    readonly isRelayerThresholdChanged: boolean;
    readonly asRelayerThresholdChanged: u32;
    readonly isChainWhitelisted: boolean;
    readonly asChainWhitelisted: u8;
    readonly isRelayerAdded: boolean;
    readonly asRelayerAdded: AccountId32;
    readonly isRelayerRemoved: boolean;
    readonly asRelayerRemoved: AccountId32;
    readonly isFungibleTransfer: boolean;
    readonly asFungibleTransfer: ITuple<[u8, u64, U8aFixed, U256, Bytes]>;
    readonly isNonFungibleTransfer: boolean;
    readonly asNonFungibleTransfer: ITuple<[u8, u64, U8aFixed, Bytes, Bytes, Bytes]>;
    readonly isGenericTransfer: boolean;
    readonly asGenericTransfer: ITuple<[u8, u64, U8aFixed, Bytes]>;
    readonly isVoteFor: boolean;
    readonly asVoteFor: ITuple<[u8, u64, AccountId32]>;
    readonly isVoteAgainst: boolean;
    readonly asVoteAgainst: ITuple<[u8, u64, AccountId32]>;
    readonly isProposalApproved: boolean;
    readonly asProposalApproved: ITuple<[u8, u64]>;
    readonly isProposalRejected: boolean;
    readonly asProposalRejected: ITuple<[u8, u64]>;
    readonly isProposalSucceeded: boolean;
    readonly asProposalSucceeded: ITuple<[u8, u64]>;
    readonly isProposalFailed: boolean;
    readonly asProposalFailed: ITuple<[u8, u64]>;
    readonly type: 'RelayerThresholdChanged' | 'ChainWhitelisted' | 'RelayerAdded' | 'RelayerRemoved' | 'FungibleTransfer' | 'NonFungibleTransfer' | 'GenericTransfer' | 'VoteFor' | 'VoteAgainst' | 'ProposalApproved' | 'ProposalRejected' | 'ProposalSucceeded' | 'ProposalFailed';
  }

  /** @name SwapRawEvent (78) */
  interface SwapRawEvent extends Enum {
    readonly isFeeChanged: boolean;
    readonly asFeeChanged: u128;
    readonly isFeeDestinationChanged: boolean;
    readonly asFeeDestinationChanged: AccountId32;
    readonly type: 'FeeChanged' | 'FeeDestinationChanged';
  }

  /** @name XxCmixRawEvent (79) */
  interface XxCmixRawEvent extends Enum {
    readonly isCmixHashesUpdated: boolean;
    readonly isAdminPermissionUpdated: boolean;
    readonly asAdminPermissionUpdated: u32;
    readonly isSchedulingAccountUpdated: boolean;
    readonly isCmixVariablesUpdated: boolean;
    readonly isCmixAddressSpaceUpdated: boolean;
    readonly isCmixPointsAdded: boolean;
    readonly isCmixPointsDeducted: boolean;
    readonly type: 'CmixHashesUpdated' | 'AdminPermissionUpdated' | 'SchedulingAccountUpdated' | 'CmixVariablesUpdated' | 'CmixAddressSpaceUpdated' | 'CmixPointsAdded' | 'CmixPointsDeducted';
  }

  /** @name XxEconomicsRawEvent (80) */
  interface XxEconomicsRawEvent extends Enum {
    readonly isRewardFromPool: boolean;
    readonly asRewardFromPool: u128;
    readonly isRewardMinted: boolean;
    readonly asRewardMinted: u128;
    readonly isInflationParamsChanged: boolean;
    readonly isInterestPointsChanged: boolean;
    readonly isIdealLiquidityStakeChanged: boolean;
    readonly isLiquidityRewardsBalanceChanged: boolean;
    readonly type: 'RewardFromPool' | 'RewardMinted' | 'InflationParamsChanged' | 'InterestPointsChanged' | 'IdealLiquidityStakeChanged' | 'LiquidityRewardsBalanceChanged';
  }

  /** @name XxTeamCustodyRawEvent (81) */
  interface XxTeamCustodyRawEvent extends Enum {
    readonly isPayoutFromCustody: boolean;
    readonly asPayoutFromCustody: ITuple<[AccountId32, u128]>;
    readonly isPayoutFromReserve: boolean;
    readonly asPayoutFromReserve: ITuple<[AccountId32, u128]>;
    readonly isCustodyDone: boolean;
    readonly asCustodyDone: AccountId32;
    readonly isCustodianAdded: boolean;
    readonly asCustodianAdded: AccountId32;
    readonly isCustodianRemoved: boolean;
    readonly asCustodianRemoved: AccountId32;
    readonly isTeamMemberUpdated: boolean;
    readonly asTeamMemberUpdated: ITuple<[AccountId32, AccountId32]>;
    readonly type: 'PayoutFromCustody' | 'PayoutFromReserve' | 'CustodyDone' | 'CustodianAdded' | 'CustodianRemoved' | 'TeamMemberUpdated';
  }

  /** @name XxBetanetRewardsRawEvent (82) */
  interface XxBetanetRewardsRawEvent extends Enum {
    readonly isOptionSelected: boolean;
    readonly asOptionSelected: ITuple<[AccountId32, XxBetanetRewardsRewardOption]>;
    readonly isProgramApproved: boolean;
    readonly isProgramEnacted: boolean;
    readonly type: 'OptionSelected' | 'ProgramApproved' | 'ProgramEnacted';
  }

  /** @name XxBetanetRewardsRewardOption (83) */
  interface XxBetanetRewardsRewardOption extends Enum {
    readonly isNoVesting: boolean;
    readonly isVesting1Month: boolean;
    readonly isVesting3Month: boolean;
    readonly isVesting6Month: boolean;
    readonly isVesting9Month: boolean;
    readonly type: 'NoVesting' | 'Vesting1Month' | 'Vesting3Month' | 'Vesting6Month' | 'Vesting9Month';
  }

  /** @name XxPublicEvent (84) */
  interface XxPublicEvent extends Enum {
    readonly isTestnetManagerUpdated: boolean;
    readonly isSaleManagerUpdated: boolean;
    readonly type: 'TestnetManagerUpdated' | 'SaleManagerUpdated';
  }

  /** @name PalletMultisigEvent (85) */
  interface PalletMultisigEvent extends Enum {
    readonly isNewMultisig: boolean;
    readonly asNewMultisig: ITuple<[AccountId32, AccountId32, U8aFixed]>;
    readonly isMultisigApproval: boolean;
    readonly asMultisigApproval: ITuple<[AccountId32, PalletMultisigTimepoint, AccountId32, U8aFixed]>;
    readonly isMultisigExecuted: boolean;
    readonly asMultisigExecuted: ITuple<[AccountId32, PalletMultisigTimepoint, AccountId32, U8aFixed, Result<Null, SpRuntimeDispatchError>]>;
    readonly isMultisigCancelled: boolean;
    readonly asMultisigCancelled: ITuple<[AccountId32, PalletMultisigTimepoint, AccountId32, U8aFixed]>;
    readonly type: 'NewMultisig' | 'MultisigApproval' | 'MultisigExecuted' | 'MultisigCancelled';
  }

  /** @name PalletMultisigTimepoint (86) */
  interface PalletMultisigTimepoint extends Struct {
    readonly height: u32;
    readonly index: u32;
  }

  /** @name PalletRecoveryEvent (87) */
  interface PalletRecoveryEvent extends Enum {
    readonly isRecoveryCreated: boolean;
    readonly asRecoveryCreated: AccountId32;
    readonly isRecoveryInitiated: boolean;
    readonly asRecoveryInitiated: ITuple<[AccountId32, AccountId32]>;
    readonly isRecoveryVouched: boolean;
    readonly asRecoveryVouched: ITuple<[AccountId32, AccountId32, AccountId32]>;
    readonly isRecoveryClosed: boolean;
    readonly asRecoveryClosed: ITuple<[AccountId32, AccountId32]>;
    readonly isAccountRecovered: boolean;
    readonly asAccountRecovered: ITuple<[AccountId32, AccountId32]>;
    readonly isRecoveryRemoved: boolean;
    readonly asRecoveryRemoved: AccountId32;
    readonly type: 'RecoveryCreated' | 'RecoveryInitiated' | 'RecoveryVouched' | 'RecoveryClosed' | 'AccountRecovered' | 'RecoveryRemoved';
  }

  /** @name PalletAssetsEvent (88) */
  interface PalletAssetsEvent extends Enum {
    readonly isCreated: boolean;
    readonly asCreated: ITuple<[u32, AccountId32, AccountId32]>;
    readonly isIssued: boolean;
    readonly asIssued: ITuple<[u32, AccountId32, u64]>;
    readonly isTransferred: boolean;
    readonly asTransferred: ITuple<[u32, AccountId32, AccountId32, u64]>;
    readonly isBurned: boolean;
    readonly asBurned: ITuple<[u32, AccountId32, u64]>;
    readonly isTeamChanged: boolean;
    readonly asTeamChanged: ITuple<[u32, AccountId32, AccountId32, AccountId32]>;
    readonly isOwnerChanged: boolean;
    readonly asOwnerChanged: ITuple<[u32, AccountId32]>;
    readonly isFrozen: boolean;
    readonly asFrozen: ITuple<[u32, AccountId32]>;
    readonly isThawed: boolean;
    readonly asThawed: ITuple<[u32, AccountId32]>;
    readonly isAssetFrozen: boolean;
    readonly asAssetFrozen: u32;
    readonly isAssetThawed: boolean;
    readonly asAssetThawed: u32;
    readonly isDestroyed: boolean;
    readonly asDestroyed: u32;
    readonly isForceCreated: boolean;
    readonly asForceCreated: ITuple<[u32, AccountId32]>;
    readonly isMetadataSet: boolean;
    readonly asMetadataSet: ITuple<[u32, Bytes, Bytes, u8, bool]>;
    readonly isMetadataCleared: boolean;
    readonly asMetadataCleared: u32;
    readonly isApprovedTransfer: boolean;
    readonly asApprovedTransfer: ITuple<[u32, AccountId32, AccountId32, u64]>;
    readonly isApprovalCancelled: boolean;
    readonly asApprovalCancelled: ITuple<[u32, AccountId32, AccountId32]>;
    readonly isTransferredApproved: boolean;
    readonly asTransferredApproved: ITuple<[u32, AccountId32, AccountId32, AccountId32, u64]>;
    readonly isAssetStatusChanged: boolean;
    readonly asAssetStatusChanged: u32;
    readonly type: 'Created' | 'Issued' | 'Transferred' | 'Burned' | 'TeamChanged' | 'OwnerChanged' | 'Frozen' | 'Thawed' | 'AssetFrozen' | 'AssetThawed' | 'Destroyed' | 'ForceCreated' | 'MetadataSet' | 'MetadataCleared' | 'ApprovedTransfer' | 'ApprovalCancelled' | 'TransferredApproved' | 'AssetStatusChanged';
  }

  /** @name PalletUniquesEvent (89) */
  interface PalletUniquesEvent extends Enum {
    readonly isCreated: boolean;
    readonly asCreated: ITuple<[u32, AccountId32, AccountId32]>;
    readonly isForceCreated: boolean;
    readonly asForceCreated: ITuple<[u32, AccountId32]>;
    readonly isDestroyed: boolean;
    readonly asDestroyed: u32;
    readonly isIssued: boolean;
    readonly asIssued: ITuple<[u32, u32, AccountId32]>;
    readonly isTransferred: boolean;
    readonly asTransferred: ITuple<[u32, u32, AccountId32, AccountId32]>;
    readonly isBurned: boolean;
    readonly asBurned: ITuple<[u32, u32, AccountId32]>;
    readonly isFrozen: boolean;
    readonly asFrozen: ITuple<[u32, u32]>;
    readonly isThawed: boolean;
    readonly asThawed: ITuple<[u32, u32]>;
    readonly isClassFrozen: boolean;
    readonly asClassFrozen: u32;
    readonly isClassThawed: boolean;
    readonly asClassThawed: u32;
    readonly isOwnerChanged: boolean;
    readonly asOwnerChanged: ITuple<[u32, AccountId32]>;
    readonly isTeamChanged: boolean;
    readonly asTeamChanged: ITuple<[u32, AccountId32, AccountId32, AccountId32]>;
    readonly isApprovedTransfer: boolean;
    readonly asApprovedTransfer: ITuple<[u32, u32, AccountId32, AccountId32]>;
    readonly isApprovalCancelled: boolean;
    readonly asApprovalCancelled: ITuple<[u32, u32, AccountId32, AccountId32]>;
    readonly isAssetStatusChanged: boolean;
    readonly asAssetStatusChanged: u32;
    readonly isClassMetadataSet: boolean;
    readonly asClassMetadataSet: ITuple<[u32, Bytes, bool]>;
    readonly isClassMetadataCleared: boolean;
    readonly asClassMetadataCleared: u32;
    readonly isMetadataSet: boolean;
    readonly asMetadataSet: ITuple<[u32, u32, Bytes, bool]>;
    readonly isMetadataCleared: boolean;
    readonly asMetadataCleared: ITuple<[u32, u32]>;
    readonly isRedeposited: boolean;
    readonly asRedeposited: ITuple<[u32, Vec<u32>]>;
    readonly isAttributeSet: boolean;
    readonly asAttributeSet: ITuple<[u32, Option<u32>, Bytes, Bytes]>;
    readonly isAttributeCleared: boolean;
    readonly asAttributeCleared: ITuple<[u32, Option<u32>, Bytes]>;
    readonly type: 'Created' | 'ForceCreated' | 'Destroyed' | 'Issued' | 'Transferred' | 'Burned' | 'Frozen' | 'Thawed' | 'ClassFrozen' | 'ClassThawed' | 'OwnerChanged' | 'TeamChanged' | 'ApprovedTransfer' | 'ApprovalCancelled' | 'AssetStatusChanged' | 'ClassMetadataSet' | 'ClassMetadataCleared' | 'MetadataSet' | 'MetadataCleared' | 'Redeposited' | 'AttributeSet' | 'AttributeCleared';
  }

  /** @name FrameSystemPhase (95) */
  interface FrameSystemPhase extends Enum {
    readonly isApplyExtrinsic: boolean;
    readonly asApplyExtrinsic: u32;
    readonly isFinalization: boolean;
    readonly isInitialization: boolean;
    readonly type: 'ApplyExtrinsic' | 'Finalization' | 'Initialization';
  }

  /** @name FrameSystemLastRuntimeUpgradeInfo (98) */
  interface FrameSystemLastRuntimeUpgradeInfo extends Struct {
    readonly specVersion: Compact<u32>;
    readonly specName: Text;
  }

  /** @name FrameSystemCall (101) */
  interface FrameSystemCall extends Enum {
    readonly isFillBlock: boolean;
    readonly asFillBlock: {
      readonly ratio: Perbill;
    } & Struct;
    readonly isRemark: boolean;
    readonly asRemark: {
      readonly remark: Bytes;
    } & Struct;
    readonly isSetHeapPages: boolean;
    readonly asSetHeapPages: {
      readonly pages: u64;
    } & Struct;
    readonly isSetCode: boolean;
    readonly asSetCode: {
      readonly code: Bytes;
    } & Struct;
    readonly isSetCodeWithoutChecks: boolean;
    readonly asSetCodeWithoutChecks: {
      readonly code: Bytes;
    } & Struct;
    readonly isSetStorage: boolean;
    readonly asSetStorage: {
      readonly items: Vec<ITuple<[Bytes, Bytes]>>;
    } & Struct;
    readonly isKillStorage: boolean;
    readonly asKillStorage: {
      readonly keys_: Vec<Bytes>;
    } & Struct;
    readonly isKillPrefix: boolean;
    readonly asKillPrefix: {
      readonly prefix: Bytes;
      readonly subkeys: u32;
    } & Struct;
    readonly isRemarkWithEvent: boolean;
    readonly asRemarkWithEvent: {
      readonly remark: Bytes;
    } & Struct;
    readonly type: 'FillBlock' | 'Remark' | 'SetHeapPages' | 'SetCode' | 'SetCodeWithoutChecks' | 'SetStorage' | 'KillStorage' | 'KillPrefix' | 'RemarkWithEvent';
  }

  /** @name FrameSystemLimitsBlockWeights (106) */
  interface FrameSystemLimitsBlockWeights extends Struct {
    readonly baseBlock: u64;
    readonly maxBlock: u64;
    readonly perClass: FrameSupportWeightsPerDispatchClassWeightsPerClass;
  }

  /** @name FrameSupportWeightsPerDispatchClassWeightsPerClass (107) */
  interface FrameSupportWeightsPerDispatchClassWeightsPerClass extends Struct {
    readonly normal: FrameSystemLimitsWeightsPerClass;
    readonly operational: FrameSystemLimitsWeightsPerClass;
    readonly mandatory: FrameSystemLimitsWeightsPerClass;
  }

  /** @name FrameSystemLimitsWeightsPerClass (108) */
  interface FrameSystemLimitsWeightsPerClass extends Struct {
    readonly baseExtrinsic: u64;
    readonly maxExtrinsic: Option<u64>;
    readonly maxTotal: Option<u64>;
    readonly reserved: Option<u64>;
  }

  /** @name FrameSystemLimitsBlockLength (110) */
  interface FrameSystemLimitsBlockLength extends Struct {
    readonly max: FrameSupportWeightsPerDispatchClassU32;
  }

  /** @name FrameSupportWeightsPerDispatchClassU32 (111) */
  interface FrameSupportWeightsPerDispatchClassU32 extends Struct {
    readonly normal: u32;
    readonly operational: u32;
    readonly mandatory: u32;
  }

  /** @name FrameSupportWeightsRuntimeDbWeight (112) */
  interface FrameSupportWeightsRuntimeDbWeight extends Struct {
    readonly read: u64;
    readonly write: u64;
  }

  /** @name SpVersionRuntimeVersion (113) */
  interface SpVersionRuntimeVersion extends Struct {
    readonly specName: Text;
    readonly implName: Text;
    readonly authoringVersion: u32;
    readonly specVersion: u32;
    readonly implVersion: u32;
    readonly apis: Vec<ITuple<[U8aFixed, u32]>>;
    readonly transactionVersion: u32;
  }

  /** @name FrameSystemError (118) */
  interface FrameSystemError extends Enum {
    readonly isInvalidSpecName: boolean;
    readonly isSpecVersionNeedsToIncrease: boolean;
    readonly isFailedToExtractRuntimeVersion: boolean;
    readonly isNonDefaultComposite: boolean;
    readonly isNonZeroRefCount: boolean;
    readonly isCallFiltered: boolean;
    readonly type: 'InvalidSpecName' | 'SpecVersionNeedsToIncrease' | 'FailedToExtractRuntimeVersion' | 'NonDefaultComposite' | 'NonZeroRefCount' | 'CallFiltered';
  }

  /** @name PalletSchedulerScheduledV2 (121) */
  interface PalletSchedulerScheduledV2 extends Struct {
    readonly maybeId: Option<Bytes>;
    readonly priority: u8;
    readonly call: Call;
    readonly maybePeriodic: Option<ITuple<[u32, u32]>>;
    readonly origin: XxnetworkRuntimeOriginCaller;
  }

  /** @name PalletSchedulerCall (123) */
  interface PalletSchedulerCall extends Enum {
    readonly isSchedule: boolean;
    readonly asSchedule: {
      readonly when: u32;
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>;
      readonly priority: u8;
      readonly call: Call;
    } & Struct;
    readonly isCancel: boolean;
    readonly asCancel: {
      readonly when: u32;
      readonly index: u32;
    } & Struct;
    readonly isScheduleNamed: boolean;
    readonly asScheduleNamed: {
      readonly id: Bytes;
      readonly when: u32;
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>;
      readonly priority: u8;
      readonly call: Call;
    } & Struct;
    readonly isCancelNamed: boolean;
    readonly asCancelNamed: {
      readonly id: Bytes;
    } & Struct;
    readonly isScheduleAfter: boolean;
    readonly asScheduleAfter: {
      readonly after: u32;
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>;
      readonly priority: u8;
      readonly call: Call;
    } & Struct;
    readonly isScheduleNamedAfter: boolean;
    readonly asScheduleNamedAfter: {
      readonly id: Bytes;
      readonly after: u32;
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>;
      readonly priority: u8;
      readonly call: Call;
    } & Struct;
    readonly type: 'Schedule' | 'Cancel' | 'ScheduleNamed' | 'CancelNamed' | 'ScheduleAfter' | 'ScheduleNamedAfter';
  }

  /** @name PalletBabeCall (125) */
  interface PalletBabeCall extends Enum {
    readonly isReportEquivocation: boolean;
    readonly asReportEquivocation: {
      readonly equivocationProof: SpConsensusSlotsEquivocationProof;
      readonly keyOwnerProof: SpSessionMembershipProof;
    } & Struct;
    readonly isReportEquivocationUnsigned: boolean;
    readonly asReportEquivocationUnsigned: {
      readonly equivocationProof: SpConsensusSlotsEquivocationProof;
      readonly keyOwnerProof: SpSessionMembershipProof;
    } & Struct;
    readonly isPlanConfigChange: boolean;
    readonly asPlanConfigChange: {
      readonly config: SpConsensusBabeDigestsNextConfigDescriptor;
    } & Struct;
    readonly type: 'ReportEquivocation' | 'ReportEquivocationUnsigned' | 'PlanConfigChange';
  }

  /** @name SpConsensusSlotsEquivocationProof (126) */
  interface SpConsensusSlotsEquivocationProof extends Struct {
    readonly offender: SpConsensusBabeAppPublic;
    readonly slot: u64;
    readonly firstHeader: SpRuntimeHeader;
    readonly secondHeader: SpRuntimeHeader;
  }

  /** @name SpRuntimeHeader (127) */
  interface SpRuntimeHeader extends Struct {
    readonly parentHash: H256;
    readonly number: Compact<u32>;
    readonly stateRoot: H256;
    readonly extrinsicsRoot: H256;
    readonly digest: SpRuntimeDigest;
  }

  /** @name SpRuntimeBlakeTwo256 (128) */
  type SpRuntimeBlakeTwo256 = Null;

  /** @name SpConsensusBabeAppPublic (129) */
  interface SpConsensusBabeAppPublic extends SpCoreSr25519Public {}

  /** @name SpSessionMembershipProof (131) */
  interface SpSessionMembershipProof extends Struct {
    readonly session: u32;
    readonly trieNodes: Vec<Bytes>;
    readonly validatorCount: u32;
  }

  /** @name SpConsensusBabeDigestsNextConfigDescriptor (132) */
  interface SpConsensusBabeDigestsNextConfigDescriptor extends Enum {
    readonly isV1: boolean;
    readonly asV1: {
      readonly c: ITuple<[u64, u64]>;
      readonly allowedSlots: SpConsensusBabeAllowedSlots;
    } & Struct;
    readonly type: 'V1';
  }

  /** @name SpConsensusBabeAllowedSlots (134) */
  interface SpConsensusBabeAllowedSlots extends Enum {
    readonly isPrimarySlots: boolean;
    readonly isPrimaryAndSecondaryPlainSlots: boolean;
    readonly isPrimaryAndSecondaryVRFSlots: boolean;
    readonly type: 'PrimarySlots' | 'PrimaryAndSecondaryPlainSlots' | 'PrimaryAndSecondaryVRFSlots';
  }

  /** @name PalletTimestampCall (135) */
  interface PalletTimestampCall extends Enum {
    readonly isSet: boolean;
    readonly asSet: {
      readonly now: Compact<u64>;
    } & Struct;
    readonly type: 'Set';
  }

  /** @name PalletBalancesCall (137) */
  interface PalletBalancesCall extends Enum {
    readonly isTransfer: boolean;
    readonly asTransfer: {
      readonly dest: MultiAddress;
      readonly value: Compact<u128>;
    } & Struct;
    readonly isSetBalance: boolean;
    readonly asSetBalance: {
      readonly who: MultiAddress;
      readonly newFree: Compact<u128>;
      readonly newReserved: Compact<u128>;
    } & Struct;
    readonly isForceTransfer: boolean;
    readonly asForceTransfer: {
      readonly source: MultiAddress;
      readonly dest: MultiAddress;
      readonly value: Compact<u128>;
    } & Struct;
    readonly isTransferKeepAlive: boolean;
    readonly asTransferKeepAlive: {
      readonly dest: MultiAddress;
      readonly value: Compact<u128>;
    } & Struct;
    readonly isTransferAll: boolean;
    readonly asTransferAll: {
      readonly dest: MultiAddress;
      readonly keepAlive: bool;
    } & Struct;
    readonly isForceUnreserve: boolean;
    readonly asForceUnreserve: {
      readonly who: MultiAddress;
      readonly amount: u128;
    } & Struct;
    readonly type: 'Transfer' | 'SetBalance' | 'ForceTransfer' | 'TransferKeepAlive' | 'TransferAll' | 'ForceUnreserve';
  }

  /** @name PalletAuthorshipCall (140) */
  interface PalletAuthorshipCall extends Enum {
    readonly isSetUncles: boolean;
    readonly asSetUncles: {
      readonly newUncles: Vec<SpRuntimeHeader>;
    } & Struct;
    readonly type: 'SetUncles';
  }

  /** @name PalletStakingPalletCall (142) */
  interface PalletStakingPalletCall extends Enum {
    readonly isBond: boolean;
    readonly asBond: {
      readonly controller: MultiAddress;
      readonly value: Compact<u128>;
      readonly cmixId: Option<H256>;
    } & Struct;
    readonly isBondExtra: boolean;
    readonly asBondExtra: {
      readonly maxAdditional: Compact<u128>;
    } & Struct;
    readonly isUnbond: boolean;
    readonly asUnbond: {
      readonly value: Compact<u128>;
    } & Struct;
    readonly isWithdrawUnbonded: boolean;
    readonly asWithdrawUnbonded: {
      readonly numSlashingSpans: u32;
    } & Struct;
    readonly isValidate: boolean;
    readonly asValidate: {
      readonly prefs: PalletStakingValidatorPrefs;
    } & Struct;
    readonly isNominate: boolean;
    readonly asNominate: {
      readonly targets: Vec<MultiAddress>;
    } & Struct;
    readonly isChill: boolean;
    readonly isSetController: boolean;
    readonly asSetController: {
      readonly controller: MultiAddress;
    } & Struct;
    readonly isSetValidatorCount: boolean;
    readonly asSetValidatorCount: {
      readonly new_: Compact<u32>;
    } & Struct;
    readonly isIncreaseValidatorCount: boolean;
    readonly asIncreaseValidatorCount: {
      readonly additional: Compact<u32>;
    } & Struct;
    readonly isScaleValidatorCount: boolean;
    readonly asScaleValidatorCount: {
      readonly factor: Percent;
    } & Struct;
    readonly isForceNoEras: boolean;
    readonly isForceNewEra: boolean;
    readonly isSetInvulnerables: boolean;
    readonly asSetInvulnerables: {
      readonly invulnerables: Vec<AccountId32>;
    } & Struct;
    readonly isForceUnstake: boolean;
    readonly asForceUnstake: {
      readonly stash: AccountId32;
      readonly numSlashingSpans: u32;
    } & Struct;
    readonly isForceNewEraAlways: boolean;
    readonly isCancelDeferredSlash: boolean;
    readonly asCancelDeferredSlash: {
      readonly era: u32;
      readonly slashIndices: Vec<u32>;
    } & Struct;
    readonly isPayoutStakers: boolean;
    readonly asPayoutStakers: {
      readonly validatorStash: AccountId32;
      readonly era: u32;
    } & Struct;
    readonly isRebond: boolean;
    readonly asRebond: {
      readonly value: Compact<u128>;
    } & Struct;
    readonly isSetHistoryDepth: boolean;
    readonly asSetHistoryDepth: {
      readonly newHistoryDepth: Compact<u32>;
      readonly eraItemsDeleted: Compact<u32>;
    } & Struct;
    readonly isReapStash: boolean;
    readonly asReapStash: {
      readonly stash: AccountId32;
      readonly numSlashingSpans: u32;
    } & Struct;
    readonly isKick: boolean;
    readonly asKick: {
      readonly who: Vec<MultiAddress>;
    } & Struct;
    readonly isSetStakingLimits: boolean;
    readonly asSetStakingLimits: {
      readonly minNominatorBond: u128;
      readonly minValidatorBond: u128;
      readonly maxNominatorCount: Option<u32>;
      readonly maxValidatorCount: Option<u32>;
      readonly threshold: Option<Percent>;
      readonly minCommission: Perbill;
    } & Struct;
    readonly isChillOther: boolean;
    readonly asChillOther: {
      readonly controller: AccountId32;
    } & Struct;
    readonly isSetCmixId: boolean;
    readonly asSetCmixId: {
      readonly cmixId: H256;
    } & Struct;
    readonly isTransferCmixId: boolean;
    readonly asTransferCmixId: {
      readonly dest: AccountId32;
    } & Struct;
    readonly type: 'Bond' | 'BondExtra' | 'Unbond' | 'WithdrawUnbonded' | 'Validate' | 'Nominate' | 'Chill' | 'SetController' | 'SetValidatorCount' | 'IncreaseValidatorCount' | 'ScaleValidatorCount' | 'ForceNoEras' | 'ForceNewEra' | 'SetInvulnerables' | 'ForceUnstake' | 'ForceNewEraAlways' | 'CancelDeferredSlash' | 'PayoutStakers' | 'Rebond' | 'SetHistoryDepth' | 'ReapStash' | 'Kick' | 'SetStakingLimits' | 'ChillOther' | 'SetCmixId' | 'TransferCmixId';
  }

  /** @name PalletStakingValidatorPrefs (144) */
  interface PalletStakingValidatorPrefs extends Struct {
    readonly commission: Compact<Perbill>;
    readonly blocked: bool;
  }

  /** @name PalletElectionProviderMultiPhaseCall (149) */
  interface PalletElectionProviderMultiPhaseCall extends Enum {
    readonly isSubmitUnsigned: boolean;
    readonly asSubmitUnsigned: {
      readonly rawSolution: PalletElectionProviderMultiPhaseRawSolution;
      readonly witness: PalletElectionProviderMultiPhaseSolutionOrSnapshotSize;
    } & Struct;
    readonly isSetMinimumUntrustedScore: boolean;
    readonly asSetMinimumUntrustedScore: {
      readonly maybeNextScore: Option<Vec<u128>>;
    } & Struct;
    readonly isSetEmergencyElectionResult: boolean;
    readonly asSetEmergencyElectionResult: {
      readonly supports: Vec<ITuple<[AccountId32, SpNposElectionsSupport]>>;
    } & Struct;
    readonly isSubmit: boolean;
    readonly asSubmit: {
      readonly rawSolution: PalletElectionProviderMultiPhaseRawSolution;
      readonly numSignedSubmissions: u32;
    } & Struct;
    readonly type: 'SubmitUnsigned' | 'SetMinimumUntrustedScore' | 'SetEmergencyElectionResult' | 'Submit';
  }

  /** @name PalletElectionProviderMultiPhaseRawSolution (150) */
  interface PalletElectionProviderMultiPhaseRawSolution extends Struct {
    readonly solution: RuntimeCommonNposSolution16;
    readonly score: Vec<u128>;
    readonly round: u32;
  }

  /** @name RuntimeCommonNposSolution16 (151) */
  interface RuntimeCommonNposSolution16 extends Struct {
    readonly votes1: Vec<ITuple<[Compact<u32>, Compact<u16>]>>;
    readonly votes2: Vec<ITuple<[Compact<u32>, ITuple<[Compact<u16>, Compact<PerU16>]>, Compact<u16>]>>;
    readonly votes3: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes4: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes5: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes6: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes7: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes8: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes9: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes10: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes11: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes12: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes13: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes14: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes15: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes16: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
  }

  /** @name PalletElectionProviderMultiPhaseSolutionOrSnapshotSize (203) */
  interface PalletElectionProviderMultiPhaseSolutionOrSnapshotSize extends Struct {
    readonly voters: Compact<u32>;
    readonly targets: Compact<u32>;
  }

  /** @name SpNposElectionsSupport (207) */
  interface SpNposElectionsSupport extends Struct {
    readonly total: u128;
    readonly voters: Vec<ITuple<[AccountId32, u128]>>;
  }

  /** @name PalletSessionCall (208) */
  interface PalletSessionCall extends Enum {
    readonly isSetKeys: boolean;
    readonly asSetKeys: {
      readonly keys_: XxnetworkRuntimeSessionKeys;
      readonly proof: Bytes;
    } & Struct;
    readonly isPurgeKeys: boolean;
    readonly type: 'SetKeys' | 'PurgeKeys';
  }

  /** @name XxnetworkRuntimeSessionKeys (209) */
  interface XxnetworkRuntimeSessionKeys extends Struct {
    readonly grandpa: SpFinalityGrandpaAppPublic;
    readonly babe: SpConsensusBabeAppPublic;
    readonly imOnline: PalletImOnlineSr25519AppSr25519Public;
    readonly authorityDiscovery: SpAuthorityDiscoveryAppPublic;
  }

  /** @name SpAuthorityDiscoveryAppPublic (210) */
  interface SpAuthorityDiscoveryAppPublic extends SpCoreSr25519Public {}

  /** @name PalletGrandpaCall (211) */
  interface PalletGrandpaCall extends Enum {
    readonly isReportEquivocation: boolean;
    readonly asReportEquivocation: {
      readonly equivocationProof: SpFinalityGrandpaEquivocationProof;
      readonly keyOwnerProof: SpSessionMembershipProof;
    } & Struct;
    readonly isReportEquivocationUnsigned: boolean;
    readonly asReportEquivocationUnsigned: {
      readonly equivocationProof: SpFinalityGrandpaEquivocationProof;
      readonly keyOwnerProof: SpSessionMembershipProof;
    } & Struct;
    readonly isNoteStalled: boolean;
    readonly asNoteStalled: {
      readonly delay: u32;
      readonly bestFinalizedBlockNumber: u32;
    } & Struct;
    readonly type: 'ReportEquivocation' | 'ReportEquivocationUnsigned' | 'NoteStalled';
  }

  /** @name SpFinalityGrandpaEquivocationProof (212) */
  interface SpFinalityGrandpaEquivocationProof extends Struct {
    readonly setId: u64;
    readonly equivocation: SpFinalityGrandpaEquivocation;
  }

  /** @name SpFinalityGrandpaEquivocation (213) */
  interface SpFinalityGrandpaEquivocation extends Enum {
    readonly isPrevote: boolean;
    readonly asPrevote: FinalityGrandpaEquivocationPrevote;
    readonly isPrecommit: boolean;
    readonly asPrecommit: FinalityGrandpaEquivocationPrecommit;
    readonly type: 'Prevote' | 'Precommit';
  }

  /** @name FinalityGrandpaEquivocationPrevote (214) */
  interface FinalityGrandpaEquivocationPrevote extends Struct {
    readonly roundNumber: u64;
    readonly identity: SpFinalityGrandpaAppPublic;
    readonly first: ITuple<[FinalityGrandpaPrevote, SpFinalityGrandpaAppSignature]>;
    readonly second: ITuple<[FinalityGrandpaPrevote, SpFinalityGrandpaAppSignature]>;
  }

  /** @name FinalityGrandpaPrevote (215) */
  interface FinalityGrandpaPrevote extends Struct {
    readonly targetHash: H256;
    readonly targetNumber: u32;
  }

  /** @name SpFinalityGrandpaAppSignature (216) */
  interface SpFinalityGrandpaAppSignature extends SpCoreEd25519Signature {}

  /** @name SpCoreEd25519Signature (217) */
  interface SpCoreEd25519Signature extends U8aFixed {}

  /** @name FinalityGrandpaEquivocationPrecommit (220) */
  interface FinalityGrandpaEquivocationPrecommit extends Struct {
    readonly roundNumber: u64;
    readonly identity: SpFinalityGrandpaAppPublic;
    readonly first: ITuple<[FinalityGrandpaPrecommit, SpFinalityGrandpaAppSignature]>;
    readonly second: ITuple<[FinalityGrandpaPrecommit, SpFinalityGrandpaAppSignature]>;
  }

  /** @name FinalityGrandpaPrecommit (221) */
  interface FinalityGrandpaPrecommit extends Struct {
    readonly targetHash: H256;
    readonly targetNumber: u32;
  }

  /** @name PalletImOnlineCall (223) */
  interface PalletImOnlineCall extends Enum {
    readonly isHeartbeat: boolean;
    readonly asHeartbeat: {
      readonly heartbeat: PalletImOnlineHeartbeat;
      readonly signature: PalletImOnlineSr25519AppSr25519Signature;
    } & Struct;
    readonly type: 'Heartbeat';
  }

  /** @name PalletImOnlineHeartbeat (224) */
  interface PalletImOnlineHeartbeat extends Struct {
    readonly blockNumber: u32;
    readonly networkState: SpCoreOffchainOpaqueNetworkState;
    readonly sessionIndex: u32;
    readonly authorityIndex: u32;
    readonly validatorsLen: u32;
  }

  /** @name SpCoreOffchainOpaqueNetworkState (225) */
  interface SpCoreOffchainOpaqueNetworkState extends Struct {
    readonly peerId: OpaquePeerId;
    readonly externalAddresses: Vec<OpaqueMultiaddr>;
  }

  /** @name PalletImOnlineSr25519AppSr25519Signature (229) */
  interface PalletImOnlineSr25519AppSr25519Signature extends SpCoreSr25519Signature {}

  /** @name SpCoreSr25519Signature (230) */
  interface SpCoreSr25519Signature extends U8aFixed {}

  /** @name PalletDemocracyCall (231) */
  interface PalletDemocracyCall extends Enum {
    readonly isPropose: boolean;
    readonly asPropose: {
      readonly proposalHash: H256;
      readonly value: Compact<u128>;
    } & Struct;
    readonly isSecond: boolean;
    readonly asSecond: {
      readonly proposal: Compact<u32>;
      readonly secondsUpperBound: Compact<u32>;
    } & Struct;
    readonly isVote: boolean;
    readonly asVote: {
      readonly refIndex: Compact<u32>;
      readonly vote: PalletDemocracyVoteAccountVote;
    } & Struct;
    readonly isEmergencyCancel: boolean;
    readonly asEmergencyCancel: {
      readonly refIndex: u32;
    } & Struct;
    readonly isExternalPropose: boolean;
    readonly asExternalPropose: {
      readonly proposalHash: H256;
    } & Struct;
    readonly isExternalProposeMajority: boolean;
    readonly asExternalProposeMajority: {
      readonly proposalHash: H256;
    } & Struct;
    readonly isExternalProposeDefault: boolean;
    readonly asExternalProposeDefault: {
      readonly proposalHash: H256;
    } & Struct;
    readonly isFastTrack: boolean;
    readonly asFastTrack: {
      readonly proposalHash: H256;
      readonly votingPeriod: u32;
      readonly delay: u32;
    } & Struct;
    readonly isVetoExternal: boolean;
    readonly asVetoExternal: {
      readonly proposalHash: H256;
    } & Struct;
    readonly isCancelReferendum: boolean;
    readonly asCancelReferendum: {
      readonly refIndex: Compact<u32>;
    } & Struct;
    readonly isCancelQueued: boolean;
    readonly asCancelQueued: {
      readonly which: u32;
    } & Struct;
    readonly isDelegate: boolean;
    readonly asDelegate: {
      readonly to: AccountId32;
      readonly conviction: PalletDemocracyConviction;
      readonly balance: u128;
    } & Struct;
    readonly isUndelegate: boolean;
    readonly isClearPublicProposals: boolean;
    readonly isNotePreimage: boolean;
    readonly asNotePreimage: {
      readonly encodedProposal: Bytes;
    } & Struct;
    readonly isNotePreimageOperational: boolean;
    readonly asNotePreimageOperational: {
      readonly encodedProposal: Bytes;
    } & Struct;
    readonly isNoteImminentPreimage: boolean;
    readonly asNoteImminentPreimage: {
      readonly encodedProposal: Bytes;
    } & Struct;
    readonly isNoteImminentPreimageOperational: boolean;
    readonly asNoteImminentPreimageOperational: {
      readonly encodedProposal: Bytes;
    } & Struct;
    readonly isReapPreimage: boolean;
    readonly asReapPreimage: {
      readonly proposalHash: H256;
      readonly proposalLenUpperBound: Compact<u32>;
    } & Struct;
    readonly isUnlock: boolean;
    readonly asUnlock: {
      readonly target: AccountId32;
    } & Struct;
    readonly isRemoveVote: boolean;
    readonly asRemoveVote: {
      readonly index: u32;
    } & Struct;
    readonly isRemoveOtherVote: boolean;
    readonly asRemoveOtherVote: {
      readonly target: AccountId32;
      readonly index: u32;
    } & Struct;
    readonly isEnactProposal: boolean;
    readonly asEnactProposal: {
      readonly proposalHash: H256;
      readonly index: u32;
    } & Struct;
    readonly isBlacklist: boolean;
    readonly asBlacklist: {
      readonly proposalHash: H256;
      readonly maybeRefIndex: Option<u32>;
    } & Struct;
    readonly isCancelProposal: boolean;
    readonly asCancelProposal: {
      readonly propIndex: Compact<u32>;
    } & Struct;
    readonly type: 'Propose' | 'Second' | 'Vote' | 'EmergencyCancel' | 'ExternalPropose' | 'ExternalProposeMajority' | 'ExternalProposeDefault' | 'FastTrack' | 'VetoExternal' | 'CancelReferendum' | 'CancelQueued' | 'Delegate' | 'Undelegate' | 'ClearPublicProposals' | 'NotePreimage' | 'NotePreimageOperational' | 'NoteImminentPreimage' | 'NoteImminentPreimageOperational' | 'ReapPreimage' | 'Unlock' | 'RemoveVote' | 'RemoveOtherVote' | 'EnactProposal' | 'Blacklist' | 'CancelProposal';
  }

  /** @name PalletDemocracyVoteAccountVote (232) */
  interface PalletDemocracyVoteAccountVote extends Enum {
    readonly isStandard: boolean;
    readonly asStandard: {
      readonly vote: Vote;
      readonly balance: u128;
    } & Struct;
    readonly isSplit: boolean;
    readonly asSplit: {
      readonly aye: u128;
      readonly nay: u128;
    } & Struct;
    readonly type: 'Standard' | 'Split';
  }

  /** @name PalletDemocracyConviction (234) */
  interface PalletDemocracyConviction extends Enum {
    readonly isNone: boolean;
    readonly isLocked1x: boolean;
    readonly isLocked2x: boolean;
    readonly isLocked3x: boolean;
    readonly isLocked4x: boolean;
    readonly isLocked5x: boolean;
    readonly isLocked6x: boolean;
    readonly type: 'None' | 'Locked1x' | 'Locked2x' | 'Locked3x' | 'Locked4x' | 'Locked5x' | 'Locked6x';
  }

  /** @name PalletCollectiveCall (235) */
  interface PalletCollectiveCall extends Enum {
    readonly isSetMembers: boolean;
    readonly asSetMembers: {
      readonly newMembers: Vec<AccountId32>;
      readonly prime: Option<AccountId32>;
      readonly oldCount: u32;
    } & Struct;
    readonly isExecute: boolean;
    readonly asExecute: {
      readonly proposal: Call;
      readonly lengthBound: Compact<u32>;
    } & Struct;
    readonly isPropose: boolean;
    readonly asPropose: {
      readonly threshold: Compact<u32>;
      readonly proposal: Call;
      readonly lengthBound: Compact<u32>;
    } & Struct;
    readonly isVote: boolean;
    readonly asVote: {
      readonly proposal: H256;
      readonly index: Compact<u32>;
      readonly approve: bool;
    } & Struct;
    readonly isClose: boolean;
    readonly asClose: {
      readonly proposalHash: H256;
      readonly index: Compact<u32>;
      readonly proposalWeightBound: Compact<u64>;
      readonly lengthBound: Compact<u32>;
    } & Struct;
    readonly isDisapproveProposal: boolean;
    readonly asDisapproveProposal: {
      readonly proposalHash: H256;
    } & Struct;
    readonly type: 'SetMembers' | 'Execute' | 'Propose' | 'Vote' | 'Close' | 'DisapproveProposal';
  }

  /** @name PalletElectionsPhragmenCall (238) */
  interface PalletElectionsPhragmenCall extends Enum {
    readonly isVote: boolean;
    readonly asVote: {
      readonly votes: Vec<AccountId32>;
      readonly value: Compact<u128>;
    } & Struct;
    readonly isRemoveVoter: boolean;
    readonly isSubmitCandidacy: boolean;
    readonly asSubmitCandidacy: {
      readonly candidateCount: Compact<u32>;
    } & Struct;
    readonly isRenounceCandidacy: boolean;
    readonly asRenounceCandidacy: {
      readonly renouncing: PalletElectionsPhragmenRenouncing;
    } & Struct;
    readonly isRemoveMember: boolean;
    readonly asRemoveMember: {
      readonly who: MultiAddress;
      readonly hasReplacement: bool;
    } & Struct;
    readonly isCleanDefunctVoters: boolean;
    readonly asCleanDefunctVoters: {
      readonly numVoters: u32;
      readonly numDefunct: u32;
    } & Struct;
    readonly type: 'Vote' | 'RemoveVoter' | 'SubmitCandidacy' | 'RenounceCandidacy' | 'RemoveMember' | 'CleanDefunctVoters';
  }

  /** @name PalletElectionsPhragmenRenouncing (239) */
  interface PalletElectionsPhragmenRenouncing extends Enum {
    readonly isMember: boolean;
    readonly isRunnerUp: boolean;
    readonly isCandidate: boolean;
    readonly asCandidate: Compact<u32>;
    readonly type: 'Member' | 'RunnerUp' | 'Candidate';
  }

  /** @name PalletMembershipCall (240) */
  interface PalletMembershipCall extends Enum {
    readonly isAddMember: boolean;
    readonly asAddMember: {
      readonly who: AccountId32;
    } & Struct;
    readonly isRemoveMember: boolean;
    readonly asRemoveMember: {
      readonly who: AccountId32;
    } & Struct;
    readonly isSwapMember: boolean;
    readonly asSwapMember: {
      readonly remove: AccountId32;
      readonly add: AccountId32;
    } & Struct;
    readonly isResetMembers: boolean;
    readonly asResetMembers: {
      readonly members: Vec<AccountId32>;
    } & Struct;
    readonly isChangeKey: boolean;
    readonly asChangeKey: {
      readonly new_: AccountId32;
    } & Struct;
    readonly isSetPrime: boolean;
    readonly asSetPrime: {
      readonly who: AccountId32;
    } & Struct;
    readonly isClearPrime: boolean;
    readonly type: 'AddMember' | 'RemoveMember' | 'SwapMember' | 'ResetMembers' | 'ChangeKey' | 'SetPrime' | 'ClearPrime';
  }

  /** @name PalletTreasuryCall (241) */
  interface PalletTreasuryCall extends Enum {
    readonly isProposeSpend: boolean;
    readonly asProposeSpend: {
      readonly value: Compact<u128>;
      readonly beneficiary: MultiAddress;
    } & Struct;
    readonly isRejectProposal: boolean;
    readonly asRejectProposal: {
      readonly proposalId: Compact<u32>;
    } & Struct;
    readonly isApproveProposal: boolean;
    readonly asApproveProposal: {
      readonly proposalId: Compact<u32>;
    } & Struct;
    readonly type: 'ProposeSpend' | 'RejectProposal' | 'ApproveProposal';
  }

  /** @name ClaimsCall (242) */
  interface ClaimsCall extends Enum {
    readonly isClaim: boolean;
    readonly asClaim: {
      readonly dest: AccountId32;
      readonly ethereumSignature: ClaimsEcdsaSignature;
    } & Struct;
    readonly isMintClaim: boolean;
    readonly asMintClaim: {
      readonly who: ClaimsEthereumAddress;
      readonly value: u128;
      readonly vestingSchedules: Option<Vec<ITuple<[u128, u128, u32]>>>;
      readonly statement: Option<ClaimsStatementKind>;
    } & Struct;
    readonly isClaimAttest: boolean;
    readonly asClaimAttest: {
      readonly dest: AccountId32;
      readonly ethereumSignature: ClaimsEcdsaSignature;
      readonly statement: Bytes;
    } & Struct;
    readonly isAttest: boolean;
    readonly asAttest: {
      readonly statement: Bytes;
    } & Struct;
    readonly isMoveClaim: boolean;
    readonly asMoveClaim: {
      readonly old: ClaimsEthereumAddress;
      readonly new_: ClaimsEthereumAddress;
      readonly maybePreclaim: Option<AccountId32>;
    } & Struct;
    readonly type: 'Claim' | 'MintClaim' | 'ClaimAttest' | 'Attest' | 'MoveClaim';
  }

  /** @name ClaimsEcdsaSignature (243) */
  interface ClaimsEcdsaSignature extends U8aFixed {}

  /** @name ClaimsStatementKind (249) */
  interface ClaimsStatementKind extends Enum {
    readonly isRegular: boolean;
    readonly isSaft: boolean;
    readonly type: 'Regular' | 'Saft';
  }

  /** @name PalletVestingCall (250) */
  interface PalletVestingCall extends Enum {
    readonly isVest: boolean;
    readonly isVestOther: boolean;
    readonly asVestOther: {
      readonly target: MultiAddress;
    } & Struct;
    readonly isVestedTransfer: boolean;
    readonly asVestedTransfer: {
      readonly target: MultiAddress;
      readonly schedule: PalletVestingVestingInfo;
    } & Struct;
    readonly isForceVestedTransfer: boolean;
    readonly asForceVestedTransfer: {
      readonly source: MultiAddress;
      readonly target: MultiAddress;
      readonly schedule: PalletVestingVestingInfo;
    } & Struct;
    readonly isMergeSchedules: boolean;
    readonly asMergeSchedules: {
      readonly schedule1Index: u32;
      readonly schedule2Index: u32;
    } & Struct;
    readonly type: 'Vest' | 'VestOther' | 'VestedTransfer' | 'ForceVestedTransfer' | 'MergeSchedules';
  }

  /** @name PalletVestingVestingInfo (251) */
  interface PalletVestingVestingInfo extends Struct {
    readonly locked: u128;
    readonly perBlock: u128;
    readonly startingBlock: u32;
  }

  /** @name PalletUtilityCall (252) */
  interface PalletUtilityCall extends Enum {
    readonly isBatch: boolean;
    readonly asBatch: {
      readonly calls: Vec<Call>;
    } & Struct;
    readonly isAsDerivative: boolean;
    readonly asAsDerivative: {
      readonly index: u16;
      readonly call: Call;
    } & Struct;
    readonly isBatchAll: boolean;
    readonly asBatchAll: {
      readonly calls: Vec<Call>;
    } & Struct;
    readonly isDispatchAs: boolean;
    readonly asDispatchAs: {
      readonly asOrigin: XxnetworkRuntimeOriginCaller;
      readonly call: Call;
    } & Struct;
    readonly type: 'Batch' | 'AsDerivative' | 'BatchAll' | 'DispatchAs';
  }

  /** @name XxnetworkRuntimeOriginCaller (254) */
  interface XxnetworkRuntimeOriginCaller extends Enum {
    readonly isSystem: boolean;
    readonly asSystem: FrameSystemRawOrigin;
    readonly isVoid: boolean;
    readonly isCouncil: boolean;
    readonly asCouncil: PalletCollectiveRawOrigin;
    readonly isTechnicalCommittee: boolean;
    readonly asTechnicalCommittee: PalletCollectiveRawOrigin;
    readonly type: 'System' | 'Void' | 'Council' | 'TechnicalCommittee';
  }

  /** @name FrameSystemRawOrigin (255) */
  interface FrameSystemRawOrigin extends Enum {
    readonly isRoot: boolean;
    readonly isSigned: boolean;
    readonly asSigned: AccountId32;
    readonly isNone: boolean;
    readonly type: 'Root' | 'Signed' | 'None';
  }

  /** @name PalletCollectiveRawOrigin (256) */
  interface PalletCollectiveRawOrigin extends Enum {
    readonly isMembers: boolean;
    readonly asMembers: ITuple<[u32, u32]>;
    readonly isMember: boolean;
    readonly asMember: AccountId32;
    readonly isPhantom: boolean;
    readonly type: 'Members' | 'Member' | 'Phantom';
  }

  /** @name SpCoreVoid (258) */
  type SpCoreVoid = Null;

  /** @name PalletIdentityCall (259) */
  interface PalletIdentityCall extends Enum {
    readonly isAddRegistrar: boolean;
    readonly asAddRegistrar: {
      readonly account: AccountId32;
    } & Struct;
    readonly isSetIdentity: boolean;
    readonly asSetIdentity: {
      readonly info: PalletIdentityIdentityInfo;
    } & Struct;
    readonly isSetSubs: boolean;
    readonly asSetSubs: {
      readonly subs: Vec<ITuple<[AccountId32, Data]>>;
    } & Struct;
    readonly isClearIdentity: boolean;
    readonly isRequestJudgement: boolean;
    readonly asRequestJudgement: {
      readonly regIndex: Compact<u32>;
      readonly maxFee: Compact<u128>;
    } & Struct;
    readonly isCancelRequest: boolean;
    readonly asCancelRequest: {
      readonly regIndex: u32;
    } & Struct;
    readonly isSetFee: boolean;
    readonly asSetFee: {
      readonly index: Compact<u32>;
      readonly fee: Compact<u128>;
    } & Struct;
    readonly isSetAccountId: boolean;
    readonly asSetAccountId: {
      readonly index: Compact<u32>;
      readonly new_: AccountId32;
    } & Struct;
    readonly isSetFields: boolean;
    readonly asSetFields: {
      readonly index: Compact<u32>;
      readonly fields: PalletIdentityBitFlags;
    } & Struct;
    readonly isProvideJudgement: boolean;
    readonly asProvideJudgement: {
      readonly regIndex: Compact<u32>;
      readonly target: MultiAddress;
      readonly judgement: PalletIdentityJudgement;
    } & Struct;
    readonly isKillIdentity: boolean;
    readonly asKillIdentity: {
      readonly target: MultiAddress;
    } & Struct;
    readonly isAddSub: boolean;
    readonly asAddSub: {
      readonly sub: MultiAddress;
      readonly data: Data;
    } & Struct;
    readonly isRenameSub: boolean;
    readonly asRenameSub: {
      readonly sub: MultiAddress;
      readonly data: Data;
    } & Struct;
    readonly isRemoveSub: boolean;
    readonly asRemoveSub: {
      readonly sub: MultiAddress;
    } & Struct;
    readonly isQuitSub: boolean;
    readonly type: 'AddRegistrar' | 'SetIdentity' | 'SetSubs' | 'ClearIdentity' | 'RequestJudgement' | 'CancelRequest' | 'SetFee' | 'SetAccountId' | 'SetFields' | 'ProvideJudgement' | 'KillIdentity' | 'AddSub' | 'RenameSub' | 'RemoveSub' | 'QuitSub';
  }

  /** @name PalletIdentityIdentityInfo (260) */
  interface PalletIdentityIdentityInfo extends Struct {
    readonly additional: Vec<ITuple<[Data, Data]>>;
    readonly display: Data;
    readonly legal: Data;
    readonly web: Data;
    readonly riot: Data;
    readonly email: Data;
    readonly pgpFingerprint: Option<U8aFixed>;
    readonly image: Data;
    readonly twitter: Data;
  }

  /** @name PalletIdentityBitFlags (296) */
  interface PalletIdentityBitFlags extends Set {
    readonly isDisplay: boolean;
    readonly isLegal: boolean;
    readonly isWeb: boolean;
    readonly isRiot: boolean;
    readonly isEmail: boolean;
    readonly isPgpFingerprint: boolean;
    readonly isImage: boolean;
    readonly isTwitter: boolean;
  }

  /** @name PalletIdentityIdentityField (297) */
  interface PalletIdentityIdentityField extends Enum {
    readonly isDisplay: boolean;
    readonly isLegal: boolean;
    readonly isWeb: boolean;
    readonly isRiot: boolean;
    readonly isEmail: boolean;
    readonly isPgpFingerprint: boolean;
    readonly isImage: boolean;
    readonly isTwitter: boolean;
    readonly type: 'Display' | 'Legal' | 'Web' | 'Riot' | 'Email' | 'PgpFingerprint' | 'Image' | 'Twitter';
  }

  /** @name PalletIdentityJudgement (298) */
  interface PalletIdentityJudgement extends Enum {
    readonly isUnknown: boolean;
    readonly isFeePaid: boolean;
    readonly asFeePaid: u128;
    readonly isReasonable: boolean;
    readonly isKnownGood: boolean;
    readonly isOutOfDate: boolean;
    readonly isLowQuality: boolean;
    readonly isErroneous: boolean;
    readonly type: 'Unknown' | 'FeePaid' | 'Reasonable' | 'KnownGood' | 'OutOfDate' | 'LowQuality' | 'Erroneous';
  }

  /** @name PalletProxyCall (299) */
  interface PalletProxyCall extends Enum {
    readonly isProxy: boolean;
    readonly asProxy: {
      readonly real: AccountId32;
      readonly forceProxyType: Option<XxnetworkRuntimeProxyType>;
      readonly call: Call;
    } & Struct;
    readonly isAddProxy: boolean;
    readonly asAddProxy: {
      readonly delegate: AccountId32;
      readonly proxyType: XxnetworkRuntimeProxyType;
      readonly delay: u32;
    } & Struct;
    readonly isRemoveProxy: boolean;
    readonly asRemoveProxy: {
      readonly delegate: AccountId32;
      readonly proxyType: XxnetworkRuntimeProxyType;
      readonly delay: u32;
    } & Struct;
    readonly isRemoveProxies: boolean;
    readonly isAnonymous: boolean;
    readonly asAnonymous: {
      readonly proxyType: XxnetworkRuntimeProxyType;
      readonly delay: u32;
      readonly index: u16;
    } & Struct;
    readonly isKillAnonymous: boolean;
    readonly asKillAnonymous: {
      readonly spawner: AccountId32;
      readonly proxyType: XxnetworkRuntimeProxyType;
      readonly index: u16;
      readonly height: Compact<u32>;
      readonly extIndex: Compact<u32>;
    } & Struct;
    readonly isAnnounce: boolean;
    readonly asAnnounce: {
      readonly real: AccountId32;
      readonly callHash: H256;
    } & Struct;
    readonly isRemoveAnnouncement: boolean;
    readonly asRemoveAnnouncement: {
      readonly real: AccountId32;
      readonly callHash: H256;
    } & Struct;
    readonly isRejectAnnouncement: boolean;
    readonly asRejectAnnouncement: {
      readonly delegate: AccountId32;
      readonly callHash: H256;
    } & Struct;
    readonly isProxyAnnounced: boolean;
    readonly asProxyAnnounced: {
      readonly delegate: AccountId32;
      readonly real: AccountId32;
      readonly forceProxyType: Option<XxnetworkRuntimeProxyType>;
      readonly call: Call;
    } & Struct;
    readonly type: 'Proxy' | 'AddProxy' | 'RemoveProxy' | 'RemoveProxies' | 'Anonymous' | 'KillAnonymous' | 'Announce' | 'RemoveAnnouncement' | 'RejectAnnouncement' | 'ProxyAnnounced';
  }

  /** @name PalletBountiesCall (301) */
  interface PalletBountiesCall extends Enum {
    readonly isProposeBounty: boolean;
    readonly asProposeBounty: {
      readonly value: Compact<u128>;
      readonly description: Bytes;
    } & Struct;
    readonly isApproveBounty: boolean;
    readonly asApproveBounty: {
      readonly bountyId: Compact<u32>;
    } & Struct;
    readonly isProposeCurator: boolean;
    readonly asProposeCurator: {
      readonly bountyId: Compact<u32>;
      readonly curator: MultiAddress;
      readonly fee: Compact<u128>;
    } & Struct;
    readonly isUnassignCurator: boolean;
    readonly asUnassignCurator: {
      readonly bountyId: Compact<u32>;
    } & Struct;
    readonly isAcceptCurator: boolean;
    readonly asAcceptCurator: {
      readonly bountyId: Compact<u32>;
    } & Struct;
    readonly isAwardBounty: boolean;
    readonly asAwardBounty: {
      readonly bountyId: Compact<u32>;
      readonly beneficiary: MultiAddress;
    } & Struct;
    readonly isClaimBounty: boolean;
    readonly asClaimBounty: {
      readonly bountyId: Compact<u32>;
    } & Struct;
    readonly isCloseBounty: boolean;
    readonly asCloseBounty: {
      readonly bountyId: Compact<u32>;
    } & Struct;
    readonly isExtendBountyExpiry: boolean;
    readonly asExtendBountyExpiry: {
      readonly bountyId: Compact<u32>;
      readonly remark: Bytes;
    } & Struct;
    readonly type: 'ProposeBounty' | 'ApproveBounty' | 'ProposeCurator' | 'UnassignCurator' | 'AcceptCurator' | 'AwardBounty' | 'ClaimBounty' | 'CloseBounty' | 'ExtendBountyExpiry';
  }

  /** @name PalletTipsCall (302) */
  interface PalletTipsCall extends Enum {
    readonly isReportAwesome: boolean;
    readonly asReportAwesome: {
      readonly reason: Bytes;
      readonly who: AccountId32;
    } & Struct;
    readonly isRetractTip: boolean;
    readonly asRetractTip: {
      readonly hash_: H256;
    } & Struct;
    readonly isTipNew: boolean;
    readonly asTipNew: {
      readonly reason: Bytes;
      readonly who: AccountId32;
      readonly tipValue: Compact<u128>;
    } & Struct;
    readonly isTip: boolean;
    readonly asTip: {
      readonly hash_: H256;
      readonly tipValue: Compact<u128>;
    } & Struct;
    readonly isCloseTip: boolean;
    readonly asCloseTip: {
      readonly hash_: H256;
    } & Struct;
    readonly isSlashTip: boolean;
    readonly asSlashTip: {
      readonly hash_: H256;
    } & Struct;
    readonly type: 'ReportAwesome' | 'RetractTip' | 'TipNew' | 'Tip' | 'CloseTip' | 'SlashTip';
  }

  /** @name ChainbridgeCall (303) */
  interface ChainbridgeCall extends Enum {
    readonly isSetThreshold: boolean;
    readonly asSetThreshold: {
      readonly threshold: u32;
    } & Struct;
    readonly isSetResource: boolean;
    readonly asSetResource: {
      readonly id: U8aFixed;
      readonly method: Bytes;
    } & Struct;
    readonly isRemoveResource: boolean;
    readonly asRemoveResource: {
      readonly id: U8aFixed;
    } & Struct;
    readonly isWhitelistChain: boolean;
    readonly asWhitelistChain: {
      readonly id: u8;
    } & Struct;
    readonly isAddRelayer: boolean;
    readonly asAddRelayer: {
      readonly v: AccountId32;
    } & Struct;
    readonly isRemoveRelayer: boolean;
    readonly asRemoveRelayer: {
      readonly v: AccountId32;
    } & Struct;
    readonly isAcknowledgeProposal: boolean;
    readonly asAcknowledgeProposal: {
      readonly nonce: u64;
      readonly srcId: u8;
      readonly rId: U8aFixed;
      readonly call: Call;
    } & Struct;
    readonly isRejectProposal: boolean;
    readonly asRejectProposal: {
      readonly nonce: u64;
      readonly srcId: u8;
      readonly rId: U8aFixed;
      readonly call: Call;
    } & Struct;
    readonly isEvalVoteState: boolean;
    readonly asEvalVoteState: {
      readonly nonce: u64;
      readonly srcId: u8;
      readonly prop: Call;
    } & Struct;
    readonly type: 'SetThreshold' | 'SetResource' | 'RemoveResource' | 'WhitelistChain' | 'AddRelayer' | 'RemoveRelayer' | 'AcknowledgeProposal' | 'RejectProposal' | 'EvalVoteState';
  }

  /** @name SwapCall (304) */
  interface SwapCall extends Enum {
    readonly isTransferNative: boolean;
    readonly asTransferNative: {
      readonly amount: u128;
      readonly recipient: Bytes;
      readonly destId: u8;
    } & Struct;
    readonly isTransfer: boolean;
    readonly asTransfer: {
      readonly to: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isSetSwapFee: boolean;
    readonly asSetSwapFee: {
      readonly fee: Compact<u128>;
    } & Struct;
    readonly isSetFeeDestination: boolean;
    readonly asSetFeeDestination: {
      readonly dest: AccountId32;
    } & Struct;
    readonly type: 'TransferNative' | 'Transfer' | 'SetSwapFee' | 'SetFeeDestination';
  }

  /** @name XxCmixCall (305) */
  interface XxCmixCall extends Enum {
    readonly isSetCmixHashes: boolean;
    readonly asSetCmixHashes: {
      readonly hashes: XxCmixCmixSoftwareHashes;
    } & Struct;
    readonly isSetSchedulingAccount: boolean;
    readonly asSetSchedulingAccount: {
      readonly who: AccountId32;
    } & Struct;
    readonly isSetNextCmixVariables: boolean;
    readonly asSetNextCmixVariables: {
      readonly variables: XxCmixCmixVariables;
    } & Struct;
    readonly isSubmitCmixPoints: boolean;
    readonly asSubmitCmixPoints: {
      readonly data: Vec<ITuple<[AccountId32, u32]>>;
    } & Struct;
    readonly isSubmitCmixDeductions: boolean;
    readonly asSubmitCmixDeductions: {
      readonly data: Vec<ITuple<[AccountId32, u32]>>;
    } & Struct;
    readonly isSetCmixAddressSpace: boolean;
    readonly asSetCmixAddressSpace: {
      readonly size_: u8;
    } & Struct;
    readonly isSetAdminPermission: boolean;
    readonly asSetAdminPermission: {
      readonly permission: u32;
    } & Struct;
    readonly type: 'SetCmixHashes' | 'SetSchedulingAccount' | 'SetNextCmixVariables' | 'SubmitCmixPoints' | 'SubmitCmixDeductions' | 'SetCmixAddressSpace' | 'SetAdminPermission';
  }

  /** @name XxCmixCmixSoftwareHashes (306) */
  interface XxCmixCmixSoftwareHashes extends Struct {
    readonly server: H256;
    readonly fatbin: H256;
    readonly libpow: H256;
    readonly gateway: H256;
    readonly scheduling: H256;
    readonly wrapper: H256;
    readonly udb: H256;
    readonly notifications: H256;
    readonly extra: Option<Vec<H256>>;
  }

  /** @name XxCmixCmixVariables (308) */
  interface XxCmixCmixVariables extends Struct {
    readonly performance: XxCmixCmixPerformance;
    readonly timeouts: XxCmixCmixTimeouts;
    readonly scheduling: XxCmixCmixScheduling;
    readonly registration: XxCmixCmixUserRegistration;
  }

  /** @name XxCmixCmixPerformance (309) */
  interface XxCmixCmixPerformance extends Struct {
    readonly period: u64;
    readonly points: XxCmixCmixRewardPoints;
    readonly countries: Vec<ITuple<[U8aFixed, u8]>>;
    readonly multipliers: Vec<ITuple<[u8, u16]>>;
  }

  /** @name XxCmixCmixRewardPoints (310) */
  interface XxCmixCmixRewardPoints extends Struct {
    readonly success: u32;
    readonly failure: u32;
    readonly block: u32;
  }

  /** @name XxCmixCmixTimeouts (315) */
  interface XxCmixCmixTimeouts extends Struct {
    readonly precomputation: u64;
    readonly realtime: u64;
    readonly advertisement: u64;
  }

  /** @name XxCmixCmixScheduling (316) */
  interface XxCmixCmixScheduling extends Struct {
    readonly teamSize: u8;
    readonly batchSize: u32;
    readonly minDelay: u64;
    readonly poolThreshold: Permill;
  }

  /** @name XxCmixCmixUserRegistration (318) */
  interface XxCmixCmixUserRegistration extends Struct {
    readonly max: u32;
    readonly period: u64;
  }

  /** @name XxEconomicsCall (321) */
  interface XxEconomicsCall extends Enum {
    readonly isSetInflationParams: boolean;
    readonly asSetInflationParams: {
      readonly params: XxEconomicsInflationInflationFixedParams;
    } & Struct;
    readonly isSetInterestPoints: boolean;
    readonly asSetInterestPoints: {
      readonly points: Vec<XxEconomicsInflationIdealInterestPoint>;
    } & Struct;
    readonly isSetLiquidityRewardsStake: boolean;
    readonly asSetLiquidityRewardsStake: {
      readonly amount: Compact<u128>;
    } & Struct;
    readonly isSetLiquidityRewardsBalance: boolean;
    readonly asSetLiquidityRewardsBalance: {
      readonly amount: Compact<u128>;
    } & Struct;
    readonly type: 'SetInflationParams' | 'SetInterestPoints' | 'SetLiquidityRewardsStake' | 'SetLiquidityRewardsBalance';
  }

  /** @name XxEconomicsInflationInflationFixedParams (322) */
  interface XxEconomicsInflationInflationFixedParams extends Struct {
    readonly minInflation: Compact<Perbill>;
    readonly idealStake: Compact<Perbill>;
    readonly falloff: Compact<Perbill>;
  }

  /** @name XxEconomicsInflationIdealInterestPoint (324) */
  interface XxEconomicsInflationIdealInterestPoint extends Struct {
    readonly block: u32;
    readonly interest: Compact<Perbill>;
  }

  /** @name XxTeamCustodyCall (325) */
  interface XxTeamCustodyCall extends Enum {
    readonly isPayout: boolean;
    readonly asPayout: {
      readonly who: AccountId32;
    } & Struct;
    readonly isCustodyBond: boolean;
    readonly asCustodyBond: {
      readonly custody: AccountId32;
      readonly controller: AccountId32;
      readonly value: Compact<u128>;
    } & Struct;
    readonly isCustodyBondExtra: boolean;
    readonly asCustodyBondExtra: {
      readonly custody: AccountId32;
      readonly value: Compact<u128>;
    } & Struct;
    readonly isCustodySetController: boolean;
    readonly asCustodySetController: {
      readonly custody: AccountId32;
      readonly controller: AccountId32;
    } & Struct;
    readonly isCustodySetProxy: boolean;
    readonly asCustodySetProxy: {
      readonly custody: AccountId32;
      readonly proxy: AccountId32;
    } & Struct;
    readonly isTeamCustodySetProxy: boolean;
    readonly asTeamCustodySetProxy: {
      readonly proxy: AccountId32;
    } & Struct;
    readonly isAddCustodian: boolean;
    readonly asAddCustodian: {
      readonly custodian: AccountId32;
    } & Struct;
    readonly isRemoveCustodian: boolean;
    readonly asRemoveCustodian: {
      readonly custodian: AccountId32;
    } & Struct;
    readonly isReplaceTeamMember: boolean;
    readonly asReplaceTeamMember: {
      readonly who: AccountId32;
      readonly new_: AccountId32;
    } & Struct;
    readonly type: 'Payout' | 'CustodyBond' | 'CustodyBondExtra' | 'CustodySetController' | 'CustodySetProxy' | 'TeamCustodySetProxy' | 'AddCustodian' | 'RemoveCustodian' | 'ReplaceTeamMember';
  }

  /** @name XxBetanetRewardsCall (326) */
  interface XxBetanetRewardsCall extends Enum {
    readonly isSelectOption: boolean;
    readonly asSelectOption: {
      readonly option: XxBetanetRewardsRewardOption;
    } & Struct;
    readonly isApprove: boolean;
    readonly type: 'SelectOption' | 'Approve';
  }

  /** @name XxPublicCall (327) */
  interface XxPublicCall extends Enum {
    readonly isSetTestnetManagerAccount: boolean;
    readonly asSetTestnetManagerAccount: {
      readonly who: AccountId32;
    } & Struct;
    readonly isSetSaleManagerAccount: boolean;
    readonly asSetSaleManagerAccount: {
      readonly who: AccountId32;
    } & Struct;
    readonly isTestnetDistribute: boolean;
    readonly asTestnetDistribute: {
      readonly data: Vec<XxPublicTransferData>;
    } & Struct;
    readonly isSaleDistribute: boolean;
    readonly asSaleDistribute: {
      readonly data: Vec<XxPublicTransferData>;
    } & Struct;
    readonly type: 'SetTestnetManagerAccount' | 'SetSaleManagerAccount' | 'TestnetDistribute' | 'SaleDistribute';
  }

  /** @name XxPublicTransferData (329) */
  interface XxPublicTransferData extends Struct {
    readonly destination: AccountId32;
    readonly amount: Compact<u128>;
    readonly schedules: Option<Vec<ITuple<[u128, u128, u32]>>>;
  }

  /** @name PalletMultisigCall (330) */
  interface PalletMultisigCall extends Enum {
    readonly isAsMultiThreshold1: boolean;
    readonly asAsMultiThreshold1: {
      readonly otherSignatories: Vec<AccountId32>;
      readonly call: Call;
    } & Struct;
    readonly isAsMulti: boolean;
    readonly asAsMulti: {
      readonly threshold: u16;
      readonly otherSignatories: Vec<AccountId32>;
      readonly maybeTimepoint: Option<PalletMultisigTimepoint>;
      readonly call: WrapperKeepOpaque<Call>;
      readonly storeCall: bool;
      readonly maxWeight: u64;
    } & Struct;
    readonly isApproveAsMulti: boolean;
    readonly asApproveAsMulti: {
      readonly threshold: u16;
      readonly otherSignatories: Vec<AccountId32>;
      readonly maybeTimepoint: Option<PalletMultisigTimepoint>;
      readonly callHash: U8aFixed;
      readonly maxWeight: u64;
    } & Struct;
    readonly isCancelAsMulti: boolean;
    readonly asCancelAsMulti: {
      readonly threshold: u16;
      readonly otherSignatories: Vec<AccountId32>;
      readonly timepoint: PalletMultisigTimepoint;
      readonly callHash: U8aFixed;
    } & Struct;
    readonly type: 'AsMultiThreshold1' | 'AsMulti' | 'ApproveAsMulti' | 'CancelAsMulti';
  }

  /** @name PalletRecoveryCall (333) */
  interface PalletRecoveryCall extends Enum {
    readonly isAsRecovered: boolean;
    readonly asAsRecovered: {
      readonly account: AccountId32;
      readonly call: Call;
    } & Struct;
    readonly isSetRecovered: boolean;
    readonly asSetRecovered: {
      readonly lost: AccountId32;
      readonly rescuer: AccountId32;
    } & Struct;
    readonly isCreateRecovery: boolean;
    readonly asCreateRecovery: {
      readonly friends: Vec<AccountId32>;
      readonly threshold: u16;
      readonly delayPeriod: u32;
    } & Struct;
    readonly isInitiateRecovery: boolean;
    readonly asInitiateRecovery: {
      readonly account: AccountId32;
    } & Struct;
    readonly isVouchRecovery: boolean;
    readonly asVouchRecovery: {
      readonly lost: AccountId32;
      readonly rescuer: AccountId32;
    } & Struct;
    readonly isClaimRecovery: boolean;
    readonly asClaimRecovery: {
      readonly account: AccountId32;
    } & Struct;
    readonly isCloseRecovery: boolean;
    readonly asCloseRecovery: {
      readonly rescuer: AccountId32;
    } & Struct;
    readonly isRemoveRecovery: boolean;
    readonly isCancelRecovered: boolean;
    readonly asCancelRecovered: {
      readonly account: AccountId32;
    } & Struct;
    readonly type: 'AsRecovered' | 'SetRecovered' | 'CreateRecovery' | 'InitiateRecovery' | 'VouchRecovery' | 'ClaimRecovery' | 'CloseRecovery' | 'RemoveRecovery' | 'CancelRecovered';
  }

  /** @name PalletAssetsCall (334) */
  interface PalletAssetsCall extends Enum {
    readonly isCreate: boolean;
    readonly asCreate: {
      readonly id: Compact<u32>;
      readonly admin: MultiAddress;
      readonly minBalance: u64;
    } & Struct;
    readonly isForceCreate: boolean;
    readonly asForceCreate: {
      readonly id: Compact<u32>;
      readonly owner: MultiAddress;
      readonly isSufficient: bool;
      readonly minBalance: Compact<u64>;
    } & Struct;
    readonly isDestroy: boolean;
    readonly asDestroy: {
      readonly id: Compact<u32>;
      readonly witness: PalletAssetsDestroyWitness;
    } & Struct;
    readonly isMint: boolean;
    readonly asMint: {
      readonly id: Compact<u32>;
      readonly beneficiary: MultiAddress;
      readonly amount: Compact<u64>;
    } & Struct;
    readonly isBurn: boolean;
    readonly asBurn: {
      readonly id: Compact<u32>;
      readonly who: MultiAddress;
      readonly amount: Compact<u64>;
    } & Struct;
    readonly isTransfer: boolean;
    readonly asTransfer: {
      readonly id: Compact<u32>;
      readonly target: MultiAddress;
      readonly amount: Compact<u64>;
    } & Struct;
    readonly isTransferKeepAlive: boolean;
    readonly asTransferKeepAlive: {
      readonly id: Compact<u32>;
      readonly target: MultiAddress;
      readonly amount: Compact<u64>;
    } & Struct;
    readonly isForceTransfer: boolean;
    readonly asForceTransfer: {
      readonly id: Compact<u32>;
      readonly source: MultiAddress;
      readonly dest: MultiAddress;
      readonly amount: Compact<u64>;
    } & Struct;
    readonly isFreeze: boolean;
    readonly asFreeze: {
      readonly id: Compact<u32>;
      readonly who: MultiAddress;
    } & Struct;
    readonly isThaw: boolean;
    readonly asThaw: {
      readonly id: Compact<u32>;
      readonly who: MultiAddress;
    } & Struct;
    readonly isFreezeAsset: boolean;
    readonly asFreezeAsset: {
      readonly id: Compact<u32>;
    } & Struct;
    readonly isThawAsset: boolean;
    readonly asThawAsset: {
      readonly id: Compact<u32>;
    } & Struct;
    readonly isTransferOwnership: boolean;
    readonly asTransferOwnership: {
      readonly id: Compact<u32>;
      readonly owner: MultiAddress;
    } & Struct;
    readonly isSetTeam: boolean;
    readonly asSetTeam: {
      readonly id: Compact<u32>;
      readonly issuer: MultiAddress;
      readonly admin: MultiAddress;
      readonly freezer: MultiAddress;
    } & Struct;
    readonly isSetMetadata: boolean;
    readonly asSetMetadata: {
      readonly id: Compact<u32>;
      readonly name: Bytes;
      readonly symbol: Bytes;
      readonly decimals: u8;
    } & Struct;
    readonly isClearMetadata: boolean;
    readonly asClearMetadata: {
      readonly id: Compact<u32>;
    } & Struct;
    readonly isForceSetMetadata: boolean;
    readonly asForceSetMetadata: {
      readonly id: Compact<u32>;
      readonly name: Bytes;
      readonly symbol: Bytes;
      readonly decimals: u8;
      readonly isFrozen: bool;
    } & Struct;
    readonly isForceClearMetadata: boolean;
    readonly asForceClearMetadata: {
      readonly id: Compact<u32>;
    } & Struct;
    readonly isForceAssetStatus: boolean;
    readonly asForceAssetStatus: {
      readonly id: Compact<u32>;
      readonly owner: MultiAddress;
      readonly issuer: MultiAddress;
      readonly admin: MultiAddress;
      readonly freezer: MultiAddress;
      readonly minBalance: Compact<u64>;
      readonly isSufficient: bool;
      readonly isFrozen: bool;
    } & Struct;
    readonly isApproveTransfer: boolean;
    readonly asApproveTransfer: {
      readonly id: Compact<u32>;
      readonly delegate: MultiAddress;
      readonly amount: Compact<u64>;
    } & Struct;
    readonly isCancelApproval: boolean;
    readonly asCancelApproval: {
      readonly id: Compact<u32>;
      readonly delegate: MultiAddress;
    } & Struct;
    readonly isForceCancelApproval: boolean;
    readonly asForceCancelApproval: {
      readonly id: Compact<u32>;
      readonly owner: MultiAddress;
      readonly delegate: MultiAddress;
    } & Struct;
    readonly isTransferApproved: boolean;
    readonly asTransferApproved: {
      readonly id: Compact<u32>;
      readonly owner: MultiAddress;
      readonly destination: MultiAddress;
      readonly amount: Compact<u64>;
    } & Struct;
    readonly type: 'Create' | 'ForceCreate' | 'Destroy' | 'Mint' | 'Burn' | 'Transfer' | 'TransferKeepAlive' | 'ForceTransfer' | 'Freeze' | 'Thaw' | 'FreezeAsset' | 'ThawAsset' | 'TransferOwnership' | 'SetTeam' | 'SetMetadata' | 'ClearMetadata' | 'ForceSetMetadata' | 'ForceClearMetadata' | 'ForceAssetStatus' | 'ApproveTransfer' | 'CancelApproval' | 'ForceCancelApproval' | 'TransferApproved';
  }

  /** @name PalletAssetsDestroyWitness (335) */
  interface PalletAssetsDestroyWitness extends Struct {
    readonly accounts: Compact<u32>;
    readonly sufficients: Compact<u32>;
    readonly approvals: Compact<u32>;
  }

  /** @name PalletUniquesCall (336) */
  interface PalletUniquesCall extends Enum {
    readonly isCreate: boolean;
    readonly asCreate: {
      readonly class: Compact<u32>;
      readonly admin: MultiAddress;
    } & Struct;
    readonly isForceCreate: boolean;
    readonly asForceCreate: {
      readonly class: Compact<u32>;
      readonly owner: MultiAddress;
      readonly freeHolding: bool;
    } & Struct;
    readonly isDestroy: boolean;
    readonly asDestroy: {
      readonly class: Compact<u32>;
      readonly witness: PalletUniquesDestroyWitness;
    } & Struct;
    readonly isMint: boolean;
    readonly asMint: {
      readonly class: Compact<u32>;
      readonly instance: Compact<u32>;
      readonly owner: MultiAddress;
    } & Struct;
    readonly isBurn: boolean;
    readonly asBurn: {
      readonly class: Compact<u32>;
      readonly instance: Compact<u32>;
      readonly checkOwner: Option<MultiAddress>;
    } & Struct;
    readonly isTransfer: boolean;
    readonly asTransfer: {
      readonly class: Compact<u32>;
      readonly instance: Compact<u32>;
      readonly dest: MultiAddress;
    } & Struct;
    readonly isRedeposit: boolean;
    readonly asRedeposit: {
      readonly class: Compact<u32>;
      readonly instances: Vec<u32>;
    } & Struct;
    readonly isFreeze: boolean;
    readonly asFreeze: {
      readonly class: Compact<u32>;
      readonly instance: Compact<u32>;
    } & Struct;
    readonly isThaw: boolean;
    readonly asThaw: {
      readonly class: Compact<u32>;
      readonly instance: Compact<u32>;
    } & Struct;
    readonly isFreezeClass: boolean;
    readonly asFreezeClass: {
      readonly class: Compact<u32>;
    } & Struct;
    readonly isThawClass: boolean;
    readonly asThawClass: {
      readonly class: Compact<u32>;
    } & Struct;
    readonly isTransferOwnership: boolean;
    readonly asTransferOwnership: {
      readonly class: Compact<u32>;
      readonly owner: MultiAddress;
    } & Struct;
    readonly isSetTeam: boolean;
    readonly asSetTeam: {
      readonly class: Compact<u32>;
      readonly issuer: MultiAddress;
      readonly admin: MultiAddress;
      readonly freezer: MultiAddress;
    } & Struct;
    readonly isApproveTransfer: boolean;
    readonly asApproveTransfer: {
      readonly class: Compact<u32>;
      readonly instance: Compact<u32>;
      readonly delegate: MultiAddress;
    } & Struct;
    readonly isCancelApproval: boolean;
    readonly asCancelApproval: {
      readonly class: Compact<u32>;
      readonly instance: Compact<u32>;
      readonly maybeCheckDelegate: Option<MultiAddress>;
    } & Struct;
    readonly isForceAssetStatus: boolean;
    readonly asForceAssetStatus: {
      readonly class: Compact<u32>;
      readonly owner: MultiAddress;
      readonly issuer: MultiAddress;
      readonly admin: MultiAddress;
      readonly freezer: MultiAddress;
      readonly freeHolding: bool;
      readonly isFrozen: bool;
    } & Struct;
    readonly isSetAttribute: boolean;
    readonly asSetAttribute: {
      readonly class: Compact<u32>;
      readonly maybeInstance: Option<u32>;
      readonly key: Bytes;
      readonly value: Bytes;
    } & Struct;
    readonly isClearAttribute: boolean;
    readonly asClearAttribute: {
      readonly class: Compact<u32>;
      readonly maybeInstance: Option<u32>;
      readonly key: Bytes;
    } & Struct;
    readonly isSetMetadata: boolean;
    readonly asSetMetadata: {
      readonly class: Compact<u32>;
      readonly instance: Compact<u32>;
      readonly data: Bytes;
      readonly isFrozen: bool;
    } & Struct;
    readonly isClearMetadata: boolean;
    readonly asClearMetadata: {
      readonly class: Compact<u32>;
      readonly instance: Compact<u32>;
    } & Struct;
    readonly isSetClassMetadata: boolean;
    readonly asSetClassMetadata: {
      readonly class: Compact<u32>;
      readonly data: Bytes;
      readonly isFrozen: bool;
    } & Struct;
    readonly isClearClassMetadata: boolean;
    readonly asClearClassMetadata: {
      readonly class: Compact<u32>;
    } & Struct;
    readonly type: 'Create' | 'ForceCreate' | 'Destroy' | 'Mint' | 'Burn' | 'Transfer' | 'Redeposit' | 'Freeze' | 'Thaw' | 'FreezeClass' | 'ThawClass' | 'TransferOwnership' | 'SetTeam' | 'ApproveTransfer' | 'CancelApproval' | 'ForceAssetStatus' | 'SetAttribute' | 'ClearAttribute' | 'SetMetadata' | 'ClearMetadata' | 'SetClassMetadata' | 'ClearClassMetadata';
  }

  /** @name PalletUniquesDestroyWitness (337) */
  interface PalletUniquesDestroyWitness extends Struct {
    readonly instances: Compact<u32>;
    readonly instanceMetadatas: Compact<u32>;
    readonly attributes: Compact<u32>;
  }

  /** @name PalletSchedulerReleases (339) */
  interface PalletSchedulerReleases extends Enum {
    readonly isV1: boolean;
    readonly isV2: boolean;
    readonly type: 'V1' | 'V2';
  }

  /** @name PalletSchedulerError (340) */
  interface PalletSchedulerError extends Enum {
    readonly isFailedToSchedule: boolean;
    readonly isNotFound: boolean;
    readonly isTargetBlockNumberInPast: boolean;
    readonly isRescheduleNoChange: boolean;
    readonly type: 'FailedToSchedule' | 'NotFound' | 'TargetBlockNumberInPast' | 'RescheduleNoChange';
  }

  /** @name SpConsensusBabeBabeEpochConfiguration (347) */
  interface SpConsensusBabeBabeEpochConfiguration extends Struct {
    readonly c: ITuple<[u64, u64]>;
    readonly allowedSlots: SpConsensusBabeAllowedSlots;
  }

  /** @name PalletBabeError (348) */
  interface PalletBabeError extends Enum {
    readonly isInvalidEquivocationProof: boolean;
    readonly isInvalidKeyOwnershipProof: boolean;
    readonly isDuplicateOffenceReport: boolean;
    readonly type: 'InvalidEquivocationProof' | 'InvalidKeyOwnershipProof' | 'DuplicateOffenceReport';
  }

  /** @name PalletBalancesBalanceLock (350) */
  interface PalletBalancesBalanceLock extends Struct {
    readonly id: U8aFixed;
    readonly amount: u128;
    readonly reasons: PalletBalancesReasons;
  }

  /** @name PalletBalancesReasons (351) */
  interface PalletBalancesReasons extends Enum {
    readonly isFee: boolean;
    readonly isMisc: boolean;
    readonly isAll: boolean;
    readonly type: 'Fee' | 'Misc' | 'All';
  }

  /** @name PalletBalancesReserveData (354) */
  interface PalletBalancesReserveData extends Struct {
    readonly id: U8aFixed;
    readonly amount: u128;
  }

  /** @name PalletBalancesReleases (356) */
  interface PalletBalancesReleases extends Enum {
    readonly isV100: boolean;
    readonly isV200: boolean;
    readonly type: 'V100' | 'V200';
  }

  /** @name PalletBalancesError (357) */
  interface PalletBalancesError extends Enum {
    readonly isVestingBalance: boolean;
    readonly isLiquidityRestrictions: boolean;
    readonly isInsufficientBalance: boolean;
    readonly isExistentialDeposit: boolean;
    readonly isKeepAlive: boolean;
    readonly isExistingVestingSchedule: boolean;
    readonly isDeadAccount: boolean;
    readonly isTooManyReserves: boolean;
    readonly type: 'VestingBalance' | 'LiquidityRestrictions' | 'InsufficientBalance' | 'ExistentialDeposit' | 'KeepAlive' | 'ExistingVestingSchedule' | 'DeadAccount' | 'TooManyReserves';
  }

  /** @name PalletTransactionPaymentReleases (359) */
  interface PalletTransactionPaymentReleases extends Enum {
    readonly isV1Ancient: boolean;
    readonly isV2: boolean;
    readonly type: 'V1Ancient' | 'V2';
  }

  /** @name FrameSupportWeightsWeightToFeeCoefficient (361) */
  interface FrameSupportWeightsWeightToFeeCoefficient extends Struct {
    readonly coeffInteger: u128;
    readonly coeffFrac: Perbill;
    readonly negative: bool;
    readonly degree: u8;
  }

  /** @name PalletAuthorshipUncleEntryItem (363) */
  interface PalletAuthorshipUncleEntryItem extends Enum {
    readonly isInclusionHeight: boolean;
    readonly asInclusionHeight: u32;
    readonly isUncle: boolean;
    readonly asUncle: ITuple<[H256, Option<AccountId32>]>;
    readonly type: 'InclusionHeight' | 'Uncle';
  }

  /** @name PalletAuthorshipError (364) */
  interface PalletAuthorshipError extends Enum {
    readonly isInvalidUncleParent: boolean;
    readonly isUnclesAlreadySet: boolean;
    readonly isTooManyUncles: boolean;
    readonly isGenesisUncle: boolean;
    readonly isTooHighUncle: boolean;
    readonly isUncleAlreadyIncluded: boolean;
    readonly isOldUncle: boolean;
    readonly type: 'InvalidUncleParent' | 'UnclesAlreadySet' | 'TooManyUncles' | 'GenesisUncle' | 'TooHighUncle' | 'UncleAlreadyIncluded' | 'OldUncle';
  }

  /** @name PalletStakingStakingLedger (365) */
  interface PalletStakingStakingLedger extends Struct {
    readonly stash: AccountId32;
    readonly total: Compact<u128>;
    readonly active: Compact<u128>;
    readonly unlocking: Vec<PalletStakingUnlockChunk>;
    readonly claimedRewards: Vec<u32>;
    readonly cmixId: Option<H256>;
  }

  /** @name PalletStakingUnlockChunk (367) */
  interface PalletStakingUnlockChunk extends Struct {
    readonly value: Compact<u128>;
    readonly era: Compact<u32>;
  }

  /** @name PalletStakingNominations (368) */
  interface PalletStakingNominations extends Struct {
    readonly targets: Vec<AccountId32>;
    readonly submittedIn: u32;
    readonly suppressed: bool;
  }

  /** @name PalletStakingActiveEraInfo (369) */
  interface PalletStakingActiveEraInfo extends Struct {
    readonly index: u32;
    readonly start: Option<u64>;
  }

  /** @name PalletStakingEraRewardPoints (371) */
  interface PalletStakingEraRewardPoints extends Struct {
    readonly total: u32;
    readonly individual: BTreeMap<AccountId32, u32>;
  }

  /** @name PalletStakingForcing (373) */
  interface PalletStakingForcing extends Enum {
    readonly isNotForcing: boolean;
    readonly isForceNew: boolean;
    readonly isForceNone: boolean;
    readonly isForceAlways: boolean;
    readonly type: 'NotForcing' | 'ForceNew' | 'ForceNone' | 'ForceAlways';
  }

  /** @name PalletStakingUnappliedSlash (375) */
  interface PalletStakingUnappliedSlash extends Struct {
    readonly validator: AccountId32;
    readonly own: u128;
    readonly others: Vec<ITuple<[AccountId32, u128]>>;
    readonly reporters: Vec<AccountId32>;
    readonly payout: u128;
  }

  /** @name PalletStakingSlashingSlashingSpans (377) */
  interface PalletStakingSlashingSlashingSpans extends Struct {
    readonly spanIndex: u32;
    readonly lastStart: u32;
    readonly lastNonzeroSlash: u32;
    readonly prior: Vec<u32>;
  }

  /** @name PalletStakingSlashingSpanRecord (378) */
  interface PalletStakingSlashingSpanRecord extends Struct {
    readonly slashed: u128;
    readonly paidOut: u128;
  }

  /** @name PalletStakingReleases (381) */
  interface PalletStakingReleases extends Enum {
    readonly isV100Ancient: boolean;
    readonly isV200: boolean;
    readonly isV300: boolean;
    readonly isV400: boolean;
    readonly isV500: boolean;
    readonly isV600: boolean;
    readonly isV700: boolean;
    readonly isV750: boolean;
    readonly isV800: boolean;
    readonly type: 'V100Ancient' | 'V200' | 'V300' | 'V400' | 'V500' | 'V600' | 'V700' | 'V750' | 'V800';
  }

  /** @name PalletStakingPalletError (382) */
  interface PalletStakingPalletError extends Enum {
    readonly isNotController: boolean;
    readonly isNotStash: boolean;
    readonly isAlreadyBonded: boolean;
    readonly isAlreadyPaired: boolean;
    readonly isEmptyTargets: boolean;
    readonly isDuplicateIndex: boolean;
    readonly isInvalidSlashIndex: boolean;
    readonly isInsufficientBond: boolean;
    readonly isNoMoreChunks: boolean;
    readonly isNoUnlockChunk: boolean;
    readonly isFundedTarget: boolean;
    readonly isInvalidEraToReward: boolean;
    readonly isInvalidNumberOfNominations: boolean;
    readonly isNotSortedAndUnique: boolean;
    readonly isAlreadyClaimed: boolean;
    readonly isIncorrectHistoryDepth: boolean;
    readonly isIncorrectSlashingSpans: boolean;
    readonly isBadState: boolean;
    readonly isTooManyTargets: boolean;
    readonly isBadTarget: boolean;
    readonly isCannotChillOther: boolean;
    readonly isTooManyNominators: boolean;
    readonly isTooManyValidators: boolean;
    readonly isValidatorCmixIdNotUnique: boolean;
    readonly isValidatorMustHaveCmixId: boolean;
    readonly isValidatorCommissionTooLow: boolean;
    readonly isStashAlreadyHasCmixId: boolean;
    readonly isStashNoCmixId: boolean;
    readonly isStashValidating: boolean;
    readonly isStashActiveValidator: boolean;
    readonly isStashElectedValidator: boolean;
    readonly isElectionOngoing: boolean;
    readonly type: 'NotController' | 'NotStash' | 'AlreadyBonded' | 'AlreadyPaired' | 'EmptyTargets' | 'DuplicateIndex' | 'InvalidSlashIndex' | 'InsufficientBond' | 'NoMoreChunks' | 'NoUnlockChunk' | 'FundedTarget' | 'InvalidEraToReward' | 'InvalidNumberOfNominations' | 'NotSortedAndUnique' | 'AlreadyClaimed' | 'IncorrectHistoryDepth' | 'IncorrectSlashingSpans' | 'BadState' | 'TooManyTargets' | 'BadTarget' | 'CannotChillOther' | 'TooManyNominators' | 'TooManyValidators' | 'ValidatorCmixIdNotUnique' | 'ValidatorMustHaveCmixId' | 'ValidatorCommissionTooLow' | 'StashAlreadyHasCmixId' | 'StashNoCmixId' | 'StashValidating' | 'StashActiveValidator' | 'StashElectedValidator' | 'ElectionOngoing';
  }

  /** @name PalletElectionProviderMultiPhasePhase (383) */
  interface PalletElectionProviderMultiPhasePhase extends Enum {
    readonly isOff: boolean;
    readonly isSigned: boolean;
    readonly isUnsigned: boolean;
    readonly asUnsigned: ITuple<[bool, u32]>;
    readonly isEmergency: boolean;
    readonly type: 'Off' | 'Signed' | 'Unsigned' | 'Emergency';
  }

  /** @name PalletElectionProviderMultiPhaseReadySolution (385) */
  interface PalletElectionProviderMultiPhaseReadySolution extends Struct {
    readonly supports: Vec<ITuple<[AccountId32, SpNposElectionsSupport]>>;
    readonly score: Vec<u128>;
    readonly compute: PalletElectionProviderMultiPhaseElectionCompute;
  }

  /** @name PalletElectionProviderMultiPhaseRoundSnapshot (386) */
  interface PalletElectionProviderMultiPhaseRoundSnapshot extends Struct {
    readonly voters: Vec<ITuple<[AccountId32, u64, Vec<AccountId32>]>>;
    readonly targets: Vec<AccountId32>;
  }

  /** @name PalletElectionProviderMultiPhaseSignedSignedSubmission (393) */
  interface PalletElectionProviderMultiPhaseSignedSignedSubmission extends Struct {
    readonly who: AccountId32;
    readonly deposit: u128;
    readonly rawSolution: PalletElectionProviderMultiPhaseRawSolution;
    readonly reward: u128;
  }

  /** @name PalletElectionProviderMultiPhaseError (394) */
  interface PalletElectionProviderMultiPhaseError extends Enum {
    readonly isPreDispatchEarlySubmission: boolean;
    readonly isPreDispatchWrongWinnerCount: boolean;
    readonly isPreDispatchWeakSubmission: boolean;
    readonly isSignedQueueFull: boolean;
    readonly isSignedCannotPayDeposit: boolean;
    readonly isSignedInvalidWitness: boolean;
    readonly isSignedTooMuchWeight: boolean;
    readonly isOcwCallWrongEra: boolean;
    readonly isMissingSnapshotMetadata: boolean;
    readonly isInvalidSubmissionIndex: boolean;
    readonly isCallNotAllowed: boolean;
    readonly type: 'PreDispatchEarlySubmission' | 'PreDispatchWrongWinnerCount' | 'PreDispatchWeakSubmission' | 'SignedQueueFull' | 'SignedCannotPayDeposit' | 'SignedInvalidWitness' | 'SignedTooMuchWeight' | 'OcwCallWrongEra' | 'MissingSnapshotMetadata' | 'InvalidSubmissionIndex' | 'CallNotAllowed';
  }

  /** @name SpStakingOffenceOffenceDetails (395) */
  interface SpStakingOffenceOffenceDetails extends Struct {
    readonly offender: ITuple<[AccountId32, PalletStakingExposure]>;
    readonly reporters: Vec<AccountId32>;
  }

  /** @name SpCoreCryptoKeyTypeId (400) */
  interface SpCoreCryptoKeyTypeId extends U8aFixed {}

  /** @name PalletSessionError (401) */
  interface PalletSessionError extends Enum {
    readonly isInvalidProof: boolean;
    readonly isNoAssociatedValidatorId: boolean;
    readonly isDuplicatedKey: boolean;
    readonly isNoKeys: boolean;
    readonly isNoAccount: boolean;
    readonly type: 'InvalidProof' | 'NoAssociatedValidatorId' | 'DuplicatedKey' | 'NoKeys' | 'NoAccount';
  }

  /** @name PalletGrandpaStoredState (402) */
  interface PalletGrandpaStoredState extends Enum {
    readonly isLive: boolean;
    readonly isPendingPause: boolean;
    readonly asPendingPause: {
      readonly scheduledAt: u32;
      readonly delay: u32;
    } & Struct;
    readonly isPaused: boolean;
    readonly isPendingResume: boolean;
    readonly asPendingResume: {
      readonly scheduledAt: u32;
      readonly delay: u32;
    } & Struct;
    readonly type: 'Live' | 'PendingPause' | 'Paused' | 'PendingResume';
  }

  /** @name PalletGrandpaStoredPendingChange (403) */
  interface PalletGrandpaStoredPendingChange extends Struct {
    readonly scheduledAt: u32;
    readonly delay: u32;
    readonly nextAuthorities: Vec<ITuple<[SpFinalityGrandpaAppPublic, u64]>>;
    readonly forced: Option<u32>;
  }

  /** @name PalletGrandpaError (405) */
  interface PalletGrandpaError extends Enum {
    readonly isPauseFailed: boolean;
    readonly isResumeFailed: boolean;
    readonly isChangePending: boolean;
    readonly isTooSoon: boolean;
    readonly isInvalidKeyOwnershipProof: boolean;
    readonly isInvalidEquivocationProof: boolean;
    readonly isDuplicateOffenceReport: boolean;
    readonly type: 'PauseFailed' | 'ResumeFailed' | 'ChangePending' | 'TooSoon' | 'InvalidKeyOwnershipProof' | 'InvalidEquivocationProof' | 'DuplicateOffenceReport';
  }

  /** @name PalletImOnlineBoundedOpaqueNetworkState (409) */
  interface PalletImOnlineBoundedOpaqueNetworkState extends Struct {
    readonly peerId: Bytes;
    readonly externalAddresses: Vec<Bytes>;
  }

  /** @name PalletImOnlineError (413) */
  interface PalletImOnlineError extends Enum {
    readonly isInvalidKey: boolean;
    readonly isDuplicatedHeartbeat: boolean;
    readonly type: 'InvalidKey' | 'DuplicatedHeartbeat';
  }

  /** @name PalletDemocracyPreimageStatus (417) */
  interface PalletDemocracyPreimageStatus extends Enum {
    readonly isMissing: boolean;
    readonly asMissing: u32;
    readonly isAvailable: boolean;
    readonly asAvailable: {
      readonly data: Bytes;
      readonly provider: AccountId32;
      readonly deposit: u128;
      readonly since: u32;
      readonly expiry: Option<u32>;
    } & Struct;
    readonly type: 'Missing' | 'Available';
  }

  /** @name PalletDemocracyReferendumInfo (418) */
  interface PalletDemocracyReferendumInfo extends Enum {
    readonly isOngoing: boolean;
    readonly asOngoing: PalletDemocracyReferendumStatus;
    readonly isFinished: boolean;
    readonly asFinished: {
      readonly approved: bool;
      readonly end: u32;
    } & Struct;
    readonly type: 'Ongoing' | 'Finished';
  }

  /** @name PalletDemocracyReferendumStatus (419) */
  interface PalletDemocracyReferendumStatus extends Struct {
    readonly end: u32;
    readonly proposalHash: H256;
    readonly threshold: PalletDemocracyVoteThreshold;
    readonly delay: u32;
    readonly tally: PalletDemocracyTally;
  }

  /** @name PalletDemocracyTally (420) */
  interface PalletDemocracyTally extends Struct {
    readonly ayes: u128;
    readonly nays: u128;
    readonly turnout: u128;
  }

  /** @name PalletDemocracyVoteVoting (421) */
  interface PalletDemocracyVoteVoting extends Enum {
    readonly isDirect: boolean;
    readonly asDirect: {
      readonly votes: Vec<ITuple<[u32, PalletDemocracyVoteAccountVote]>>;
      readonly delegations: PalletDemocracyDelegations;
      readonly prior: PalletDemocracyVotePriorLock;
    } & Struct;
    readonly isDelegating: boolean;
    readonly asDelegating: {
      readonly balance: u128;
      readonly target: AccountId32;
      readonly conviction: PalletDemocracyConviction;
      readonly delegations: PalletDemocracyDelegations;
      readonly prior: PalletDemocracyVotePriorLock;
    } & Struct;
    readonly type: 'Direct' | 'Delegating';
  }

  /** @name PalletDemocracyDelegations (424) */
  interface PalletDemocracyDelegations extends Struct {
    readonly votes: u128;
    readonly capital: u128;
  }

  /** @name PalletDemocracyVotePriorLock (425) */
  interface PalletDemocracyVotePriorLock extends ITuple<[u32, u128]> {}

  /** @name PalletDemocracyReleases (428) */
  interface PalletDemocracyReleases extends Enum {
    readonly isV1: boolean;
    readonly type: 'V1';
  }

  /** @name PalletDemocracyError (429) */
  interface PalletDemocracyError extends Enum {
    readonly isValueLow: boolean;
    readonly isProposalMissing: boolean;
    readonly isAlreadyCanceled: boolean;
    readonly isDuplicateProposal: boolean;
    readonly isProposalBlacklisted: boolean;
    readonly isNotSimpleMajority: boolean;
    readonly isInvalidHash: boolean;
    readonly isNoProposal: boolean;
    readonly isAlreadyVetoed: boolean;
    readonly isDuplicatePreimage: boolean;
    readonly isNotImminent: boolean;
    readonly isTooEarly: boolean;
    readonly isImminent: boolean;
    readonly isPreimageMissing: boolean;
    readonly isReferendumInvalid: boolean;
    readonly isPreimageInvalid: boolean;
    readonly isNoneWaiting: boolean;
    readonly isNotVoter: boolean;
    readonly isNoPermission: boolean;
    readonly isAlreadyDelegating: boolean;
    readonly isInsufficientFunds: boolean;
    readonly isNotDelegating: boolean;
    readonly isVotesExist: boolean;
    readonly isInstantNotAllowed: boolean;
    readonly isNonsense: boolean;
    readonly isWrongUpperBound: boolean;
    readonly isMaxVotesReached: boolean;
    readonly isTooManyProposals: boolean;
    readonly type: 'ValueLow' | 'ProposalMissing' | 'AlreadyCanceled' | 'DuplicateProposal' | 'ProposalBlacklisted' | 'NotSimpleMajority' | 'InvalidHash' | 'NoProposal' | 'AlreadyVetoed' | 'DuplicatePreimage' | 'NotImminent' | 'TooEarly' | 'Imminent' | 'PreimageMissing' | 'ReferendumInvalid' | 'PreimageInvalid' | 'NoneWaiting' | 'NotVoter' | 'NoPermission' | 'AlreadyDelegating' | 'InsufficientFunds' | 'NotDelegating' | 'VotesExist' | 'InstantNotAllowed' | 'Nonsense' | 'WrongUpperBound' | 'MaxVotesReached' | 'TooManyProposals';
  }

  /** @name PalletCollectiveVotes (431) */
  interface PalletCollectiveVotes extends Struct {
    readonly index: u32;
    readonly threshold: u32;
    readonly ayes: Vec<AccountId32>;
    readonly nays: Vec<AccountId32>;
    readonly end: u32;
  }

  /** @name PalletCollectiveError (432) */
  interface PalletCollectiveError extends Enum {
    readonly isNotMember: boolean;
    readonly isDuplicateProposal: boolean;
    readonly isProposalMissing: boolean;
    readonly isWrongIndex: boolean;
    readonly isDuplicateVote: boolean;
    readonly isAlreadyInitialized: boolean;
    readonly isTooEarly: boolean;
    readonly isTooManyProposals: boolean;
    readonly isWrongProposalWeight: boolean;
    readonly isWrongProposalLength: boolean;
    readonly type: 'NotMember' | 'DuplicateProposal' | 'ProposalMissing' | 'WrongIndex' | 'DuplicateVote' | 'AlreadyInitialized' | 'TooEarly' | 'TooManyProposals' | 'WrongProposalWeight' | 'WrongProposalLength';
  }

  /** @name PalletElectionsPhragmenSeatHolder (436) */
  interface PalletElectionsPhragmenSeatHolder extends Struct {
    readonly who: AccountId32;
    readonly stake: u128;
    readonly deposit: u128;
  }

  /** @name PalletElectionsPhragmenVoter (437) */
  interface PalletElectionsPhragmenVoter extends Struct {
    readonly votes: Vec<AccountId32>;
    readonly stake: u128;
    readonly deposit: u128;
  }

  /** @name PalletElectionsPhragmenError (438) */
  interface PalletElectionsPhragmenError extends Enum {
    readonly isUnableToVote: boolean;
    readonly isNoVotes: boolean;
    readonly isTooManyVotes: boolean;
    readonly isMaximumVotesExceeded: boolean;
    readonly isLowBalance: boolean;
    readonly isUnableToPayBond: boolean;
    readonly isMustBeVoter: boolean;
    readonly isReportSelf: boolean;
    readonly isDuplicatedCandidate: boolean;
    readonly isMemberSubmit: boolean;
    readonly isRunnerUpSubmit: boolean;
    readonly isInsufficientCandidateFunds: boolean;
    readonly isNotMember: boolean;
    readonly isInvalidWitnessData: boolean;
    readonly isInvalidVoteCount: boolean;
    readonly isInvalidRenouncing: boolean;
    readonly isInvalidReplacement: boolean;
    readonly type: 'UnableToVote' | 'NoVotes' | 'TooManyVotes' | 'MaximumVotesExceeded' | 'LowBalance' | 'UnableToPayBond' | 'MustBeVoter' | 'ReportSelf' | 'DuplicatedCandidate' | 'MemberSubmit' | 'RunnerUpSubmit' | 'InsufficientCandidateFunds' | 'NotMember' | 'InvalidWitnessData' | 'InvalidVoteCount' | 'InvalidRenouncing' | 'InvalidReplacement';
  }

  /** @name PalletMembershipError (439) */
  interface PalletMembershipError extends Enum {
    readonly isAlreadyMember: boolean;
    readonly isNotMember: boolean;
    readonly type: 'AlreadyMember' | 'NotMember';
  }

  /** @name PalletTreasuryProposal (440) */
  interface PalletTreasuryProposal extends Struct {
    readonly proposer: AccountId32;
    readonly value: u128;
    readonly beneficiary: AccountId32;
    readonly bond: u128;
  }

  /** @name FrameSupportPalletId (442) */
  interface FrameSupportPalletId extends U8aFixed {}

  /** @name PalletTreasuryError (443) */
  interface PalletTreasuryError extends Enum {
    readonly isInsufficientProposersBalance: boolean;
    readonly isInvalidIndex: boolean;
    readonly isTooManyApprovals: boolean;
    readonly type: 'InsufficientProposersBalance' | 'InvalidIndex' | 'TooManyApprovals';
  }

  /** @name ClaimsError (444) */
  interface ClaimsError extends Enum {
    readonly isInvalidEthereumSignature: boolean;
    readonly isSignerHasNoClaim: boolean;
    readonly isSenderHasNoClaim: boolean;
    readonly isPotUnderflow: boolean;
    readonly isInvalidStatement: boolean;
    readonly isVestedBalanceExists: boolean;
    readonly type: 'InvalidEthereumSignature' | 'SignerHasNoClaim' | 'SenderHasNoClaim' | 'PotUnderflow' | 'InvalidStatement' | 'VestedBalanceExists';
  }

  /** @name PalletVestingReleases (447) */
  interface PalletVestingReleases extends Enum {
    readonly isV0: boolean;
    readonly isV1: boolean;
    readonly type: 'V0' | 'V1';
  }

  /** @name PalletVestingError (448) */
  interface PalletVestingError extends Enum {
    readonly isNotVesting: boolean;
    readonly isAtMaxVestingSchedules: boolean;
    readonly isAmountLow: boolean;
    readonly isScheduleIndexOutOfBounds: boolean;
    readonly isInvalidScheduleParams: boolean;
    readonly type: 'NotVesting' | 'AtMaxVestingSchedules' | 'AmountLow' | 'ScheduleIndexOutOfBounds' | 'InvalidScheduleParams';
  }

  /** @name PalletUtilityError (449) */
  interface PalletUtilityError extends Enum {
    readonly isTooManyCalls: boolean;
    readonly type: 'TooManyCalls';
  }

  /** @name PalletIdentityRegistration (450) */
  interface PalletIdentityRegistration extends Struct {
    readonly judgements: Vec<ITuple<[u32, PalletIdentityJudgement]>>;
    readonly deposit: u128;
    readonly info: PalletIdentityIdentityInfo;
  }

  /** @name PalletIdentityRegistrarInfo (458) */
  interface PalletIdentityRegistrarInfo extends Struct {
    readonly account: AccountId32;
    readonly fee: u128;
    readonly fields: PalletIdentityBitFlags;
  }

  /** @name PalletIdentityError (460) */
  interface PalletIdentityError extends Enum {
    readonly isTooManySubAccounts: boolean;
    readonly isNotFound: boolean;
    readonly isNotNamed: boolean;
    readonly isEmptyIndex: boolean;
    readonly isFeeChanged: boolean;
    readonly isNoIdentity: boolean;
    readonly isStickyJudgement: boolean;
    readonly isJudgementGiven: boolean;
    readonly isInvalidJudgement: boolean;
    readonly isInvalidIndex: boolean;
    readonly isInvalidTarget: boolean;
    readonly isTooManyFields: boolean;
    readonly isTooManyRegistrars: boolean;
    readonly isAlreadyClaimed: boolean;
    readonly isNotSub: boolean;
    readonly isNotOwned: boolean;
    readonly type: 'TooManySubAccounts' | 'NotFound' | 'NotNamed' | 'EmptyIndex' | 'FeeChanged' | 'NoIdentity' | 'StickyJudgement' | 'JudgementGiven' | 'InvalidJudgement' | 'InvalidIndex' | 'InvalidTarget' | 'TooManyFields' | 'TooManyRegistrars' | 'AlreadyClaimed' | 'NotSub' | 'NotOwned';
  }

  /** @name PalletProxyProxyDefinition (463) */
  interface PalletProxyProxyDefinition extends Struct {
    readonly delegate: AccountId32;
    readonly proxyType: XxnetworkRuntimeProxyType;
    readonly delay: u32;
  }

  /** @name PalletProxyAnnouncement (467) */
  interface PalletProxyAnnouncement extends Struct {
    readonly real: AccountId32;
    readonly callHash: H256;
    readonly height: u32;
  }

  /** @name PalletProxyError (469) */
  interface PalletProxyError extends Enum {
    readonly isTooMany: boolean;
    readonly isNotFound: boolean;
    readonly isNotProxy: boolean;
    readonly isUnproxyable: boolean;
    readonly isDuplicate: boolean;
    readonly isNoPermission: boolean;
    readonly isUnannounced: boolean;
    readonly isNoSelfProxy: boolean;
    readonly type: 'TooMany' | 'NotFound' | 'NotProxy' | 'Unproxyable' | 'Duplicate' | 'NoPermission' | 'Unannounced' | 'NoSelfProxy';
  }

  /** @name PalletBountiesBounty (470) */
  interface PalletBountiesBounty extends Struct {
    readonly proposer: AccountId32;
    readonly value: u128;
    readonly fee: u128;
    readonly curatorDeposit: u128;
    readonly bond: u128;
    readonly status: PalletBountiesBountyStatus;
  }

  /** @name PalletBountiesBountyStatus (471) */
  interface PalletBountiesBountyStatus extends Enum {
    readonly isProposed: boolean;
    readonly isApproved: boolean;
    readonly isFunded: boolean;
    readonly isCuratorProposed: boolean;
    readonly asCuratorProposed: {
      readonly curator: AccountId32;
    } & Struct;
    readonly isActive: boolean;
    readonly asActive: {
      readonly curator: AccountId32;
      readonly updateDue: u32;
    } & Struct;
    readonly isPendingPayout: boolean;
    readonly asPendingPayout: {
      readonly curator: AccountId32;
      readonly beneficiary: AccountId32;
      readonly unlockAt: u32;
    } & Struct;
    readonly type: 'Proposed' | 'Approved' | 'Funded' | 'CuratorProposed' | 'Active' | 'PendingPayout';
  }

  /** @name PalletBountiesError (472) */
  interface PalletBountiesError extends Enum {
    readonly isInsufficientProposersBalance: boolean;
    readonly isInvalidIndex: boolean;
    readonly isReasonTooBig: boolean;
    readonly isUnexpectedStatus: boolean;
    readonly isRequireCurator: boolean;
    readonly isInvalidValue: boolean;
    readonly isInvalidFee: boolean;
    readonly isPendingPayout: boolean;
    readonly isPremature: boolean;
    readonly type: 'InsufficientProposersBalance' | 'InvalidIndex' | 'ReasonTooBig' | 'UnexpectedStatus' | 'RequireCurator' | 'InvalidValue' | 'InvalidFee' | 'PendingPayout' | 'Premature';
  }

  /** @name PalletTipsOpenTip (473) */
  interface PalletTipsOpenTip extends Struct {
    readonly reason: H256;
    readonly who: AccountId32;
    readonly finder: AccountId32;
    readonly deposit: u128;
    readonly closes: Option<u32>;
    readonly tips: Vec<ITuple<[AccountId32, u128]>>;
    readonly findersFee: bool;
  }

  /** @name PalletTipsError (474) */
  interface PalletTipsError extends Enum {
    readonly isReasonTooBig: boolean;
    readonly isAlreadyKnown: boolean;
    readonly isUnknownTip: boolean;
    readonly isNotFinder: boolean;
    readonly isStillOpen: boolean;
    readonly isPremature: boolean;
    readonly type: 'ReasonTooBig' | 'AlreadyKnown' | 'UnknownTip' | 'NotFinder' | 'StillOpen' | 'Premature';
  }

  /** @name ChainbridgeProposalVotes (477) */
  interface ChainbridgeProposalVotes extends Struct {
    readonly votesFor: Vec<AccountId32>;
    readonly votesAgainst: Vec<AccountId32>;
    readonly status: ChainbridgeProposalStatus;
    readonly expiry: u32;
  }

  /** @name ChainbridgeProposalStatus (478) */
  interface ChainbridgeProposalStatus extends Enum {
    readonly isInitiated: boolean;
    readonly isApproved: boolean;
    readonly isRejected: boolean;
    readonly type: 'Initiated' | 'Approved' | 'Rejected';
  }

  /** @name ChainbridgeError (479) */
  interface ChainbridgeError extends Enum {
    readonly isThresholdNotSet: boolean;
    readonly isInvalidChainId: boolean;
    readonly isInvalidThreshold: boolean;
    readonly isChainNotWhitelisted: boolean;
    readonly isChainAlreadyWhitelisted: boolean;
    readonly isResourceDoesNotExist: boolean;
    readonly isRelayerAlreadyExists: boolean;
    readonly isRelayerInvalid: boolean;
    readonly isMustBeRelayer: boolean;
    readonly isRelayerAlreadyVoted: boolean;
    readonly isProposalAlreadyExists: boolean;
    readonly isProposalDoesNotExist: boolean;
    readonly isProposalNotComplete: boolean;
    readonly isProposalAlreadyComplete: boolean;
    readonly isProposalExpired: boolean;
    readonly type: 'ThresholdNotSet' | 'InvalidChainId' | 'InvalidThreshold' | 'ChainNotWhitelisted' | 'ChainAlreadyWhitelisted' | 'ResourceDoesNotExist' | 'RelayerAlreadyExists' | 'RelayerInvalid' | 'MustBeRelayer' | 'RelayerAlreadyVoted' | 'ProposalAlreadyExists' | 'ProposalDoesNotExist' | 'ProposalNotComplete' | 'ProposalAlreadyComplete' | 'ProposalExpired';
  }

  /** @name XxCmixError (480) */
  interface XxCmixError extends Enum {
    readonly isAdminPermissionExpired: boolean;
    readonly isMustBeScheduling: boolean;
    readonly type: 'AdminPermissionExpired' | 'MustBeScheduling';
  }

  /** @name XxTeamCustodyCustodyCustodyInfo (481) */
  interface XxTeamCustodyCustodyCustodyInfo extends Struct {
    readonly allocation: Compact<u128>;
    readonly vested: Compact<u128>;
    readonly custody: AccountId32;
    readonly reserve: AccountId32;
  }

  /** @name XxTeamCustodyError (482) */
  interface XxTeamCustodyError extends Enum {
    readonly isInvalidTeamMember: boolean;
    readonly isInvalidCustodyAccount: boolean;
    readonly isMustBeCustodian: boolean;
    readonly isPayoutNotAvailable: boolean;
    readonly isPayoutFailedInsufficientFunds: boolean;
    readonly isCustodyPeriodEnded: boolean;
    readonly isGovernanceCustodyActive: boolean;
    readonly isGovernanceCustodyPeriodEnded: boolean;
    readonly isTeamMemberExists: boolean;
    readonly type: 'InvalidTeamMember' | 'InvalidCustodyAccount' | 'MustBeCustodian' | 'PayoutNotAvailable' | 'PayoutFailedInsufficientFunds' | 'CustodyPeriodEnded' | 'GovernanceCustodyActive' | 'GovernanceCustodyPeriodEnded' | 'TeamMemberExists';
  }

  /** @name XxBetanetRewardsUserInfo (483) */
  interface XxBetanetRewardsUserInfo extends Struct {
    readonly principal: u128;
    readonly reward: u128;
    readonly option: XxBetanetRewardsRewardOption;
  }

  /** @name XxBetanetRewardsError (484) */
  interface XxBetanetRewardsError extends Enum {
    readonly isNoRewards: boolean;
    readonly isEnactmentBlockHasPassed: boolean;
    readonly type: 'NoRewards' | 'EnactmentBlockHasPassed';
  }

  /** @name PalletMultisigMultisig (486) */
  interface PalletMultisigMultisig extends Struct {
    readonly when: PalletMultisigTimepoint;
    readonly deposit: u128;
    readonly depositor: AccountId32;
    readonly approvals: Vec<AccountId32>;
  }

  /** @name PalletMultisigError (488) */
  interface PalletMultisigError extends Enum {
    readonly isMinimumThreshold: boolean;
    readonly isAlreadyApproved: boolean;
    readonly isNoApprovalsNeeded: boolean;
    readonly isTooFewSignatories: boolean;
    readonly isTooManySignatories: boolean;
    readonly isSignatoriesOutOfOrder: boolean;
    readonly isSenderInSignatories: boolean;
    readonly isNotFound: boolean;
    readonly isNotOwner: boolean;
    readonly isNoTimepoint: boolean;
    readonly isWrongTimepoint: boolean;
    readonly isUnexpectedTimepoint: boolean;
    readonly isMaxWeightTooLow: boolean;
    readonly isAlreadyStored: boolean;
    readonly type: 'MinimumThreshold' | 'AlreadyApproved' | 'NoApprovalsNeeded' | 'TooFewSignatories' | 'TooManySignatories' | 'SignatoriesOutOfOrder' | 'SenderInSignatories' | 'NotFound' | 'NotOwner' | 'NoTimepoint' | 'WrongTimepoint' | 'UnexpectedTimepoint' | 'MaxWeightTooLow' | 'AlreadyStored';
  }

  /** @name PalletRecoveryRecoveryConfig (489) */
  interface PalletRecoveryRecoveryConfig extends Struct {
    readonly delayPeriod: u32;
    readonly deposit: u128;
    readonly friends: Vec<AccountId32>;
    readonly threshold: u16;
  }

  /** @name PalletRecoveryActiveRecovery (491) */
  interface PalletRecoveryActiveRecovery extends Struct {
    readonly created: u32;
    readonly deposit: u128;
    readonly friends: Vec<AccountId32>;
  }

  /** @name PalletRecoveryError (492) */
  interface PalletRecoveryError extends Enum {
    readonly isNotAllowed: boolean;
    readonly isZeroThreshold: boolean;
    readonly isNotEnoughFriends: boolean;
    readonly isMaxFriends: boolean;
    readonly isNotSorted: boolean;
    readonly isNotRecoverable: boolean;
    readonly isAlreadyRecoverable: boolean;
    readonly isAlreadyStarted: boolean;
    readonly isNotStarted: boolean;
    readonly isNotFriend: boolean;
    readonly isDelayPeriod: boolean;
    readonly isAlreadyVouched: boolean;
    readonly isThreshold: boolean;
    readonly isStillActive: boolean;
    readonly isAlreadyProxy: boolean;
    readonly isBadState: boolean;
    readonly type: 'NotAllowed' | 'ZeroThreshold' | 'NotEnoughFriends' | 'MaxFriends' | 'NotSorted' | 'NotRecoverable' | 'AlreadyRecoverable' | 'AlreadyStarted' | 'NotStarted' | 'NotFriend' | 'DelayPeriod' | 'AlreadyVouched' | 'Threshold' | 'StillActive' | 'AlreadyProxy' | 'BadState';
  }

  /** @name PalletAssetsAssetDetails (493) */
  interface PalletAssetsAssetDetails extends Struct {
    readonly owner: AccountId32;
    readonly issuer: AccountId32;
    readonly admin: AccountId32;
    readonly freezer: AccountId32;
    readonly supply: u64;
    readonly deposit: u128;
    readonly minBalance: u64;
    readonly isSufficient: bool;
    readonly accounts: u32;
    readonly sufficients: u32;
    readonly approvals: u32;
    readonly isFrozen: bool;
  }

  /** @name PalletAssetsAssetBalance (494) */
  interface PalletAssetsAssetBalance extends Struct {
    readonly balance: u64;
    readonly isFrozen: bool;
    readonly sufficient: bool;
    readonly extra: Null;
  }

  /** @name PalletAssetsApproval (496) */
  interface PalletAssetsApproval extends Struct {
    readonly amount: u64;
    readonly deposit: u128;
  }

  /** @name PalletAssetsAssetMetadata (497) */
  interface PalletAssetsAssetMetadata extends Struct {
    readonly deposit: u128;
    readonly name: Bytes;
    readonly symbol: Bytes;
    readonly decimals: u8;
    readonly isFrozen: bool;
  }

  /** @name PalletAssetsError (498) */
  interface PalletAssetsError extends Enum {
    readonly isBalanceLow: boolean;
    readonly isBalanceZero: boolean;
    readonly isNoPermission: boolean;
    readonly isUnknown: boolean;
    readonly isFrozen: boolean;
    readonly isInUse: boolean;
    readonly isBadWitness: boolean;
    readonly isMinBalanceZero: boolean;
    readonly isNoProvider: boolean;
    readonly isBadMetadata: boolean;
    readonly isUnapproved: boolean;
    readonly isWouldDie: boolean;
    readonly type: 'BalanceLow' | 'BalanceZero' | 'NoPermission' | 'Unknown' | 'Frozen' | 'InUse' | 'BadWitness' | 'MinBalanceZero' | 'NoProvider' | 'BadMetadata' | 'Unapproved' | 'WouldDie';
  }

  /** @name PalletUniquesClassDetails (499) */
  interface PalletUniquesClassDetails extends Struct {
    readonly owner: AccountId32;
    readonly issuer: AccountId32;
    readonly admin: AccountId32;
    readonly freezer: AccountId32;
    readonly totalDeposit: u128;
    readonly freeHolding: bool;
    readonly instances: u32;
    readonly instanceMetadatas: u32;
    readonly attributes: u32;
    readonly isFrozen: bool;
  }

  /** @name PalletUniquesInstanceDetails (501) */
  interface PalletUniquesInstanceDetails extends Struct {
    readonly owner: AccountId32;
    readonly approved: Option<AccountId32>;
    readonly isFrozen: bool;
    readonly deposit: u128;
  }

  /** @name PalletUniquesClassMetadata (502) */
  interface PalletUniquesClassMetadata extends Struct {
    readonly deposit: u128;
    readonly data: Bytes;
    readonly isFrozen: bool;
  }

  /** @name PalletUniquesInstanceMetadata (503) */
  interface PalletUniquesInstanceMetadata extends Struct {
    readonly deposit: u128;
    readonly data: Bytes;
    readonly isFrozen: bool;
  }

  /** @name PalletUniquesError (506) */
  interface PalletUniquesError extends Enum {
    readonly isNoPermission: boolean;
    readonly isUnknown: boolean;
    readonly isAlreadyExists: boolean;
    readonly isWrongOwner: boolean;
    readonly isBadWitness: boolean;
    readonly isInUse: boolean;
    readonly isFrozen: boolean;
    readonly isWrongDelegate: boolean;
    readonly isNoDelegate: boolean;
    readonly isUnapproved: boolean;
    readonly type: 'NoPermission' | 'Unknown' | 'AlreadyExists' | 'WrongOwner' | 'BadWitness' | 'InUse' | 'Frozen' | 'WrongDelegate' | 'NoDelegate' | 'Unapproved';
  }

  /** @name SpRuntimeMultiSignature (508) */
  interface SpRuntimeMultiSignature extends Enum {
    readonly isEd25519: boolean;
    readonly asEd25519: SpCoreEd25519Signature;
    readonly isSr25519: boolean;
    readonly asSr25519: SpCoreSr25519Signature;
    readonly isEcdsa: boolean;
    readonly asEcdsa: SpCoreEcdsaSignature;
    readonly type: 'Ed25519' | 'Sr25519' | 'Ecdsa';
  }

  /** @name SpCoreEcdsaSignature (509) */
  interface SpCoreEcdsaSignature extends U8aFixed {}

  /** @name FrameSystemExtensionsCheckSpecVersion (511) */
  type FrameSystemExtensionsCheckSpecVersion = Null;

  /** @name FrameSystemExtensionsCheckTxVersion (512) */
  type FrameSystemExtensionsCheckTxVersion = Null;

  /** @name FrameSystemExtensionsCheckGenesis (513) */
  type FrameSystemExtensionsCheckGenesis = Null;

  /** @name FrameSystemExtensionsCheckNonce (516) */
  interface FrameSystemExtensionsCheckNonce extends Compact<u32> {}

  /** @name FrameSystemExtensionsCheckWeight (517) */
  type FrameSystemExtensionsCheckWeight = Null;

  /** @name PalletTransactionPaymentChargeTransactionPayment (518) */
  interface PalletTransactionPaymentChargeTransactionPayment extends Compact<u128> {}

  /** @name ClaimsPrevalidateAttests (519) */
  type ClaimsPrevalidateAttests = Null;

  /** @name XxnetworkRuntimeRuntime (520) */
  type XxnetworkRuntimeRuntime = Null;

} // declare module
