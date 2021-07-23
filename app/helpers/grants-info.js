const GRANT_PERCENTAGE = 40
const MIN_GRANT = 35000
const MAX_GRANT = 1000000

const getGrantValues = (projectCostValue) => {
  const calculatedGrant = Number(GRANT_PERCENTAGE * projectCostValue / 100).toFixed(2)
  const remainingCost = Number(projectCostValue - calculatedGrant).toFixed(2)
  const isEligible = (
    (MIN_GRANT <= calculatedGrant) && (calculatedGrant <= MAX_GRANT)
  )
  return { calculatedGrant, remainingCost, isEligible }
}

module.exports = {
  GRANT_PERCENTAGE,
  MIN_GRANT,
  MAX_GRANT,
  getGrantValues
}
