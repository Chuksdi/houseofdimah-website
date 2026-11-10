#!/bin/zsh
# Puts the Sanity "Website preview" (Viewer) token straight into Netlify for the preview site.
# It is never shown on screen, never written to a file, and never seen by Claude.
cd "${0:A:h}/.." || exit 1
print -n "Paste the Sanity Viewer token (nothing will show as you paste), then press Enter: "
read -rs token
print
if [[ -z "$token" ]]; then print "No token entered. Nothing saved."; exit 1; fi
if npx netlify env:set SANITY_READ_TOKEN "$token" --context branch-deploy >/dev/null 2>&1; then
  print "Saved in Netlify. You can close this tab and tell Claude it's done."
else
  print "Netlify didn't accept it. Tell Claude, and don't paste the token anywhere else."
fi
unset token
