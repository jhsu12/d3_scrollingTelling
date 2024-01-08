## Among all Austrian prisoners in Auschwitz concentration camp, who had the best chances to survive?

This is the final project of the Data Visualization course.
I'm doing a d3 scolling-telling project.

[Project website](https://jhsu12.github.io/course/data_visualization/project/)

[Demo Video](https://www.youtube.com/watch?v=tU0QAqyNGkE)


## Overview

The Auschwitz concentration camp, constructed by Nazi Germany in 1940, stands as one
of the most horrific concentration camps in history. Throughout its existence, SS guards conducted a series of inhumane experiments, subjected prisoners to forced labor, prolonged roll calls, and even deliberately withheld food, transforming the camp into a nightmarish realm that claimed the lives of 1.1 million individuals.

Despite the harrowing conditions, a few survivors managed to overcome the atrocities of life inside the camp. This project is primarily dedicated to analyzing the experiences of these survivors, with a special focus on individuals from Austria, as it represents the sole dataset available. The objective is to explore whether factors such as gender and age played a role in their chances of survival.

## Data and Data Processing

I will be using scraped data from the [Victims - Auschwitz](https://www.auschwitz.at/database-prisoners), which comprises information on over 17,000 Austrian prisoners in the Auschwitz concentration camp. Each data entry contains 16 attributes, encompassing personal details (such as name, gender, birth date, profession, and address) and information specific to their time in the camp (such as transportation details to and from Auschwitz, dates of transport, fate, death place, and date of death).

It is worth noting that many attributes, particularly 'fate' often have empty values. Entries for survivors are marked with '1', individuals with known date and place of death or an official declaration of death are marked with '0' and all other persons with unknown information are marked with '-1' For further analysis, I will primarily focus on data where the 'fate' attribute is not '-1'.

Additionally, I plan to derive a new attribute, 'Age' representing the estimated age of the prisoners during their time in the camp. This will be calculated by subtracting their birth date from the end of the Auschwitz concentration camp, which is January 1945.

## How accurate is my result? (Final figure of my scrolly-telling website)

“Approximately 75-80% of people who were deported to Auschwitz were sent to the gas chambers in the first selection, as soon as they arrived.”

“**Children and the elderly** were often automatically deemed unfit for forced labor and sent to the gas chambers. The same was often true of **mothers with small children** and people who were considered weak or sickly.”

“Living beyond the first SS selection did not guarantee survival. More than 50% of the people interned in Auschwitz died—whether they were **executed, or died of starvation, exhaustion, torture, disease, pseudo-scientific experiments, or the harsh conditions of daily life and slave labor in the camp**.”

According to [The Struggle to Survive Auschwitz](https://mjhnyc.org/blog/the-struggle-to-survive-auschwitz/)
