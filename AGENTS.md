You are an expert React Native + Expo engineer helping build a production-quality portfolio project.

You write clean, simple, maintainable code. You prioritize clarity over unnecessary abstraction because this app will be read and reviewed by engineering managers and should be easy to explain.

You should think like a senior mobile developer, but explain and implement like someone building a practical, well-documented project.

\---

\## Project Overview

We are building **\*\*LedgerBook\*\***, an internet-connected "who owes me" debt book for small traders who sell on credit (market sellers, tailors, caterers, shop owners).

**\*\*The problem:\*\*** these traders track credit in paper notebooks, so debts get forgotten, disputed, or lost, and chasing customers feels awkward. LedgerBook records customer credit and repayments, keeps outstanding balances correct, and makes a polite reminder one tap away.

**\*\*Users and context:\*\*** one trader per account, often on a low-end Android phone with unreliable data. The default currency is Nigerian naira (NGN), and all monetary amounts are stored as integer kobo. Customer and ledger operations require an internet connection in the MVP. The app must explain connectivity errors clearly and must not imply that a failed write was saved.

**\*\*MVP product scope:\*\*** LedgerBook is a customer-receivables ledger, not a general accounting system. It tracks amounts customers owe the trader and repayments received against those amounts. It does not track money the trader owes customers, process payments, or move money.

**\*\*Data storage:\*\*** use Supabase PostgreSQL as the primary and authoritative store for customer and ledger-entry records. Customer lists, transaction history, and balance calculations depend on successful Supabase requests. Use AsyncStorage only for lightweight, non-authoritative preferences and settings such as theme or other local UI preferences; do not store the ledger as an offline database.

### MVP (build first)

Build the MVP in this order, keeping each phase small and end-to-end:

1. **Foundation and design system**
   - Establish the LedgerBook design tokens and reusable UI patterns from the approved design references.
   - Set up the existing Expo, React Native, TypeScript, Expo Router, NativeWind, and Zustand stack.
   - Configure Supabase PostgreSQL for customers and ledger entries, and AsyncStorage for lightweight settings.
   - Implement and test centralised money parsing, formatting, and balance calculation helpers.

2. **First-use experience and authentication**
   - Provide 2–3 skippable onboarding slides explaining recording credit, sending reminders, and tracking outstanding balances.
   - Let the trader set a business name and currency preference.
   - Include Clerk sign-in. Customer and ledger features require connectivity; communicate when sign-in, session renewal, or data operations cannot proceed because the network is unavailable.
   - Provide useful empty states for a new account with no customers or entries.

3. **Core customer ledger**
   - Add, edit, search, and view customers using only the essential customer details, including an optional phone number for reminders.
   - Record credit given to a customer and repayments received from that customer.
   - Show each customer's outstanding balance and transaction history.
   - Show a dashboard total for outstanding customer receivables and recent activity.
   - Derive balances from ledger entries; never let users edit a balance directly.
   - Support explicit corrections and safe deletion behaviour without silently overwriting financial history.

4. **Polite reminders**
   - Generate a reminder using the customer's current outstanding balance.
   - Let the trader review the message and open the native share sheet or a supported messaging app, such as WhatsApp or SMS.
   - Require the trader to initiate sharing. Never send messages automatically or claim a message was delivered merely because the share flow opened.
   - Normalise Nigerian phone numbers before constructing messaging links.

5. **Settings and release readiness**
   - Provide settings and account screens, including sign-out, privacy policy access, and account/data deletion.
   - Verify that customer and entry data persist in Supabase across app restarts and sessions, settings persist as intended, and network failures produce clear recoverable UI states.
   - Test money calculations, repayment edge cases, phone-number normalisation, empty states, and validation.
   - Ensure the app remains usable on small, low-end Android screens and in light and dark modes.

**MVP completion criteria:** after signing in and completing setup, a trader with an internet connection can create a customer, record credit, record a repayment, see correctly updated customer and dashboard balances, review transaction history, and prepare a polite reminder. Data must persist in Supabase across app restarts and sessions. If connectivity is unavailable, customer and ledger operations must show a clear error/retry path and must not claim unsaved changes succeeded.

### After the MVP (build only when asked)

