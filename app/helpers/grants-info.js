const getGrantValues = (projectCostValue, grantsInfo) => {
  const { minGrant, maxGrant, grantPercentage } = grantsInfo
  const calculatedGrant = Number(grantPercentage * projectCostValue / 100).toFixed(2)
  const remainingCost = Number(projectCostValue - calculatedGrant).toFixed(2)
  const isEligible = (
    (minGrant <= calculatedGrant) && (calculatedGrant <= maxGrant)
  )
  return { calculatedGrant, remainingCost, isEligible }
}

module.exports = {
  getGrantValues
}
