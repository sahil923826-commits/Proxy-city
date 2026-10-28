# Proxy Traffic Orbit

I am continuing my existing project, ProxyCity, from a new Lovable account because my previous account ran out of credits.



Existing Published Website — Inspect This First



https://proxy-pulse-control-center.lovable.app



Before writing any code, carefully inspect the published website above. Review its dashboard layout, sidebar navigation, typography, spacing, card design, responsive behavior, component styling, and overall Royal Purple Tech visual identity.



Use the published website as a visual and functional reference. Reproduce its design language as closely as possible while improving the layout where needed.



Important: The published link is a reference to my existing application, not a replacement for this new Lovable project. Build the new application in the current Lovable workspace, using the reference website to understand how it should look and behave.



Do not assume that inspecting the published website gives you access to its source code, database, authentication, API keys, or backend. Do not invent integrations or claim that the original backend has been connected.



1. Project Identity and Design



The product is called ProxyCity, a proxy management and traffic purchasing platform.



Use the same Royal Purple Tech theme as the reference website.



Exact colors:



- Main background: #0A0614

- Secondary background: #0F0A1A

- Sidebar background: #0B0812

- Card background: #150B22

- Primary purple: #A855F7

- Button purple: #7C3AED

- Lavender: #C084FC

- Main text: #F8FAFC

- Secondary text: #A1A1AA

- Border: #30203F

- Success: #22C55E

- Error: #F87171



Purple must be the dominant accent. Do not use pink or magenta gradients, cyan, blue, or yellow as primary colors.



Keep the design premium, minimal, clean, and professional, with subtle borders, restrained shadows, and very little glow.



2. Preserve the Existing Dashboard Experience



Use the reference dashboard as the starting point for the visual system.



The existing experience includes:



- Overview

- Proxy Configuration

- My Proxies

- Purchase Traffic

- Usage & Analytics

- Documentation

- Support

- Account Settings

- Proxy Access Details

- Generated Proxy



Keep the dashboard consistent with the reference.



Simplify the sidebar by removing unnecessary navigation items such as Documentation if it is not needed in the initial product. Keep Overview, My Proxies, Purchase Traffic, Usage & Analytics, Support, and Account Settings. Proxy Configuration must remain accessible from the dashboard.



Do not remove useful proxy configuration, credential-copying, or generated-proxy functionality.



3. Build the Purchase Traffic Page



Create a complete Purchase Traffic page that follows the same visual language as the reference website.



At the top, display:



- Page title: Purchase Traffic

- Subtitle: Choose your bandwidth and get the best available rate.

- Back to Dashboard action

- Current remaining traffic, when available



Plan Name



Replace the fixed “Create New Plan” selector with an editable text field.



Label: Plan Name



Placeholder: My Residential Plan



Allow users to enter their own custom plan name. Validate the input and preserve it while editing.



Traffic Amount



Add a prominent numeric input labeled Traffic Amount (GB).



Users should be able to enter the amount of bandwidth they want to purchase.



Automatically update the pricing tier, price per GB, subtotal, discount suggestion, and order total whenever the quantity changes.



Pricing Tiers



Use these exact prices:



- 1–10 GB: $0.90/GB

- 11–50 GB: $0.87/GB

- 51–100 GB: $0.85/GB

- 101–200 GB: $0.80/GB

- 201–500 GB: $0.75/GB

- 501–1,000 GB: $0.70/GB

- Above 1,000 GB: Contact Sales



Treat 1 TB as 1,000 GB for this pricing model.



The rate for the selected tier applies to the entire order.



Smart Discount Suggestions



Show a contextual suggestion beneath the bandwidth input explaining how much more traffic the user needs to unlock the next tier.



Example: When a user enters 2 GB:



- Current rate: $0.90/GB

- Current subtotal: $1.80

- Suggestion: Add 9 GB more to unlock $0.87/GB pricing.

- Next-tier total: 11 GB × $0.87 = $9.57.



Calculate these values dynamically for every tier. Do not hardcode the suggested quantities or totals.



Use a subtle green or purple highlight for savings information.



Payment Method



Display selectable payment methods only when they are supported by the current application configuration.



Potential providers include Cryptomus, Plisio, and Stripe, but do not claim any provider is connected unless it is actually configured.



Clearly distinguish available, unavailable, and selected payment methods.



Order Summary



Create a polished Order Summary card containing:



- Custom plan name

- Traffic quantity

- Selected pricing tier

- Rate per GB

- Subtotal

- Coupon code input

- Apply Coupon button

- Valid discount, if applicable

- Final total



Use the correct calculations and USD currency formatting.



Only apply coupons that are successfully validated. Include additional fees only when they actually apply.



Pay Button



Create a premium full-width purple button displaying the current total dynamically, for example:



Pay $1.80 →



Use a vivid purple background, white text, and minimal shadow. Include a small secure-checkout indicator.



Show loading, success, and failure states. Prevent duplicate checkout submissions.



Never mark an order as paid until payment is verified by the configured backend or payment provider.



For orders above 1,000 GB, show Contact Sales instead of the automatic payment flow.



4. Responsive Layout



Desktop and laptop:



- Use a balanced two-column layout.

- Left column: plan configuration, bandwidth input, pricing suggestions, and payment methods.

- Right column: Order Summary and Pay button.

- Keep the order summary visible and well-aligned without excessive scrolling.

- Avoid horizontal scrolling.



Mobile:



- Stack the sections vertically.

- Keep the bandwidth input and Pay button easy to use.

- Ensure cards fit the screen width.

- Keep spacing, typography, and buttons consistent with the reference dashboard.



5. Technical and Integration Rules



Use the current project's framework and dependencies. If starting from scratch, use React, TypeScript, and Tailwind CSS.



Keep pricing logic in reusable, type-safe functions.



Use real backend data where available. Clearly label demo data and do not present sample values as live account information.



Do not invent working proxy credentials, payment integrations, traffic balances, or transaction statuses.



If the reference application's source code or backend cannot be accessed, reproduce the visible design and implement the new page independently in this project. Do not claim that the new application is connected to the original database or backend.



Preserve existing functionality and avoid unnecessary redesigns.



Final Goal



Build the Purchase Traffic page as the next part of the ProxyCity application, matching the published dashboard's Royal Purple Tech identity.



The result should look like the same product, not a different template. It must work beautifully on laptops and mobile devices, calculate bandwidth pricing accurately, suggest the next discount tier dynamically, and provide a clear, professional checkout experience.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://proxy-traffic-orbit.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a9f8d969-d877-4039-ac28-0730165a22b1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