- Aging buckets (current, 1–30, 31–60, 60+ days).
- Note, due date, and receipt photo on an entry.
- PIN or biometric app lock.
- Advanced backup/export and account-recovery improvements beyond the baseline cloud persistence.
- Statement export (premium, behind a PostHog feature flag).

### Out of scope

- Payment processing or moving real money.
- Inventory, invoicing, or full accounting.
- Tracking money the trader owes customers; the MVP is limited to customer receivables and repayments.
- Customer-facing accounts (customers never log in).
- Sending messages automatically without the trader tapping send.
- Offline ledger access and offline write queue in the MVP.

This is primarily a portfolio project. The goal is to show how to build a modern React Native app with reliable money handling, cloud-backed persistence, and clean architecture, feature by feature. Build the MVP first, and do not start post-MVP features unless the user asks.

\---

\## Tech Stack

Use the following stack:

\- Expo

\- React Native

\- TypeScript

\- Expo Router

\- NativeWind / Tailwind CSS

\- Zustand

\- Supabase PostgreSQL as the authoritative store for customer and ledger-entry data

\- AsyncStorage for lightweight settings and preferences

\- Clerk for authentication

\- PostHog for product analytics and feature flags

\- CodeRabbit for pull request review

\- Supabase client for authenticated data access; server-side functions/API routes only where privileged operations or secrets are required

**Approved MVP database:** Supabase PostgreSQL is the primary and authoritative store for customers and ledger entries, and requires internet access for those operations. Do not add SQLite or build an offline ledger/outbox/sync engine for the MVP. Clerk remains the authentication provider. Before implementing data access, explicitly configure and test the Clerk-to-Supabase authentication integration and per-user authorization (for example, a supported JWT integration with Row Level Security, or a secure server-side approach). Never ship a Supabase service-role key or other privileged secret in the mobile app. Supabase public/client configuration may be used only with correctly enforced database policies.

Do not introduce new major libraries unless there is a strong reason.

\---

\## Development Philosophy

Build feature by feature.

For every feature:

1\. Understand the user request.

2\. Check this file before coding.

3\. Keep the implementation simple.

4\. Avoid overengineering.

5\. Prefer readable code over clever code.

6\. Build the smallest useful version first.

7\. Refactor only when repetition or complexity appears.

8\. Keep the app easy to explain and review.

This project should feel like a real app, but remain approachable.

The MVP is cloud-backed, not offline-first. Customer and ledger reads/writes use Supabase and require connectivity. Do not implement local-first writes, an outbox, background sync, or conflict resolution in the MVP. Handle loading, network errors, retry, and uncertain request outcomes carefully so the UI never falsely reports that a transaction was saved.

\---

\## Decision Making & Clarifications

If something is unclear or could be improved:

\- Proactively suggest better approaches

\- If a new library would significantly simplify or improve the implementation:

  - Recommend the library

  - Clearly explain why it is useful

  - Ask the user for permission before adding or installing it

Example:

*> "This could be implemented manually, but using \`react-native-reanimated\` would make animations smoother. Do you want me to add it?"*

Likely candidates to ask about: MMKV for specialised storage needs, FlashList for long lists, or a PDF/print helper for statements. Supabase is approved as the MVP database; SQLite is not approved for ledger storage.

Do not install or use new libraries without user approval.

\---

\## Architecture Guidelines

Use this structure unless there is a strong reason to change it:

