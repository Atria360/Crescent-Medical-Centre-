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
Gmail, Microsoft 365 / Outlook, or any host that speaks SMTP.

Set these in Vercel → Project → Settings → Environment Variables:

| Variable | Value |
|---|---|
| `SMTP_USER` | the full mailbox address |
| `SMTP_PASS` | the mailbox password or app password (see per-provider notes) |
| `SMTP_HOST` | optional, defaults to `smtp.gmail.com` |
| `SMTP_PORT` | optional; defaults to `465` for Gmail, `587` for any other host |
| `SMTP_FROM` | optional display name/address, defaults to `Crescent Medical Centre <SMTP_USER>` |

One mailbox sends for **all** locations; each location's `form_email` still
controls *who receives*. **The sending mailbox does not have to be a receiving
one** — this is the escape hatch if one provider won't cooperate.

#### Gmail / Google Workspace

| | |
|---|---|
| `SMTP_HOST` | `smtp.gmail.com` (default) |
| `SMTP_PORT` | `465` (default, implicit TLS) |
| `SMTP_PASS` | a **16-character App Password** |

1. Google account → **Security** → turn on **2-Step Verification** (required —
   App Passwords are not offered without it).
2. Same page → **App passwords** → create one named e.g. "Clinic website".
3. Paste the 16-character code into `SMTP_PASS`.

Limits: roughly 500 recipients/day on free Gmail, 2,000/day on Workspace.

#### Microsoft 365 / Outlook (domain email)

| | |
|---|---|
| `SMTP_HOST` | `smtp.office365.com` |
| `SMTP_PORT` | `587` (STARTTLS — Microsoft does **not** support 465) |
| `SMTP_USER` | the full mailbox address, e.g. `info@crescentmedical.ca` |
| `SMTP_PASS` | the mailbox password, or an app password if MFA is on |

**Authenticated SMTP must be enabled for that mailbox**, in two places:

1. Microsoft 365 admin centre → **Users** → *the user* → **Mail** →
   **Manage email apps** → tick **Authenticated SMTP**.
2. The tenant-wide setting must not block it
   (`Set-TransportConfig -SmtpClientAuthenticationDisabled $false`).

> **⚠️ This has a deadline.** Microsoft is retiring Basic authentication for
> SMTP AUTH client submission. The timeline has slipped repeatedly — most
> recently to **Basic auth being switched off by default at the end of
> December 2026**, with admins still able to re-enable it, and a final removal
> date to be announced in the second half of 2027. Check **MC786329** in your
> own Message Center for the dates that apply to your tenant, since these have
> moved more than once.
>
> Practical options when that lands: re-enable it for this one mailbox, switch
> to OAuth2, or — simplest — **send through a Gmail/Workspace mailbox while
> still delivering to the Outlook address**. The form only needs *some*
> mailbox to send; the recipient stays whatever you set per location.

#### Security notes

- Port 465 uses implicit TLS. Port 587 starts in the clear and upgrades, so
  the code sets `requireTLS` — if a server refuses STARTTLS the send **fails**
  rather than transmitting the password or patient details unencrypted. This is
  tested.
- TLS 1.2 is the enforced minimum (Microsoft 365 requires it).
- `SMTP_FROM` must be the authenticated mailbox or a verified alias; both Gmail
  and Microsoft 365 rewrite or reject anything else.
- Requires outbound TCP, so the route runs on the Node.js runtime
  (`export const runtime = "nodejs"`). It would not work on Vercel's Edge runtime.

### 2. Resend

Set `RESEND_API_KEY`, plus `CONTACT_FROM_EMAIL` once a sending domain is
verified. Used only when no SMTP credentials are set. Free tier available;
a paid plan and a verified domain are needed for real volume. Worth keeping in
mind as the fallback if Microsoft's Basic-auth retirement closes off option 1.

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
