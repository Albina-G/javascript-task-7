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
        let answers = [];
        let next = 0;
        for (let i = 0; i < parallelNum; i++) {
            next = i + parallelNum - 1;
            startPromise(i, next);
        }
        function startPromise(index, nextIndex) {
            let finish = function () {
                answers[index] = arguments['0'];
                if (answers.length === jobs.length) {
                    resolve(answers);
                }
                if (answers.length < jobs.length) {
                    startPromise(nextIndex++, nextIndex++);
                }
            };
            new Promise((resolve, reject) => {
                jobs[index]().then(resolve, reject);
                setTimeout(reject, timeout, new Error('Promise timeout'));
            }).then(finish)
            .catch(finish);
        }
    });
}