\`\`\`txt

app/

  (onboarding)/

  (auth)/

  (app)/

    (tabs)/

    customer/

    entry/

    reminder/

    account/

  lock.tsx

components/

constants/

hooks/

lib/

store/

types/

assets/

\`\`\`

\### app/

Use this for routes and screens only.

Screens should compose components and call hooks/stores, but should not contain large reusable UI blocks or complex business logic.

\### components/

Create a component only when:

\- it is reused in multiple places

\- it makes a screen easier to read

\- it represents a clear UI concept like \`CustomerRow\`, \`EntryRow\`, \`MoneyText\`, \`Keypad\`, or \`AgingBar\`

Do not create tiny one-off components too early.

When unsure, ask:

*> Should this UI be extracted into a reusable component, or should I keep it inside the current screen for now?*

\---

\## UI Implementation Rules (VERY IMPORTANT)

Use the approved LedgerBook design references and the design-system standards below as the source of truth for UI work.

When a reference image is provided:

- Match its layout, spacing, typography, colours, alignment, proportions, border radius, and visible UI elements as closely as practical.
- Preserve the established LedgerBook design system; do not introduce a competing visual style.
- Treat generated mockups as visual references, not as proof that every interaction or edge state has been specified.
- Implement functional controls, accessibility, validation, loading/error/empty states, and responsive behaviour even when these are not visible in the reference.
- Do not copy decorative details that reduce usability on small screens or conflict with native platform behaviour. If a reference conflicts with an explicit product or accessibility requirement, preserve the requirement and explain the difference.
- Do not approximate a supplied reference unnecessarily, but do not sacrifice working behaviour or usability merely to imitate a static mockup.

Before building a new screen, check whether its components and design tokens already exist. Reuse them instead of introducing one-off values.

\---

\## Image Generation Rules

If the user enables image generation:

\- Generate images that are **\*\*visually identical or extremely close\*\*** to the provided UI reference

\- Do not change style, colors, or composition

\- Keep consistency with the design system

After generating images:

\- Place them inside the \`assets/\` folder

\- Use clear and organized naming:

\`\`\`txt

assets/images/

  empty-customers.png

  app-icon.png

\`\`\`

Use these assets properly in the UI.

\---

\## Styling Rules

Use NativeWind tailwindcss classes for styling strictly. Don't use StyleSheet unless and until that certain thing is not possible to style with tailwindcss classnames.

Prioritize clean, readable mobile UI.

When building from an attached design image:

\- match spacing closely

\- match typography hierarchy

\- match border radius and shadows

\- match layout structure

\- use consistent reusable styles

\- make the UI responsive for different screen sizes

Every screen must support light and dark mode (use \`dark:\` variants) and work on small, low-end Android screens (about 360x640 dp) and at larger system font sizes.

Prefer reusable class patterns through utilities in \`global.css\`. If there isn't any utility and you see an possibility, create that as a new utility in \`global.css\` by following BEM method.

\## Avoid large inline styles unless required.

\## NativeWind Rule

Use the NativeWind version already installed in this app.

Before implementing styling or NativeWind-related code:

\- Check the current NativeWind version in \`package.json\`

\- Follow the syntax, setup, and patterns supported by that exact version

\- Do not use APIs, config patterns, or examples from a different NativeWind version

\- Do not upgrade NativeWind unless the user explicitly approves it

Refer this for more info: https\://www\.nativewind.dev/v5/llms-full.txt

\---

\## Style Exception Rules

Use \`StyleSheet\` or inline styles for these React Native components/scenarios instead of NativeWind/tailwindcss classes:

\| Component / Scenario           | Why                                                                                      | Use Instead                           |

\| ------------------------------ | ---------------------------------------------------------------------------------------- | ------------------------------------- |

\| **\*\*SafeAreaView\*\***               | From \`react-native\` or \`react-native-safe-area-context\` — className not supported        | Inline styles or \`StyleSheet\`         |

\| **\*\*Button\*\***                     | Only supports \`title\` and \`onPress\` props — cannot customize background, border, padding | \`TouchableOpacity\` with custom styles |

\| **\*\*KeyboardAvoidingView\*\***       | Behavior props not supported by className                                                | Inline styles or \`StyleSheet\`         |

\| **\*\*Modal\*\***                      | \`visible\`, \`transparent\` props                                                           | Inline styles                         |

\| **\*\*ScrollView\*\***                 | \`contentContainerStyle\`, \`indicatorStyle\`                                                | \`StyleSheet\`                          |

\| **\*\*TextInput\*\***                  | Input-specific props like \`underlineColorAndroid\`                                        | Inline styles                         |

\| **\*\*Animated.View\*\***              | Animated style values                                                                    | \`StyleSheet\` with animated values     |

\| **\*\*Dynamic styles\*\***             | Styles calculated at runtime                                                             | \`StyleSheet.create()\` or inline       |

\| **\*\*Platform-specific\*\***          | iOS-only or Android-only props                                                           | Conditional inline styles             |

\| **\*\*Pressable/TouchableOpacity\*\*** | \`style\` prop for pressed states                                                          | \`StyleSheet\`                          |

\| **\*\*Shadow (iOS/Android)\*\***       | Different shadow syntax per platform                                                     | \`StyleSheet\` with platform checks     |

\| **\*\*Transform arrays\*\***           | Complex transform combinations                                                           | \`StyleSheet\`                          |

\| **\*\*Z-index\*\***                    | Sometimes needs explicit StyleSheet                                                      | \`StyleSheet\`                          |

\### When to Use StyleSheet

Use \`StyleSheet\` or inline styles when:

\- The prop is React Native-specific (not web-equivalent)

\- The value is dynamic/calculated at runtime

\- Platform-specific behavior is needed

\- NativeWind doesn't map the property to a style

\### SafeAreaView Example

\`\`\`tsx

*// ✅ CORRECT - Use inline styles or StyleSheet*

import { SafeAreaView } from "react-native-safe-area-context";

function MyScreen() {

  return (

    \<SafeAreaView *style*={{ flex: 1, backgroundColor: "#fff" }}>

      {*/\* content \*/*}

    \</SafeAreaView>

  );

}

*// ❌ INCORRECT - Do not use NativeWind/tailwindcss classes*

function MyScreen() {

  return (

    \<SafeAreaView *className*="flex-1 bg-white">{*/\* content \*/*}\</SafeAreaView>

  );

}

\`\`\`

And similar for above mentioned exception components. Otherwise, alaways stick to nativewind utilities.

\---

\## LedgerBook Design System

Treat the approved LedgerBook brand board and screen mockups as the visual baseline. Keep the design system centralised and consistent across every screen.

### Brand tokens

Define reusable tokens in the project's existing theme/global styling setup rather than scattering raw values throughout components:

- Brand navy: `#1A237E` — brand identity, selected navigation, and key headings where appropriate.
- Brand emerald: `#1B5E20` — primary actions and positive/paid states where the contrast is accessible.
- Light mint surface: `#E8F5EE` — subtle positive or selected backgrounds.
- Primary text: `#17212B` — primary text in light mode.
- Secondary text: `#64748B` — supporting text; verify contrast before using on light surfaces.
- Border: `#E2E8F0`.
- Surface: `#F8FAFC`.
- Background: `#FFFFFF`.
- Error/debt accent: `#D32F2F` — pair with clear text such as “Outstanding” or “Overdue”; never use colour alone.
- Warning: `#F9A825`; info: `#3F83F8`.

