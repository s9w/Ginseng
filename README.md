# Ginseng

Ginseng is a spaced repetition program/app.  Quick comparison:
- 100% in browser client-side Javascript
- Data stored in JSON format. Sync currently over file in/export, Dropbox and in browser
- Repetition time can be freely chosen. Can be the classic spaced repetition way, or a fixed time intervals or anything you like
- Informations can have arbitrary entries, tags, have rich metadata stored and reviews can be done on any selection based on that data. No fixed "deck" structure
- proper Markdown and LaTeX (Katex and Mathjax) support

## Quickstart / Introduction
What you want to learn/memorize is stored in an *info* which contains several *entries*. If you learn Spanish, an info could contain two entries with the english and spanish expressions.

You then create a *view* on those infos, which can be thought of as a flashcard with a front and back side. In this case, the front could show the english word and vici versa.

Those views on the individual infos are then shown, or rather "tested" on you. You can then set a time for the next review.

There are sane defaults and auto-generated info types, views and selections, so don't be intimidated by the details below. That's more of a documentation

### Views
Then we can have several 'views' (cards) on that info. A common thing to do is set up two views for Those infos: One that shows the front and asks for the back side, and visi versa. That can also be conditional, only applying to a matching tag. That way you can generate "reverse" views on infos only for those where you set a `reverse` tag for example.

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
- The data (infos, types, views, settings, everything!) is saved in a straightforward human-readable (and therefore hackable) JSON format. It's also stored file-based, so no binary data. In doubt, just edit the data file with a text editor
- The formatting is done markdown, which I think is better suited for this than full blown html
- Dates/times are saved in ISO format. Time intervals are always calculated, never saved (no standard way)
- Review ratings were abandoned in favor of just setting time intervals. Is Anki-like Interval modifier wanted?

## Open Questions:
- Naming
- minimal or full JSON?
- logic inside views
    - Right now that's not possible
    - Technical reason: Ginseng is built with React, and React has no templating with logics. There are more or less elegant ways around
    - This means no conditional parts of views. Is there a need for this?