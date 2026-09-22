---js
const eleventyNavigation = {
	key: "Home",
	order: 1
};

---

I am a PhD student in CS at UMD College Park, where I am advised by [Prof. Jonathan Katz](https://www.cs.umd.edu/~jkatz/) and [Prof. Gabriel Kaptchuk](https://www.cs.umd.edu/~kaptchuk/). My research interest is in cryptography.

Previously, I used to work with [Dr. Divya Gupta](https://www.microsoft.com/en-us/research/people/digup/), [Dr. Nishanth Chandran](https://www.microsoft.com/en-us/research/people/nichandr/), and [Dr. Rahul Sharma](https://www.microsoft.com/en-us/research/people/rahsha/). I graduated with a bachelors degree in computer science from IIT Roorkee under the guidance of [Prof. Sugata Gangopadhyay](https://www.iitr.ac.in/~CSE/Gangopadhyay_Sugata). My home town is New Delhi.

Email: [firstname]@umd.edu

## Publications

<ul class="publications-list">
{%- for pub in publications %}
	<li>
		<a href="{{ pub.url }}">{{ pub.title }}</a>
		<div class="pub-authors">{{ pub.authors }}</div>
		<div class="pub-venue">{{ pub.venue }}{% if pub.venue %}, {% endif %}{{ pub.year }}</div>
	</li>
{%- endfor %}
</ul>

_Also on [Google Scholar](https://scholar.google.com/citations?hl=en&user=QEFy_4wAAAAJ)._

## Links

- [Papers I loved](/papers/)
