'use strict';

exports.isStar = true;
exports.runParallel = runParallel;

/** Функция паралелльно запускает указанное число промисов
 * @param {Array} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {

    return new Promise(resolve => {
        if (!jobs.length) {
            resolve([]);
        }
        const answers = [];
        let next = 0;
        for (let i = 0; i < parallelNum; i++) {
            startPromise(next, next++);
        }
        function startPromise(index, nextIndex) {
            let finish = function () {
                answers[nextIndex] = arguments['0'];
                if (answers.length === jobs.length) {
                    resolve(answers);

                    return;
                }
                if (next < jobs.length) {
                    startPromise(next, next++);
                }
            };
            new Promise((resolveSt, rejectSt) => {
                jobs[index]().then(resolveSt, rejectSt);
                setTimeout(rejectSt, timeout, new Error('Promise timeout'));
            }).then(finish)
                .catch(finish);
        }
    });
}
