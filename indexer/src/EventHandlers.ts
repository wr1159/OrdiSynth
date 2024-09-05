/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  OrdiSynth,
  OrdiSynth_LiquidityAdded,
  OrdiSynth_SynthDeposited,
  OrdiSynth_SynthRedeemed,
  OrdiSynth_TokenSwappedForRune,
  RuneToken,
  RuneToken_ApprovalForAll,
  RuneToken_OwnershipTransferred,
  RuneToken_TokensFrozen,
  RuneToken_TokensUnfrozen,
  RuneToken_TransferBatch,
  RuneToken_TransferSingle,
  RuneToken_URI,
} from "generated";

OrdiSynth.LiquidityAdded.handler(async ({ event, context }) => {
  const entity: OrdiSynth_LiquidityAdded = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user,
    contractAddress: event.params.contractAddress,
    tokenId: event.params.tokenId,
    runeAmount: event.params.runeAmount,
    ethAmount: event.params.ethAmount,
    synthTokenAddress: event.params.synthTokenAddress,
  };

  context.OrdiSynth_LiquidityAdded.set(entity);
});


OrdiSynth.SynthDeposited.handler(async ({ event, context }) => {
  const entity: OrdiSynth_SynthDeposited = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user,
    contractAddress: event.params.contractAddress,
    tokenId: event.params.tokenId,
    runeAmount: event.params.runeAmount,
    synthTokenAddress: event.params.synthTokenAddress,
  };

  context.OrdiSynth_SynthDeposited.set(entity);
});


OrdiSynth.SynthRedeemed.handler(async ({ event, context }) => {
  const entity: OrdiSynth_SynthRedeemed = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user,
    contractAddress: event.params.contractAddress,
    tokenId: event.params.tokenId,
    runeAmount: event.params.runeAmount,
    synthTokenAddress: event.params.synthTokenAddress,
  };

  context.OrdiSynth_SynthRedeemed.set(entity);
});


OrdiSynth.TokenSwappedForRune.handler(async ({ event, context }) => {
  const entity: OrdiSynth_TokenSwappedForRune = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.user,
    contractAddress: event.params.contractAddress,
    tokenId: event.params.tokenId,
    runeAmount: event.params.runeAmount,
    synthTokenAddress: event.params.synthTokenAddress,
  };

  context.OrdiSynth_TokenSwappedForRune.set(entity);
});


RuneToken.ApprovalForAll.handler(async ({ event, context }) => {
  const entity: RuneToken_ApprovalForAll = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    account: event.params.account,
    operator: event.params.operator,
    approved: event.params.approved,
  };

  context.RuneToken_ApprovalForAll.set(entity);
});


RuneToken.OwnershipTransferred.handler(async ({ event, context }) => {
  const entity: RuneToken_OwnershipTransferred = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    previousOwner: event.params.previousOwner,
    newOwner: event.params.newOwner,
  };

  context.RuneToken_OwnershipTransferred.set(entity);
});


RuneToken.TokensFrozen.handler(async ({ event, context }) => {
  const entity: RuneToken_TokensFrozen = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    account: event.params.account,
    tokenId: event.params.tokenId,
    amount: event.params.amount,
  };

  context.RuneToken_TokensFrozen.set(entity);
});


RuneToken.TokensUnfrozen.handler(async ({ event, context }) => {
  const entity: RuneToken_TokensUnfrozen = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    account: event.params.account,
    tokenId: event.params.tokenId,
    amount: event.params.amount,
  };

  context.RuneToken_TokensUnfrozen.set(entity);
});


RuneToken.TransferBatch.handler(async ({ event, context }) => {
  const entity: RuneToken_TransferBatch = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    operator: event.params.operator,
    from: event.params.from,
    to: event.params.to,
    ids: event.params.ids,
    values: event.params.values,
  };

  context.RuneToken_TransferBatch.set(entity);
});


RuneToken.TransferSingle.handler(async ({ event, context }) => {
  const entity: RuneToken_TransferSingle = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    operator: event.params.operator,
    from: event.params.from,
    to: event.params.to,
    event_id: event.params.id,
    value: event.params.value,
  };

  context.RuneToken_TransferSingle.set(entity);
});


RuneToken.URI.handler(async ({ event, context }) => {
  const entity: RuneToken_URI = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    value: event.params.value,
    event_id: event.params.id,
  };

  context.RuneToken_URI.set(entity);
});

