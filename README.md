# Ginseng

Ginseng is a web app for learning things with flashcards and spaced repetition. Think Anki, but different.

- 100% in browser client-side Javascript
- Data stored in single JSON file, sync over Dropbox
- Freedom over review intervals. Not bound to "difficulty"
- No fixed "deck" structure. Manage and filter by tags and profiles
- Native Markdown formatting and LaTeX support for content and templates

## Introduction
In Ginseng, the thing you want to learn/memorize is called an **info**. An info can contain two or more **entries** and any number of tags. If you learn Spanish, the entries could be the Spanish and spanish expression. Infos have a **type** which defines the number of entries as well as the **templates** which are used to display the info in the review mode.

### Templates
A template maps an info to a front and back side of a virtual flashcard. In the example case, the front could show the english word and the back could show the spanish word. The templates (as well as the info entries) are written in [Markdown](http://en.wikipedia.org/wiki/Markdown). The info entries can be used with curly braces, like `{front}`. The templates as well as the entries can contain [LaTeX](http://en.wikipedia.org/wiki/LaTeX) code between single dollar signs.

![](https://github.com/s9w/Ginseng/raw/master/doc/pipeline1.png)

There can be more than one template for a type, for example if you also want to test the reverse relation. Or you might want to include a note entry that gets displayed alongside. Templates can have to a condition so they only generate a flashcard when that condition is matched. An example could be a reverse template that will only be generated if an info has a "reverse" tag. The syntax is described [below](#filter).

![](https://github.com/s9w/Ginseng/raw/master/doc/pipeline2.png)

### Review
During review, you have the choice between *setting* an interval, or *changing* the previous. For example setting "5h" would mean that in 5 hours, that review would become due again. Most of the time you'll probably want to change the previous interval. There are relative increases in percent or fixed time amounts.

Clicking an interval selection will "select" it and mark it green. The new interval and the date and time when it'll become due again are previewed below. Click the same selection again to confirm. That way you can quickly apply a new interval with a double click.

Note that the last interval is calculated as the actual time between the last review and now, NOT when the review would have been due. That's intentional as I feel that's really what counts.

Each generated flashcard has a "**dueness**" based on the selected interval and the time since the last review. Right after reviewing, the dueness is 0. It increases linearly with time, reaching 1.0 at the time of it's designated interval. By default, that's when reviews are "due" and are displayed. It will continue to increase though if it's not reviewed. Most due cards are reviewed first.

### Profiles
With a growing collection of infos, more control over the reviews is helpful - that's what **profile**s are for. They group/filter the generated flashcards, either by their tag or creation date as described below or their dueness. A "due threshold" of less than 1.0 will show cards that are not due yet. That can be used as a "cramming mode" if you will.

![](https://github.com/s9w/Ginseng/raw/master/doc/pipeline3.png)

## Science

## Profiles
With a growing collection of things to keep in mind/Ginseng, more control over the reviews is helpful - that's what profiles are for. In addition to filtering the infos by their tag as described below, you can also specify a "due threshold". Based on the dueness described above, you can manually specify when to display cards. This allows for bigger/smaller review sessions or "cramming".

## Filter syntax
- Infos can be filtered by their tags. `tag: math` matches all infos that have a `math` tag. This is case-sensitive and a precise match, so it will neither match a `Math` nor a `mathematics` tag.
- Filtering by the creation date of the info is also possible: `createdBefore: 2015-01-01` matches infos that are created before 2015. The format should be something [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601). See [here](http://momentjs.com/docs/#/parsing/) for technical details.
- Filter queries can be logically combined with Javascript Syntax. So `||` means "or", `&&` means and. Negations can be done with `!` and feel free to go wild with brackets. For example, `tag: math || tag: physics` matches all infos with either a math or a physics tag. And `!(tag: french) || tag: important` matches everything but french... unless it's important (tag-wise).
- These filters can be applied to the templates as well as review profiles!

## Philosophy / Goals
Ginseng and the underlying data format are designed to be as open and robust as possible
- All data is saved in a straightforward human-readable (and therefore hackable) JSON file.
- This means that syncing should be reasonably easy to extend to other services like Google Drive, Firebase, MongoDB or really anything else.
- The formatting of the view entries and the templates is done Markdown with optional LaTeX. Currently [marked](https://github.com/chjj/marked) is used for Markdown and [KaTeX](https://github.com/Khan/KaTeX) for LaTeX converting as they seem to be the fastest choice.
- Dates/times are saved in [ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601).

## Roadmap / issues
- KaTeX is very fast but currently doesn't even support `\mathbb` fonts or basic Math operators, let alone other packages etc. Add Mathjax as an option?
- Use browsers local storage to provide offline/cached access? But that'll open Pandoras box of conflicting versions
- Write an Anki converter? The Anki data format is borderline unusable, but I'll try the python package