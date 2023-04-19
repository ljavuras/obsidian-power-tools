<%*
let year = moment(tp.file.title);

// # 2023
tR += '# ' + year.format('YYYY') + '\n\n\n';

// ❮ 2022 | 2023 | 2024 ❯
tR += '❮ [[' + year.subtract(1, 'years').format('YYYY') + ']]';
tR += ' | ' + year.add(1, 'years').format('YYYY') + ' | ';
tR += '[[' + year.add(1, 'years').format('YYYY') + ']] ❯';
year.subtract(1, 'years');
tR += '\n';

// Q1 - Q2 - Q3 - Q4
tR += '[[' + year.format('YYYY-[Q]Q|[Q]Q') + ']] - ';
tR += '[[' + year.add(1, 'quarters').format('YYYY-[Q]Q|[Q]Q') + ']] - ';
tR += '[[' + year.add(1, 'quarters').format('YYYY-[Q]Q|[Q]Q') + ']] - ';
tR += '[[' + year.add(1, 'quarters').format('YYYY-[Q]Q|[Q]Q') + ']]';
%>

---
