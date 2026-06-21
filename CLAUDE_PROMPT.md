# Claude Prompt — Mehmet Polat Website

Copy and paste this into Claude when you want to make changes to the website.

---

## Prompt to use

```
I manage the website for musician Mehmet Polat. The site is a single HTML file called index.html located at:

[FILL IN YOUR PATH — e.g. /Users/yourname/Documents/mehmet-polat-website/index.html]

The site is deployed on Cloudflare Pages via GitHub. Any changes I push to the main branch go live automatically at https://mehmet-polat-website.pages.dev/

The GitHub repo is: https://github.com/bartlandstra/mehmet-polat-website

Please help me make the following change:

[DESCRIBE WHAT YOU WANT TO CHANGE]

After making the change, please also run these Terminal commands to push it live:
  git add index.html
  git commit -m "describe the change here"
  git push
```

---

## Examples of changes you can ask for

- "Add a new upcoming concert on June 30 in Amsterdam at Bimhuis"
- "Update the phone number to +31 6 12345678"
- "Change the hero photo to this new image: [paste URL]"
- "Add a new album called 'New Title' (2026) with this cover image: [paste URL]"
- "Change the accent color from gold to deep blue"
- "Add a YouTube video embed in the Listen section: [paste URL]"
- "Update the bio text to say: [paste new text]"
- "Remove the contact form and just show the phone number and social links"

---

## Tips

- Always tell Claude the full file path to index.html on your computer
- You can paste in new image URLs from mehmetpolat.net or any public image host
- After Claude edits the file, it will push to GitHub and Cloudflare deploys in ~1 minute
- If you want to preview before pushing, open index.html directly in your browser first
