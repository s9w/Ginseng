# Ginseng

Ginseng is a spaced repetition program/app. Like Anki or SuperMemo but different.
- 100% in browser client-side Javascript
- Data stored in JSON format, sync over Dropbox
- Freedom over review intervals. Not strictly bound to "difficulty"
- No fixed "deck" structure. Instead you can create filters that dynamically create reviews
- native Markdown formatting and LaTeX support for content and templates

## Quickstart / Introduction
What you want to learn/memorize is stored in an *info* which contains several *entries*. If you learn Spanish, an info could contain two entries with the English and Spanish expressions.

You then create a *view* on those infos, where each view can be thought of as a flashcard with a front and back side. In this case, the front could show the english word and vici versa.

More than one view can be created from an info, for example if you also want to test the reverse relation. Or you might want to include a note entry that gets displayed along.

Views can be bound to a condition or filter so they only get generated when that condition is true. A typical example is the condition that the info has a "reverse" tag for generating a reverse template. The filter syntax is described below.

The views are written in markdown code and you can access the info fields with curly braces. Here's an (unncessary cluttered) example of a template front:
```
This is my **front**:
{front}

And here's my notes: {notes}
```

Infos have a type which defines the number of entries as well as the templates.

## Intervals

## Selections
There are no static "decks", but rather you can make a *selection* of views with this syntax:

- Simple strings match info tags. So `tag: math` matches all views whose infos have a `math`tag.
- `isDue` matches view that are beyond their due date.
- Items separated with a comma are all necessary for that selection to apply. So `math, physics` returns all infos that are tagged with math and physics.
- Items separated with `OR` work how you think. `apple OR beer` returns all infos that are tagged apple or beer.
- A leading ! will invert the selection. So `tag: !hidden` matches all views whose infos don't have a hidden tag.

A reasonable and default selection is `isDue, tag: !hidden` for example.

## Mobile use
There is no real android app, but the html should be very usable there.

There is liberal use of HTML5 stuff, but the only part that isn't supported by android chrome is drag and drop, so you won't be able to rearrange your infotype fields on mobile. That's a pretty rare thing to do though, that cut feels reasonable.

## Philosophy / Goals
The App and the underlying data format are designed to be as open and robust as possible
- All data is saved in a straightforward human-readable (and therefore hackable) JSON file
- This means that syncing should be very easy to extend to other services like Google Drive, Firebase, MongoDB or really anything else
- The formatting of the view entries and the templates is done Markdown with optional LaTeX. Currently [marked](https://github.com/chjj/marked) is used for Markdown and [KaTeX](https://github.com/Khan/KaTeX) for LaTeX converting.
- Dates/times are saved in [ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601)