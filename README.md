# Ginseng

Ginseng is a spaced repetition web app. Think Anki or SuperMemo but different.
- 100% in browser client-side Javascript
- Data stored in JSON format, sync over Dropbox
- Freedom over review intervals. Not strictly bound to "difficulty"
- No fixed "deck" structure. Manage and filter by tags
- Native Markdown formatting and LaTeX support for content and templates

## Introduction
In Ginseng, the thing you want to learn/memorize is called an *info*. It can contain two or more *entries* and any number of tags you want. If you learn Spanish, the entries would be the English and Spanish word. Infos have a type, which defines the number of entries as well as the templates which are used to display the info in the review mode.

The template maps an info into a front and back side. In the example case, the front could show the english word and the back could show the spanish word. More than one template can be created from an info: For example if you also want to test the reverse relation. Or you might want to include a note entry that gets displayed along.

Templates can be bound to a condition so they only get generated when that condition is matched. A typical example is the condition that the info has a "reverse" tag for generating a reverse template. The filter syntax is described below.

The templates (as well as the info entries) are written in Markdown and you can access the info entries with curly braces. Also, both can contain LaTeX code when between single dollar signs.

Note that there are no fixed groups (or "decks" as in Anki) for infos. Instead there are *session types*. By default this works like Anki, so it shows the generated templates for everything that's "due". That behaviour is customizable though. It can filter based on the infos type, entries, tags, creation date, review count, last interval. Some example uses might be
- group together different languages or different university related tags
- only newly created
- generate even if not due (aka "cram mode")

## Intervals
During review, you have the choice between *set*ting an interval, or *changing* the previous. For example setting "5h" would mean that in 5 hours, that review would become due again.

Most of the time you probably want to change the previous interval. Either relatively with percent increases or adding a fixed time amount.

Clicking an interval selection will "select" it with a black border and preview the new interval and the date and time when it'll become due again. click the same selection again to confirm.

## Filter
- `tag: math` matches all infos that have a `math` tag. This is case-sensitive and a precise match, so it won't match a `mathematics` tag.
- Filter queries can be logically combined with the keywords `and` and `or`. For example, `tag: math and tag: physics` matches all infos with a `math` tag.
- And has a higher precedence than `or`, so `tag: math and tag:physics or tag: spanish` would match infos with either a spanish tag or with both math and physics tags

## Philosophy / Goals
The App and the underlying data format are designed to be as open and robust as possible
- All data is saved in a straightforward human-readable (and therefore hackable) JSON file
- This means that syncing should be very easy to extend to other services like Google Drive, Firebase, MongoDB or really anything else
- The formatting of the view entries and the templates is done Markdown with optional LaTeX. Currently [marked](https://github.com/chjj/marked) is used for Markdown and [KaTeX](https://github.com/Khan/KaTeX) for LaTeX converting as they seem to be the fastest choice.
- Dates/times are saved in [ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601)

## Roadmap / issues
- I'm quite happy with the JSON format as it's so clean. But it tends to grow pretty quickly. Especially upload times may be come a problem with slower connections and bigger datasets. Ideas:
    - When every review would be saved, that data grows quickly. So by default, only the last two reviews are stored. That way the file size is independent of the number of reviews.
    - Better compression? My test with LZ-String yielded a compression down to 13%, which is impressive. But it'll limit the human-readable nature and simplicity of the format.
    - Cutting whitespace would yield around 28% of space saving, but also severely limit the readability of the file
    - A "proper" solution would probably mean only transferring the diffs. But that would mean having some kind of backend and everything that comes with it (overhead, another program to write/maintain, transfer limits/costs, making it reliable)
- KaTeX is very fast but currently doesn't even support `\mathbb` fonts, let alone other packages etc. Add Mathjax as an option?
- Use browsers local storage to provide offline/cached access? But that'll open Pandoras box of conflicting versions
- Write an Anki converter? The Anki data format is borderline unusable, but I'll try the python package