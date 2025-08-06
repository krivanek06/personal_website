---
title: 'The Need Of Failing Before Succeeding'
seoTitle: 'The Need Of Failing Before Succeeding'
seoDescription: 'I used to think the whole try-and-fail wording was just a catchy phrase people threw around to sound deep. Turns out it has some truth to it and the fail part is very real.'
slug: 39_the-need-of-failing
tags: personal stories, angular
order: 39
datePublished: 11.06.2025
readTime: 13
coverImage: article-cover/39_the-need-of-failing.jpg
---

I used to think the whole try-and-fail wording was just a catchy phrase people threw around to sound deep. Turns out it has some truth to it and the fail part is very real. Failing sucks, and many times, It's not just some feel good “learning opportunity”. It usually comes with blame, criticism, and mainly taking responsibility for your actions.

I feel like in tech we don't share our experiences so often, even if some may come with valuable lessons, therefore I wanted to write a smaller article where I'll share some of my own screw-up decisions I was sure were right (they weren't), the lessons they taught me, and how I became a senior developer by age 27. I want to underline that these are my personal experiences, not universal rules. Every project has its own variables, such as people, tech stack, timeline, and budget. What failed for me might work perfectly for someone else under different circumstances. Hope these short stories will show you that we all suck, and being a senior dev just means you've made enough bad calls to know which ones to avoid next time.

## Quick Refactoring

_“hmm, look at that, old code - I should refactor this, doesn't look that complicated”._

Classic mistake only juniors make, right? Well, I've made this mistake at least once a year for the past seven years. Every. Single. Time. And somehow, it was always more complicated than I initially thought.

First, you have to convince your manager to allocate time. Believe me, he wants nothing else to hear just why exactly we need to change an already existing production code, used by thousands of paying customers, just because you don't like the syntax. Good luck selling that.

Even if you manage to sell the idea, then what? You've got a deadline. Are you 100% sure you understand every edge case in that old legacy code? No? Are there tests? Probably not. So now you're hoping, that your shiny new version doesn't explode. And when it does, you just became the responsible person for it.

Worst case scenario? You're deep in your “harmless little refactor,” missing your deadlines, stress levels through the roof, burning unpaid overtime to fix a mess you created entirely voluntarily.

Refactoring isn't bad. In fact, it's often necessary for long-term maintainability. Simple refactoring might include upgrading dependencies, where newer library versions can fix some security issues or reduce the overall bundle size through optimizations like tree-shaking. Other small refactors with high impact can include reducing repeated DOM access inside loops, extracting duplicated logic into reusable functions, or replacing nested callbacks with async/await for readability.

However, be aware of the risks you're walking into. If you don't fully understand the purpose and scope of the code, don't refactor it blindly. Always have a clear reason for the change, ideally with your manager's blessing. It's critical to understand why the code exists in its current form and what edge cases it handles.

## Pushing Side Projects

Everyone tells you side projects are essential. They help you learn new tech, experiment freely, and build confidence without the pressure of deadlines. The problem starts when you delude yourself into thinking your side project is definitely the next unicorn SaaS startup.

My most “educational failure” was an app called GGFinance. It started as my Master's thesis and later turned into a long nights work. The concept was decent - a stock portfolio simulator aimed at schools. Students were creating a fake portfolio by trading stocks and the app was calculating many financial metrics, displayed in charts (people like charts), and students competed with each other. I even made [a YouTube video](https://www.youtube.com/watch?v=77E7O_Zu4tA) about it. The app is long gone, of course.

I had examples, eToro, XTB, various data-vizualizations apps, so clearly, my idea had needed to work. Or so I thought.

I learned that having users does not automatically mean you'll make money. Turns out, building a profitable product requires an actual business plan. Who would have thought.

I thought if I built it, customers would come, and pay. No. You need marketing, user research, pricing strategies, customer support... basically everything besides development. I invested 1,500+ hours in that app. Worth it? For the tech lessons, yes. I was optimizing the app, solving many edge-cases, and from the tech side, it was the most complex and best learning experience. For the revenue? I only saw red numbers. Most projects fail, and it still surprises us, that our idea does too. And just because you put more work into something it still does not mean it will succeed. Sometimes we have to admit our loss and move on.

Still, I'll always advocate for side projects. Not because they'll make you rich, but because they'll make you better. Company projects tend to revolve around the same stack, the same patterns, and often avoid "risky" experiments, for a good reason. It's easy to stagnate. Side projects give you space to try a new framework, build something from scratch, and break stuff without consequences. You'll learn faster because you're the one making the decisions. And sure, it might be exhausting after a long workday, but even dedicating a couple of hours a week keeps you sharp.

## Over-Evaluating Your Skills

I started my career as an IT helpdesk guy just before my twenties. It was a small company, around 100 people, only 2 of us on the helpdesk. We were receiving every user request thought an email. It was hard to track time, status and who was working on what. And some email occasionally even got “lost” if the request was too hard on us.

I was already learning some PHP, Jquery and MySQL, and then I came up with a brilliant idea to create an internal ticketing tool, a small Jira.

Enter the Dunning-Kruger effect. I massively overestimated my abilities. I thought, how hard could it be? A few forms, some login logic, slap on a bit of CSS, done. Instead, I ended up learning how little I actually knew, especially about things like async flows, multi-role authentication, and database design. For my first attempt I designed the database with 5 tables, shipped the product after some uncomfortable long time, and felt like a genius.

The app was ~working. I felt excited as the application was growing and slowly the whole company started to use it; however, new and new feature requests were coming in, and as the only coding guy, I had to solve them all. Over the next two years, the project went through multiple iterations, and I even wrote a custom script to migrate my 5-table database structure into a new 25-table one. Thankfully, at the time we only had 400 tickets, but man, database migrations are the worst.

This project had its ups and downs. The fascinating part is that even five years after my last commit, it is still in use, making it my most successful solo project. But it had its cost with plenty of frustrations, lots of learning, and many weekends spent coding while studying at University.

I learnt that before promising the stars, make sure you understand the destination, and at least have a rough idea of how to get there.

## Using The New Shiny Tech

Once, I was assigned as the frontend dev on a greenfield project. We got to pick the stack. I had been playing with GraphQL during weekends and loved how flexible it was. You shape your own queries, it generates TypeScript types. What's not to like?

So, I thought: “If it works in my toy projects, it'll be perfect for this big production app too”. Backend team was on board. Management was convinced. We were ready to change the world.

Fast-forward 4–5 months. Everything works fine... on localhost. Then we move to real servers and suddenly, queries are slower than a government website. Now what? Turns out GraphQL's has its infamous N+1 problem, where it hammers the database with calls for every nested entity. We spent another 3-4 months optimizing queries and rethinking everything.

Now, similarly as in the **Over-Evaluating Your Skills** section, what did I do wrong here? For starters, I was learning GraphQL for 3-4 weeks. I quickly scanned the documentation (who needs docs, am I wrong?) and I used this tech on a small project on localhost. We sold GraphQL to the company based on our excitement, not a deep understanding of how it worked, and we ignored some cautious voices from teammates. Keep in mind that once you push a new tech in a project, you may became the responsible person for it. Being the go-to guy is not bad, if you know what you do. The problem becomes when you spend 2 hours learning a new library and thinking you mastered it.

I would like to emphasise that I don't think GraphQL is a bad technology. The company I work for now uses GraphQL in one project, and all I hear is positive feedback. It's a bit like using Angular without OnPush and then blaming Angular for being slow — the tool isn't the problem, the implementation is.

This is more of a story of me, a young, naive developer seeing a new tech through rose-colored glasses, only reading the praise, not understanding the full picture, and convincing others to take it to production.

## Not Asking For Help

Back in my early days, I wanted to be a Java developer because, well, that's what they taught at University. Then one day at work, I was given a tiny frontend task. Create a dashboard with two pages. One to display external links as buttons and one to display admin logs in a table.

For an experienced person this would be 1-2 days of work. I was working on it for 4 weeks. The reason? Since I was new in web, I had no idea what CORS, Proxy, JWT token, Cookies, Sessions, Application State event meant… and it was a first time I heard that javascript have libraries - Angular/React?

Instead of asking for a help of my colleagues, I started googling and went down to a rabbit hole of information. There is a fine line between “I don't want to look stupid so I will google it” and “I have no idea what I am doing”.

Junior developers often let ego get in the way. We'd rather spend 40 hours creating a terrible solution ourselves than ask for help and risk looking clueless for 5 minutes.

In the end with tears in my eyes I went to my superior and asked him for helped. He scolded me like a 12 year old child for waiting such a long time, but we solved all problems.

Now, as a senior, I've learned that saying “I don't know” is not a weakness. It's efficiency. It means I know when to ask the right person for help and move on.

It's worth mentioning that not asking for help has a dark opposite - asking for help too much. When you're new to a team, it's totally okay, even expected, to ask questions or get clarification when you're stuck. But be mindful of how you ask.

You don't want to turn your colleague into your personal Google and just wait for them to hand you answers. Instead, always share what you've already tried or the approaches you're considering. That way, your teammate can give more targeted advice and it shows that you've put in some effort before reaching out.

## Poor Project Management

I was so happy when I first landed my first junior programming job. I wasn't questioning anything and I thought what they were doing was the gold standard in the tech industry. Well... not exactly.

I had basic Git skills — commit, push, pull, more or less what I do now. But what surprised me was that our team of five devs, were all pushed directly to the main branch. No feature branches, pull requests or code reviews. Straight up YOLO to main.

As the project was heading toward a big launch, every week our managers would demo new features to the client. Weekly presentations, that created an extreme pressure on us to deliver features fast.

I remember that the day before one of the presentations, I wanted to finish my task. I was doing some changes on the checkout page and commented out the payment button functionality for testing. Since no PR reviews were done, I forgot to uncomment the code, I made a commit and pushed into main. Happy with my changes I closed the PC and went home.

Next day demo time. The client notices the payment button doesn't work. “But it worked last week…” Hmm. They dig into the Git log. Whose name do they see? Mine. Awesome.

I received some gentle feedback, which motivated me to check each file changes before committing them.

I felt horrible at the time. But looking back, the real problem wasn't one junior dev pushing a broken commit, it was a complete lack of process. No reviews or QA or checks. If a bug makes it to production, it's never just one person's fault. It means something broke in the process the team is using.

## Letting Your Emotions The Better Of You

We're all human (at least most of us), so no matter how many coaching sessions we attend or how many times we're told to “think before responding,” there will always be moments when emotions take over and we say something we probably shouldn't. Two classic examples are salary negotiations and PR reviews.

Let's start with salary. You're doing your job and doing it well. Over time, you take on more responsibility, lead more initiatives, and help others, all while your paycheck stays the same. At first, you're okay with it. But months go by, and the frustration quietly builds. Especially in tech, where your teammate, doing the same work (or occasionally even less), might be getting paid more. One day, you snap. You storm into your manager's office (or call him on MS Teams), list everything that's wrong, demand a raise and maybe even threaten to quit.

Now… was that a great strategy? Sure, you might get what you asked for, but it'll likely damage your relationship with your manager. And even if you “win,” you've created tension that can hurt you down the line. A better approach? Come prepared. Gather what you've accomplished over the past few months. Show the extra responsibilities you've taken on. Then, calmly ask if it would be fair to revisit your compensation. And remember, even if this has been bugging you for months, it's probably the first time your manager's hearing about the request. They won't have a solution immediately. You're not trying to corner them. You're trying to solve the problem together.

I see this a lot, especially with junior developers. At first, they feel “lucky to have a job” and just patiently wait for their manager to bring up a raise... and nothing happens. But here's the thing, you chose this company, and they hired you because they see value in you. If they want to keep you long-term, this conversation needs to happen. You should be having regular performance reviews where you lay out your contributions. That's the perfect time to start open up this topic. It may feel awkward at first, but these small, honest talks are what prevent bigger problems later on.

Now, on to PR reviews. Someone once told me code reviews are like standing naked in front of a mirror, all your flaws are right there, impossible to miss. When you submit a pull request, you usually feel pretty good about it. You expect a comment or two, but nothing major.

I remember once I submitted a 200-line PR and got 50 comments. Whether I was frustrated is not even a question. I almost wrote something regrettable to that person. At least it was still in morning and I had my willpower to stop myself. I took a break, cursed a bit, and then calmly called that person to walk though the feedback. The suggestions were more about the way of writing the code, rather than the business logic. The call was long and painful, but we came to a common ground, that appealed both of us and merged the PR.

Through the time I cultivated a positive mindset in a sense that nobody really wants bad for you. People just want to do their job well and sometimes they aren't the best at communicating. The message that you interpreted personally may have just been a rushed response from them. If you get angry, you need to sit with your emotions, let them pass a bit and just then start replaying. It is always you with your teammate against the problem and never you against him.

## NgRx for State Management

I remember around 2018 there was a big push towards NgRx State Management. As your application scales, centralizing state management with a library like NgRx can help avoid code mess and make things more predictable. The argument was that relying on a proven library reduces the risk of introducing bugs through ad hoc state logic.

So I started to learn NgRx and this was the famous diagram I was staring at for a week until I thought understood what It meant.

![NgRx Overview](./article-images/39_ngrx.jpg)

I'm not going to explain the concept here, but let's just say it's not exactly beginner-friendly. I was trying to shift from writing imperative code to thinking declaratively, and that's a mental jump.

At the time, we were refactoring our custom RxJS Observables state into this NgRx concept. It was largely driven by one external senior developer, so we didn't question his decisions that much. I assumed that I lack some knowledge to understand this higher power wisdom.

But once we finished the migration, things got weird. Suddenly, our once relatively clean project had exploded in size. We had three to four times more files, and they were scattered across different folders — actions, reducers, effects, selectors, facades, and sometimes even duplicated types. What used to be a simple state update now required touching five different files, across multiple layers of abstraction. Even worse, onboarding new developers got tricky. Instead of showing them the logic in one place, we had to walk them through a mental map of how state flowed through the app.

Looking back, the mistake wasn't using NgRx. The mistake was using a powerful tool without fully understanding the paradigm shift it required and underestimating the cost of added complexity for a relatively small team. NgRx isn't "bad", it shines when it is used correctly. You can have the best hammer in the world if you are unable to use it properly.

Since some years have passed, I've seen NgRx introducing `Component Store` or even `NgRx Signals` which is a much lightweight implementation of the above picture. After some break I picked it up again and with a better understanding, and I wrote an article on [Angular State Management - Imperative, Declarative, Ngrx and SignalSlice](https://dev.to/krivanek06/angular-state-management-how-to-keep-your-sanity-1oin)

From myself, I worked on projects with less and 500K lines of code on the frontend, where I prefer using custom signal based solution to manage application state. That said, I now understand why libraries like NgRx exist, and when they really shine. In large-scale applications with many developers, strict separation of concerns, predictable flows, and centralized debugging become critical. NgRx's declarative pattern can help enforce consistency across teams, make testing easier, and prevent accidental side effects. It's always best to try it out yourself and draw your own conclusions.

## Key Takeaways

Honestly, and sadly, I could go on about all the mistakes I've made. But here's the real takeaway: we all screw up. Sometimes a little. Sometimes catastrophically. And that's exactly how you grow.

What makes a senior developer isn't knowing all the answers. It's knowing which bad decisions to avoid because you've already lived through the fallout. Experience doesn't just teach you what to do, it teaches you what not to do.

So fail. Then fail better. And maybe one day, you'll be writing blog posts like this, after you've finished crying over your failed side project. Hope you liked these short stories. Feel free to share your thoughts, catch more of my articles on [dev.to](https://dev.to/krivanek06), connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or check my [Personal Website](https://eduardkrivanek.com/).
