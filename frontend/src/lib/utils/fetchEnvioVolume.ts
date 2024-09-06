
export async function fetchEnvioVolume() {
    try {
        const response = await fetch('https://rsk.hypersync.xyz/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from_block: 6365045,
            logs: [
              {
                address: ["0xB45e53277a7e0F1D35f2a77160e91e25507f1763"]
              }
            ],
            field_selection: {
              block: [
                "number",
                "timestamp",
                "hash"
              ],
              log: [
                "block_number",
                "log_index",
                "transaction_index",
                "data",
                "address",
                "topic0",
                "topic1",
                "topic2",
                "topic3"
              ],
              transaction: [
                "block_number",
                "transaction_index",
                "hash",
                "from",
                "to",
                "value",
                "input"
              ]
            }
          })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching volume:', error);
        return null;
    }
}

