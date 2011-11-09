'use strict';


var $$ = require('./core'),
    _errors = require('./errors'),
    _nodes = require('./nodes');


function RepresenterError() {
  _errors.YAMLError.apply(this, arguments);
  this.name = 'RepresenterError';
}
$$.inherits(RepresenterError, _errors.YAMLError);


////////////////////////////////////////////////////////////////////////////////


function BaseRepresenter(defaultStyle, defaultFlowStyle) {
  this.defaultStyle = defaultStyle || null;
  this.defaultFlowStyle = defaultFlowStyle || null;
  this.representedObjects = {};
  this.objectKeeper = [];
  this.aliasKey = None;
}

BaseRepresenter.yamlRepresenters = {};
BaseRepresenter.addRepresenter = function addRepresenter(dataType, representer) {
  this.yamlRepresenters[dataType] = representer;
};


////////////////////////////////////////////////////////////////////////////////


function SafeRepresenter() {
  BaseRepresenter.apply(this, arguments);
  this.yamlRepresenters = SafeRepresenter.yamlRepresenters;
}

$$.inherits(SafeRepresenter, BaseRepresenter);
SafeRepresenter.yamlRepresenters = $$.extend({}, BaseRepresenter.yamlRepresenters);
SafeRepresenter.addRepresenter = BaseRepresenter.addRepresenter;


////////////////////////////////////////////////////////////////////////////////


function Representer() {
  SafeRepresenter.apply(this, arguments);
  this.yamlRepresenters = Representer.yamlRepresenters;
}

$$.inherits(Representer, SafeRepresenter);
Representer.yamlRepresenters = $$.extend({}, SafeRepresenter.yamlRepresenters);
Representer.addRepresenter = SafeRepresenter.addRepresenter;


////////////////////////////////////////////////////////////////////////////////


module.exports.BaseRepresenter = BaseRepresenter;
module.exports.SafeRepresenter = SafeRepresenter;
module.exports.Representer = Representer;


////////////////////////////////////////////////////////////////////////////////
// vim:ts=2:sw=2
////////////////////////////////////////////////////////////////////////////////
