# Where contact-form enquiries go

Every enquiry submitted on a clinic's **Contact Us** page is emailed to that
clinic's own inbox, and is also stored in **Admin → Messages** as a backstop.

## Changing the address

**Admin → Locations & branding → "Contact form goes to"**, with the location
switcher in the sidebar set to the clinic you want to change.

- Separate several addresses with commas to notify more than one person.
- Leave it blank and enquiries fall back to that location's **Public email**.
- After saving, use **Send test email** to confirm the inbox actually receives
  mail. The panel shows the live recipient above the button.

## Resolution order

The first source that yields a valid address wins:

1. the location's `form_email` — **"Contact form goes to"**
2. the location's `email` — **"Public email"**
3. the shared `settings.form_email`
4. the shared `settings.email`
5. `CONTACT_TO_EMAIL` env var

`CONTACT_TO_EMAIL` is deliberately **last**. As an override it would quietly
funnel every location's enquiries into one inbox, defeating per-clinic routing;
as a last resort it only catches the case where no address is configured at all.
Steps 3–5 exist so an enquiry is never silently dropped — they are safety nets,
not the intended configuration.

---

## Sending the mail

Three ways to send, tried in this order. The first one configured is used.

### 1. Direct SMTP — recommended (free, no third party)

This is the "WP Mail SMTP" approach: the clinic's **own mailbox** does the
sending, so patient details never pass through an outside service. Works with
Gmail, Google Workspace, Outlook, or any host that speaks SMTP.

Set these in Vercel → Project → Settings → Environment Variables:

| Variable | Value |
|---|---|
| `SMTP_USER` | the full mailbox address, e.g. `emailtocrescent@gmail.com` |
| `SMTP_PASS` | the **16-character App Password** (see below) — not the account password |
| `SMTP_HOST` | optional, defaults to `smtp.gmail.com` |
| `SMTP_PORT` | optional, defaults to `465` |
| `SMTP_FROM` | optional display name/address, defaults to `Crescent Medical Centre <SMTP_USER>` |

**Getting a Gmail App Password**

1. Google account → **Security** → turn on **2-Step Verification** (required —
   App Passwords are not offered without it).
2. Same page → **App passwords** → create one named e.g. "Clinic website".
3. Copy the 16-character code and paste it into `SMTP_PASS` (spaces optional).

**Notes**

- Port 465 is implicit TLS, so the password is never sent in the clear. Port 587
  (STARTTLS) also works.
- Gmail rewrites the `From:` header to the authenticated account unless the
  address is a verified alias — so the mail arrives *from* the clinic mailbox.
  `Reply-To` is set to the patient, so staff can just hit Reply.
- One mailbox does the sending for **all** locations; each location's
  `form_email` still controls *who receives* it. You do not need separate
  credentials per clinic.
- Free Gmail allows roughly 500 recipients/day; Google Workspace 2,000/day.
  Far above what a clinic contact form generates.
- Requires outbound TCP, so the route runs on the Node.js runtime
  (`export const runtime = "nodejs"` in `app/api/contact/route.ts`). It would
  not work on Vercel's Edge runtime.

### 2. Resend

Set `RESEND_API_KEY`, plus `CONTACT_FROM_EMAIL` once a sending domain is
verified. Used only when no SMTP credentials are set. Free tier available;
a paid plan and a verified domain are needed for real volume.

### 3. FormSubmit — zero-config fallback

Used automatically when neither of the above is configured. No setup, but:

- **Each new recipient address must click a one-time activation email before it
  receives anything.**
- It is a third-party relay — patient names, phone numbers and messages pass
  through formsubmit.co.

For a medical clinic, option 1 is the one to use.

---

## When delivery fails

The enquiry is still saved, and **Admin → Messages** shows a red
*"Not emailed"* banner with the address that was tried and the provider's
reason, for example:

> SMTP send via smtp.gmail.com:465 failed: Invalid login: 535 … — check
> SMTP_USER and SMTP_PASS. Gmail needs a 16-character App Password with
> 2-Step Verification enabled, not the normal account password.

The patient is not shown an error as long as the enquiry was captured — so
watch for that banner, it is the only signal that an address is wrong or a
credential has expired.
