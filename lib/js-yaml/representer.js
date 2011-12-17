'use strict';


var $$ = require('./core'),
    _errors = require('./errors'),
    _nodes = require('./nodes');


function RepresenterError() {
  _errors.YAMLError.apply(this, arguments);
  this.name = 'RepresenterError';
}
$$.inherits(RepresenterError, _errors.YAMLError);


function getTypeOf(obj) {
  switch (typeof obj) {
    case 'undefined': return 'null';
    case 'string':    return 'string';
    case 'boolean':   return 'boolean';
    case 'number':    return (obj === obj.toFixed()) ? 'integer' : 'float';
  }

  if (null === obj) {
    return 'null';
  }

  throw new RepresenterError('Not fully implemented yet');  
}


////////////////////////////////////////////////////////////////////////////////


function BaseRepresenter(defaultStyle, defaultFlowStyle) {
  this.defaultStyle = defaultStyle || null;
  this.defaultFlowStyle = defaultFlowStyle || null;
  this.representedObjects = {};
  this.objectKeeper = [];
  this.aliasKey = null;
}

BaseRepresenter.yamlRepresenters = {};
BaseRepresenter.addRepresenter = function addRepresenter(dataType, representer) {
  this.yamlRepresenters[dataType] = representer;
};


BaseRepresenter.prototype.represent = function represent(data) {
  var node = this.representData(data);
  this.serialize(node);
  this.representedObjects = {};
  this.objectKeeper = [];
  this.aliasKey = null;
};


BaseRepresenter.prototype.representData = function representData(data) {
  var node, dataType;

  this.aliasKey = this.ignoreAliases(data) ? null : $$.id(data);

  if (null !== this.aliasKey) {
    if (undefined !== this.representedObjects[this.aliasKey]) {
      return this.representedObjects[this.aliasKey];
    }

    this.objectKeeper.push(data);
  }

  dataType = getTypeOf(data);

  if (undefined !== this.yamlRepresenters[dataType]) {
    return this.yamlRepresenters[dataType](data);
  }

  return new _nodes.ScalarNode(data.toString());
};


////////////////////////////////////////////////////////////////////////////////


function SafeRepresenter() {
  BaseRepresenter.apply(this, arguments);
  this.yamlRepresenters = SafeRepresenter.yamlRepresenters;
}

$$.inherits(SafeRepresenter, BaseRepresenter);
SafeRepresenter.yamlRepresenters = $$.extend({}, BaseRepresenter.yamlRepresenters);
SafeRepresenter.addRepresenter = BaseRepresenter.addRepresenter;


SafeRepresenter.prototype.representNull = function representNull(data) {
  return new _nodes.ScalarNode('~');
};


SafeRepresenter.addRepresenter('null',    SafeRepresenter.prototype.representNull);
SafeRepresenter.addRepresenter('string',  SafeRepresenter.prototype.representString);
SafeRepresenter.addRepresenter('boolean', SafeRepresenter.prototype.representBoolean);
SafeRepresenter.addRepresenter('integer', SafeRepresenter.prototype.representInteger);
SafeRepresenter.addRepresenter('float',   SafeRepresenter.prototype.representFloat);
SafeRepresenter.addRepresenter('object',  SafeRepresenter.prototype.representObject);


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
