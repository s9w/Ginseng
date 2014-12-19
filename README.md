# Ginseng

Ginseng is a spaced repetition program/app. Like Anki or SuperMemo but different.
- 100% in browser client-side Javascript
- Data stored in JSON format, sync over Dropbox
- Freedom over review intervals. Not strictly bound to "difficulty"
- No fixed "deck" structure. Instead you can create filters that dynamically create reviews
- native Markdown formatting and LaTeX support for content and templates

## Introduction
In Ginseng, the thing you want to learn/memorize is called an *info*. It can contain two or more *entries* and any number of tags you want. If you learn Spanish, the entries would be the English and Spanish word. Infos have a type, which defines the number of entries as well as templates which are used to display the info in the end.

The template maps an info into a front and back side. In the example case, the front could show the english word and vici versa. More than one template can be created from an info: For example if you also want to test the reverse relation. Or you might want to include a note entry that gets displayed along.

Templates can be bound to a condition so they only get generated when that condition is matched. A typical example is the condition that the info has a "reverse" tag for generating a reverse template. The filter syntax is described below.

The templates (as well as the info entries) are written in markdown and you can access the info entries with curly braces. Also, both can contain LaTeX math when between dollar signs.

Note that there are no fixed groups (or "decks" as in Anki) for infos. Instead there are *session types*. By default this works like Anki, so it shows the generated templates for everything that's "due". That behaviour is customizable though. It can filter based on the infos type, entries, tags, creation date, review count, last interval. Some example uses might be
- group together different languages or different university related tags
- only newly created
- generate even if not due (aka "cram mode")

## Intervals
todo

## Filter
- Simple strings match all entries of an info. So `Apple` matches all infos that have `apple` anywhere in any of their entries. This is case-insensitive and would also match "grapple".
- Tags: `tag: math` matches all infos that have a `math` tag. This is a precise match!
- `is: Due` matches view that are beyond their due date.
- Items separated with a comma are all necessary. So `tag: math, tag: physics` matches both.
- Items separated with `OR` work how you think. `tag:math OR beer`.
- A leading ! will invert the filter. So `tag: !hidden` matches all views whose infos don't have a hidden tag.

A reasonable and default filter is `is:Due, tag: !hidden`.

## Mobile use
There is no native android app, but the app should be very usable there. Performance on my hardware was always "too fast to measure"

## Philosophy / Goals
The App and the underlying data format are designed to be as open and robust as possible
- All data is saved in a straightforward human-readable (and therefore hackable) JSON file
- This means that syncing should be very easy to extend to other services like Google Drive, Firebase, MongoDB or really anything else
- The formatting of the view entries and the templates is done Markdown with optional LaTeX. Currently [marked](https://github.com/chjj/marked) is used for Markdown and [KaTeX](https://github.com/Khan/KaTeX) for LaTeX converting as they seem to be the fastest choice.
- Dates/times are saved in [ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601)

## Roadmap / issues
- I'm quite happy with the JSON format as it's so clean. But it tends to grow pretty quickly. Especially upload times may be come a problem with slower connections and bigger datasets. Ideas:
    - The review data is about 50% of the size in my dataset, maybe offer an option to only keep the last n reviews?
    - Remove whitespace? But that would severely limit the human-readable part
    - Better compression?
    - A "proper" solution would probably mean only transferring the diffs. But that would mean having some kind of backend and everything that comes with it (overhead, another program to write/maintain, transfer limits/costs, making it reliable)
- KaTeX is very fast but currently doesn't even support `\mathbb` fonts, let alone ams etc. Add Mathjax as an option?
- Use browsers local storage to provide offline/cached access? But that'll open Pandoras box of conflicting versions
- Write an Anki converter? The format is borderline unusable, but I'll try the python package