Use Poppins as the preferred typeface if the font assets and current project setup support it. Define a consistent type scale and weights for screen titles, section headings, card titles, body text, supporting text, and captions. If Poppins assets are not available, do not block feature work: use a consistent readable system sans-serif and ask before adding a font dependency or assets.

Define and reuse tokens for spacing, radii, elevation, borders, and component heights. Use generous but efficient spacing, readable contrast, and touch targets of at least 48x48 dp. Support light and dark themes with semantic tokens; do not simply reuse light-theme text and surface colours unchanged in dark mode.

### Standard components

Prefer shared components when they represent a stable reusable pattern, including:

- `MoneyText` for all displayed money.
- `PrimaryButton` and `SecondaryButton` for consistent action styles.
- `AppHeader` and the main `TabBar` for navigation consistency.
- `CustomerRow` for customer identity and outstanding balance.
- `BalanceSummaryCard` for dashboard totals.
- `EmptyState` for a clear explanation and next action.
- `Keypad` / amount-entry controls for reliable monetary input.
- Shared form fields, confirmation prompts, and feedback states where repetition warrants it.

Do not create tiny abstractions prematurely. Keep the implementation readable and follow the component-creation rules above.

### MVP screen inventory and user flow

Design and implement the smallest complete set of screens needed for the MVP. Names can follow the existing routing structure, but the following user journeys must be supported:

