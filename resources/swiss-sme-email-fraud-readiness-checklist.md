---
layout: page
title: Swiss SME Email Fraud Readiness Checklist
description: "A practical checklist for Swiss SMEs to review fake invoice, domain impersonation, SPF, DKIM, DMARC, and business email trust risks before attackers or clients find the gaps."
permalink: /resources/swiss-sme-email-fraud-readiness-checklist/
multilingual: false
---

## Can fake invoices or supplier emails appear to come from your business?

Email is still one of the most important business systems for Swiss SMEs. It carries invoices, supplier requests, contracts, customer updates, payment information, and internal approvals.

The problem: business email can work every day and still be only partly protected.

This checklist helps you review whether your email domain is ready against common trust and impersonation risks. It does not require passwords, mailbox access, admin rights, or confidential documents.

---

## 1. Domain impersonation risk

Ask:

- Can someone send emails that appear to use your business domain?
- Does your domain have SPF, DKIM and DMARC configured?
- Is DMARC only monitoring, or does it actually tell inboxes to quarantine or reject fake-looking mail?
- Do you know who receives DMARC reports, if anyone?

Plain-language translation:

- **SPF** is the approved-sender list.
- **DKIM** is the email signature.
- **DMARC** is the rule for what inboxes should do when a message looks fake.

Why it matters:

If these are missing or unfinished, fake invoices, supplier requests, or client messages may have a better chance of looking legitimate.

---

## 2. Invoice and payment email trust

Ask:

- Do you send invoices or payment instructions by email?
- Would clients easily recognise a fake invoice email?
- Do staff verify changed bank details through a second channel?
- Are payment approvals handled only by email?
- Are supplier payment changes documented and checked?

Why it matters:

Fraud often succeeds because the email looks normal and arrives in a familiar workflow. Technical controls reduce some risks, but payment verification processes are still essential.

---

## 3. Microsoft 365, Google Workspace and hosted email settings

Ask:

- Are you using Microsoft 365, Google Workspace, Infomaniak, Hostpoint, IONOS, OVH or another provider?
- Has DKIM signing been enabled for the real business domain?
- Are all legitimate sending tools included in SPF or authenticated correctly?
- Are old email services still authorised even though nobody uses them anymore?
- Are newsletters, CRM, booking, invoicing or website forms sending email on your behalf?

Why it matters:

Many SMEs use several tools that send email. One missing or outdated configuration can create trust or delivery problems.

---

## 4. Third-party sender list

Make a quick list of tools that may send email for your company:

| Tool type | Example | Sends email as your domain? | Checked? |
|---|---|---:|---:|
| Email provider | Microsoft 365 / Google Workspace / Infomaniak | Yes / No | Yes / No |
| Website/contact form | WordPress / Webflow / custom site | Yes / No | Yes / No |
| Newsletter | Mailchimp / Brevo / HubSpot | Yes / No | Yes / No |
| Invoicing/accounting | Bexio / Abacus / other | Yes / No | Yes / No |
| CRM/booking | Calendly / Tally / CRM tool | Yes / No | Yes / No |
| Support/helpdesk | Zendesk / Freshdesk / other | Yes / No | Yes / No |

Why it matters:

Email authentication often fails because nobody owns the complete list of systems that send email.

---

## 5. Basic signs that something needs attention

You should review your setup if:

- clients say your emails land in spam,
- invoices are delayed or questioned,
- your domain has no DMARC record,
- DMARC is set to `p=none` and nobody reviews the reports,
- you changed providers but old DNS records remain,
- multiple tools send email but nobody has checked alignment,
- staff have received phishing or fake payment messages,
- your IT provider says “email works” but cannot explain SPF, DKIM and DMARC status clearly.

---

## 6. What to ask your IT, web or email provider

Use these questions:

1. Which systems are authorised to send email for our domain?
2. Is DKIM enabled for our real business domain?
3. Do we have a DMARC record?
4. Is DMARC only monitoring, or is it enforcing quarantine/reject?
5. Who receives and reviews DMARC reports?
6. Are third-party tools such as newsletters, CRM, invoicing or website forms aligned?
7. Are old providers or unused systems still authorised?
8. What is the recommended path to improve protection without disrupting legitimate email?

---

## 7. What this checklist does not cover

This checklist is not a full cybersecurity audit. It does not replace:

- mailbox compromise investigation,
- phishing simulation,
- penetration testing,
- legal certification,
- staff security training,
- full Microsoft 365 or Google Workspace tenant review.

It focuses on email-domain trust, visible configuration risks, and practical next steps.

---

## Want Clearpoint to check this for your domain?

Clearpoint offers a fixed-price **Email Security Health Check** for Swiss SMEs.

The check reviews public email-domain configuration, explains the business risk, and gives your IT, web or email provider clear next steps.

- No passwords
- No mailbox access
- No admin access
- No disruption
- Fixed-price report

<a href="/services/email-security-health-check/" class="cta-button">
Check your business email domain
</a>
