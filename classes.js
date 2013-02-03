// Rule

var Rule = function(input){
    this.value = input;
    var parts = input.split(/@/);
    this.active = false;
    if (parts.length === 2) {
        this.local = parts[0];
        this.domain = parts[1];
        this.active = true;
        this.url = this.domain.replace(/\*\./g, "").replace(/\*/g, "");
        this.favicon = "http://www.google.com/s2/favicons?domain=" + this.url;
    }
};

Rule.fn = Rule.prototype;

Rule.fn.toString = function() {
    return this.value;
};

Rule.fn.delete = function() {
    this.active = false;
};

// Rules

var Rules = function(input) {
    this.init();
};

Rules.fn = Rules.prototype;

Rules.fn.init = function() {
    this.items = {};
};

Rules.fn.add = function(rule) {
    if (typeof rule === "string") {
        rule = new Rule(rule);
    }
    this.items[rule.value] = rule;
    return this;
}

Rules.fn.parseInputString = function(input) {
    this.init();
    input.split(/\|/g).forEach(this.add.bind(this));
};

Rules.fn.toArray = function() {
    var items = [];
    for (key in this.items) {
        items.push(this.items[key]);
    }
    return items;
};

Rules.fn.toAlphabetizedArray = function() {
    var clean = function(input) {
        return input.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    }
    return this.toArray().sort(function(a,b) {
        if (a.domain && b.domain) {
            return clean(a.domain) >= clean(b.domain) ? 1 : -1;
        }
        return 0;
    })
};

Rules.fn.toString = function() {
    return this.toArray().filter(function(item) {
        return item.active;
    }).join("|");
};

// RuleView

var RuleView = function(options) {
    this.model = options.model;
    this.el = options.el || document.createElement("tr");
};

RuleView.fn = RuleView.prototype;

RuleView.fn.render = function() {
    var model = this.model;
    this.el.innerHTML =
        "<tr data-value='" + model.value + "'>" +
            "<td class='favicon'><img src='" + model.favicon + "' /></td>" +
            "<td class='domain'><a href='http://" + model.url + "/' target='_blank'>" + model.domain + "</a></td>" +
            "<td class='local'>" + model.local + "</td>" +
            "<td class='delete'>&times;</td>" +
        "</tr>"
    this.el.querySelector(".delete").addEventListener("click", function() {
        this.el.remove();
        model.delete();
    }.bind(this));
    return this;
};