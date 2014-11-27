Ginseng
==========

Ginseng is basically a Spaced repetition software like Anki, but with all the things fixed I disliked/missed there. Quick comparison:
- 100% in browser client-side Javascript
- Data stored in JSON format. Sync currently over file in/export, Dropbox or MongoDB
- proper Markdown and LaTeX (Katex and Mathjax) support
- Repetition time can be freely chosen. Can be the classic spaced repetition way, or a fixed time intervals or anything you like
- Informations can have arbitrary entries, tags, have rich metadata stored and reviews can be done on any selection based on that data. No fixed "deck" structure

## Quickstart / Introduction
### Informations
Let's say you want to learn about the countries of our planet. Ginseng uses *informations' (Think Anki notes), which can have several entries.

Country: USA
Capital: Washington
Language: English
tags: 'good country', 'home of the brave'

Country: Germany
Capital: Berlin
Language: German


There is also metadata, like
- time of creation and all previous views
- Tags like the automatically inserted file it's in above, or any more custom ones you want
- number of fields
- file it's saved in
- does it contain latex/math, images etc

### Views
Then we can have several 'views' (cards) on that information. A common thing to do is set up two views for Those informations: One that shows the front and asks for the back side, and visi versa. For our example, we might do

Country -> Capital
Capital -> Country
Country -> Language

These are all different views on this kind of information and are what get's actually reviewed in the end.

### Mappings
A mapping is the interesting part. It's about *which* informations are displayed *how* and *when*.

The which part may be all informations from the example above, or just all that don't have math, or a specific one ...

controller just default
