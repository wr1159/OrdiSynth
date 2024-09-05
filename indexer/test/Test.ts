import assert from "assert";
import { 
  TestHelpers,
  OrdiSynth_LiquidityAdded
} from "generated";
const { MockDb, OrdiSynth } = TestHelpers;

describe("OrdiSynth contract LiquidityAdded event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for OrdiSynth contract LiquidityAdded event
  const event = OrdiSynth.LiquidityAdded.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("OrdiSynth_LiquidityAdded is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await OrdiSynth.LiquidityAdded.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualOrdiSynthLiquidityAdded = mockDbUpdated.entities.OrdiSynth_LiquidityAdded.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedOrdiSynthLiquidityAdded: OrdiSynth_LiquidityAdded = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      user: event.params.user,
      contractAddress: event.params.contractAddress,
      tokenId: event.params.tokenId,
      runeAmount: event.params.runeAmount,
      ethAmount: event.params.ethAmount,
      synthTokenAddress: event.params.synthTokenAddress,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualOrdiSynthLiquidityAdded, expectedOrdiSynthLiquidityAdded, "Actual OrdiSynthLiquidityAdded should be the same as the expectedOrdiSynthLiquidityAdded");
  });
});
