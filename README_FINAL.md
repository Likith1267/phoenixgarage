# Phoenix Garage — Finalized Build

This build consolidates the Phoenix Garage marketplace through the current project roadmap.

## Included
- Phoenix Garage homepage with saved-vehicle Easter egg
- Light/dark theme
- Dedicated vehicle catalogue with 79 vehicle records
- Vehicle fitment: type → brand → model → year → variant → engine
- 66 parts catalogue entries with studio product imagery
- Search, categories, filtering, sorting and vehicle fitment
- Persistent SQLite wishlist and cart
- Product detail pages
- Checkout and order persistence
- Customer authentication and saved vehicles
- Order lookup foundation
- Contact message API
- Service booking API
- Manufacturer/distributor B2B dashboard and listing API
- B2B inventory/listing management foundation
- B2B application, Admin approval, company ownership, and staff/sub-user workflow

## Local run
```bash
npm start
```
Open `http://localhost:5000`.

## Important
The product imagery and 36 added catalogue entries are presented as Phoenix Garage aftermarket/reference catalogue data. They are not claims of OEM supply, authenticity, or verified manufacturer part numbers. Exact supplier/OEM data must be imported from authorized catalogues before production sales.

Real payment gateway credentials, shipping carrier credentials, production email/CRM credentials, and production hosting/domain configuration remain deployment-specific.


## Step 1 — Authentication hardening
- Customer/workshop registration with validated email and stronger password requirements.
- Manufacturer/distributor roles cannot be self-assigned during public registration.
- Passwords are stored as salted scrypt hashes.
- Bearer sessions expire after 30 days.
- Explicit logout invalidates the server-side session.
- Login and registration attempts are rate-limited per source address.
- `/api/auth/me` validates the active session before returning account data.


## Step 2 — Customer Account
- Profile editing
- Saved addresses with default address, edit and delete
- Saved vehicles management
- Wishlist view/removal
- Order history with order detail lookup
- Account overview and quick actions


## Account & B2B 4.5.4
- Customer account includes profile, addresses, vehicles, wishlist, orders and password security.
- B2B has a separate professional business workspace for approved manufacturers/distributors.
- B2B supports company profile, catalogue, inventory, owner-controlled staff, and protected company administration.
- B2B applications remain admin-approved and separate from customer registration.


### v4.5.4 B2B application fixes
- Field-specific B2B application validation and server error messages.
- Dark-mode B2B form input/select/textarea visibility and focus/error states fixed.
- Successful B2B application displays a pending-review confirmation and reference number.


## v4.5.4 account portal fix
- Admin sign-out now clears the admin session and returns to the account portal instead of reloading the Admin Console login.
- Customer/B2B/Admin portal choices are available from the account sign-in screen.
- B2B portal sign-in rejects non-B2B roles with a clear message.
- Customer portal sign-in rejects Admin/B2B credentials with a clear portal-specific message.


## v4.5.4 Login portal polish
- Simplified account-selection/admin login panel.
- Corrected login field text, placeholder and caret contrast in light and dark themes.
- Admin login now follows the saved Phoenix Garage theme.
- Reduced visual density while preserving separate Customer, Business/B2B and Admin entry points.
