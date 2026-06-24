# Infrastructure & DNS — mehmetpolat.net

How the domain, website, and email for **mehmetpolat.net** are wired together.
Read this before changing anything in Cloudflare DNS.

## Overview

| Concern | Provider | Cost | Notes |
|---|---|---|---|
| Domain DNS | **Cloudflare** | Free | Nameservers point here; all DNS records live here |
| Website hosting | **Cloudflare Pages** | Free | Serves this repo at `mehmetpolat.net` + `www` |
| Email (mailboxes) | **Cloud86** (Plesk) | Paid | `info@mehmetpolat.net` physically lives here, IP `45.82.189.111` |
| Contact form delivery | **Web3Forms → private Gmail** | Free | Independent of the mailbox above (see below) |

The website and the email are hosted in **two different places**. That split is
the key thing to understand: the site is on Cloudflare, the mail is on Cloud86.

## DNS records (Cloudflare)

| Name | Type | Content | Proxy | Purpose |
|---|---|---|---|---|
| `mehmetpolat.net` | CNAME | → Cloudflare Pages site | 🟠 Proxied | Website |
| `www` | CNAME | → Cloudflare Pages site | 🟠 Proxied | Website |
| `mail` | A | `45.82.189.111` | ☁️ DNS only | Mail server (Cloud86) |
| `smtp` | A | `45.82.189.111` | ☁️ DNS only | Outgoing mail (Cloud86) |
| `mehmetpolat.net` | MX | `mail.mehmetpolat.net` (prio 0) | ☁️ DNS only | Inbound mail routing |
| `mehmetpolat.net` | TXT | `v=spf1 +a +mx +ip4:45.82.189.111 ~all` | ☁️ DNS only | SPF |
| `_dmarc` | TXT | `v=DMARC1; p=quarantine; ...` | ☁️ DNS only | DMARC |
| `_domainkey` | TXT | `o=-` (stub — DKIM not yet configured) | ☁️ DNS only | DKIM (see follow-up) |
| `ftp` | CNAME/A | (optional, Cloud86) | — | FTP, not email-related |

### ⚠️ Rules — do not break email again
- **Never proxy (🟠 orange cloud) the mail records** (`mail`, `smtp`, MX target).
  Cloudflare's proxy only handles HTTP/HTTPS — it cannot carry SMTP/IMAP/POP3.
  All mail records must stay **"DNS only" (grey cloud)**.
- **MX must point to a grey-cloud A record** (`mail.mehmetpolat.net` → `45.82.189.111`),
  never to a proxied record or a CNAME.
- Cloudflare will warn "your origin IP is exposed" because of the grey-cloud mail
  records. **This is expected and correct** — mail servers must be directly reachable.

### Mail client settings (Cloud86)
- IMAP: `mail.mehmetpolat.net`, port `993`, SSL/TLS
- SMTP: `mail.mehmetpolat.net`, port `465` (SSL) or `587` (STARTTLS)
- Username: full address, e.g. `info@mehmetpolat.net`

## Contact form

The contact form in `index.html` posts to **Web3Forms**
(`https://api.web3forms.com/submit`, hidden `access_key` field). Web3Forms emails
each submission to the **private Gmail** registered to that key. It does **not**
use `info@mehmetpolat.net`, SPF/DKIM, or the Cloud86 mailbox in any way — so the
form keeps working regardless of what happens to the domain's email hosting.

## History — the June 2026 email outage

When the website was migrated to Cloudflare Pages, the apex `mehmetpolat.net`
became a CNAME to the Pages site, and `mail`/`smtp`/`ftp` were CNAMEs back to the
apex — all **proxied**. The MX also pointed at `mehmetpolat.net` (the website).
Result: every mail path resolved to the website behind Cloudflare's proxy, so
`info@mehmetpolat.net` could neither send nor receive.

**Fix:** changed `mail` and `smtp` to grey-cloud **A records** → `45.82.189.111`,
and repointed the **MX** to `mail.mehmetpolat.net`. Website records left on
Cloudflare. (See the DNS table above for the resulting good state.)

## Cost-keeping rules

- **Keep the Cloud86 plan active** while `info@` is in use — the mailbox lives
  there. The cheapest Cloud86 plan ("Webhosting Start", ~€1.95/mo first year,
  ~€3.75/mo after, 10 mailboxes) is enough now that the site is on Cloudflare.
- **Keep the domain name renewed** each year.

## Future plan — retiring the paid mailbox

`info@mehmetpolat.net` is being phased out (~1 year). Because the contact form
already delivers to a private Gmail (Web3Forms), the paid mailbox can eventually
be dropped:

1. Cancel the Cloud86 email/hosting plan.
2. Enable **Cloudflare Email Routing** (free) to forward `info@mehmetpolat.net`
   → the private Gmail. This swaps the MX to Cloudflare's routing servers and
   makes the `mail`/`smtp` A records unnecessary.
3. Website (Cloudflare) and contact form (Web3Forms → Gmail) are unaffected.

After that, the only recurring cost is the yearly domain renewal.

> Note: Cloudflare Email Routing only **receives/forwards** — it cannot **send
> as** `info@`. That's acceptable here since outgoing mail will move to the
> private Gmail. **Do not switch yet** — keep Cloud86 while `info@` is still used.

## Follow-up: DKIM (deliverability)

`_domainkey` is currently just an `o=-` stub, not a real signing key, so outgoing
mail may be spam-filtered. In Cloud86 (Plesk): **Mail → domain → Mail Settings**,
enable DKIM signing, then copy the generated TXT record into Cloudflare as
**DNS only**. Only needed while sending from the Cloud86 mailbox.
