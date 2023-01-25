<%*
let quarter = moment(tp.file.title, 'YYYY-[Q]Q');

// # 2023 Q1
tR += '# ' + quarter.format('YYYY [Q]Q') + '\n';

// 2023
tR += '[[' + quarter.format('YYYY') + ']]' + '\n\n';

// ❮ Q4 | Q1 | Q2 ❯
tR += '❮ [[' + quarter.subtract(1, 'quarters').format('YYYY-[Q]Q|[Q]Q') + ']]';
tR += ' | ' + quarter.add(1, 'quarters').format('[Q]Q') + ' | ';
tR += '[[' + quarter.add(1, 'quarters').format('YYYY-[Q]Q|[Q]Q') + ']] ❯\n';
quarter.subtract(1, 'quarters');

// January - February - March
tR += '[[' + quarter.format('YYYY-MM|MMMM') + ']] - ';
tR += '[[' + quarter.add(1, 'months').format('YYYY-MM|MMMM') + ']] - ';
tR += '[[' + quarter.add(1, 'months').format('YYYY-MM|MMMM') + ']]';
%>

---
