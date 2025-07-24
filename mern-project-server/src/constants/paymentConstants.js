const CREDIT_PACKS = {
    10: 10,
    20: 20,
    50: 50,
    100: 100
};

const PLAN_IDS = {
    UNLIMITED_YEARLY: {
        id:process.env.RAZORPAY_YEARLY_PLAN_ID,
        planName: 'Unlimited Yearly',
        totalBillingCycleCount: 5
    },
    UNLIMITED_MONTHLY: {
        id:process.env.RAZORPAY_MONTHLY_PLAN_ID,
        planName: 'Unlimited Monthly',
        totalBillingCycleCount: 12
    },
}



module.exports = {CREDIT_PACKS,PLAN_IDS};
