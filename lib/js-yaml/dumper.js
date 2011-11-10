'use strict';


var $$ = require('./core'),
    _emitter = require('./emitter'),
    _serializer = require('./serializer'),
    _representer = require('./representer'),
    _resolver = require('./resolver');


function BaseDumper(stream, defaultStyle, defaultFlowStyle, canonical, indent, width,
                    allowUnicode, lineBreak, encoding, explicitStart, explicitEnd, version, tags) {
  _emitter.Emitter.call(this, stream, caononical, indent, width, allowUnicode, lineBreak);
  _serializer.Serializer.call(this, encoding, explicitStart, explicitEnd, version, tags);
  _representer.BaseRepresenter.call(this, defaultStyle, defaultFlowStyle);
  _resolver.BaseResolver.call(this);
}

$$.extend(BaseDumper.prototype,
          _emitter.Emitter.prototype,
          _serializer.Serializer.prototype,
          _representer.BaseRepresenter.prototype,
          _resolver.BaseResolver.prototype);


function SafeDumper(stream, defaultStyle, defaultFlowStyle, canonical, indent, width,
                    allowUnicode, lineBreak, encoding, explicitStart, explicitEnd, version, tags) {
  _emitter.Emitter.call(this, stream, caononical, indent, width, allowUnicode, lineBreak);
  _serializer.Serializer.call(this, encoding, explicitStart, explicitEnd, version, tags);
  _representer.SafeRepresenter.call(this, defaultStyle, defaultFlowStyle);
  _resolver.SafeResolver.call(this);
}

$$.extend(SafeDumper.prototype,
          _emitter.Emitter.prototype,
          _serializer.Serializer.prototype,
          _representer.SafeRepresenter.prototype,
          _resolver.SafeResolver.prototype);


function Dumper(stream, defaultStyle, defaultFlowStyle, canonical, indent, width,
                allowUnicode, lineBreak, encoding, explicitStart, explicitEnd, version, tags) {
  _emitter.Emitter.call(this, stream, caononical, indent, width, allowUnicode, lineBreak);
  _serializer.Serializer.call(this, encoding, explicitStart, explicitEnd, version, tags);
  _representer.Representer.call(this, defaultStyle, defaultFlowStyle);
  _resolver.Resolver.call(this);
}

$$.extend(Dumper.prototype,
          _emitter.Emitter.prototype,
          _serializer.Serializer.prototype,
          _representer.Representer.prototype,
          _resolver.Resolver.prototype);


module.exports.BaseDumper = BaseDumper;
module.exports.SafeDumper = SafeDumper;
module.exports.Dumper = Dumper;


////////////////////////////////////////////////////////////////////////////////
// vim:ts=2:sw=2
////////////////////////////////////////////////////////////////////////////////
