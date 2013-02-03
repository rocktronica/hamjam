// RulesView

var RulesView = function(options) {
	this.el = options.el;
	this.model = options.model;
};

RulesView.fn = RulesView.prototype;

RulesView.fn.render = function() {
	this.el.innerHTML = "";
	this.model.toAlphabetizedArray().forEach(function(model) {
		if (model.active) {
			var view = new RuleView({
				model: model
			})
			this.el.appendChild(view.render().el);
		}
	}.bind(this));
}

// SectionView

var SectionView = function(options) {
	this.el = options.el;
	this.sectionNext = undefined;
	this.onShow = options.onShow || function(){};
	this.onHide = options.onHide || function(){};
};

SectionView.fn = SectionView.prototype;

SectionView.fn.render = function() {
	this.el.addEventListener("click", function(event) {
		if (event.target.dataset.nav) {
			event.preventDefault();
		}
	});
	var navNext = this.el.querySelector("[data-nav='next']");
	if (navNext) {
		navNext.addEventListener("click", this.showNext.bind(this));
	}
	var navBack = this.el.querySelector("[data-nav='back']");
	if (navBack) {
		navBack.addEventListener("click", this.showBack.bind(this));
	}
	return this;
};

SectionView.fn.show = function() {
	this.el.style.display = "block";
	this.onShow.bind(this)();
	return this;
};

SectionView.fn.hide = function() {
	this.el.style.display = "none";
	this.onHide.bind(this)();
	return this;
};

SectionView.fn.showNext = function() {
	if (this.sectionNext) {
		this.hide();
		this.sectionNext.show();
	}
};

SectionView.fn.showBack = function() {
	if (this.sectionBack) {
		this.hide();
		this.sectionBack.show();
	}
};