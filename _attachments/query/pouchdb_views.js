var QUERIES = {};

QUERIES.byCollection = function(doc) {
    if (doc.collection) {
        emit(doc.collection, doc);
    }
};

QUERIES.bySearchKeywords = function(doc) {
    if(doc.phone) {
        emit(doc.phone, doc);
    }
};

QUERIES.byDepartmentAdmin = function(doc) {
    if(doc.dep_administration) {
        //console.log("department: " + doc.dep_administration);
        emit(doc.dep_administration, doc);
    }
};

QUERIES.byDepartmentCommDev = function(doc) {
    if(doc.dep_community_development) {
        emit(doc.dep_community_development, doc);
    }
};

QUERIES.byDepartmentCouncil = function(doc) {
    if(doc.dev_council) {
        emit(doc.dev_council, doc);
    }
};

QUERIES.byDepartmentEducation = function(doc) {
    if(doc.dev_education) {
        emit(doc.dev_education, doc);
    }
};

QUERIES.byDepartmentFinance = function(doc) {
    if(doc.dev_finance) {
        emit(doc.dev_finance, doc);
    }
};

QUERIES.byDepartmentHealth = function(doc) {
    if(doc.dev_health) {
        emit(doc.dev_health, doc);
    }
};

QUERIES.byDepartmentNatResources = function(doc) {
    if(doc.dev_nat_resources) {
        emit(doc.dev_nat_resources, doc);
    }
};

QUERIES.byDepartmentProduction = function(doc) {
    if(doc.dev_production) {
        //console.log("department: " + doc.dev_production);
        emit(doc.dev_production, doc);
    }
};

QUERIES.byDepartmentWorks = function(doc) {
    if(doc.dev_works) {
        //console.log("department: " + doc.dev_works);
        emit(doc.dev_works, doc);
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

QUERIES.byParentId = function(doc) {
    if(doc.parentId) {
        emit(doc.parentId, doc);
    }
};