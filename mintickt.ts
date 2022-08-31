query MyQuery($user: String!) {
  store(where: {name: {_eq: "globaldv"}, minters: {account: {_eq: $user}}}) {
    things(order_by: {createdAt: desc}, where: {id: {_eq: "7XdGaLjEXrMo23Ej4AWNkojdEG96XIv1_0aK5A8UYi8:globaldv.mintspace2.testnet"}, metadata: {extra: {}}}) {
      metadata {
        extra
      }
      tokens(where: {_not: {ownerId: {_eq: $user}}}) {
        id
        ownerId
        lastTransferred
        approvals {
          id
        }
      }
    }
  }
}
