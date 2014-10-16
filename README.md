braindrill
==========

This is basically a Spaced repetition software, but pushed way further. Everyone knows Anki. Quick comparison

This is 100% client-side web app, meaning it's truly portable everywhere. To make the data available everywhere, it's synced to your Dropbox. I would have preferred to read/write directly to the disk, but this is unfortunately still not allowed for browsers.

- It uses a powerful template system for excessive customization
- better math support (mathjax AND katex)
- powerful way to control the showing time. Honestly I don't think the "theory" behind 

## Quickstart / Introduction
### Informations
Let's say you want to learn about the countries of our planet. Braindrill uses *informations' (Think Anki notes), which can have several entries (Fields).

Country: USA
Capital: Washington
Language: English
tags: 'good country'

Country: Germany
Capital: Berlin
Language: German

There can be an arbitrary amount of entries, and they can contain text, images or math.

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

So we set up three different views for this kind of information (more below)

### Mappings
A mapping is the interesting part. It's about *which* informations are displayed *how* and *when*.

The filtering can be based on the content and metadata! The *how* is simply an associated view, and the when is a controller which controls the delay until it's displayed next.

For the controller you can set a time, and how big the "window" is.

Overcomplicated? 

** Opinions
Honestly I don't think the "theory" behind Anki and most of the other spaced repetition ideas is valid. Even if it would be true, the premises it's based on is hardly ever fulfilled. It's not about learning random words, it's about working knowledge or whatever. 
