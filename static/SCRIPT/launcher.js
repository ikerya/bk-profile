'use strict'

let dossierBox = document.querySelector('.info')
let promoBox = document.querySelector('.notes-block')
let pageMsg, userTmpl, tabsTmpl, expertsData, allExperts, regions
let testUser = new user()

let fileLoadForm = document.getElementById('fileUpload')
let fileLoadInput = document.getElementById('uploaded_file')
let errorBox = document.getElementById('error-box')
let errorMsg = errorBox.querySelector('.error-msg')

disappearable(document.querySelector('.load-invite'), fileLoadForm, fileLoadForm.querySelector('button'))
setActiveButton(document.querySelector('button'), document.querySelector('input[type="file"]'))

if (accessToken != "") {
    getJSON(`${apiPath}/user?accessToken=` + accessToken)
        .then(x => {
            testUser.getUserData(x)
            getJSON(`./DATA/exper_msg.json`)
                .catch(x => {
                    errorBox.style.display = 'block'
                    errorMsg.innerText = LOAD_ERROR + LOAD_ERR_MSG.msgErr
                })
                .then(x => {
                    pageMsg = x
                })
                .then(() => getJSON('./DATA/exper_tmpl.json'))
                .catch(x => {
                    if (errorBox.style.display !== 'block') {
                        errorBox.style.display = 'block'
                    }
                    errorMsg.innerText += LOAD_ERROR + LOAD_ERR_MSG.msgTmpl
                })
                .then(x => {
                    userTmpl = x
                })
                .then(() => getJSON(`${apiPath}/storage`))
                .catch(x => {
                    if (errorBox.style.display !== 'block') {
                        errorBox.style.display = 'block'
                    }
                    errorMsg.innerText += LOAD_ERROR + LOAD_ERR_MSG.msgStrg
                })
                .then(x => {
                    console.log(x);
                    console.log('--------------------------------');
                    x.forEach(y => {
                        if (!pageMsg[y.key]) {
                            pageMsg[y.key] = y.body;
                        }
                    })
                    console.log(pageMsg);
                    console.log('----------------------------------');
                    console.log(testUser);
                })
                .then(() => {
                    let galleryBox = document.querySelector('.photoes .gallery')
                    let pollBox = document.querySelector('.design-votes')
                    fileLoadForm.onsubmit = createLoader(fileLoadForm, fileLoadInput, testUser, galleryBox)

                    dossierBox.appendChild(testUser.renderLogin())
                    getJSON(`${apiPath}/regions/`)
                        .then(x => {
                            regions = x
                            dossierBox.appendChild(testUser.renderDossier(pageMsg, userTmpl, regions))
                        })
                        .catch(x => {
                            if (errorBox.style.display !== 'block') {
                                errorBox.style.display = 'block'
                            }
                            errorMsg.innerText += LOAD_ERROR + LOAD_ERR_MSG.msgRgn
                        })

                    promoBox.appendChild(testUser.renderPromoDate(pageMsg.info1))

                    testUser.renderPhotoes(galleryBox)
                    document.querySelector('.auto-info').appendChild(testUser.renderCar(pageMsg, userTmpl))

                    getJSON(testPollURL)
                        .then(pollData => {
                            let pollImgs = pollData.items[0].photosPreview.map(photo => addElement({
                                tag: 'li',
                                value: addElement({
                                    tag: 'img',
                                    attribs: {
                                        src: photo.photo,
                                        id: photo.id
                                    }
                                })
                            })).slice(0, 3)

                            pollBox.appendChild(addElement({
                                tag: 'ul',
                                value: pollImgs
                            }))
                        })
                        .catch(error => {
                            if (errorBox.style.display !== 'block') {
                                errorBox.style.display = 'block'
                            }
                            errorMsg.innerText += LOAD_ERROR + LOAD_ERR_MSG.msgPll
                        })

                    getJSON('./DATA/tabs_tmpl.json')
                        .then(x => {
                            tabsTmpl = x
                            let tableBox = document.querySelector('.table-box')
                            getJSON('./DATA/firstLineExperts.json')
                                .then(x => {
                                    expertsData = x
                                    tableBox.appendChild(testUser.renderTableExperList(expertsData.experts, tabsTmpl.expertList, pageMsg))
                                    tableBox.appendChild(testUser.renderInfoPoints(pageMsg.info2))
                                    tableBox.appendChild(renderRelativeTable(expertsData.experts, tabsTmpl.relativeList, pageMsg))
                                    tableBox.appendChild(renderPromoAction(pageMsg.info3))
                                    getJSON('./DATA/expers_all.json')
                                        .then(x => {
                                            allExperts = x.allExperts
                                            tableBox.appendChild(testUser.renderFirstHundredTable(allExperts, tabsTmpl, pageMsg))
                                            tableBox.appendChild(renderPromoAction(pageMsg.info4))
                                            tableBox.appendChild(renderPromoAction(pageMsg.info5))
                                        })
                                        .catch(x => {
                                            if (errorBox.style.display !== 'block') {
                                                errorBox.style.display = 'block'
                                            }
                                            errorMsg.innerText += LOAD_ERROR + LOAD_ERR_MSG.msgExp
                                        })
                                })
                                .catch(x => {
                                    if (errorBox.style.display !== 'block') {
                                        errorBox.style.display = 'block'
                                    }
                                    errorMsg.innerText += LOAD_ERROR + LOAD_ERR_MSG.msgExp
                                })
                        })
                        .catch(x => {
                            if (errorBox.style.display !== 'block') {
                                errorBox.style.display = 'block'
                            }
                            errorMsg.innerText += LOAD_ERROR + LOAD_ERR_MSG.msgTab
                        })
                })
        })
        .catch(x => {
        });
} else {
    window.location = ""
}
