'use strict';


var $$ = require('./core'),
    _errors = require('./errors'),
    _events = require('./events'),
    _nodes = require('./nodes');


function SerializerError() {
  _errors.YAMLError.apply(this, arguments);
  this.name = 'SerializerError';
}
$$.inherits(SerializerError, _errors.YAMLError);


function Serializer(encoding, explicitStart, explicitEnd, version, tags) {
  this.useEncoding = encoding || null;
  this.useExplicitStart = explicitStart || null;
  this.useExplicitEnd = explicitEnd || null;
  this.useVersion = version || null;
  this.useTags = tags || null;
  this.serializedNodes = new $$.Hash();
  this.anchors = new $$.Hash();
  this.lastAnchorId = 0;
  this.closed = null;
}


Serializer.prototype.open = function open() {
  if (null === this.closed) {
    this.emit(new _events.StreamStartEvent(this.useEncoding));
    this.closed = false;
  } else if (this.closed) {
    throw new SerializerError("Serializer is closed");
  } else {
    throw new SerializerError("Serializer is already opened");
  }
};


Serializer.prototype.close = function close() {
  if (null === this.closed) {
    throw new SerializerError("Serializer is not opened");
  } else if (!this.closed) {
    this.emit(new _events.StreamEndEvent());
    this.closed = true;
  }
};


Serializer.prototype.serialize = function serialize(node) {
  if (null === this.closed) {
    throw new SerializerError("Serializer is not opened");
  } else if (this.closed) {
    throw new SerializerError("Serializer is closed");
  }

  this.emit(new _events.DocumentStartEvent(this.useExplicitStart, this.version, this.useTags));
  this.anchorNode(node);
  this.serializeNode(node);
  this.emit(new _events.DocumentEndEvent(this.useExplicitEnd));

  this.serializedNodes = new $$.Hash();
  this.anchors = new $$.Hash();
  this.lastAnchorId = 0;
};


Serializer.prototype.anchorNode = function anchorNode(node) {
  if (this.anchors.hasKey(node)) {
    if (null === this.anchors.get(node)) {
      this.anchors.store(node, this.generateAnchor(node));
    }
  } else {
    this.anchors.store(node, null);

    if ($$.isInstanceOf(node, _nodes.SequenceNode)) {
      $$.each(node.value, function (subnode) {
        this.anchorNode(subnode);
      }.bind(this));
    } else if ($$.isInstanceOf(node, _nodes.MappingNode)) {
      $$.each(node.value, function (pairs) {
        this.anchorNode(pairs[0]);
        this.anchorNode(pairs[1]);
      }.bind(this));
    }
  }
};


Serializer.prototype.generateAnchor = function generateAnchor(node) {
  this.lastAnchorId += 1;
  return 'id000'.slice(0, -this.lastAnchorId.toString().length) + this.lastAnchorId;
};


Serializer.prototype.serializeNode = function serializeNode(node, parent, index) {
  var alias, detectedTag, defaultTag, implicit;

  alias = this.anchors.get(node);

  if (this.serializedNodes.hasKey(node)) {
    this.emit(new _events.AliasEvent(alias));
    return;
  }

  this.serializedNodes.store(node, true);

  if ($$.isInstanceOf(node, _nodes.ScalarNode)) {
    detectedTag = this.resolve(_nodes.ScalarNode, node.value, [true, false]);
    defaultTag = this.resolve(_nodes.ScalarNode, node.value, [false, true]);
    implicit = [(node.tag === detectedTag), (node.tag === defaultTag)];
    this.emit(new _events.ScalarEvent(alias, node.tag, implicit, node.value, node.style));
  } else if ($$.isInstanceOf(node, _nodes.SequenceNode)) {
      implicit = (node.tag === this.resolve(_nodes.SequenceNode, node.value, true));
      this.emit(new _events.SequenceStartEvent(alias, node.tag, implicit, node.flowStyle));

      index = 0;
      $$.each(node.value, function (subnode) {
        this.serializeNode(subnode, node, index);
        index += 1;
      }.bind(this));

      this.emit(new _events.SequenceEndEvent());
  } else if ($$.isInstanceOf(node, _nodes.MappingNode)) {
      implicit = (node.tag === this.resolve(_nodes.MappingNode, node.value, true));
      this.emit(new _events.MappingStartEvent(alias, node.tag, implicit, node.flowStyle));

      $$.each(node.value, function (pairs) {
        this.serializeNode(pairs[0], node, null);
        this.serializeNode(pairs[1], node, pairs[0]);
      }.bind(this));

      this.emit(new _events.MappingEndEvent());
  }
};


////////////////////////////////////////////////////////////////////////////////
// vim:ts=2:sw=2
////////////////////////////////////////////////////////////////////////////////
