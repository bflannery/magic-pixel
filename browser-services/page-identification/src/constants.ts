export const ECOMM_KEYWORDS = [
  'paypal',
  'google_pay',
  'apple_pay',
  'bolt_pay',
  'stripe_for',
  'braintree_form',
  'square_form',
  'checkout',
  'purchase',
  'order',
  'buy',
  'order_summary',
  'total',
  'subtotal',
  'shipping',
  'tax',
  'payment',
  'promo_code',
  'coupon',
  'shipping_address',
  'billing_address',
]

export const CONFIRMATION_KEYWORDS = [
  'thankyou',
  'order',
  'ordersummary',
  'confirmation'
]

export const LEAD_GEN_KEYWORDS = ['email']
export const CONTACT_US_KEYWORDS = ['contact', 'feedback']
export const CAREERS_KEYWORDS = ['careers', 'jobs']
export const BLOG_KEYWORDS = ['blog', 'articles']

export const PAGE_ID_PROPERTIES = {
  eCommerce: {
    isEcommPage: false,
    dom: {
      paypal: false,
      google_pay: false,
      apple_pay: false,
      bolt_pay: false,
      stripe_for: false,
      braintree_form: false,
      square_form: false,
      checkout: false,
      purchase: false,
      order: false,
      buy: false,
      order_summary: false,
      total: false,
      subtotal: false,
      shipping: false,
      tax: false,
      payment: false,
      promo_code: false,
      coupon: false,
      shipping_address: false,
      billing_address: false,
    },
    url: {
      checkout: false,
      purchase: false,
      order: false,
      buy: false,
      order_summary: false,
    },
  },
  confirmation: {
    isConfirmationPage: false,
    url: {
      thank_you: false,
      order_summary: false,
      order: false,
      confirmation: false,
    },
    dom: {
      confirmation: false,
    },
  },
  lead_gen: {
    isLeadGenPage: false,
    dom: {
      email: true,
    },
  },
  contact_us: {
    isContactUsPage: false,
    dom: {
      contact: true,
    },
    url: {
      contact: false,
      feedback: false,
    },
  },
  careers: {
    isCareersPage: false,
    url: {
      careers: false,
      jobs: false,
    },
  },
  blog: {
    isBlogPage: false,
    url: {
      blog: false,
      articles: false,
    },
    dom: {
      list_of_articles: false,
      list_of_links: false,
    },
  },
  general: {
    form_inputs_on_page: 0,
    videos_on_page: 0,
    content_on_page: 0,
  },
  misc: {
    has_sidebar: false,
    has_topbar: false,
    has_navbar: false,
  },
}
