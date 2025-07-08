export const CREDIT_PACKS = [10,20,50,100];

export const PLAN_IDS = {
  UNLIMITED_YEARLY: {
    id: 'plan_QoFXepjBYTR3qB',
    planName: 'Unlimited Yearly',
    description: 'Yearly subscription, 2 months free',
    totalBillingCycleCount: 5
  },
  UNLIMITED_MONTHLY: {
    id: 'plan_QoFVv8WQwBXdua',
    planName: 'Unlimited Monthly',
    description: 'Monthly subscription',
    totalBillingCycleCount: 12
  }
};

export const pricingList = [
  {
    price: "Credit Packs",
    list: [
      { detail: "10 CREDITS FOR ₹10" },
      { detail: "20 CREDITS FOR ₹20" },
      { detail: "50 CREDITS FOR ₹50" },
      { detail: "100 CREDITS FOR ₹100" }
    ]
  },
  {
    price: "Unlimited Monthly",
    list: [
      { detail: "UNLIMITED LINKS" },
      { detail: "AUTO RENEWED" },
      { detail: "CHARGED MONTHLY" },
      { detail: "CANCEL ANYTIME" }
    ]
  },
  {
    price: "Unlimited Yearly",
    list: [
      { detail: "UNLIMITED LINKS" },
      { detail: "AUTO RENEWED" },
      { detail: "CHARGED YEARLY" },
      { detail: "CANCEL ANYTIME" }
    ]
  }
];
