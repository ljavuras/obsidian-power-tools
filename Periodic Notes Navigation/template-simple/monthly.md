<%*
let month = moment(tp.file.title);

// # 2023 January
tR += '# ' + month.format('YYYY MMMM') + '\n';

// 2023 / Q1
tR += '[[' + month.format('YYYY') + ']] / ';
tR += '[[' + month.format('YYYY-[Q]Q|[Q]Q') + ']]\n\n';

// ❮ December | January | February ❯
tR += '❮ [[' + month.subtract(1, 'months').format('YYYY-MM|MMMM') + ']]';
tR += ' | ' + month.add(1, 'months').format('MMMM') + ' | ';
tR += '[[' + month.add(1, 'months').format('YYYY-MM|MMMM') + ']] ❯';
month.subtract(1, 'months');
tR += '\n';

// Week 52 - Week 1 - Week 2 - Week 3 - Week 4 - Week 5
const thisMonth = month.month();
month.startOf('week');
do {
    tR += '[[' + month.format('YYYY-[W]ww|[Week] w') + ']]';
    month.add(1, 'weeks');
    if (month.month() == thisMonth) {
        tR += ' - ';
    }
} while (month.month() == thisMonth);
month.subtract(1, 'weeks');
%>

---
