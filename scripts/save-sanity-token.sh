#!/bin/zsh
# Saves a Sanity API token for this project WITHOUT showing it on screen or in chat.
# It is stored in a private file only your Mac user can read, outside the repo.
dir="$HOME/.config/houseofdimah"
file="$dir/sanity-token"
mkdir -p "$dir" && chmod 700 "$dir"
print -n "Paste the Sanity token (nothing will show as you paste), then press Enter: "
read -rs token
print
if [[ -z "$token" ]]; then print "No token entered. Nothing saved."; exit 1; fi
umask 077
print -rn -- "$token" > "$file"
chmod 600 "$file"
unset token
print "Saved. You can close this tab and tell Claude it's done."