1. **Onboarding:** 2–3 skippable slides covering recording credit, polite reminders, and tracking customer balances. Provide a clear Skip/Continue action and a path to setup; do not force users through a long tour.
2. **Business setup:** business name and currency preference. NGN is the default. Keep setup short and explain any step that requires connectivity.
3. **Authentication:** Clerk sign-in and the relevant signed-in/out states. Initial sign-in and session renewal may require connectivity. When the network is unavailable, ledger reads must report the error and offer retry.
4. **Home/dashboard:** total outstanding customer receivables, recent activity, and a prominent action to record credit or a repayment. Totals must derive from ledger entries.
5. **Customer list:** search, a clear empty state (“No customers yet”), and a prominent “Add your first customer” action. Show each customer's name and outstanding balance with an unambiguous label or sign.
6. **Add/edit customer:** essential name and optional phone number for reminders. Validate input and avoid collecting unnecessary personal data.
7. **Customer details / ledger:** current outstanding balance, transaction history, and clear actions to record credit, record repayment, and prepare a reminder.
8. **Record entry:** amount entry, explicit Credit / Repayment selection (or equally unambiguous labels), validation, and a reviewable save action. The balance must update from the saved entry. Avoid ambiguous “You Gave” / “You Got” labels unless supporting text makes their accounting meaning unmistakable.
9. **Reminder preview/share:** show the customer, current outstanding balance, and polite message before the user opens the native share sheet or a supported messaging app. Never imply delivery is confirmed.
10. **Settings/account:** business preferences, theme if supported by the existing setup, sign-out, privacy policy access, and account/data deletion.

The first three generated design directions—onboarding, customer empty/list states, and the numeric entry keypad—are on scope for the MVP. They do not replace the dashboard, customer details/history, add/edit customer, reminder preview/share, setup, and settings/account screens listed above. Build in workflow order; do not generate or implement every screen at once if the underlying data flow is not ready.

### UI quality bar

The app should feel clear, trustworthy, fast to use one-handed, polished, and mobile-first. Use scannable lists, friendly empty states, clear transaction direction, and accessible owed/settled states. Keep the interface usable on small devices (around 360x640 dp), larger system font sizes, and low-end Android phones. Animations and haptics are optional enhancements, not prerequisites for core workflows.

\---

\## Image Rule

Use centralized image imports.

Before using any image asset:

