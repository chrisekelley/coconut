var QUERIES = {};

QUERIES.byCollection = function(doc) {
    if (doc.collection) {
        emit(doc.collection, doc);
    }
};

QUERIES.byQuestion = function(doc) {
    if(doc.collection == 'question') {
        emit(doc.collection, doc);
    }
};

QUERIES.resultsByQuestionAndComplete = function(questionId, complete) {
//    if (document.collection === "result") {
    console.log("questionId:" + questionId);
    if (document.question == questionId) {
        if (document.complete === complete) {
            return emit(document.question + ':true:' + document.lastModifiedAt, null);
        } else {
            return emit(document.question + ':false:' + document.lastModifiedAt, null);
        }
    }
};

QUERIES.byDepartment = function(department) {
    console.log("byDepartment: " + department);
    if (department === '1') {
        return QUERIES.byDepartmentAdmin;
    } else if (department === '6') {
        return QUERIES.byDepartmentCouncil;
    } else if (department === '7') {
        return bQUERIES.yDepartmentCommDev;
    } else if (department === '3') {
        return QUERIES.byDepartmentEducation;
    } else if (department === '2') {
        return QUERIES.byDepartmentFinance;
    } else if (department === '4') {
        return QUERIES.byDepartmentHealth;
    } else if (department === '8') {
        return QUERIES.byDepartmentNatResources;
    } else if (department === '9') {
        return QUERIES.byDepartmentProduction;
    } else if (department === '5') {
        return QUERIES.byDepartmentWorks;
    }
};