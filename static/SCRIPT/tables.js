'use strict';
/* Сформировать заголовок таблицы */
const renderTopHeader = (msgToRender, tmpl, replaces = []) => addElement({
    tag: 'tr',
    value: addElement({
        tag: 'th',
        value: replaceTemplate(msgToRender, replaces),
        attribs: {"colspan": tmpl.colNames.length}
    })
})
/* отобразить название столбцов таблицы*/
const renderColHeader = (tmpl, msg) => addElement({
    tag: 'tr',
    value: tmpl.colNames.map(x => addElement({
        tag: 'th',
        value: msg[x.msg],
        classes: x.classes
    }))
})
/* Отобразить содержимое таблицы списка экспертов */
const renderExpertLine = line => addElement({
    tag: 'tr',
    value: [
        addElement({tag: 'td', value: line.fullName}),
        addElement({
            tag: 'td',
            value: addElement({tag: 'img', attribs: {"src": line.photoExpertPath}})
        }),
        addElement({tag: 'td', value: line.region}),
        addElement({tag: 'td', value: line.pointsForBuy}),
        addElement({
            tag: 'td',
             value: addElement({tag: 'img', attribs: {"src": line.photoLastBuyPath}})
        }),
        addElement({tag: 'td', value: line.pointsForVote}),
        addElement({
            tag: 'td',
            value: addElement({
                tag: 'div',
                value: [
                    addElement({tag: 'a', value: line.email, attribs: {'href': `mailto: ${line.email}`}}),
                    addElement({tag: 'input', attribs: {"type": "checkbox"}})
                ],
                classes: 'email-cell'
            })            
        })
    ]
})
/* сформировать строку таблицы связанных участников */
const renderRelativeLine = line => addElement({
    tag: 'tr',
    value: [
        addElement({tag: 'td', value: line.fullName}),
        addElement({tag: 'td', value: line.secondaryRel}),
        addElement({tag: 'td', value: line.tertiaryRel}),
        addElement({tag: 'td', value: line.pointsForBuy}),
        addElement({tag: 'td', value: line.pointsForVote})
    ]
})
/* сформировать таблицу из всех ассоциированных пользователей*/
const renderRelativeTable = (userData, tmpl, msg) => addElement({
    tag: 'table',
    value: [ 
        addElement({tag: 'thead', value: renderColHeader(tmpl, msg)}),
        addElement({tag: 'tbody', value: userData.map(x => renderRelativeLine(x))})
    ]
})
/*отрендерить первый этап конкурса*/
const renderStage1 = (line, i) => addElement({
    tag: 'tr',
    value: [
        addElement({tag: 'td', value: i}),
        addElement({tag: 'td', value: line.initials}),
        addElement({tag: 'td', value: line.firstLineFol.total}),
        addElement({tag: 'td', value: line.otherLineFol.total})
    ]
})
/*отрендерить второй этап конкурса*/
const renderStage2 = (line, i) => addElement({
    tag: 'tr',
    value: [
        addElement({tag: 'td', value: i}),
        addElement({tag: 'td', value: line.initials}),
        addElement({tag: 'td', value: line.firstLineFol.active}),
        addElement({tag: 'td', value: line.firstLineFol.total}),
        addElement({tag: 'td', value: line.firstLineFol.active}),
        addElement({tag: 'td', value: line.otherLineFol.total})
    ]
})
/*отрендерить третий этап конкурса*/
const renderStage3 = (line, i) => addElement({
    tag: 'tr',
    value: [
        addElement({tag: 'td', value: i}),
        addElement({tag: 'td', value: line.initials}),
        addElement({tag: 'td', value: line.points}),
        addElement({tag: 'td', value: line.firstLineFol.active}),
        addElement({tag: 'td', value: line.firstLineFol.total}),
        addElement({tag: 'td', value: line.firstLineFol.active}),
        addElement({tag: 'td', value: line.otherLineFol.total})
    ]
})