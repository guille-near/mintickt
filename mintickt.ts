query MyQuery {
    store(where: {name: {_eq: "globaldv"}}) {
      id
      things(where: {id: {_eq: "MVoHZwi-BOMJthyoTlEekHVquh7DA14lQGV-f0XIYTA:globaldv.mintspace2.testnet"}}) {
        metadata {
          title
          media
          extra
          thing {
            tokens_aggregate {
              aggregate {
                count
              }
              nodes {
                approvals_aggregate {
                  aggregate {
                    count
                  }
                }
                list {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
  