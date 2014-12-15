# Ginseng

Ginseng is a spaced repetition program/app. Like Anki, SuperMemo but different.
- 100% in browser client-side Javascript
- Data stored in JSON format, sync Dropbox
- Repetition time can be freely chosen. Can be the classic spaced repetition way, or a fixed time intervals or anything you like
- No fixed "deck" structure. Instead you can create filters that dynamically create reviews
- native Markdown formatting and LaTeX support

## Quickstart / Introduction
What you want to learn/memorize is stored in an *info* which contains several *entries*. If you learn Spanish, an info could contain two entries with the english and spanish expressions.

You then create a *view* on those infos, where each view can be thought of as a flashcard with a front and back side. In this case, the front could show the english word and vici versa.

More than one view can be created from an info, for example if you want to test the reverse relation also. or any other template based on that info.

Views can be bound to a condition or filter so they only get generated when for example the information has a "reverse" tag.

The views are written in markdown code and you can access the info fields with curly braces. Example of a view-front:
```
This is my **front**:
{front}
```

## Intervals

### Selections
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
This is designed to be as open and long-term as possible
- All data is saved in a straightforward human-readable (and therefore hackable) JSON file.
- The formatting is done markdown, which I think is better suited for this than full blown html
- Dates/times are saved in ISO format. Time intervals are always calculated, never saved (no standard way)
- Review ratings were abandoned in favor of just setting time intervals. Is Anki-like Interval modifier wanted?
