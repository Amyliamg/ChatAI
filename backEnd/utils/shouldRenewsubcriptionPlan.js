const shouldRenewSubcriptionPlan = (user) => {
    const today = new Date();
    return !user?.nextBillingDate || user?.nextBillingDate <= today; // one of them is true will return true
  };
  
module.exports = { shouldRenewSubcriptionPlan };