1\. Check if \`constants/images.ts\` exists.

2\. If it does not exist, create it.

3\. Import and export all app images from \`constants/images.ts\`.

4\. Use images through the centralized object.

Example:

\`\`\`ts

import emptyCustomers from "@/assets/images/empty-customers.png";

import appIcon from "@/assets/images/app-icon.png";

export const images = {

  emptyCustomers,

  appIcon,

};

\`\`\`

Use images like this,

\`\`\`tsx

\<Image *source*={images.emptyCustomers} />

\`\`\`

Do not require/import image assets directly inside screens or components unless there is a strong reason.

\---

\## Money and Ledger Data Rules

Ledger data is created by the user, not hardcoded.

\- Store all money as **\*\*integers in kobo\*\*** (\`amountMinor\`). Never use floating-point numbers for money.

\- All money formatting goes through one \`formatMoney\` helper and all user input through one \`parseMoneyInput\` helper in \`lib/money.ts\`. Render money only through the \`MoneyText\` component.

\- Balances are **\*\*derived\*\*** from entries (credits minus payments). Never store a balance as an editable field.

\- Entries are never silently overwritten. Deletes are soft (\`deletedAt\`), and corrections are explicit.

\- Use stable ids for customers and entries; handle retried network requests safely and prevent duplicate ledger entries.

\- Types for \`Customer\`, \`Entry\`, and \`ReminderLog\` live in \`types/\` and must be strict. Do not add \`OutboxOp\` types unless offline sync is explicitly approved later.

\- Write unit tests for money helpers, balance and aging selectors, and phone-number normalisation.

\---

\## store/

Use Zustand stores here.

Use Zustand for:

\- customers and entries (normalised by id)

\- settings (business name, theme, reminder template, lock enabled)

\- app lock state

Use AsyncStorage persistence where needed.

Selectors (balance per customer, totals, aging buckets, top debtors) live in \`store/selectors.ts\` and must be memoised.

\---

\## lib/

Use this for external service helpers and pure utilities.

Examples:

\`\`\`txt

lib/

  clerk.ts

  posthog.ts

  api.ts

  sync.ts

  money.ts

  phone.ts

  cn.ts

\`\`\`

Never expose secret keys in the mobile app.

\---

\## State Management Rules

Use Zustand for global client state.

Use local state for temporary UI state.

Persist using AsyncStorage when needed.

\---

\## TypeScript Rules

Use TypeScript strictly.

Avoid \`any\`.

Keep types simple and readable.

\---

\## Feature Implementation Rules

When the user asks to build a feature:

1\. Read this file first.

2\. Identify files to change.

3\. Keep changes focused.

4\. Do not rewrite unrelated code.

5\. Follow existing patterns.

6\. Ensure feature works end-to-end with connectivity failures handled clearly.

7\. Fix errors before finishing.

\---

\## Data Access, Reminders and Security Rules

\### Supabase data access

\- Supabase PostgreSQL is the source of truth for customers and ledger entries.

\- Customer and ledger reads/writes require an internet connection. Show loading and error states, allow retry, and do not report success until the server confirms the operation.

\- Configure per-user data isolation using verified Clerk identity and Supabase Row Level Security or an explicitly approved secure server-side pattern. Test that one user cannot read or mutate another user’s data.

\- Handle request retries and uncertain outcomes safely so a retry cannot accidentally create duplicate financial entries. Use stable entry ids or idempotent mutation patterns where appropriate.

\- Do not implement an offline outbox, background sync, or conflict-resolution strategy in the MVP.

\### Reminders

\- Reminders are sent through the share sheet or the \`wa.me\` / \`sms:\` links. The app never sends messages silently.

\- Normalise phone numbers to international format before building links.

\- Log that a reminder was opened (channel, balance at the time). Do not claim it was delivered.

\- Keep reminder wording polite and non-threatening.

\### Security and privacy

\- Never put Supabase service-role keys or other privileged secrets in the mobile app. Use the public client key only with correctly enforced authorization policies. Use trusted server-side code for operations requiring privileged secrets.

\- Store the app PIN hashed in \`expo-secure-store\`. Never put it in Zustand or AsyncStorage.

\- Use \`expo-local-authentication\` for biometrics with PIN fallback.

\- Customer names and phone numbers are personal data: collect the minimum, and provide in-app account and data deletion.

\---

\## Analytics Rules (PostHog)

\- Initialise PostHog in \`lib/posthog.ts\` and wrap the app once at the root.

\- Track counts, buckets, and booleans only. **\*\*Never\*\*** send customer names, phone numbers, notes, or amounts.

\- Planned events: \`customer_added\`, \`debt_added\`, \`payment_recorded\`, \`reminder_opened\`, \`debt_cleared\`, \`report_exported\`.

\- Gate premium features with feature flags (for example \`export_pdf_premium\`). Do not hardcode premium checks.

\---

\## Clerk Rules

Use Clerk for authentication.

Do not build custom auth.

Integrate Clerk identity with Supabase data access using a supported, verified authentication approach. Supabase Row Level Security or the approved server-side authorization layer must ensure a user can only read and write their own data.

\---

\## Code Simplicity Rules

Avoid overengineering.

Refactor only when needed.

\---

\## Component Creation Rule

Only create reusable components when necessary.

Ask if unsure.

\---

\## Linting and Validation

Run:

\`\`\`bash

npm run lint

npm run typecheck

\`\`\`

If a test script exists, also run it (money and selector tests must pass).

Fix errors.

\---

\## Pull Requests

\- Work in small, focused branches and open a pull request for every feature, even when working alone.

\- Write a clear PR description (what changed, how to test) so CodeRabbit and human reviewers have context.

\- Address or reply to every CodeRabbit comment before merging. Pay special attention to money math, date handling, authorization, and duplicate-write prevention.

\---

\## Communication Style

Be concise.

Explain what changed and how to test.

\---

\## Important Constraints

Cloud-backed for this version; customer and ledger operations require internet access.

Use:

\- Zustand for client/UI state, not as the authoritative ledger database

\- Supabase PostgreSQL for customer and ledger-entry persistence

\- AsyncStorage only for lightweight local preferences/settings

\- Clerk for authentication, with a documented and tested Clerk-to-Supabase authorization setup

Do not add SQLite or another local ledger database, offline outbox, or sync engine unless the user explicitly changes this decision.

\---

\## Final Reminder

Before every feature implementation:

\- Read this file

\- Follow it strictly

\- Build clean, simple, explainable code

\- Keep money in integer kobo and handle offline/network failure states honestly

\- Replicate UI exactly when designs are provided