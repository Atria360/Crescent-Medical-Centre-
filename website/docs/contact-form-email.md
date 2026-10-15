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

## Mail providers

| | Setup | Notes |
|---|---|---|
| **Resend** (recommended) | Set `RESEND_API_KEY`, and `CONTACT_FROM_EMAIL` once a sending domain is verified | Sends to all recipients in one call. No per-address activation. |
| **FormSubmit** (fallback) | None — used automatically when `RESEND_API_KEY` is absent | **Each new recipient address must click a one-time activation email before it receives anything.** Third-party relay: patient details pass through formsubmit.co. |

> **Currently in production:** no `RESEND_API_KEY` is set, so the site is on the
> FormSubmit fallback. For a medical clinic handling patient contact details,
> moving to Resend (or another provider with a signed data-processing agreement)
> is worth doing before the form carries real volume.

## When delivery fails

The enquiry is still saved, and **Admin → Messages** shows a red
*"Not emailed"* banner with the address that was tried and the provider's
reason. The patient is not shown an error as long as the enquiry was captured —
so watch the inbox for that banner, it is the only signal that an address is
wrong or unconfirmed.
