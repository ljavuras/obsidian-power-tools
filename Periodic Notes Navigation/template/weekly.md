<%*
let weekMoment = moment(tp.file.title);

// # 2023 Week 1
tR += '# ' + weekMoment.format('gggg [Week] w') + '\n';

// 2023 / Q1 / January
tR += '[[' + weekMoment.format('YYYY') + ']] / ';
tR += '[[' + weekMoment.format('YYYY-[Q]Q|[Q]Q') + ']] / ';
tR += '[[' + weekMoment.format('YYYY-MM|MMMM') + ']]';

/**
 * If the week crosses a month, include the year/quarter/month that is crossed:
 * 2023 / Q1 / January - February              // Crosses a month
 * 2023 / Q1 / March - Q2 / April              // Crosses quarter and month
 * 2022 / Q4 / December - 2023 / Q1 / January  // Corsses year, quarter and month
 */
const endOfWeekMoment = weekMoment.clone().endOf('week');
if(weekMoment.format('M') != endOfWeekMoment.format('M')) {
	tR += ' - ';
	if (weekMoment.format('YYYY') != endOfWeekMoment.format('YYYY')) {
		tR += '[[' + endOfWeekMoment.format('YYYY') + ']] / ';
	}
	if (weekMoment.format('Q') != endOfWeekMoment.format('Q')) {
		tR += '[[' + endOfWeekMoment.format('YYYY-[Q]Q|[Q]Q') + ']] / ';
	}
	tR += '[[' + endOfWeekMoment.format('YYYY-MM|MMMM') + ']]';
}
tR += '\n\n';

// ❮ Week 52 | Week 1 | Week 2 ❯
tR += '❮ [[' + weekMoment.subtract(1, 'weeks').format('gggg-[W]ww|[Week] w') + ']]';
tR += ' | ' + weekMoment.add(1, 'weeks').format('[Week] w') + ' | ';
tR += '[[' + weekMoment.add(1, 'weeks').format('gggg-[W]ww|[Week] w') + ']] ❯';
weekMoment.subtract(1, 'weeks');
tR += '\n';

// Monday - Tuesday - Wednesday - Thursday - Friday - Saturday - Sunday
for (let day = 0; day < 7; day++) {
    tR += '[[' + weekMoment.weekday(day).format('YYYY-MM-DD|dddd') + ']]';
    if (day < 6) {
        tR += ' - ';
    }
}
%>

---
